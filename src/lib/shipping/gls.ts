import prisma from "@/lib/prisma";

interface ShipmentData {
  orderId: string;
  orderNumber: number;
  receiver: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postCode: string;
    countryCode?: string;
  };
  parcels: {
    weight: number; // in kg
  }[];
  codAmount?: number; // Cash on delivery amount
}

async function getSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany();
  const settingsObj: Record<string, string> = {};
  settings.forEach((s: { key: string; value: string }) => {
    settingsObj[s.key] = s.value;
  });
  return settingsObj;
}

// GLS Poland Web API URL - Production
const GLS_API_URL = process.env.GLS_TEST_MODE === "true"
  ? "https://ade-test.gls-poland.com/adeplus/pm1/ade_webapi2.php"
  : "https://ade.gls-poland.com/adeplus/pm1/ade_webapi2.php";

export async function createGLSShipment(data: ShipmentData): Promise<{
  success: boolean;
  trackingNumber?: string;
  labelPdf?: string;
  error?: string;
}> {
  try {
    const settings = await getSettings();

    console.log("[GLS] Creating shipment for order:", data.orderNumber);
    console.log("[GLS] Using API URL:", GLS_API_URL);
    console.log("[GLS] Settings:", {
      gls_api_enabled: settings.gls_api_enabled || "NOT SET",
      gls_api_username: settings.gls_api_username || "NOT SET",
      gls_sender_name: settings.gls_sender_name || "NOT SET",
      gls_sender_city: settings.gls_sender_city || "NOT SET",
    });

    if (settings.gls_api_enabled !== "true") {
      console.log("[GLS] API is disabled");
      return { success: false, error: "GLS API no está activado" };
    }

    if (!settings.gls_api_username || !settings.gls_api_password) {
      console.log("[GLS] Missing credentials");
      return { success: false, error: "Faltan credenciales de GLS API" };
    }

    // GLS uses SOAP-like XML requests
    const consignment = {
      rname1: data.receiver.name.substring(0, 40),
      rname2: "",
      rname3: "",
      rstreet: data.receiver.address.substring(0, 40),
      rzipcode: data.receiver.postCode.replace(/[^0-9]/g, ""),
      rcity: data.receiver.city.substring(0, 40),
      rcountry: data.receiver.countryCode || "PL",
      rphone: data.receiver.phone.replace(/[^0-9+]/g, ""),
      rcontact: data.receiver.name.substring(0, 40),

      sname1: settings.gls_sender_name.substring(0, 40),
      sname2: "",
      sname3: "",
      sstreet: settings.gls_sender_address.substring(0, 40),
      szipcode: settings.gls_sender_postcode.replace(/[^0-9]/g, ""),
      scity: settings.gls_sender_city.substring(0, 40),
      scountry: settings.gls_sender_country || "PL",

      references: `ORDER-${data.orderNumber}`,
      notes: "",
      quantity: data.parcels.length,
      weight: data.parcels.reduce((sum, p) => sum + p.weight, 0),

      ...(data.codAmount
        ? {
            srv_cod: {
              amount: data.codAmount.toFixed(2),
              reference: `ORDER-${data.orderNumber}`,
            },
          }
        : {}),
    };

    // Create request body for GLS API
    const requestBody = {
      username: settings.gls_api_username,
      password: settings.gls_api_password,
      consign: [consignment],
    };

    console.log("[GLS] Sending request to:", GLS_API_URL);

    const response = await fetch(GLS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[GLS] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GLS] API error response:", errorText);
      return {
        success: false,
        error: `Error de conexión con GLS API (HTTP ${response.status})`,
      };
    }

    const result = await response.json();
    console.log("[GLS] API response:", JSON.stringify(result, null, 2));

    if (result.status === "E") {
      console.error("[GLS] API returned error:", result.error_description);
      return {
        success: false,
        error: result.error_description || "Error de GLS API",
      };
    }

    const trackingNumber = result.parcels?.[0]?.number || result.consig_id;

    if (trackingNumber) {
      // Update order with tracking number
      await prisma.order.update({
        where: { id: data.orderId },
        data: {
          trackingNumber: trackingNumber,
          carrier: "GLS",
        },
      });
    }

    return {
      success: true,
      trackingNumber: trackingNumber,
      labelPdf: result.labels,
    };
  } catch (error) {
    console.error("GLS shipment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nieznany błąd",
    };
  }
}

export async function getGLSTrackingUrl(trackingNumber: string): Promise<string> {
  return `https://gls-group.eu/PL/pl/sledzenie-paczek?match=${trackingNumber}`;
}

// Alternative: GLS API via REST (newer version)
export async function createGLSShipmentREST(data: ShipmentData): Promise<{
  success: boolean;
  trackingNumber?: string;
  error?: string;
}> {
  try {
    const settings = await getSettings();

    if (settings.gls_api_enabled !== "true") {
      return { success: false, error: "GLS API nie jest włączone" };
    }

    // GLS REST API endpoint (if available)
    const GLS_REST_URL = "https://api.gls-group.eu/public/v1/shipments";

    const shipmentPayload = {
      shipperId: settings.gls_api_username,
      shipmentType: "PARCEL",
      labelFormat: "PDF",
      consignee: {
        name1: data.receiver.name,
        street1: data.receiver.address,
        zipCode: data.receiver.postCode,
        city: data.receiver.city,
        countryCode: data.receiver.countryCode || "PL",
        phone: data.receiver.phone,
        email: data.receiver.email,
      },
      shipper: {
        name1: settings.gls_sender_name,
        street1: settings.gls_sender_address,
        zipCode: settings.gls_sender_postcode,
        city: settings.gls_sender_city,
        countryCode: settings.gls_sender_country || "PL",
      },
      parcels: data.parcels.map((p) => ({
        weight: p.weight,
      })),
      references: [`ORDER-${data.orderNumber}`],
    };

    const authHeader = Buffer.from(
      `${settings.gls_api_username}:${settings.gls_api_password}`
    ).toString("base64");

    const response = await fetch(GLS_REST_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipmentPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Błąd API GLS",
      };
    }

    const result = await response.json();
    const trackingNumber = result.parcels?.[0]?.trackingNumber;

    if (trackingNumber) {
      await prisma.order.update({
        where: { id: data.orderId },
        data: {
          trackingNumber: trackingNumber,
          carrier: "GLS",
        },
      });
    }

    return {
      success: true,
      trackingNumber: trackingNumber,
    };
  } catch (error) {
    console.error("GLS REST shipment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nieznany błąd",
    };
  }
}

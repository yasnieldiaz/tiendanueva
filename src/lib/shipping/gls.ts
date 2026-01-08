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

// GLS Poland Web API URL - Production uses adeplus subdomain
const GLS_API_URL = process.env.GLS_TEST_MODE === "true"
  ? "https://ade-test.gls-poland.com/adeplus/pm1/ade_webapi2.php"
  : "https://adeplus.gls-poland.com/adeplus/pm1/ade_webapi2.php";

// Helper to escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Build SOAP XML request for GLS Poland API
function buildSoapRequest(
  username: string,
  password: string,
  consignment: {
    rname1: string;
    rstreet: string;
    rzipcode: string;
    rcity: string;
    rcountry: string;
    rphone: string;
    rcontact: string;
    sname1: string;
    sstreet: string;
    szipcode: string;
    scity: string;
    scountry: string;
    references: string;
    weight: number;
    quantity: number;
    codAmount?: number;
  }
): string {
  const codService = consignment.codAmount
    ? `<srv_cod>
        <cod_amount>${consignment.codAmount.toFixed(2)}</cod_amount>
        <cod_reference>${escapeXml(consignment.references)}</cod_reference>
      </srv_cod>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://www.gls-poland.com/webservices/">
  <soap:Header>
    <ws:AuthHeader>
      <ws:user_name>${escapeXml(username)}</ws:user_name>
      <ws:user_password>${escapeXml(password)}</ws:user_password>
    </ws:AuthHeader>
  </soap:Header>
  <soap:Body>
    <ws:adePreparingBox_Insert>
      <ws:consign>
        <ws:rname1>${escapeXml(consignment.rname1)}</ws:rname1>
        <ws:rname2></ws:rname2>
        <ws:rname3></ws:rname3>
        <ws:rstreet>${escapeXml(consignment.rstreet)}</ws:rstreet>
        <ws:rzipcode>${escapeXml(consignment.rzipcode)}</ws:rzipcode>
        <ws:rcity>${escapeXml(consignment.rcity)}</ws:rcity>
        <ws:rcountry>${escapeXml(consignment.rcountry)}</ws:rcountry>
        <ws:rphone>${escapeXml(consignment.rphone)}</ws:rphone>
        <ws:rcontact>${escapeXml(consignment.rcontact)}</ws:rcontact>
        <ws:sname1>${escapeXml(consignment.sname1)}</ws:sname1>
        <ws:sname2></ws:sname2>
        <ws:sname3></ws:sname3>
        <ws:sstreet>${escapeXml(consignment.sstreet)}</ws:sstreet>
        <ws:szipcode>${escapeXml(consignment.szipcode)}</ws:szipcode>
        <ws:scity>${escapeXml(consignment.scity)}</ws:scity>
        <ws:scountry>${escapeXml(consignment.scountry)}</ws:scountry>
        <ws:references>${escapeXml(consignment.references)}</ws:references>
        <ws:weight>${consignment.weight}</ws:weight>
        <ws:quantity>${consignment.quantity}</ws:quantity>
        ${codService}
      </ws:consign>
    </ws:adePreparingBox_Insert>
  </soap:Body>
</soap:Envelope>`;
}

// Parse SOAP response from GLS
function parseSoapResponse(xml: string): {
  success: boolean;
  trackingNumber?: string;
  error?: string;
} {
  console.log("[GLS] Parsing SOAP response...");

  // Check for SOAP Fault
  const faultMatch = xml.match(/<faultstring>([^<]+)<\/faultstring>/);
  if (faultMatch) {
    return { success: false, error: faultMatch[1] };
  }

  // Check for error in response
  const errorMatch = xml.match(/<error[^>]*>([^<]+)<\/error>/i);
  if (errorMatch) {
    return { success: false, error: errorMatch[1] };
  }

  // Try to extract tracking number (various possible field names)
  const trackingPatterns = [
    /<number>([^<]+)<\/number>/,
    /<parcel_number>([^<]+)<\/parcel_number>/,
    /<tracking_number>([^<]+)<\/tracking_number>/,
    /<consig_id>([^<]+)<\/consig_id>/,
    /<id>([^<]+)<\/id>/,
  ];

  for (const pattern of trackingPatterns) {
    const match = xml.match(pattern);
    if (match && match[1]) {
      return { success: true, trackingNumber: match[1] };
    }
  }

  // If we got a response without errors but no tracking number
  if (xml.includes("InsertResult") || xml.includes("result")) {
    return {
      success: false,
      error: "Respuesta recibida pero sin número de seguimiento",
    };
  }

  return { success: false, error: "Respuesta no reconocida de GLS API" };
}

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

    // Prepare consignment data
    const consignment = {
      rname1: data.receiver.name.substring(0, 40),
      rstreet: data.receiver.address.substring(0, 40),
      rzipcode: data.receiver.postCode.replace(/[^0-9]/g, ""),
      rcity: data.receiver.city.substring(0, 40),
      rcountry: data.receiver.countryCode || "PL",
      rphone: data.receiver.phone.replace(/[^0-9+]/g, ""),
      rcontact: data.receiver.name.substring(0, 40),
      sname1: (settings.gls_sender_name || "").substring(0, 40),
      sstreet: (settings.gls_sender_address || "").substring(0, 40),
      szipcode: (settings.gls_sender_postcode || "").replace(/[^0-9]/g, ""),
      scity: (settings.gls_sender_city || "").substring(0, 40),
      scountry: settings.gls_sender_country || "PL",
      references: `ORDER-${data.orderNumber}`,
      weight: data.parcels.reduce((sum, p) => sum + p.weight, 0),
      quantity: data.parcels.length,
      codAmount: data.codAmount,
    };

    // Build SOAP request
    const soapRequest = buildSoapRequest(
      settings.gls_api_username,
      settings.gls_api_password,
      consignment
    );

    console.log("[GLS] Sending SOAP request to:", GLS_API_URL);

    const response = await fetch(GLS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: "http://www.gls-poland.com/webservices/adePreparingBox_Insert",
      },
      body: soapRequest,
    });

    console.log("[GLS] Response status:", response.status);

    const responseText = await response.text();
    console.log("[GLS] Response body:", responseText.substring(0, 500));

    if (!response.ok) {
      console.error("[GLS] HTTP error:", response.status);
      return {
        success: false,
        error: `Error de conexión con GLS API (HTTP ${response.status})`,
      };
    }

    // Parse the SOAP response
    const result = parseSoapResponse(responseText);
    console.log("[GLS] Parsed result:", result);

    if (result.success && result.trackingNumber) {
      // Update order with tracking number
      await prisma.order.update({
        where: { id: data.orderId },
        data: {
          trackingNumber: result.trackingNumber,
          carrier: "GLS",
        },
      });
      console.log("[GLS] Order updated with tracking:", result.trackingNumber);
    }

    return result;
  } catch (error) {
    console.error("[GLS] Shipment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function getGLSTrackingUrl(trackingNumber: string): Promise<string> {
  return `https://gls-group.eu/PL/pl/sledzenie-paczek?match=${trackingNumber}`;
}

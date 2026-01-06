import prisma from "@/lib/prisma";

interface ShipmentData {
  orderId: string;
  orderNumber: number;
  receiver: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postCode?: string;
    countryCode?: string;
  };
  parcels: {
    dimensions: {
      length: number;
      width: number;
      height: number;
      weight: number;
    };
  }[];
  targetPoint?: string; // Paczkomat ID
}

interface InPostShipmentResponse {
  id: string;
  tracking_number: string;
  status: string;
  href: string;
}

async function getSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany();
  const settingsObj: Record<string, string> = {};
  settings.forEach((s: { key: string; value: string }) => {
    settingsObj[s.key] = s.value;
  });
  return settingsObj;
}

const INPOST_API_URL = "https://api-shipx-pl.easypack24.net/v1";
// For sandbox/testing use: "https://sandbox-api-shipx-pl.easypack24.net/v1"

export async function createInPostShipment(data: ShipmentData): Promise<{
  success: boolean;
  trackingNumber?: string;
  shipmentId?: string;
  labelUrl?: string;
  error?: string;
}> {
  try {
    const settings = await getSettings();

    if (settings.inpost_api_enabled !== "true") {
      return { success: false, error: "InPost API nie jest włączone" };
    }

    if (!settings.inpost_api_token || !settings.inpost_organization_id) {
      return { success: false, error: "Brak konfiguracji InPost API" };
    }

    const isToLocker = !!data.targetPoint;

    const shipmentPayload = {
      receiver: {
        name: data.receiver.name,
        email: data.receiver.email,
        phone: data.receiver.phone.replace(/[^0-9+]/g, ""),
        ...(isToLocker
          ? {}
          : {
              address: {
                street: data.receiver.address,
                city: data.receiver.city,
                post_code: data.receiver.postCode,
                country_code: data.receiver.countryCode || "PL",
              },
            }),
      },
      sender: {
        name: settings.inpost_sender_name,
        email: settings.inpost_sender_email,
        phone: settings.inpost_sender_phone.replace(/[^0-9+]/g, ""),
        address: {
          street: settings.inpost_sender_address,
          city: settings.inpost_sender_city,
          post_code: settings.inpost_sender_postcode,
          country_code: "PL",
        },
      },
      parcels: data.parcels.map((parcel) => ({
        dimensions: {
          length: parcel.dimensions.length,
          width: parcel.dimensions.width,
          height: parcel.dimensions.height,
        },
        weight: {
          amount: parcel.dimensions.weight,
        },
      })),
      service: isToLocker ? "inpost_locker_standard" : "inpost_courier_standard",
      reference: `ORDER-${data.orderNumber}`,
      ...(isToLocker ? { custom_attributes: { target_point: data.targetPoint } } : {}),
    };

    // Create shipment
    const response = await fetch(
      `${INPOST_API_URL}/organizations/${settings.inpost_organization_id}/shipments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.inpost_api_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("InPost API error:", errorData);
      return {
        success: false,
        error: errorData.message || errorData.error || "Błąd API InPost",
      };
    }

    const shipment: InPostShipmentResponse = await response.json();

    // Update order with tracking number
    await prisma.order.update({
      where: { id: data.orderId },
      data: {
        trackingNumber: shipment.tracking_number,
        carrier: "InPost",
      },
    });

    return {
      success: true,
      trackingNumber: shipment.tracking_number,
      shipmentId: shipment.id,
      labelUrl: `${INPOST_API_URL}/shipments/${shipment.id}/label`,
    };
  } catch (error) {
    console.error("InPost shipment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nieznany błąd",
    };
  }
}

export async function getInPostLabel(shipmentId: string): Promise<{
  success: boolean;
  pdf?: Buffer;
  error?: string;
}> {
  try {
    const settings = await getSettings();

    if (!settings.inpost_api_token) {
      return { success: false, error: "Brak tokenu API InPost" };
    }

    const response = await fetch(`${INPOST_API_URL}/shipments/${shipmentId}/label`, {
      headers: {
        Authorization: `Bearer ${settings.inpost_api_token}`,
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      return { success: false, error: "Nie udało się pobrać etykiety" };
    }

    const pdf = Buffer.from(await response.arrayBuffer());
    return { success: true, pdf };
  } catch (error) {
    console.error("InPost label error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nieznany błąd",
    };
  }
}

export async function getInPostTrackingUrl(trackingNumber: string): Promise<string> {
  return `https://inpost.pl/sledzenie-przesylek?number=${trackingNumber}`;
}

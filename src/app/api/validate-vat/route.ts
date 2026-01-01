import { NextRequest, NextResponse } from "next/server";

// EU country codes for VAT
const EU_COUNTRIES: Record<string, string> = {
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DE: "Germany",
  DK: "Denmark",
  EE: "Estonia",
  EL: "Greece",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  HR: "Croatia",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  MT: "Malta",
  NL: "Netherlands",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SE: "Sweden",
  SI: "Slovenia",
  SK: "Slovakia",
};

interface VIESResponse {
  isValid: boolean;
  countryCode: string;
  vatNumber: string;
  requestDate: string;
  name?: string;
  address?: string;
  userError?: string;
}

// Extract country code from VAT number
function extractCountryCode(vatNumber: string): { countryCode: string; number: string } | null {
  const cleaned = vatNumber.replace(/[\s.-]/g, "").toUpperCase();

  // Check if starts with 2-letter country code
  const countryCode = cleaned.substring(0, 2);
  if (EU_COUNTRIES[countryCode]) {
    return {
      countryCode,
      number: cleaned.substring(2),
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vatNumber } = body;

    if (!vatNumber) {
      return NextResponse.json(
        { error: "VAT number is required", isValid: false },
        { status: 400 }
      );
    }

    const parsed = extractCountryCode(vatNumber);
    if (!parsed) {
      return NextResponse.json(
        {
          error: "Invalid VAT number format. Must start with EU country code (e.g., ES, DE, FR)",
          isValid: false
        },
        { status: 400 }
      );
    }

    const { countryCode, number } = parsed;

    // Call the official EU VIES SOAP service
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:checkVat>
         <urn:countryCode>${countryCode}</urn:countryCode>
         <urn:vatNumber>${number}</urn:vatNumber>
      </urn:checkVat>
   </soapenv:Body>
</soapenv:Envelope>`;

    const viesResponse = await fetch(
      "https://ec.europa.eu/taxation_customs/vies/services/checkVatService",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          "SOAPAction": "",
        },
        body: soapEnvelope,
      }
    );

    const xmlText = await viesResponse.text();

    // Parse the SOAP response (handle namespaced XML like ns2:valid or just valid)
    const isValidMatch = xmlText.match(/<(?:\w+:)?valid>(\w+)<\/(?:\w+:)?valid>/);
    const nameMatch = xmlText.match(/<(?:\w+:)?name>([^<]*)<\/(?:\w+:)?name>/);
    const addressMatch = xmlText.match(/<(?:\w+:)?address>([^<]*)<\/(?:\w+:)?address>/);
    const requestDateMatch = xmlText.match(/<(?:\w+:)?requestDate>([^<]*)<\/(?:\w+:)?requestDate>/);

    const isValid = isValidMatch ? isValidMatch[1] === "true" : false;
    // VIES returns "---" when company data is not available
    const rawName = nameMatch ? nameMatch[1].trim() : undefined;
    const rawAddress = addressMatch ? addressMatch[1].trim() : undefined;
    const name = rawName && rawName !== "---" ? rawName : undefined;
    const address = rawAddress && rawAddress !== "---" ? rawAddress : undefined;
    const requestDate = requestDateMatch ? requestDateMatch[1] : new Date().toISOString();

    // Check for fault/error in response
    if (xmlText.includes("faultstring") || xmlText.includes("Fault")) {
      const faultMatch = xmlText.match(/<(?:\w+:)?faultstring>([^<]*)<\/(?:\w+:)?faultstring>/);
      const faultMessage = faultMatch ? faultMatch[1] : "VIES service error";

      return NextResponse.json({
        isValid: false,
        countryCode,
        vatNumber: number,
        requestDate: new Date().toISOString(),
        error: faultMessage,
        // Common errors: INVALID_INPUT, SERVICE_UNAVAILABLE, MS_UNAVAILABLE, TIMEOUT
      });
    }

    const response: VIESResponse = {
      isValid,
      countryCode,
      vatNumber: number,
      requestDate,
      name: name || undefined,
      address: address || undefined,
    };

    // For intra-community purchases, VAT exemption applies when:
    // 1. Buyer has valid VAT number in VIES
    // 2. Buyer is in a different EU country than seller (Poland)
    const isIntraCommunity = isValid && countryCode !== "PL";

    return NextResponse.json({
      ...response,
      isIntraCommunity,
      vatExempt: isIntraCommunity,
      countryName: EU_COUNTRIES[countryCode],
      message: isIntraCommunity
        ? "Valid intra-community VAT number. VAT exemption applies (0%)."
        : isValid
          ? "Valid VAT number. Standard VAT applies."
          : "Invalid VAT number.",
    });

  } catch (error) {
    console.error("VIES validation error:", error);
    return NextResponse.json(
      {
        error: "Failed to validate VAT number. Please try again.",
        isValid: false,
        isIntraCommunity: false,
        vatExempt: false,
      },
      { status: 500 }
    );
  }
}

// GET method for simple validation check
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vatNumber = searchParams.get("vat");

  if (!vatNumber) {
    return NextResponse.json(
      { error: "VAT number query parameter is required", isValid: false },
      { status: 400 }
    );
  }

  // Redirect to POST handler
  const postRequest = new NextRequest(request.url, {
    method: "POST",
    body: JSON.stringify({ vatNumber }),
    headers: { "Content-Type": "application/json" },
  });

  return POST(postRequest);
}

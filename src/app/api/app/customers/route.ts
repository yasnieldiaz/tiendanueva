import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret"
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

async function verifyAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {
      role: "CUSTOMER",
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          orders: {
            select: {
              id: true,
              total: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const formattedCustomers = customers.map((customer: typeof customers[number]) => ({
      id: customer.id,
      name: customer.name || "Sin nombre",
      email: customer.email,
      phone: customer.phone || "-",
      ordersCount: customer.orders.length,
      totalSpent: customer.orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0),
      createdAt: customer.createdAt,
    }));

    return NextResponse.json({
      customers: formattedCustomers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Error fetching customers" },
      { status: 500, headers: corsHeaders }
    );
  }
}

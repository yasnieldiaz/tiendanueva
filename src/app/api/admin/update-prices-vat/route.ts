import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST: Update all product prices to remove VAT (divide by 1.23)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all products
    const products = await prisma.product.findMany({
      select: { id: true, price: true, name: true }
    });

    const VAT_RATE = 1.23;
    const updates = [];

    for (const product of products) {
      // Calculate net price (without VAT)
      const netPrice = Math.round((product.price / VAT_RATE) * 100) / 100;

      updates.push({
        id: product.id,
        oldPrice: product.price,
        newPrice: netPrice,
        name: product.name
      });

      // Update product price
      await prisma.product.update({
        where: { id: product.id },
        data: { price: netPrice }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} products`,
      updates
    });
  } catch (error) {
    console.error("Error updating prices:", error);
    return NextResponse.json(
      { error: "Error updating prices" },
      { status: 500 }
    );
  }
}

// GET: Preview price changes without applying
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      select: { id: true, price: true, name: true }
    });

    const VAT_RATE = 1.23;
    const preview = products.map(product => ({
      id: product.id,
      name: product.name,
      currentPrice: product.price,
      netPrice: Math.round((product.price / VAT_RATE) * 100) / 100,
      vatAmount: Math.round((product.price - product.price / VAT_RATE) * 100) / 100
    }));

    return NextResponse.json({
      preview,
      totalProducts: products.length,
      message: "Preview of price changes (POST to apply)"
    });
  } catch (error) {
    console.error("Error previewing prices:", error);
    return NextResponse.json(
      { error: "Error previewing prices" },
      { status: 500 }
    );
  }
}

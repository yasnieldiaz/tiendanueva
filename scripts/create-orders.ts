import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Creando clientes y órdenes de prueba...');

  // Crear clientes
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'juan.garcia@example.com',
        name: 'Juan García',
        password: await bcrypt.hash('password123', 12),
        phone: '+34 612 345 678',
        role: 'CUSTOMER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.lopez@example.com',
        name: 'María López',
        password: await bcrypt.hash('password123', 12),
        phone: '+34 623 456 789',
        role: 'CUSTOMER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'pedro.martinez@example.com',
        name: 'Pedro Martínez',
        password: await bcrypt.hash('password123', 12),
        phone: '+34 634 567 890',
        role: 'CUSTOMER',
      },
    }),
  ]);

  console.log(`Creados ${customers.length} clientes`);

  // Obtener productos
  const products = await prisma.product.findMany({ take: 5 });

  if (products.length === 0) {
    console.log('No hay productos en la base de datos');
    return;
  }

  // Crear órdenes
  const orders = [
    {
      userId: customers[0].id,
      status: 'PENDING' as const,
      subtotal: products[0].price * 2,
      shippingCost: 50,
      tax: products[0].price * 2 * 0.21,
      total: products[0].price * 2 + 50 + products[0].price * 2 * 0.21,
      shippingAddress: 'Calle Mayor 123, 28001 Madrid, España',
      paymentMethod: 'stripe',
      isPaid: true,
      paidAt: new Date(),
      items: [
        { productId: products[0].id, name: products[0].name, price: products[0].price, quantity: 2 },
      ],
    },
    {
      userId: customers[1].id,
      status: 'PROCESSING' as const,
      subtotal: products[1].price,
      shippingCost: 0,
      tax: products[1].price * 0.21,
      total: products[1].price + products[1].price * 0.21,
      shippingAddress: 'Avda. Diagonal 456, 08006 Barcelona, España',
      paymentMethod: 'stripe',
      isPaid: true,
      paidAt: new Date(),
      items: [
        { productId: products[1].id, name: products[1].name, price: products[1].price, quantity: 1 },
      ],
    },
    {
      userId: customers[2].id,
      status: 'SHIPPED' as const,
      subtotal: products[2].price + products[3].price * 3,
      shippingCost: 75,
      tax: (products[2].price + products[3].price * 3) * 0.21,
      total: products[2].price + products[3].price * 3 + 75 + (products[2].price + products[3].price * 3) * 0.21,
      shippingAddress: 'Plaza España 789, 41001 Sevilla, España',
      paymentMethod: 'stripe',
      isPaid: true,
      paidAt: new Date(Date.now() - 86400000 * 2),
      trackingNumber: 'ES123456789',
      carrier: 'SEUR',
      shippedAt: new Date(Date.now() - 86400000),
      items: [
        { productId: products[2].id, name: products[2].name, price: products[2].price, quantity: 1 },
        { productId: products[3].id, name: products[3].name, price: products[3].price, quantity: 3 },
      ],
    },
    {
      userId: customers[0].id,
      status: 'DELIVERED' as const,
      subtotal: products[4].price * 2,
      shippingCost: 25,
      tax: products[4].price * 2 * 0.21,
      total: products[4].price * 2 + 25 + products[4].price * 2 * 0.21,
      shippingAddress: 'Calle Mayor 123, 28001 Madrid, España',
      paymentMethod: 'stripe',
      isPaid: true,
      paidAt: new Date(Date.now() - 86400000 * 7),
      trackingNumber: 'ES987654321',
      carrier: 'MRW',
      shippedAt: new Date(Date.now() - 86400000 * 5),
      items: [
        { productId: products[4].id, name: products[4].name, price: products[4].price, quantity: 2 },
      ],
    },
    {
      userId: customers[1].id,
      status: 'PENDING' as const,
      subtotal: products[0].price,
      shippingCost: 50,
      tax: products[0].price * 0.21,
      total: products[0].price + 50 + products[0].price * 0.21,
      shippingAddress: 'Avda. Diagonal 456, 08006 Barcelona, España',
      paymentMethod: 'stripe',
      isPaid: false,
      notes: 'Cliente pidió factura con NIF',
      items: [
        { productId: products[0].id, name: products[0].name, price: products[0].price, quantity: 1 },
      ],
    },
  ];

  // Obtener el último orderNumber
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: 'desc' },
  });
  let orderNumber = (lastOrder?.orderNumber || 1000);

  for (const orderData of orders) {
    orderNumber++;
    const { items, ...order } = orderData;

    const createdOrder = await prisma.order.create({
      data: {
        ...order,
        orderNumber,
        items: {
          create: items,
        },
      },
    });

    console.log(`Orden #${orderNumber} creada (${order.status})`);
  }

  console.log('\n¡Listo! Se crearon 5 órdenes de prueba.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, UserRole, ItemType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'gold-resellers' },
    update: {},
    create: {
      name: 'Gold Resellers Co.',
      slug: 'gold-resellers',
      currency: 'USD',
      address: '123 Gold Souq, Dubia',
      contact: '+971 50 123 4567'
    },
  })
  console.log('Created Tenant:', tenant.name)

  // 2. Create Users
  const hashedPassword = bcrypt.hashSync('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gold.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'admin@gold.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      tenantId: tenant.id
    },
  })
  console.log('Created Admin:', admin.email)

  // 3. Create Metals
  const metals = [
    { name: 'Gold', code: 'AU' },
    { name: 'Silver', code: 'AG' },
    { name: 'Platinum', code: 'PT' }
  ]

  for (const m of metals) {
    await prisma.metal.upsert({
      where: {
        tenantId_name: {
          tenantId: tenant.id,
          name: m.name
        }
      },
      update: {},
      create: {
        name: m.name,
        code: m.code,
        tenantId: tenant.id
      }
    })
  }
  const goldMetal = await prisma.metal.findUnique({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Gold' } }
  })
  
  if (!goldMetal) return

  // 4. Create Karats
  const karats = [
    { name: '24K', purity: 0.999 },
    { name: '22K', purity: 0.916 },
    { name: '21K', purity: 0.875 },
    { name: '18K', purity: 0.750 },
  ]

  for (const k of karats) {
    // Check if exists (no unique constraint on karat name per metal generally, but practical)
    // We'll just create for now or find first
    const existing = await prisma.karat.findFirst({
      where: { metalId: goldMetal.id, name: k.name }
    })
    if (!existing) {
      await prisma.karat.create({
        data: {
          name: k.name,
          purity: k.purity,
          metalId: goldMetal.id
        }
      })
    }
  }

  // 5. Create Customers
  await prisma.customer.create({
    data: {
      name: 'John Doe Jewellery',
      email: 'john@doe.com',
      address: 'Downtown',
      tenantId: tenant.id
    }
  })

  // 6. Create Vendors
  await prisma.vendor.create({
    data: {
      name: 'Bullion Supplier Ltd',
      email: 'supply@bullion.com',
      tenantId: tenant.id
    }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

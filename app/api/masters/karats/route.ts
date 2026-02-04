import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, purity, metalId } = body

    if (!name || !purity || !metalId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const karat = await db.karat.create({
      data: {
        name,
        purity: parseFloat(purity),
        metalId,
      }
    })

    return NextResponse.json(karat)
  } catch (error) {
    console.error("[KARATS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { id, name, purity } = body

    if (!id || !name || !purity) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const existingKarat = await db.karat.findUnique({
      where: { id },
      include: { metal: true }
    })

    if (!existingKarat) {
      return new NextResponse("Karat not found", { status: 404 })
    }

    // Verify tenant
    const user = await db.user.findUnique({
        where: { email: session.user.email! },
        select: { tenantId: true }
    })

    if (!user || user.tenantId !== existingKarat.metal.tenantId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const karat = await db.karat.update({
      where: { id },
      data: { 
        name, 
        purity: parseFloat(purity)
      }
    })

    return NextResponse.json(karat)
  } catch (error) {
    console.error("[KARATS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
        return new NextResponse("Missing id", { status: 400 })
    }

    const existingKarat = await db.karat.findUnique({
        where: { id },
        include: { metal: true }
    })
  
    if (!existingKarat) {
        return new NextResponse("Karat not found", { status: 404 })
    }

    // Tenant check
    const user = await db.user.findUnique({
        where: { email: session.user.email! },
        select: { tenantId: true }
    })

    if (!user || user.tenantId !== existingKarat.metal.tenantId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await db.karat.delete({
      where: { id }
    })

    return new NextResponse("Karat deleted", { status: 200 })
  } catch (error) {
    console.error("[KARATS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

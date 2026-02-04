import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // In a real multi-tenant app, we would resolve the tenant from the session or domain.
    // For now, allowfetching keys for the user's tenant (or default one if not strictly set yet in session).
    // We'll fetch the user first to get tenantId.
    const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { tenantId: true }
    })

    if (!user) return new NextResponse("User not found", { status: 404 })

    const metals = await db.metal.findMany({
      where: { tenantId: user.tenantId },
      include: { karats: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(metals)
  } catch (error) {
    console.error("[METALS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, code } = body

    if (!name || !code) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { tenantId: true }
    })

    if (!user) return new NextResponse("User not found", { status: 404 })

    const metal = await db.metal.create({
      data: {
        name,
        code,
        tenantId: user.tenantId,
      }
    })

    return NextResponse.json(metal)
  } catch (error) {
    console.error("[METALS_POST]", error)
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
    const { id, name, code } = body

    if (!id || !name || !code) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const existingMetal = await db.metal.findUnique({
      where: { id }
    })

    if (!existingMetal) {
      return new NextResponse("Metal not found", { status: 404 })
    }

    // Verify tenant ownership (simplified for now, ideally check user tenant vs metal tenant)
    const user = await db.user.findUnique({
        where: { email: session.user.email! },
        select: { tenantId: true }
    })

    if (!user || user.tenantId !== existingMetal.tenantId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const metal = await db.metal.update({
      where: { id },
      data: { name, code }
    })

    return NextResponse.json(metal)
  } catch (error) {
    console.error("[METALS_PATCH]", error)
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

    const existingMetal = await db.metal.findUnique({
        where: { id },
        include: { karats: true } // Check for dependencies
      })
  
    if (!existingMetal) {
        return new NextResponse("Metal not found", { status: 404 })
    }

    // Tenant check
    const user = await db.user.findUnique({
        where: { email: session.user.email! },
        select: { tenantId: true }
    })

    if (!user || user.tenantId !== existingMetal.tenantId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if metal has any karats or other dependencies (optional strictness)
    if (existingMetal.karats.length > 0) {
        return new NextResponse("Cannot delete metal with underlying karats", { status: 400 })
    }

    await db.metal.delete({
      where: { id }
    })

    return new NextResponse("Metal deleted", { status: 200 })
  } catch (error) {
    console.error("[METALS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { MetalsTable } from "@/components/masters/metals-table"
import { redirect } from "next/navigation"

export default async function MetalsPage() {
  const session = await auth()
  
  if (!session || !session.user || !session.user.email) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { tenantId: true }
  })

  if (!user) {
      return <div>User not found</div>
  }

  const metals = await db.metal.findMany({
    where: { tenantId: user.tenantId },
    include: { karats: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container mx-auto py-6">
      <MetalsTable metals={metals} />
    </div>
  )
}

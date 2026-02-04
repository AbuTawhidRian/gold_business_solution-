import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Scale, TrendingUp, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  // Mock Data
  const stats = [
    {
      title: "Total Sales (Today)",
      value: "$12,345.00",
      description: "+15% from yesterday",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Gold Rate (24K)",
      value: "$85.50 /g",
      description: "Updated 1 hour ago",
      icon: TrendingUp,
      color: "text-amber-500",
    },
    {
      title: "Stock Balance (Gold)",
      value: "1,250.50 g",
      description: "2 Locations",
      icon: Scale,
      color: "text-blue-500",
    },
    {
      title: "Low Stock Items",
      value: "3 Items",
      description: "Requires attention",
      icon: AlertTriangle,
      color: "text-rose-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your business performance today.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sales chart will appear here...</p>
            <div className="h-[200px] w-full bg-muted/20 mt-4 rounded-md flex items-center justify-center text-muted-foreground">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-border shadow-sm">
          <CardHeader>
             <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
             {/* Quick Buttons */}
             <div className="p-4 border rounded-lg bg-card hover:bg-accent cursor-pointer transition">
                <div className="font-semibold">New Sale</div>
                <div className="text-xs text-muted-foreground">Create a new invoice</div>
             </div>
             <div className="p-4 border rounded-lg bg-card hover:bg-accent cursor-pointer transition">
                <div className="font-semibold">Stock In</div>
                <div className="text-xs text-muted-foreground">Add inventory Items</div>
             </div>
             <div className="p-4 border rounded-lg bg-card hover:bg-accent cursor-pointer transition">
                <div className="font-semibold">Update Rates</div>
                <div className="text-xs text-muted-foreground">Set today's gold price</div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

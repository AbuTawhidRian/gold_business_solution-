"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users,
  Gem,
  Coins
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Masters",
    href: "/dashboard/masters",
    icon: Settings,
    submenu: [
        { title: "Metals & Karats", href: "/dashboard/masters/metals" },
        { title: "Customers", href: "/dashboard/masters/customers" },
        { title: "Vendors", href: "/dashboard/masters/vendors" },
    ]
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: ShoppingCart,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-slate-100 border-r border-slate-800">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <Gem className="h-6 w-6 text-amber-500 mr-2" />
        <span className="text-lg font-bold tracking-tight text-amber-500">Gold SaaS</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-amber-500 hover:bg-slate-800",
                  isActive ? "bg-slate-800 text-amber-500" : "text-slate-400"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-200">Admin User</span>
            <span className="text-[10px] text-slate-500">admin@gold.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}

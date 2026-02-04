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
  Coins,ChevronDown,ChevronRight
} from "lucide-react"
import { useState } from "react"

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
            const hasSubmenu = item.submenu && item.submenu.length > 0
            
            // Simple expansion state logic could be added here, 
            // but for now let's just render them flat or use client state if we restructure.
            // Since this is a server/client hybrid file, let's use a client component approach properly 
            // OR simply keeping it simple: modify the structure to support recursion?
            
            // We need to change the component to be able to use state for toggles. It is marked 'use client', so we can use state.
            return (
              <SidebarItem key={index} item={item} pathname={pathname} />
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

function SidebarItem({ item, pathname }: { item: any, pathname: string | null }) {
  const [expanded, setExpanded] = useState(false)
  
  // Auto-expand if child is active
  const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") && !item.submenu)
  const isChildActive = item.submenu?.some((sub: any) => pathname === sub.href)
  
  // Initial effect to expand if active? 
  // We can initialize state based on props but that's risky with hydration.
  // Better to use useEffect or just let it be controlled.
  // For simplicity, let's just check `isChildActive` for default open style or controlled state.
  
  // Actually, we can just use the prop to force it open if active, 
  // but user might want to toggle. Let's initialize:
  if (isChildActive && !expanded) {
      // proper way would be useEffect but infinite loop risk if not careful.
      // let's default to closed unless we want strictly auto-open.
  }

  // Effectless approach: calculate derived state? No, toggle needs specific state.
  // Let's use a lazy initializer or effect.
  
  // Better yet, render submenu if `expanded || isChildActive` ?
  // That assumes we always want it expanded if active (good UX).
  
  const showSubmenu = expanded || isChildActive

  return (
    <div className="flex flex-col gap-1">
        <Link
            href={item.submenu ? "#" : item.href}
            onClick={(e) => {
                if (item.submenu) {
                    e.preventDefault()
                    setExpanded(!expanded)
                }
            }}
            className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-amber-500 hover:bg-slate-800",
                (isActive || isChildActive) ? "bg-slate-800 text-amber-500" : "text-slate-400"
            )}
        >
            <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.title}
            </div>
            {item.submenu && (
                expanded || isChildActive ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            )}
        </Link>
        
        {item.submenu && showSubmenu && (
            <div className="ml-9 flex flex-col gap-1 border-l border-slate-800 pl-2">
                {item.submenu.map((sub: any, idx: number) => (
                    <Link
                        key={idx}
                        href={sub.href}
                        className={cn(
                            "rounded-md px-3 py-1.5 text-sm transition-colors hover:text-amber-500",
                            pathname === sub.href ? "text-amber-500 bg-slate-800/50" : "text-slate-500"
                        )}
                    >
                        {sub.title}
                    </Link>
                ))}
            </div>
        )}
    </div>
  )
}

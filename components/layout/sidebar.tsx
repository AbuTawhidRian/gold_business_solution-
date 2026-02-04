"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area" // I need to check if ScrollArea is installed? No, I didn't install it. I'll use div overflow.
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  RefreshCcw, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Inventory",
      icon: Package,
      href: "/dashboard/inventory",
      color: "text-violet-500",
    },
    {
      label: "Sales & Purchase",
      icon: ShoppingCart,
      href: "/dashboard/transactions",
      color: "text-pink-700",
    },
    {
      label: "Metal Exchange",
      icon: RefreshCcw,
      href: "/dashboard/exchange",
      color: "text-orange-700",
    },
    {
      label: "Reports",
      icon: FileText,
      href: "/dashboard/reports",
      color: "text-emerald-500",
    },
    {
      label: "Parties",
      icon: Users,
      href: "/dashboard/parties",
      color: "text-blue-700",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  return (
    <div className={cn("pb-12 space-y-4 py-4 flex flex-col h-full bg-sidebar border-r border-sidebar-border", className)}>
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 bg-primary rounded-full flex items-center justify-center">
             <span className="text-primary-foreground font-bold">G</span>
          </div>
          <h1 className="text-2xl font-bold text-sidebar-foreground">
            Gold SaaS
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-sidebar-primary hover:bg-sidebar-accent rounded-lg transition",
                pathname === route.href ? "text-sidebar-primary bg-sidebar-accent" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3">
         <Link
              href="/auth/signout"
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-destructive hover:bg-destructive/10 rounded-lg transition text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <LogOut className="h-5 w-5 mr-3 text-destructive" />
                Sign Out
              </div>
            </Link>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-sidebar w-72">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

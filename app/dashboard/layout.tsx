import { Sidebar, MobileSidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button" // Assuming standard button

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full relative bg-background">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar className="bg-sidebar" />
      </div>
      <main className="md:pl-72 h-full">
        <div className="flex items-center p-4 md:hidden border-b border-border bg-sidebar text-sidebar-foreground">
            <MobileSidebar />
            <span className="font-bold ml-2">Gold SaaS</span>
        </div>
        <div className="p-8 h-full overflow-y-auto">
             {children}
        </div>
      </main>
    </div>
  )
}

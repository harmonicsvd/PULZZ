import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Music, Trophy, Settings, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/songs", label: "Discovery Pool", icon: Music },
    { href: "/wall", label: "The Wall", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex fixed inset-y-0 z-10">
        <div className="p-6">
          <Link href="/">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer">
              <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-background rounded-full" />
              </div>
              PULZZ <span className="text-muted-foreground font-normal">ARTIST</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer text-sm font-medium",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <Link href="/songs/new">
            <div className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer shadow-md">
              <Plus className="w-4 h-4" />
              Submit Song
            </div>
          </Link>
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground px-3 py-2 cursor-pointer hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground px-3 py-2 cursor-pointer hover:text-foreground transition-colors mt-1">
            <LogOut className="w-4 h-4" />
            Sign Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative">
        {children}
      </main>
    </div>
  );
}

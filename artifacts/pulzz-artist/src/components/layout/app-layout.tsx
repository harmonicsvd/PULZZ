import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Music, Trophy, Users, Settings, LogOut, Plus } from "lucide-react";
import { useClerk } from "@clerk/react";
import { cn } from "@/lib/utils";

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? "/";
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/songs", label: "Discovery Pool", icon: Music },
    { href: "/artists", label: "Collaborate", icon: Users },
    { href: "/wall", label: "The Wall", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex fixed inset-y-0 z-10">
        <div className="p-6">
          <a href={LANDING_URL}>
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 bg-background rounded-full" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight leading-none">PULZZ</span>
              <span className="text-muted-foreground font-medium text-xs tracking-[0.18em] uppercase mt-0.5">Artist</span>
            </div>
          </a>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              location === item.href ||
              (item.href === "/dashboard" && location === "/") ||
              (item.href !== "/dashboard" && location.startsWith(item.href));
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
          <Link href="/settings">
            <div className={cn(
              "flex items-center gap-3 text-sm px-3 py-2 cursor-pointer transition-colors",
              location === "/settings"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}>
              <Settings className="w-4 h-4" />
              Settings
            </div>
          </Link>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
            className="w-full flex items-center gap-3 text-sm text-muted-foreground px-3 py-2 cursor-pointer hover:text-foreground transition-colors mt-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative">
        {children}
      </main>
    </div>
  );
}

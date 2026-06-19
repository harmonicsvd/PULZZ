import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Music, Trophy, Users, Settings, LogOut, Plus, Menu } from "lucide-react";
import { useClerk } from "@clerk/react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/songs", label: "Discovery Pool", icon: Music },
  { href: "/artists", label: "Collaborate", icon: Users },
  { href: "/wall", label: "The Wall", icon: Trophy },
];

function BrandMark() {
  return (
    <Link href="/dashboard">
      <div className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
          <div className="w-2.5 h-2.5 bg-background rounded-full" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight leading-none">PUL<span className="text-primary">ZZ</span></span>
        <span className="text-muted-foreground font-medium text-xs tracking-[0.18em] uppercase mt-0.5">Artist</span>
      </div>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { signOut } = useClerk();

  return (
    <>
      <div className="p-6">
        <BrandMark />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            location === item.href ||
            (item.href === "/dashboard" && location === "/") ||
            (item.href !== "/dashboard" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
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
        <Link href="/songs/new" onClick={onNavigate}>
          <div className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer shadow-md">
            <Plus className="w-4 h-4" />
            Submit Song
          </div>
        </Link>
      </div>

      <div className="p-4 border-t border-border">
        <Link href="/settings" onClick={onNavigate}>
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
          onClick={() => {
            onNavigate?.();
            signOut({ redirectUrl: `${basePath}/sign-in` });
          }}
          className="w-full flex items-center gap-3 text-sm text-muted-foreground px-3 py-2 cursor-pointer hover:text-foreground transition-colors mt-1"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="w-64 border-r border-border bg-card flex-col hidden md:flex fixed inset-y-0 z-10">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-card flex flex-col">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 h-14 border-b border-border bg-card/95 backdrop-blur">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 rounded-md text-foreground hover:bg-secondary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <BrandMark />
        </header>
        {children}
      </main>
    </div>
  );
}

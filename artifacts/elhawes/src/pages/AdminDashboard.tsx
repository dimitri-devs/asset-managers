import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Map, BookOpen, LogOut,
  TrendingUp, Users, Clock, CheckCircle, DollarSign
} from "lucide-react";
import { useGetDashboardStats, useAdminLogout, useGetAdminMe } from "@workspace/api-client-react";
import { formatDZD } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminLayoutProps {
  children: React.ReactNode;
  active: string;
}

export function AdminLayout({ children, active }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const adminLogout = useAdminLogout();

  const handleLogout = () => {
    adminLogout.mutate(undefined, {
      onSuccess: () => setLocation("/admin/login"),
    });
  };

  const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, key: "dashboard" },
    { href: "/admin/trips", label: "Voyages", icon: Map, key: "trips" },
    { href: "/admin/bookings", label: "Réservations", icon: BookOpen, key: "bookings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* SIDEBAR */}
      <aside className="w-60 bg-[hsl(var(--secondary))] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-serif text-2xl text-[hsl(var(--primary))]">El Hawes</h2>
          <p className="text-white/50 text-xs mt-1">Administration</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href}>
              <div
                data-testid={`nav-${item.key}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active === item.key
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            data-testid="button-logout"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white w-full transition-all"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: adminMe } = useGetAdminMe();

  const statCards = [
    {
      label: "Total Voyages",
      value: stats?.totalTrips ?? 0,
      sub: `${stats?.activeTrips ?? 0} actifs`,
      icon: Map,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Réservations",
      value: stats?.totalBookings ?? 0,
      sub: `${stats?.pendingBookings ?? 0} en attente`,
      icon: BookOpen,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Confirmées",
      value: stats?.confirmedBookings ?? 0,
      sub: "réservations confirmées",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Revenus",
      value: stats ? formatDZD(stats.totalRevenueDzd) : "-",
      sub: "confirmés",
      icon: DollarSign,
      color: "text-[hsl(var(--primary))]",
      bg: "bg-amber-50",
    },
  ];

  return (
    <AdminLayout active="dashboard">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground">
            Bonjour{adminMe?.username ? `, ${adminMe.username}` : ""} !
          </h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de votre activité.</p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-5"
              data-testid={`stat-card-${i}`}
            >
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {isLoading ? (
                <Skeleton className="h-7 w-20 mb-1" />
              ) : (
                <div className="text-2xl font-bold text-foreground mb-1">{card.value}</div>
              )}
              <div className="text-xs text-muted-foreground">{card.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-0.5">{card.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* RECENT BOOKINGS */}
        <div className="bg-card border border-border rounded-2xl">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
              Réservations récentes
            </h2>
            <Link href="/admin/bookings">
              <span className="text-sm text-[hsl(var(--primary))] hover:underline cursor-pointer">
                Voir toutes →
              </span>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-5 w-full" />
                </div>
              ))
            ) : stats?.recentBookings.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Aucune réservation pour l&apos;instant.
              </div>
            ) : (
              stats?.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  data-testid={`recent-booking-${booking.id}`}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-foreground text-sm">{booking.fullName}</div>
                    <div className="text-xs text-muted-foreground">{booking.tripTitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">{formatDZD(booking.totalPriceDzd)}</div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full mt-0.5 ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status === "confirmed"
                        ? "Confirmé"
                        : booking.status === "pending"
                        ? "En attente"
                        : "Annulé"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import { AdminLayout } from "./AdminDashboard";
import { motion } from "framer-motion";
import { Phone, Mail, Check, X, MessageCircle } from "lucide-react";
import {
  useListBookings,
  useUpdateBooking,
  getListBookingsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDZD } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending: { label: "En attente", class: "bg-orange-100 text-orange-700" },
  confirmed: { label: "Confirmé", class: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulé", class: "bg-red-100 text-red-700" },
};

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: bookings, isLoading } = useListBookings();
  const updateBooking = useUpdateBooking();

  const invalidateBookings = () => {
    queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
  };

  const handleStatusChange = (id: number, status: string) => {
    updateBooking.mutate(
      { id, data: { status } },
      {
        onSuccess: () => { invalidateBookings(); toast({ title: "Statut mis à jour" }); },
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      }
    );
  };

  const handleToggleContacted = (id: number, isContacted: boolean) => {
    updateBooking.mutate(
      { id, data: { isContacted: !isContacted } },
      { onSuccess: () => invalidateBookings() }
    );
  };

  return (
    <AdminLayout active="bookings">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground">Réservations</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les demandes de réservation.{" "}
            {!isLoading && (
              <span className="font-medium text-foreground">{bookings?.length ?? 0} au total</span>
            )}
          </p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))
          ) : bookings?.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
              Aucune réservation pour l&apos;instant.
            </div>
          ) : (
            bookings?.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-testid={`row-booking-${booking.id}`}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* LEFT */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-foreground">{booking.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{booking.tripTitle}</p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          STATUS_LABELS[booking.status]?.class ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {STATUS_LABELS[booking.status]?.label ?? booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                      <a href={`mailto:${booking.email}`} className="flex items-center gap-1.5 hover:text-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        {booking.email}
                      </a>
                      <a href={`tel:${booking.phone}`} className="flex items-center gap-1.5 hover:text-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        {booking.phone}
                      </a>
                      <span>{booking.numberOfPeople} pers.</span>
                      <span className="font-semibold text-foreground">{formatDZD(booking.totalPriceDzd)}</span>
                      {booking.preferredDate && <span>Date : {booking.preferredDate}</span>}
                    </div>
                    {booking.message && (
                      <p className="text-xs text-muted-foreground mt-2 bg-muted/40 rounded-lg px-3 py-2 flex items-start gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        {booking.message}
                      </p>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-2 md:flex-col md:gap-2 md:min-w-36">
                    <select
                      data-testid={`select-status-${booking.id}`}
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="border border-border rounded-lg py-1.5 px-3 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmer</option>
                      <option value="cancelled">Annuler</option>
                    </select>

                    <button
                      data-testid={`button-contacted-${booking.id}`}
                      onClick={() => handleToggleContacted(booking.id, booking.isContacted)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        booking.isContacted
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {booking.isContacted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Contacté
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Non contacté
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

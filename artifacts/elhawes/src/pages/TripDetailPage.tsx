import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  MapPin, Clock, Users, Star, Check, X, ChevronLeft,
  Calendar, Phone, Mail, User, MessageSquare
} from "lucide-react";
import { useListTrips, useCreateBooking } from "@workspace/api-client-react";
import { formatDZD } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface TripDetailPageProps {
  slug: string;
}

export default function TripDetailPage({ slug }: TripDetailPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    numberOfPeople: 1,
    message: "",
    preferredDate: "",
  });

  const { data: trips, isLoading } = useListTrips({ params: {} });
  const trip = trips?.find((t) => t.slug === slug);

  const createBooking = useCreateBooking();

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    createBooking.mutate(
      {
        data: {
          tripId: trip.id,
          fullName: bookingForm.fullName,
          email: bookingForm.email,
          phone: bookingForm.phone,
          numberOfPeople: bookingForm.numberOfPeople,
          message: bookingForm.message,
          preferredDate: bookingForm.preferredDate,
        },
      },
      {
        onSuccess: () => {
          setLocation("/booking-success");
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue. Veuillez réessayer.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-96 w-full" />
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Voyage introuvable</h1>
          <Link href="/trips" className="text-[hsl(var(--primary))] hover:underline">
            Retour aux voyages
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = trip.priceDzd * bookingForm.numberOfPeople;
  const allImages = [trip.imageUrl, ...trip.galleryImages];

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={selectedImage ?? trip.imageUrl}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <div className="absolute inset-x-0 bottom-0 p-6 max-w-6xl mx-auto">
          <nav className="text-white/70 text-sm mb-3">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/trips" className="hover:text-white">Voyages</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{trip.title}</span>
          </nav>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-bold px-3 py-1 rounded-full">
              {trip.category}
            </span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
              {trip.difficulty}
            </span>
            {trip.spotsLeft <= 5 && trip.spotsLeft > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Seulement {trip.spotsLeft} places restantes !
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white">{trip.title}</h1>
        </div>
        <Link href="/trips">
          <button
            data-testid="button-back"
            className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* GALLERY THUMBS */}
      {allImages.length > 1 && (
        <div className="max-w-6xl mx-auto px-6 -mt-6 relative z-10">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.slice(0, 6).map((img, i) => (
              <button
                key={i}
                data-testid={`thumb-image-${i}`}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  (selectedImage ?? trip.imageUrl) === img
                    ? "border-[hsl(var(--primary))]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT: DETAILS */}
          <div className="lg:col-span-2">
            {/* META */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[hsl(var(--primary))]" />
                {trip.location}, {trip.country}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                {trip.durationDays} jours
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[hsl(var(--primary))]" />
                Max {trip.maxGroupSize} personnes
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" />
                {trip.rating} ({trip.reviewCount} avis)
              </span>
              {trip.departureDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[hsl(var(--primary))]" />
                  Départ : {trip.departureDate}
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl text-foreground mb-4">À propos de ce voyage</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{trip.description}</p>
            </div>

            {/* HIGHLIGHTS */}
            {trip.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-foreground mb-4">Points forts</h2>
                <ul className="space-y-2">
                  {trip.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center flex-shrink-0">
                        <Star className="w-3 h-3 text-[hsl(var(--primary))] fill-[hsl(var(--primary))]" />
                      </div>
                      <span className="text-muted-foreground">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* INCLUDED / EXCLUDED */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {trip.included.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Inclus
                  </h3>
                  <ul className="space-y-2">
                    {trip.included.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {trip.excluded.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400" /> Non inclus
                  </h3>
                  <ul className="space-y-2">
                    {trip.excluded.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: BOOKING PANEL */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-6">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {trip.originalPriceDzd && (
                        <div className="text-muted-foreground line-through text-sm">
                          {formatDZD(trip.originalPriceDzd)}
                        </div>
                      )}
                      <div className="font-bold text-[hsl(var(--primary))] text-2xl">
                        {formatDZD(trip.priceDzd)}
                      </div>
                      <div className="text-xs text-muted-foreground">par personne</div>
                    </div>
                    {trip.spotsLeft <= 5 && trip.spotsLeft > 0 && (
                      <div className="text-right">
                        <div className="text-xs font-bold text-orange-500">
                          {trip.spotsLeft} places !
                        </div>
                        <div className="text-xs text-muted-foreground">restantes</div>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        data-testid="input-fullname"
                        type="text"
                        required
                        value={bookingForm.fullName}
                        onChange={(e) => setBookingForm((f) => ({ ...f, fullName: e.target.value }))}
                        placeholder="Votre nom"
                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        data-testid="input-email"
                        type="email"
                        required
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="votre@email.com"
                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        data-testid="input-phone"
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+213 XX XX XX XX"
                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Nombre de personnes
                    </label>
                    <select
                      data-testid="select-people"
                      value={bookingForm.numberOfPeople}
                      onChange={(e) =>
                        setBookingForm((f) => ({ ...f, numberOfPeople: parseInt(e.target.value) }))
                      }
                      className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    >
                      {Array.from({ length: Math.min(trip.maxGroupSize, 10) }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} personne{i > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Date souhaitée
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        data-testid="input-date"
                        type="date"
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm((f) => ({ ...f, preferredDate: e.target.value }))}
                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Message (optionnel)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <textarea
                        data-testid="input-message"
                        value={bookingForm.message}
                        onChange={(e) => setBookingForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Questions ou demandes spéciales..."
                        rows={3}
                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
                      />
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatDZD(trip.priceDzd)} × {bookingForm.numberOfPeople} pers.
                      </span>
                      <span className="font-bold text-foreground">{formatDZD(totalPrice)}</span>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    data-testid="button-book"
                    disabled={createBooking.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3.5 rounded-xl font-bold text-base hover:bg-[hsl(35,85%,55%)] transition-colors disabled:opacity-60"
                  >
                    {createBooking.isPending ? "Envoi en cours..." : "Réserver ce voyage"}
                  </motion.button>

                  <p className="text-xs text-center text-muted-foreground">
                    Nous vous contacterons dans les 24h pour confirmer votre réservation.
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

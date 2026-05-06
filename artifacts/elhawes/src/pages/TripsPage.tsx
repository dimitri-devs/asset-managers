import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, Users, Filter } from "lucide-react";
import { useListTrips } from "@workspace/api-client-react";
import { formatDZD } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["Tous", "Adventure", "Culture", "Beach", "Desert", "Mountain"];
const DURATIONS = ["Tous", "1-3 jours", "4-7 jours", "8+ jours"];

export default function TripsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedDuration, setSelectedDuration] = useState("Tous");

  const { data: trips, isLoading } = useListTrips({ params: {} });

  const filtered = trips?.filter((trip) => {
    const categoryMatch = selectedCategory === "Tous" || trip.category === selectedCategory;
    const durationMatch =
      selectedDuration === "Tous" ||
      (selectedDuration === "1-3 jours" && trip.durationDays <= 3) ||
      (selectedDuration === "4-7 jours" && trip.durationDays >= 4 && trip.durationDays <= 7) ||
      (selectedDuration === "8+ jours" && trip.durationDays >= 8);
    return categoryMatch && durationMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div
        className="relative h-64 md:h-80 flex items-end overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="text-white/60 text-sm mb-2">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Voyages</span>
            </nav>
            <h1 className="font-serif text-4xl md:text-5xl text-white">Tous nos Voyages</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-10 items-center">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Filter className="w-4 h-4" />
            <span>Filtrer :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                data-testid={`filter-category-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 border-l pl-4">
            {DURATIONS.map((dur) => (
              <button
                key={dur}
                data-testid={`filter-duration-${dur}`}
                onClick={() => setSelectedDuration(dur)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedDuration === dur
                    ? "bg-[hsl(var(--secondary))] text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {dur}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS COUNT */}
        {!isLoading && (
          <p className="text-muted-foreground text-sm mb-6">
            {filtered?.length ?? 0} voyage{(filtered?.length ?? 0) !== 1 ? "s" : ""} trouvé{(filtered?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        )}

        {/* GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : filtered?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-serif">Aucun voyage trouvé pour ces filtres.</p>
            <button
              onClick={() => { setSelectedCategory("Tous"); setSelectedDuration("Tous"); }}
              className="mt-4 text-[hsl(var(--primary))] hover:underline text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/trips/${trip.slug}`}>
                  <div
                    data-testid={`card-trip-${trip.id}`}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {trip.originalPriceDzd && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Offre Limitée
                        </div>
                      )}
                      {trip.spotsLeft <= 5 && trip.spotsLeft > 0 && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {trip.spotsLeft} places restantes
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
                        <MapPin className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                        {trip.location}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-[hsl(var(--primary))] transition-colors leading-tight">
                          {trip.title}
                        </h3>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                          {trip.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{trip.shortDescription}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {trip.durationDays} jours
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          max {trip.maxGroupSize} pers.
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" />
                          {trip.rating} ({trip.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <div>
                          {trip.originalPriceDzd && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatDZD(trip.originalPriceDzd)}
                            </div>
                          )}
                          <div className="font-bold text-[hsl(var(--primary))] text-lg">{formatDZD(trip.priceDzd)}</div>
                          <div className="text-xs text-muted-foreground">par personne</div>
                        </div>
                        <span className="text-sm font-medium text-[hsl(var(--primary))] group-hover:underline">
                          Voir détails →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

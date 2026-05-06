import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, ChevronRight, Users, Instagram } from "lucide-react";
import { useListTrips, useGetInstagramFeed } from "@workspace/api-client-react";
import { formatDZD } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const HERO_IMAGE = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1800&q=90";

const TESTIMONIALS = [
  {
    name: "Amira K.",
    location: "Alger",
    rating: 5,
    text: "Le voyage au Sahara avec El Hawes était simplement magique. Organisation parfaite, guides passionnés. Une expérience qui change la vie.",
  },
  {
    name: "Karim B.",
    location: "Oran",
    rating: 5,
    text: "Tassili N'Ajjer m'a coupé le souffle. El Hawes a pensé à tout — logistique, confort, découverte. Je recommande les yeux fermés.",
  },
  {
    name: "Sarah M.",
    location: "Constantine",
    rating: 5,
    text: "Le circuit côte méditerranéenne était incroyable. Plages secrètes, cuisine locale, ambiance inoubliable. Merci El Hawes !",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" : "text-muted"}`}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: featuredTrips, isLoading: tripsLoading } = useListTrips({
    params: { featured: "true", limit: 6 },
  });
  const { data: instagramPosts, isLoading: igLoading } = useGetInstagramFeed({ params: { limit: 9 } });

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-[hsl(var(--primary))] uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Voyages Authentiques en Algérie
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-6">
              Découvrez l&apos;Algérie
              <br />
              <em>autrement</em>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed">
              Des expéditions sahariennes aux côtes méditerranéennes — des voyages
              soigneusement conçus pour les âmes curieuses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/trips">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  data-testid="button-explore-trips"
                  className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[hsl(35,85%,55%)] transition-colors"
                >
                  Explorer les Voyages
                </motion.button>
              </Link>
              <a
                href="https://www.instagram.com/elhawes"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-instagram-hero"
                className="flex items-center gap-2 text-white border border-white/40 px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                @elhawes
              </a>
            </div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[hsl(var(--secondary))] text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Voyageurs satisfaits" },
              { value: "20+", label: "Destinations uniques" },
              { value: "4.9/5", label: "Note moyenne" },
              { value: "5 ans", label: "D'expérience" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-serif font-bold text-[hsl(var(--primary))]">{stat.value}</div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TRIPS */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[hsl(var(--primary))] uppercase tracking-[0.25em] text-xs font-semibold mb-3">
            Voyages Sélectionnés
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Voyages en Vedette
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Chaque voyage est une invitation à découvrir l&apos;Algérie sous son meilleur jour.
          </p>
        </motion.div>

        {tripsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrips?.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/trips/${trip.slug}`}>
                  <div
                    data-testid={`card-trip-${trip.id}`}
                    className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-500 cursor-pointer"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {trip.originalPriceDzd && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Offre Limitée
                        </div>
                      )}
                      {trip.spotsLeft <= 5 && trip.spotsLeft > 0 && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {trip.spotsLeft} places restantes
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 text-white">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                          {trip.location}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-[hsl(var(--primary))] transition-colors">
                        {trip.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{trip.shortDescription}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {trip.durationDays}j
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            max {trip.maxGroupSize}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" />
                            {trip.rating}
                          </span>
                        </div>
                        <div className="text-right">
                          {trip.originalPriceDzd && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatDZD(trip.originalPriceDzd)}
                            </div>
                          )}
                          <div className="font-bold text-[hsl(var(--primary))]">{formatDZD(trip.priceDzd)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/trips">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-testid="button-all-trips"
              className="inline-flex items-center gap-2 border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] px-8 py-3.5 rounded-full font-semibold hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-all"
            >
              Voir tous les voyages
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[hsl(var(--primary))] uppercase tracking-[0.25em] text-xs font-semibold mb-3">
              Notre Feed
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              Sur Instagram
            </h2>
            <p className="text-muted-foreground text-lg">
              Suivez nos aventures en temps réel — dunes, médinas, côtes et bien plus.
            </p>
          </motion.div>

          {igLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-3">
              {instagramPosts?.map((post, i) => (
                <motion.a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-instagram-post-${post.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative aspect-square rounded-lg overflow-hidden block"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption ?? "Instagram post"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center px-3">
                      <Instagram className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs line-clamp-2">{post.caption}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <a
              href="https://www.instagram.com/elhawes"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-follow-instagram"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-5 h-5" />
              Suivre @elhawes sur Instagram
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[hsl(var(--primary))] uppercase tracking-[0.25em] text-xs font-semibold mb-3">
            Témoignages
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Ce qu&apos;ils disent
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <StarRating rating={t.rating} />
              <p className="text-muted-foreground mt-4 mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.location}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[hsl(var(--secondary))]/85" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center text-white max-w-3xl mx-auto px-6"
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            Prêt pour l&apos;aventure ?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Rejoignez des centaines de voyageurs qui ont découvert l&apos;Algérie avec El Hawes.
            Places limitées — réservez maintenant.
          </p>
          <Link href="/trips">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              data-testid="button-cta-bottom"
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-10 py-4 rounded-full font-bold text-lg hover:bg-[hsl(35,85%,55%)] transition-colors"
            >
              Réserver mon voyage
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--secondary))] text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-2xl text-[hsl(var(--primary))] mb-3">El Hawes</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Voyages authentiques au coeur de l&apos;Algérie. Découverte, culture et aventure.
              </p>
              <a
                href="https://www.instagram.com/elhawes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-[hsl(var(--primary))] text-sm hover:underline"
              >
                <Instagram className="w-4 h-4" />
                @elhawes
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white/90">Navigation</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/trips" className="hover:text-white transition-colors">Voyages</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white/90">Contact</h4>
              <p className="text-white/60 text-sm">Pour toute demande de renseignement ou réservation, contactez-nous via Instagram ou par téléphone.</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-white/40 text-xs">
            © {new Date().getFullYear()} El Hawes. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

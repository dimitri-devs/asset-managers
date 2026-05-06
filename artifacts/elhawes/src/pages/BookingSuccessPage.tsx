import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, Instagram } from "lucide-react";

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        <h1 className="font-serif text-4xl text-foreground mb-4">
          Demande envoyée !
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          Merci pour votre intérêt. Notre équipe El Hawes vous contactera dans les{" "}
          <strong className="text-foreground">24 heures</strong> pour confirmer votre réservation et
          répondre à vos questions.
        </p>

        <div className="bg-muted/50 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-foreground mb-3">Prochaines étapes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-[hsl(var(--primary))] font-bold mt-0.5">1.</span>
              Confirmation par notre équipe (24h)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[hsl(var(--primary))] font-bold mt-0.5">2.</span>
              Discussion des détails et personnalisation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[hsl(var(--primary))] font-bold mt-0.5">3.</span>
              Confirmation de réservation et paiement
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/trips">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-testid="button-more-trips"
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 rounded-full font-semibold"
            >
              Voir d&apos;autres voyages
            </motion.button>
          </Link>
          <a
            href="https://www.instagram.com/elhawes"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-instagram-success"
            className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full font-semibold hover:bg-muted transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Suivre @elhawes
          </a>
        </div>
      </motion.div>
    </div>
  );
}

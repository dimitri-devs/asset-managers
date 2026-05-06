import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { useAdminLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const adminLogin = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          setLocation("/admin");
        },
        onError: () => {
          toast({
            title: "Accès refusé",
            description: "Identifiants incorrects.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1600&q=80)",
      }}
    >
      <div className="absolute inset-0 bg-[hsl(var(--secondary))]/80" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-white mb-2">El Hawes</h1>
          <p className="text-white/60 text-sm">Espace administrateur</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/70 text-xs font-medium uppercase tracking-wider block mb-1.5">
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  data-testid="input-admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-white/70 text-xs font-medium uppercase tracking-wider block mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  data-testid="input-admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] text-sm"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              data-testid="button-admin-login"
              disabled={adminLogin.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 rounded-xl font-bold text-base hover:bg-[hsl(35,85%,55%)] transition-colors disabled:opacity-60 mt-2"
            >
              {adminLogin.isPending ? "Connexion..." : "Se connecter"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

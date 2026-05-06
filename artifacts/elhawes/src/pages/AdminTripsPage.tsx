import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, EyeOff, X } from "lucide-react";
import {
  useListTrips,
  useCreateTrip,
  useUpdateTrip,
  useDeleteTrip,
  getListTripsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminDashboard";
import { formatDZD } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface TripFormData {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  location: string;
  country: string;
  durationDays: number;
  priceDzd: number;
  originalPriceDzd: number | null;
  maxGroupSize: number;
  spotsLeft: number;
  imageUrl: string;
  category: string;
  difficulty: string;
  isFeatured: boolean;
  isActive: boolean;
  departureDate: string;
}

const emptyForm: TripFormData = {
  title: "",
  slug: "",
  description: "",
  shortDescription: "",
  location: "",
  country: "Algeria",
  durationDays: 3,
  priceDzd: 0,
  originalPriceDzd: null,
  maxGroupSize: 12,
  spotsLeft: 12,
  imageUrl: "",
  category: "Adventure",
  difficulty: "Easy",
  isFeatured: false,
  isActive: true,
  departureDate: "",
};

export default function AdminTripsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TripFormData>(emptyForm);

  const { data: trips, isLoading } = useListTrips({ params: {} });
  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();
  const deleteTrip = useDeleteTrip();

  const invalidateTrips = () => {
    queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (trip: NonNullable<typeof trips>[number]) => {
    setForm({
      title: trip.title,
      slug: trip.slug,
      description: trip.description,
      shortDescription: trip.shortDescription,
      location: trip.location,
      country: trip.country,
      durationDays: trip.durationDays,
      priceDzd: trip.priceDzd,
      originalPriceDzd: trip.originalPriceDzd,
      maxGroupSize: trip.maxGroupSize,
      spotsLeft: trip.spotsLeft,
      imageUrl: trip.imageUrl,
      category: trip.category,
      difficulty: trip.difficulty,
      isFeatured: trip.isFeatured,
      isActive: trip.isActive,
      departureDate: trip.departureDate ?? "",
    });
    setEditingId(trip.id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      originalPriceDzd: form.originalPriceDzd || null,
      departureDate: form.departureDate || null,
    };

    if (editingId) {
      updateTrip.mutate(
        { id: editingId, data },
        {
          onSuccess: () => { setShowModal(false); invalidateTrips(); toast({ title: "Voyage mis à jour" }); },
          onError: () => toast({ title: "Erreur", variant: "destructive" }),
        }
      );
    } else {
      createTrip.mutate(
        { data },
        {
          onSuccess: () => { setShowModal(false); invalidateTrips(); toast({ title: "Voyage créé" }); },
          onError: () => toast({ title: "Erreur", variant: "destructive" }),
        }
      );
    }
  };

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    deleteTrip.mutate(
      { id },
      {
        onSuccess: () => { invalidateTrips(); toast({ title: "Voyage supprimé" }); },
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      }
    );
  };

  const handleToggleActive = (id: number, isActive: boolean) => {
    updateTrip.mutate(
      { id, data: { isActive: !isActive } },
      { onSuccess: () => invalidateTrips() }
    );
  };

  return (
    <AdminLayout active="trips">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Voyages</h1>
            <p className="text-muted-foreground mt-1">Gérez votre catalogue de voyages.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            data-testid="button-add-trip"
            onClick={openCreate}
            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-5 py-2.5 rounded-xl font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter un voyage
          </motion.button>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-muted-foreground font-medium">Voyage</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Lieu</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Prix</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Durée</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Places</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Statut</th>
                  <th className="text-right px-6 py-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={7} className="px-6 py-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      </tr>
                    ))
                  : trips?.map((trip) => (
                      <tr key={trip.id} data-testid={`row-trip-${trip.id}`} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={trip.imageUrl}
                              alt={trip.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium text-foreground">{trip.title}</div>
                              <div className="text-xs text-muted-foreground">{trip.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">{trip.location}</td>
                        <td className="px-4 py-4 font-medium text-foreground">{formatDZD(trip.priceDzd)}</td>
                        <td className="px-4 py-4 text-muted-foreground">{trip.durationDays}j</td>
                        <td className="px-4 py-4">
                          <span className={`font-medium ${trip.spotsLeft <= 3 ? "text-red-500" : "text-foreground"}`}>
                            {trip.spotsLeft}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              trip.isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {trip.isActive ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              data-testid={`button-toggle-trip-${trip.id}`}
                              onClick={() => handleToggleActive(trip.id, trip.isActive)}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              title={trip.isActive ? "Désactiver" : "Activer"}
                            >
                              {trip.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              data-testid={`button-edit-trip-${trip.id}`}
                              onClick={() => openEdit(trip)}
                              className="p-1.5 text-muted-foreground hover:text-[hsl(var(--primary))] transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              data-testid={`button-delete-trip-${trip.id}`}
                              onClick={() => handleDelete(trip.id, trip.title)}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-serif text-xl text-foreground">
                  {editingId ? "Modifier le voyage" : "Nouveau voyage"}
                </h2>
                <button
                  data-testid="button-close-modal"
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Titre</label>
                    <input
                      data-testid="input-trip-title"
                      required
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug (URL)</label>
                    <input
                      data-testid="input-trip-slug"
                      required
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="sahara-taghit-3j"
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Lieu</label>
                    <input
                      data-testid="input-trip-location"
                      required
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Description courte</label>
                    <input
                      data-testid="input-trip-short-desc"
                      value={form.shortDescription}
                      onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Description complète</label>
                    <textarea
                      data-testid="input-trip-desc"
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Prix (DZD)</label>
                    <input
                      data-testid="input-trip-price"
                      type="number"
                      required
                      value={form.priceDzd}
                      onChange={(e) => setForm((f) => ({ ...f, priceDzd: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Prix original (DZD, optionnel)</label>
                    <input
                      data-testid="input-trip-original-price"
                      type="number"
                      value={form.originalPriceDzd ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, originalPriceDzd: e.target.value ? parseInt(e.target.value) : null }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Durée (jours)</label>
                    <input
                      type="number"
                      value={form.durationDays}
                      onChange={(e) => setForm((f) => ({ ...f, durationDays: parseInt(e.target.value) || 1 }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Places restantes</label>
                    <input
                      type="number"
                      value={form.spotsLeft}
                      onChange={(e) => setForm((f) => ({ ...f, spotsLeft: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">URL Image principale</label>
                    <input
                      data-testid="input-trip-image"
                      required
                      value={form.imageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Catégorie</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    >
                      {["Adventure", "Culture", "Beach", "Desert", "Mountain"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Difficulté</label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                      className="w-full border border-border rounded-lg py-2 px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    >
                      {["Easy", "Moderate", "Hard"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                        className="rounded"
                      />
                      En vedette
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                        className="rounded"
                      />
                      Actif
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-border py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Annuler
                  </button>
                  <motion.button
                    type="submit"
                    data-testid="button-save-trip"
                    disabled={createTrip.isPending || updateTrip.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
                  >
                    {createTrip.isPending || updateTrip.isPending ? "Sauvegarde..." : "Sauvegarder"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

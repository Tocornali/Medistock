
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, Check } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
}

export default function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estados locales sincronizados con la URL
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [prescriptionType, setPrescriptionType] = useState("all");

  // Estados locales para el rango de precio
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Sincronizar estado inicial desde la URL
  useEffect(() => {
    const cats = searchParams.get("category")?.split(",") || [];
    const stock = searchParams.get("inStock") === "true";
    const presc = searchParams.get("prescription") || "all";
    const minP = searchParams.get("minPrice") || "";
    const maxP = searchParams.get("maxPrice") || "";

    setSelectedCategories(cats);
    setOnlyInStock(stock);
    setPrescriptionType(presc);
    setMinPrice(minP);
    setMaxPrice(maxP);
  }, [searchParams]);

  // Función maestra para actualizar la URL (Ahora se llama manualmente)
  const updateFilters = (updates: Record<string, string | string[] | boolean>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) params.set(key, value.join(","));
        else params.delete(key);
      } else if (typeof value === "boolean") {
        if (value) params.set(key, "true");
        else params.delete(key);
      } else {
        if (value && value !== "all") params.set(key, value as string);
        else params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleApplyFilters = () => {
    updateFilters({
      category: selectedCategories,
      inStock: onlyInStock,
      prescription: prescriptionType,
      minPrice,
      maxPrice
    });
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
      <div className="bg-white dark:bg-[#242729] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-primary" />
            Filtros
          </h2>
          {(selectedCategories.length > 0 || onlyInStock || prescriptionType !== "all" || minPrice || maxPrice) && (
            <button 
              onClick={() => {
                router.push(pathname);
                setSelectedCategories([]);
                setOnlyInStock(false);
                setPrescriptionType("all");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="space-y-10">
          {/* Categorías */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Categorías</h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-200 dark:border-white/10 rounded-lg checked:border-brand-primary checked:bg-brand-primary transition-all cursor-pointer"
                    />
                    <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-brand-primary transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Rango de Precio */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Rango de Precio (CLP)</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[9px] text-slate-400 uppercase mb-1 block">Min</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-bold focus:border-brand-primary transition-all outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-slate-400 uppercase mb-1 block">Max</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="2M+"
                    className="w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-bold focus:border-brand-primary transition-all outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="2000000"
                step="5000"
                value={maxPrice || "2000000"}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
          </section>

          {/* Disponibilidad (Stock) */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Solo con Stock</h3>
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  onlyInStock ? "bg-brand-primary" : "bg-slate-200 dark:bg-white/10"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                  onlyInStock ? "left-5" : "left-1"
                }`} />
              </button>
            </div>
          </section>

          {/* Tipo de Venta */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tipo de Venta</h3>
            <div className="space-y-3">
              {[
                { id: "all", label: "Todos los productos" },
                { id: "free", label: "Venta Libre" },
                { id: "prescription", label: "Bajo Receta" }
              ].map((type) => (
                <label key={type.id} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="prescriptionType"
                      checked={prescriptionType === type.id}
                      onChange={() => setPrescriptionType(type.id)}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-200 dark:border-white/10 rounded-full checked:border-brand-primary transition-all cursor-pointer"
                    />
                    <div className="absolute w-2.5 h-2.5 bg-brand-primary rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-brand-primary transition-colors">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <button
            onClick={handleApplyFilters}
            className="w-full bg-brand-primary hover:bg-[#1A9089] text-white font-black py-4 rounded-2xl shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </aside>
  );
}

import { z } from "zod";
import { CHILE_DATA } from "../chile-data";

export const shippingSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  telefono: z.string().regex(/^\+56 9\d{8}$/, "Formato inválido. Debe ser +56 9XXXXXXXX"),
  calle: z.string().min(3, "La calle es obligatoria"),
  numeroCalle: z.string().min(1, "El número es obligatorio"),
  region: z.string().refine((val) => CHILE_DATA.some(r => r.name === val), {
    message: "Región no válida",
  }),
  comuna: z.string().min(1, "La comuna es obligatoria"),
}).refine((data) => {
  if (!data.region || !data.comuna) return true;
  const region = CHILE_DATA.find(r => r.name === data.region);
  return region ? region.comunas.includes(data.comuna) : false;
}, {
  message: "La comuna no pertenece a la región seleccionada",
  path: ["comuna"],
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

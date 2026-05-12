import { z } from "zod";
import { validateRut, getRutType } from "@/lib/rut-utils";

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un símbolo (ej: !@#$%^&*)");

export const authSchema = z.object({
  email: z.string().email("Formato de correo electrónico inválido"),
  password: passwordSchema,
});

export type AuthSchema = z.infer<typeof authSchema>;

// Esquema específico para registro que puede incluir otros campos si es necesario
export const registerSchema = authSchema.extend({
  name: z.string().min(1, "El nombre es obligatorio"),
  accountType: z.enum(["PERSONA", "EMPRESA"]),
  rut: z.string().optional(),
  razonSocial: z.string().optional(),
  giro: z.string().optional(),
}).refine((data) => {
  // Validación de campos obligatorios para Empresa
  if (data.accountType === "EMPRESA") {
    if (!data.rut || !data.razonSocial || !data.giro) return false;
  }
  return true;
}, {
  message: "Todos los campos de empresa son obligatorios para cuentas corporativas",
  path: ["accountType"],
}).refine((data) => {
  // Validación de Módulo 11 si el RUT está presente
  if (data.rut) {
    return validateRut(data.rut);
  }
  return true;
}, {
  message: "El RUT ingresado no es válido (Módulo 11)",
  path: ["rut"],
}).refine((data) => {
  // Discriminación de tipo de RUT
  if (data.rut && validateRut(data.rut)) {
    const type = getRutType(data.rut);
    if (data.accountType === "EMPRESA" && type !== "EMPRESA") return false;
    if (data.accountType === "PERSONA" && type === "EMPRESA") return false;
  }
  return true;
}, {
  message: (data) => 
    data.accountType === "EMPRESA" 
      ? 'Este formulario es exclusivo para RUTs de empresa (sobre 50M)'
      : 'Los RUT de empresa deben registrarse en el portal corporativo',
  path: ["rut"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;

// Esquema para activación (solo password)
export const activateSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type ActivateSchema = z.infer<typeof activateSchema>;

// Esquema para actualización de perfil básico
export const profileSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Formato de correo electrónico inválido"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

// Esquema para actualización de contraseña
export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>;

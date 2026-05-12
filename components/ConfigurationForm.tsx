"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, passwordUpdateSchema, type ProfileSchema, type PasswordUpdateSchema } from "@/lib/validations/auth"
import { updateProfile, updatePassword, verifyPassword } from "@/app/actions/profile"

export default function ConfigurationForm({ user }: { user: { name: string | null, email: string | null } }) {
  const [profilePending, setProfilePending] = useState(false)
  const [passwordPending, setPasswordPending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)

  // Formulario de Perfil
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors }
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    }
  })

  // Formulario de Contraseña
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors }
  } = useForm<PasswordUpdateSchema>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  })

  const currentPasswordValue = watchPassword("currentPassword")

  // Efecto para verificar la contraseña con debounce
  useEffect(() => {
    if (!currentPasswordValue || currentPasswordValue.length < 6) {
      setIsPasswordCorrect(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsVerifying(true)
      const result = await verifyPassword(currentPasswordValue)
      setIsVerifying(false)
      
      if (result.valid) {
        setIsPasswordCorrect(true)
      } else {
        setIsPasswordCorrect(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [currentPasswordValue])

  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const onProfileSubmit = async (data: ProfileSchema) => {
    setProfilePending(true)
    setProfileStatus(null)
    const result = await updateProfile(data)
    setProfilePending(false)

    if (result.error) {
      setProfileStatus({ type: 'error', message: result.error })
    } else {
      setProfileStatus({ type: 'success', message: result.success || "Perfil actualizado" })
    }
  }

  const onPasswordSubmit = async (data: PasswordUpdateSchema) => {
    setPasswordPending(true)
    setPasswordStatus(null)
    const result = await updatePassword(data)
    setPasswordPending(false)

    if (result.error) {
      setPasswordStatus({ type: 'error', message: result.error })
    } else {
      setPasswordStatus({ type: 'success', message: result.success || "Contraseña actualizada" })
      resetPassword()
    }
  }

  return (
    <div className="space-y-8">
      {/* Sección Perfil */}
      <div className="bg-white dark:bg-[#242729] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/10">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Información Personal</h2>
        <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
          {profileStatus && (
            <div className={`p-3 rounded-lg text-sm ${profileStatus.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {profileStatus.message}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
              <input
                {...registerProfile("name")}
                autoComplete="off"
                className="w-full px-4 py-2 rounded-lg border bg-transparent dark:bg-brand-dark/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
              {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
              <input
                {...registerProfile("email")}
                autoComplete="off"
                className="w-full px-4 py-2 rounded-lg border bg-transparent dark:bg-brand-dark/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
              {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email.message}</p>}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profilePending}
              className="bg-brand-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1A9089] transition-all disabled:opacity-50"
            >
              {profilePending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>

      {/* Sección Seguridad */}
      <div className="bg-white dark:bg-[#242729] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/10">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Cambiar contraseña</h2>
        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
          {passwordStatus && (
            <div className={`p-3 rounded-lg text-sm ${passwordStatus.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {passwordStatus.message}
            </div>
          )}
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña Actual</label>
            <div className="relative">
              <input
                {...registerPassword("currentPassword")}
                type="password"
                placeholder="Ingresa tu contraseña para cambiarla"
                autoComplete="off"
                className={`w-full px-4 py-2 rounded-lg border bg-transparent dark:bg-brand-dark/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all ${
                  isPasswordCorrect ? 'border-green-500' : ''
                }`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                {isVerifying && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-primary border-t-transparent"></div>
                )}
                {isPasswordCorrect && !isVerifying && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
          </div>

          <div className={`grid transition-all duration-500 ease-in-out ${isPasswordCorrect ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
            <div className="overflow-hidden">
              <div className="bg-slate-50 dark:bg-brand-dark/30 p-4 rounded-lg border border-slate-200 dark:border-white/5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva Contraseña</label>
                    <input
                      {...registerPassword("newPassword")}
                      type="password"
                      autoComplete="off"
                className="w-full px-4 py-2 rounded-lg border bg-transparent dark:bg-brand-dark/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                    {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar Nueva Contraseña</label>
                    <input
                      {...registerPassword("confirmPassword")}
                      type="password"
                      autoComplete="off"
                className="w-full px-4 py-2 rounded-lg border bg-transparent dark:bg-brand-dark/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                    {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passwordPending}
                    className="bg-brand-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1A9089] transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {passwordPending ? "Actualizando..." : "Confirmar Nueva Contraseña"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

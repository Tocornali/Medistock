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
  const [capsLockActive, setCapsLockActive] = useState(false)

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'))
  }

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
            <LocalPasswordInput
              registerProps={registerPassword("currentPassword")}
              placeholder="Ingresa tu contraseña para cambiarla"
              checkCapsLock={checkCapsLock}
              capsLockActive={capsLockActive}
              className={`w-full px-4 py-2 pr-20 rounded-lg border bg-transparent dark:bg-brand-dark/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all ${
                isPasswordCorrect ? 'border-green-500' : ''
              }`}
              extraIcon={
                <>
                  {isVerifying && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-primary border-t-transparent"></div>
                  )}
                  {isPasswordCorrect && !isVerifying && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </>
              }
            />
            {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
          </div>

          <div className={`grid transition-all duration-500 ease-in-out ${isPasswordCorrect ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
            <div className="overflow-hidden">
              <div className="bg-slate-50 dark:bg-brand-dark/30 p-4 rounded-lg border border-slate-200 dark:border-white/5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva Contraseña</label>
                    <LocalPasswordInput
                      registerProps={registerPassword("newPassword")}
                      checkCapsLock={checkCapsLock}
                      capsLockActive={capsLockActive}
                      className="w-full px-4 py-2 pr-20 rounded-lg border bg-transparent dark:bg-brand-dark/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                    {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar Nueva Contraseña</label>
                    <LocalPasswordInput
                      registerProps={registerPassword("confirmPassword")}
                      checkCapsLock={checkCapsLock}
                      capsLockActive={capsLockActive}
                      className="w-full px-4 py-2 pr-20 rounded-lg border bg-transparent dark:bg-brand-dark/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
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

function LocalPasswordInput({ registerProps, placeholder, className, checkCapsLock, capsLockActive, extraIcon }: any) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...registerProps}
        type={show ? "text" : "password"}
        autoComplete="off"
        placeholder={placeholder}
        onKeyUp={checkCapsLock}
        onKeyDown={checkCapsLock}
        className={className}
      />
      <div className="absolute inset-y-0 right-3 flex items-center gap-2">
        {extraIcon}
        {capsLockActive && (
          <div title="Bloq Mayús está activado" className="pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary/80 dark:text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        )}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors focus:outline-none"
          title={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          )}
        </button>
      </div>
    </div>
  )
}

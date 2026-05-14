'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { createOrder } from '@/app/actions/orders'
import { formatCurrencyCLP } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import PaymentSelector from '@/components/checkout/PaymentSelector'
import { PaymentMethod } from '@prisma/client'

export default function CarritoPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, updateQuantity, removeItem, clearCart } = useCartStore()

  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  const [webpayData, setWebpayData] = useState<{ url: string, token: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [deliveryMethod, setDeliveryMethod] = useState<'DOMICILIO' | 'RETIRO'>('DOMICILIO')
  const [deliverySpeed, setDeliverySpeed] = useState<'NORMAL' | 'PRIORITARIO'>('NORMAL')

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.WEBPAY)
  const [ocFile, setOcFile] = useState<File | null>(null)

  const [contactInfo, setContactInfo] = useState({ nombre: '', telefono: '' })
  const [addressInfo, setAddressInfo] = useState({ ciudad: '', comuna: '', calle: '', numeroCalle: '', departamento: '' })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (webpayData && formRef.current) { formRef.current.submit(); }
  }, [webpayData])

  useEffect(() => {
    if (mounted && items.length === 0 && !webpayData) { router.push('/catalogo') }
  }, [mounted, items.length, router, webpayData])

  if (!mounted || (items.length === 0 && !webpayData)) return null

  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  const FREE_SHIPPING_THRESHOLD = 100000
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = deliveryMethod === 'RETIRO' ? 0 : (isFreeShipping ? 0 : (deliverySpeed === 'PRIORITARIO' ? 7000 : 3000))
  const totalConIva = (subtotal + shippingCost) * 1.19

  const handleNextStep = () => { if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3) }
  const handlePrevStep = () => { if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3) }

  const handleConfirmOrder = async () => {
    setIsProcessing(true)
    try {
      const result = await createOrder({
        cartItems: items,
        userId: session?.user?.id || 'guest',
        deliveryMethod,
        deliverySpeed: deliveryMethod === 'RETIRO' ? 'NORMAL' : deliverySpeed,
        address: deliveryMethod === 'DOMICILIO' ? `${addressInfo.calle} ${addressInfo.numeroCalle}, ${addressInfo.comuna}` : 'Retiro en Tienda',
        shippingCost,
        paymentMethod,
      } as any)
      if (result.success) {
        clearCart()
        if (result.type === 'WEBPAY') setWebpayData({ url: result.url, token: result.token })
        else if (result.redirectUrl) router.push(result.redirectUrl)
      }
    } catch (e) { alert("Error al procesar pedido") } finally { setIsProcessing(false) }
  }

  if (webpayData) {
    return (
      <div className="min-h-screen bg-[#0F1113] flex items-center justify-center text-white">
        <form ref={formRef} action={webpayData.url} method="POST">
          <input type="hidden" name="token_ws" value={webpayData.token} />
          <p className="animate-pulse">Redirigiendo a Webpay...</p>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark/20 text-slate-900 dark:text-white p-4 lg:p-12 font-sans selection:bg-brand-primary/30 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* COLUMNA IZQUIERDA (2/3): Pedido y Opciones */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* BLOQUE 1: TU PEDIDO */}
            <div className="bg-white dark:bg-[#242729] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden p-10 h-fit">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h1 className="text-4xl font-black tracking-tight">Tu Pedido</h1>
                </div>
                <button 
                  onClick={clearCart} 
                  className="px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all border border-slate-200 dark:border-white/10"
                >
                  Vaciar Todo
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-6 border-b border-slate-100 dark:border-white/5 last:border-0 group/item">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover/item:text-brand-primary transition-colors line-clamp-1">{item.nombre}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{formatCurrencyCLP(item.precio)} <span className="text-[10px] opacity-60">/ unidad</span></p>
                    </div>

                    <div className="flex items-center gap-10">
                      {/* Selector de Cantidad Estilo Producto */}
                      <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-2xl h-12 px-3 border border-slate-200 dark:border-white/10">
                        <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-brand-primary text-2xl transition-colors font-light">-</button>
                        <span className="w-10 text-center font-black text-lg">{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} disabled={item.cantidad >= item.stock} className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-brand-primary text-2xl transition-colors font-light disabled:opacity-10">+</button>
                      </div>

                      <div className="w-32 text-right">
                        <p className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">{formatCurrencyCLP(item.precio * item.cantidad)}</p>
                      </div>

                      <button onClick={() => removeItem(item.id)} className="text-slate-300 dark:text-slate-700 hover:text-red-500 transition-all p-2 hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FILA INTERNA: Entrega y Velocidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* BLOQUE: ENTREGA */}
              <div className="bg-white dark:bg-[#242729] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl p-10">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  Método de Entrega
                </h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => setDeliveryMethod('DOMICILIO')} 
                    className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition-all font-bold ${deliveryMethod === 'DOMICILIO' ? 'border-brand-primary bg-brand-primary/5 text-slate-900 dark:text-white shadow-sm' : 'border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-200 dark:hover:border-white/10'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'DOMICILIO' ? 'border-brand-primary' : 'border-slate-200 dark:border-slate-700'}`}>
                      {deliveryMethod === 'DOMICILIO' && <div className="w-3 h-3 bg-brand-primary rounded-full" />}
                    </div>
                    <span className="text-base tracking-tight">Envío a Domicilio</span>
                  </button>
                  <button 
                    onClick={() => setDeliveryMethod('RETIRO')} 
                    className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition-all font-bold ${deliveryMethod === 'RETIRO' ? 'border-brand-primary bg-brand-primary/5 text-slate-900 dark:text-white shadow-sm' : 'border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-200 dark:hover:border-white/10'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'RETIRO' ? 'border-brand-primary' : 'border-slate-200 dark:border-slate-700'}`}>
                      {deliveryMethod === 'RETIRO' && <div className="w-3 h-3 bg-brand-primary rounded-full" />}
                    </div>
                    <span className="text-base tracking-tight">Retiro en Tienda</span>
                  </button>
                </div>
              </div>

              {/* BLOQUE: PRIORIDAD */}
              <div className={`bg-white dark:bg-[#242729] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl p-10 transition-all duration-500 ${deliveryMethod === 'RETIRO' ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Prioridad de Envío
                </h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => setDeliverySpeed('NORMAL')} 
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all font-bold ${deliverySpeed === 'NORMAL' ? 'border-brand-primary bg-brand-primary/5 text-slate-900 dark:text-white' : 'border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-200 dark:hover:border-white/10'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliverySpeed === 'NORMAL' ? 'border-brand-primary' : 'border-slate-200 dark:border-slate-700'}`}>
                        {deliverySpeed === 'NORMAL' && <div className="w-3 h-3 bg-brand-primary rounded-full" />}
                      </div>
                      <span className="text-base tracking-tight">Envío Estándar</span>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-md ${isFreeShipping ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-white/5'}`}>
                      {isFreeShipping ? 'Gratis' : '$3.000'}
                    </span>
                  </button>
                  <button 
                    onClick={() => setDeliverySpeed('PRIORITARIO')} 
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all font-bold ${deliverySpeed === 'PRIORITARIO' ? 'border-brand-primary bg-brand-primary/5 text-slate-900 dark:text-white' : 'border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-200 dark:hover:border-white/10'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliverySpeed === 'PRIORITARIO' ? 'border-brand-primary' : 'border-slate-200 dark:border-slate-700'}`}>
                        {deliverySpeed === 'PRIORITARIO' && <div className="w-3 h-3 bg-brand-primary rounded-full" />}
                      </div>
                      <span className="text-base tracking-tight">Envío Express</span>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-md ${isFreeShipping ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-white/5'}`}>
                      {isFreeShipping ? 'Gratis' : '$7.000'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (1/3): Resumen Fijo */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#242729] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl p-10 flex flex-col h-fit relative overflow-hidden sticky top-12">
              <h2 className="text-2xl font-black tracking-tight mb-10 flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="w-2 h-8 bg-brand-primary rounded-full" />
                Resumen
              </h2>

              {/* Barra de Envío Gratis */}
              <div className="mb-10 space-y-4">
                {!isFreeShipping ? (
                  <>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      <span>Envío Gratis</span>
                      <span className="text-brand-primary">{Math.round(Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100))}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 p-[2px]">
                      <div 
                        className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-xs font-bold border border-emerald-500/20 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    ¡ENVÍO GRATIS ACTIVADO!
                  </div>
                )}
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="text-base font-bold">Subtotal</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrencyCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-8 text-slate-600 dark:text-slate-400">
                  <span className="text-base font-bold">Envío</span>
                  <span className={`text-xl font-black ${shippingCost === 0 ? 'text-brand-primary' : 'text-slate-900 dark:text-white'}`}>
                    {shippingCost === 0 ? 'Gratis' : formatCurrencyCLP(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg font-bold text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-5xl font-black text-brand-primary tracking-tighter">
                    {formatCurrencyCLP(totalConIva)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase text-right tracking-[0.2em]">IVA (19%) Incluido</p>
              </div>

              {/* BOTÓN DE ACCIÓN ESTÁNDAR */}
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className="w-full bg-brand-primary hover:bg-[#1A9089] text-white font-black py-6 rounded-2xl transition-all shadow-lg hover:shadow-brand-primary/20 flex justify-center items-center gap-4 text-xl group disabled:opacity-30 active:scale-[0.98]"
              >
                <span>{isProcessing ? 'Procesando...' : 'Confirmar Pedido'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

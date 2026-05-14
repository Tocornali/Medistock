'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { createOrder } from '@/app/actions/orders'
import { formatCurrencyCLP } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import PaymentSelector from '@/components/checkout/PaymentSelector'
import { PaymentMethod } from '@prisma/client'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, updateQuantity, removeItem, clearCart } = useCartStore()
  
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  
  const [webpayData, setWebpayData] = useState<{url: string, token: string} | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  
  const [deliveryMethod, setDeliveryMethod] = useState<'DOMICILIO' | 'RETIRO'>('DOMICILIO')
  const [deliverySpeed, setDeliverySpeed] = useState<'NORMAL' | 'PRIORITARIO'>('NORMAL')
  
  // Payment info
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.WEBPAY)
  const [ocFile, setOcFile] = useState<File | null>(null)

  // Contact info
  const [contactInfo, setContactInfo] = useState({
    nombre: '',
    telefono: ''
  })

  // Address info
  const [addressInfo, setAddressInfo] = useState({
    ciudad: '',
    comuna: '',
    calle: '',
    numeroCalle: '',
    departamento: ''
  })

  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (webpayData && formRef.current) {
      formRef.current.submit();
    }
  }, [webpayData])

  useEffect(() => {
    if (mounted && items.length === 0 && !webpayData) {
      router.push('/carrito')
    }
  }, [mounted, items.length, router, webpayData])

  useEffect(() => {
    if (deliveryMethod === 'RETIRO' && currentStep > 1) {
      setCurrentStep(1)
    }
  }, [deliveryMethod, currentStep])

  if (!mounted) return null

  if (items.length === 0 && !webpayData) {
    return null
  }

  const isCompany = session?.user?.role === 'COMPANY'
  const accountType = isCompany ? 'EMPRESA' : 'PERSONA'

  // 1. Calcular Subtotal
  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  
  // 2. Definir Umbral y Estado de Envío Gratis
  const FREE_SHIPPING_THRESHOLD = 100000
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  
  // 3. Calcular Costo de Envío de forma reactiva y pura
  const shippingCost = deliveryMethod === 'RETIRO' 
    ? 0 
    : (isFreeShipping ? 0 : (deliverySpeed === 'PRIORITARIO' ? 7000 : 3000))

  // 4. Calcular Total Final
  const total = subtotal + shippingCost

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)
    }
  }

  const handleConfirmOrder = async () => {
    let finalAddress = ''

    if (deliveryMethod === 'DOMICILIO') {
      if (!contactInfo.nombre.trim() || !contactInfo.telefono.trim()) {
        alert('Por favor ingresa tu nombre y número de teléfono.')
        return
      }
      if (!addressInfo.ciudad.trim() || !addressInfo.comuna.trim() || !addressInfo.calle.trim() || !addressInfo.numeroCalle.trim()) {
        alert('Por favor completa todos los campos obligatorios de tu dirección.')
        return
      }
      finalAddress = `${addressInfo.calle} ${addressInfo.numeroCalle}${addressInfo.departamento ? `, Depto: ${addressInfo.departamento}` : ''}, ${addressInfo.comuna}, ${addressInfo.ciudad}. Contacto: ${contactInfo.nombre} (${contactInfo.telefono})`
    } else {
      finalAddress = `Retiro en Tienda`
    }

    if (paymentMethod === PaymentMethod.INVOICE && !ocFile) {
      alert('Para facturación a 30 días es obligatorio subir la Orden de Compra.')
      return
    }

    setIsProcessing(true)

    const payload = {
      cartItems: items,
      userId: session?.user?.id || 'guest',
      deliveryMethod,
      deliverySpeed: deliveryMethod === 'RETIRO' ? 'NORMAL' : deliverySpeed,
      address: finalAddress,
      shippingCost,
      paymentMethod,
      // documentUrl: ocFile ? await uploadFile(ocFile) : undefined
    }

    try {
      const result = await createOrder(payload as any)

      if (result.success) {
        clearCart()
        if (result.type === 'WEBPAY') {
          setWebpayData({ url: result.url, token: result.token });
        } else if (result.type === 'INVOICE' && result.redirectUrl) {
          router.push(result.redirectUrl)
        }
      } else {
        alert("Error al procesar la orden: " + result.error)
      }
    } catch (error) {
      console.error(error)
      alert("Error inesperado de red")
    } finally {
      setIsProcessing(false)
    }
  }


  if (webpayData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300 transition-colors mb-4">Redirigiendo al portal de pago seguro...</p>
        <form ref={formRef} action={webpayData.url} method="POST">
          <input type="hidden" name="token_ws" value={webpayData.token} />
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar Simplificado (3 Pasos) */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep >= 1 ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <span className={`ml-2 font-medium hidden sm:inline ${currentStep >= 1 ? 'text-brand-primary' : 'text-slate-500'}`}>Pedido y Envío</span>
          </div>
          
          <div className={`w-8 sm:w-16 h-1 rounded ${currentStep >= 2 ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep >= 2 ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <span className={`ml-2 font-medium hidden sm:inline ${currentStep >= 2 ? 'text-brand-primary' : 'text-slate-500'}`}>Entrega</span>
          </div>
          
          <div className={`w-8 sm:w-16 h-1 rounded ${currentStep >= 3 ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep >= 3 ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
            <span className={`ml-2 font-medium hidden sm:inline ${currentStep >= 3 ? 'text-brand-primary' : 'text-slate-500'}`}>Pago</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda: Carrito + Envío / Dirección / Pago */}
          <div className="flex-1 space-y-8">
            
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                {/* 1. Lista del Carrito Detallada */}
                <div className="bg-white dark:bg-[#242729] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                  <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tu Pedido</h2>
                    <button
                      onClick={clearCart}
                      className="px-4 py-2 rounded-full text-[10px] font-bold text-red-500 bg-red-500/5 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all duration-200"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10 last:border-0 last:pb-0 gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">{item.nombre}</h3>
                          <p className="text-xs text-slate-400 mb-1">
                            {item.sku}
                          </p>
                          <p className="text-sm text-slate-500 font-medium">{formatCurrencyCLP(item.precio)} c/u</p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-white/10 rounded-lg h-9">
                              <button
                                onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                className="w-9 h-full flex items-center justify-center text-slate-500 hover:text-brand-primary"
                              >
                                -
                              </button>
                              <span className="w-10 text-center font-bold text-slate-800 dark:text-white text-sm">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                disabled={item.cantidad >= item.stock}
                                className={`w-9 h-full flex items-center justify-center ${
                                  item.cantidad >= item.stock ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:text-brand-primary'
                                }`}
                              >
                                +
                              </button>
                            </div>
                            {item.cantidad >= item.stock && (
                              <span className="text-[9px] text-red-400 mt-1 font-bold uppercase tracking-tighter">Stock Máximo</span>
                            )}
                          </div>
                          
                          <div className="w-24 text-right">
                            <p className="font-black text-slate-800 dark:text-white text-lg">
                              {formatCurrencyCLP(item.precio * item.cantidad)}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Opciones de Envío FUSIONADAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Método de Entrega */}
                  <div className="bg-white dark:bg-[#242729] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Entrega
                    </h2>
                    <div className="space-y-4">
                      <label className={`flex items-center space-x-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${deliveryMethod === 'DOMICILIO' ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 shadow-sm shadow-brand-primary/5' : 'border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="deliveryMethod"
                            checked={deliveryMethod === 'DOMICILIO'} 
                            onChange={() => setDeliveryMethod('DOMICILIO')} 
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-brand-primary transition-all" 
                          />
                          <div className="absolute w-2.5 h-2.5 bg-brand-primary rounded-full opacity-0 peer-checked:opacity-100" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-white">Envío a Domicilio</span>
                      </label>
                      <label className={`flex items-center space-x-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${deliveryMethod === 'RETIRO' ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 shadow-sm shadow-brand-primary/5' : 'border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="deliveryMethod"
                            checked={deliveryMethod === 'RETIRO'} 
                            onChange={() => setDeliveryMethod('RETIRO')} 
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-brand-primary transition-all" 
                          />
                          <div className="absolute w-2.5 h-2.5 bg-brand-primary rounded-full opacity-0 peer-checked:opacity-100" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-white">Retiro en Tienda</span>
                      </label>
                    </div>
                  </div>

                  {/* Prioridad de Envío (Solo si es Domicilio) */}
                  <div className={`bg-white dark:bg-[#242729] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 transition-all ${deliveryMethod === 'RETIRO' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Velocidad
                    </h2>
                    <div className="space-y-4">
                      <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${deliverySpeed === 'NORMAL' ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 shadow-sm shadow-brand-primary/5' : 'border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                        <div className="flex items-center space-x-3">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="deliverySpeed"
                              checked={deliverySpeed === 'NORMAL'} 
                              onChange={() => setDeliverySpeed('NORMAL')} 
                              className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-brand-primary transition-all" 
                            />
                            <div className="absolute w-2.5 h-2.5 bg-brand-primary rounded-full opacity-0 peer-checked:opacity-100" />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-white">Normal</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{isFreeShipping ? 'Gratis' : '$3.000'}</span>
                      </label>
                      <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${deliverySpeed === 'PRIORITARIO' ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 shadow-sm shadow-brand-primary/5' : 'border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                        <div className="flex items-center space-x-3">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="deliverySpeed"
                              checked={deliverySpeed === 'PRIORITARIO'} 
                              onChange={() => setDeliverySpeed('PRIORITARIO')} 
                              className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-brand-primary transition-all" 
                            />
                            <div className="absolute w-2.5 h-2.5 bg-brand-primary rounded-full opacity-0 peer-checked:opacity-100" />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-white">Prioritario</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{isFreeShipping ? 'Gratis' : '$7.000'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={deliveryMethod === 'DOMICILIO' ? handleNextStep : handleConfirmOrder}
                    disabled={isProcessing}
                    className="w-full bg-slate-900 dark:bg-brand-primary hover:bg-slate-800 dark:hover:bg-[#1A9089] text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl flex justify-center items-center gap-2 text-xl"
                  >
                    {deliveryMethod === 'DOMICILIO' ? 'Continuar con la Entrega →' : (isProcessing ? 'Procesando...' : 'Confirmar Pedido Ahora ✓')}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && deliveryMethod === 'DOMICILIO' && (
              <div className="space-y-6 animate-fade-in">
                {/* Datos de Contacto y Dirección Fusionados */}
                <div className="bg-white dark:bg-[#242729] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-8">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Información de Entrega
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Nombre de quien recibe *</label>
                      <input type="text" value={contactInfo.nombre} onChange={(e) => setContactInfo({...contactInfo, nombre: e.target.value})} placeholder="Ej: Juan Pérez" className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Teléfono *</label>
                      <input type="tel" value={contactInfo.telefono} onChange={(e) => setContactInfo({...contactInfo, telefono: e.target.value})} placeholder="+56 9..." className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Ciudad *</label>
                      <input type="text" value={addressInfo.ciudad} onChange={(e) => setAddressInfo({...addressInfo, ciudad: e.target.value})} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-brand-dark/50 rounded-xl p-3" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Comuna *</label>
                      <input type="text" value={addressInfo.comuna} onChange={(e) => setAddressInfo({...addressInfo, comuna: e.target.value})} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-brand-dark/50 rounded-xl p-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8">
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Calle *</label>
                      <input type="text" value={addressInfo.calle} onChange={(e) => setAddressInfo({...addressInfo, calle: e.target.value})} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-brand-dark/50 rounded-xl p-3" />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Número *</label>
                      <input type="text" value={addressInfo.numeroCalle} onChange={(e) => setAddressInfo({...addressInfo, numeroCalle: e.target.value})} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-brand-dark/50 rounded-xl p-3" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={handlePrevStep} className="w-1/3 bg-white dark:bg-[#242729] border-2 border-slate-100 dark:border-white/10 text-slate-600 dark:text-white font-bold py-4 rounded-xl transition-all">← Volver</button>
                  <button onClick={handleNextStep} className="w-2/3 bg-slate-900 dark:bg-brand-primary text-white font-bold py-4 rounded-xl transition-all shadow-xl">Continuar al Pago →</button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white dark:bg-[#242729] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
                  <PaymentSelector 
                    accountType={accountType} 
                    onSelect={(method, file) => {
                      setPaymentMethod(method);
                      setOcFile(file || null);
                    }} 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={handlePrevStep} className="w-1/3 bg-white dark:bg-[#242729] border-2 border-slate-100 dark:border-white/10 text-slate-600 dark:text-white font-bold py-4 rounded-xl transition-all">← Volver</button>
                  <button onClick={handleConfirmOrder} disabled={isProcessing} className="w-2/3 bg-brand-primary text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-brand-primary/20">
                    {isProcessing ? 'Procesando...' : 'Finalizar y Pagar Ahora'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha: Resumen (Siempre visible) */}
          <div className="w-full lg:w-96">
            <div className="bg-white dark:bg-[#242729] p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors mb-6">Resumen del Pedido</h2>
              
              {/* Promo Envío Gratis */}
              <div className="mb-6">
                {isFreeShipping ? (
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-[11px] font-bold border border-emerald-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    ¡ENVÍO GRATIS ACTIVADO!
                  </div>
                ) : (
                  <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-xl">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      <span>Envío Gratis</span>
                      <span>{Math.floor((subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary transition-all duration-500" 
                        style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Faltan <span className="text-slate-600 dark:text-slate-300 font-bold">{formatCurrencyCLP(Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal))}</span> para el envío gratis.
                    </p>
                  </div>
                )}
              </div>

              {/* Los items ya se muestran en el paso 1, así que aquí solo dejamos los totales */}
              <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 transition-colors">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrencyCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 transition-colors">
                  <span>Envío {deliveryMethod === 'DOMICILIO' ? `(${deliverySpeed === 'PRIORITARIO' ? 'Prioritario' : 'Normal'})` : '(Retiro)'}</span>
                  <span className={`font-medium ${shippingCost === 0 && deliveryMethod === 'DOMICILIO' ? 'text-emerald-500 font-bold' : ''}`}>
                    {shippingCost > 0 ? formatCurrencyCLP(shippingCost) : 'Gratis'}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-white/10 pt-4 mt-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-800 dark:text-white transition-colors">Total</span>
                  <span className="text-3xl font-black text-brand-primary">{formatCurrencyCLP(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

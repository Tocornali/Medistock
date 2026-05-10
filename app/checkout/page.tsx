'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { createOrder } from '@/app/actions/orders'
import { formatCurrencyCLP } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  
  const [webpayData, setWebpayData] = useState<{url: string, token: string} | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  
  const [deliveryMethod, setDeliveryMethod] = useState<'DOMICILIO' | 'RETIRO'>('DOMICILIO')
  const [deliverySpeed, setDeliverySpeed] = useState<'NORMAL' | 'PRIORITARIO'>('NORMAL')
  
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
    // Redirigir si el carrito está vacío y ya montamos (y no estamos redirigiendo a webpay)
    if (mounted && items.length === 0 && !webpayData) {
      router.push('/carrito')
    }
  }, [mounted, items.length, router, webpayData])

  // Reset steps if method changes to avoid invalid states
  useEffect(() => {
    if (deliveryMethod === 'RETIRO' && currentStep > 1) {
      setCurrentStep(1)
    }
  }, [deliveryMethod, currentStep])

  if (!mounted) return null

  // Si no hay items en el carrito y no estamos redirigiendo a Transbank, ocultamos
  if (items.length === 0 && !webpayData) {
    return null
  }

  // Cálculos de totales
  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  
  let shippingCost = 0
  if (deliveryMethod === 'DOMICILIO' && deliverySpeed === 'PRIORITARIO') {
    shippingCost = 5000
  }

  const total = subtotal + shippingCost

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3)
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

    setIsProcessing(true)

    // Simulamos ID de usuario hasta que integremos Auth
    const simulatedUserId = 'usuario-simulado'

    const payload = {
      cartItems: items,
      userId: simulatedUserId,
      deliveryMethod,
      deliverySpeed: deliveryMethod === 'RETIRO' ? 'NORMAL' : deliverySpeed,
      address: finalAddress,
      shippingCost,
      paymentMethod: 'WEBPAY'
    }

    try {
      const result = await createOrder(payload)

      if (result.success) {
        setWebpayData({ url: result.url, token: result.token });
        // router.push('/mis-ordenes')
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
        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep >= 1 ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <span className={`ml-2 font-medium hidden sm:inline ${currentStep >= 1 ? 'text-brand-primary' : 'text-slate-500'}`}>Tipo de Envío</span>
          </div>
          
          {deliveryMethod === 'DOMICILIO' && (
            <>
              <div className={`w-8 sm:w-16 h-1 rounded ${currentStep >= 2 ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep >= 2 ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                <span className={`ml-2 font-medium hidden sm:inline ${currentStep >= 2 ? 'text-brand-primary' : 'text-slate-500'}`}>Prioridad de Envío</span>
              </div>
              
              <div className={`w-8 sm:w-16 h-1 rounded ${currentStep >= 3 ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep >= 3 ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
                <span className={`ml-2 font-medium hidden sm:inline ${currentStep >= 3 ? 'text-brand-primary' : 'text-slate-500'}`}>Dirección y Contacto</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda: Formularios Dinámicos */}
          <div className="flex-1">
            
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* Método de Entrega */}
                <div className="bg-white dark:bg-[#242729] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Selecciona el Tipo de Envío
                  </h2>
                  <div className="space-y-4">
                    <label className={`flex items-center space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${deliveryMethod === 'DOMICILIO' ? 'border-brand-primary/80 bg-blue-50/50 shadow-md shadow-brand-primary/10' : 'hover:bg-slate-50 dark:bg-brand-dark transition-colors border-slate-200 dark:border-white/10'}`}>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value="DOMICILIO"
                        checked={deliveryMethod === 'DOMICILIO'}
                        onChange={() => setDeliveryMethod('DOMICILIO')}
                        className="w-5 h-5 text-brand-primary border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 focus:ring-brand-primary/50"
                      />
                      <div>
                        <span className="block font-bold text-slate-800 dark:text-white transition-colors text-lg">Envío a Domicilio</span>
                        <span className="block text-sm text-slate-500 mt-1">Recibe tus productos en la comodidad de tu hogar.</span>
                      </div>
                    </label>
                    <label className={`flex items-center space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${deliveryMethod === 'RETIRO' ? 'border-brand-primary/80 bg-blue-50/50 shadow-md shadow-brand-primary/10' : 'hover:bg-slate-50 dark:bg-brand-dark transition-colors border-slate-200 dark:border-white/10'}`}>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value="RETIRO"
                        checked={deliveryMethod === 'RETIRO'}
                        onChange={() => setDeliveryMethod('RETIRO')}
                        className="w-5 h-5 text-brand-primary border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 focus:ring-brand-primary/50"
                      />
                      <div>
                        <span className="block font-bold text-slate-800 dark:text-white transition-colors text-lg">Retiro en Tienda</span>
                        <span className="block text-sm text-slate-500 mt-1">Retira en nuestra sucursal sin costo adicional.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  {deliveryMethod === 'DOMICILIO' ? (
                    <button 
                      onClick={handleNextStep}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 text-lg"
                    >
                      Siguiente: Prioridad de Envío &rarr;
                    </button>
                  ) : (
                    <button 
                      onClick={handleConfirmOrder}
                      disabled={isProcessing}
                      className={`w-full font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 text-lg ${
                        isProcessing 
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                          : 'bg-brand-primary hover:bg-[#1A9089] text-white hover:shadow-brand-primary/30'
                      }`}
                    >
                      {isProcessing ? 'Procesando...' : 'Confirmar Orden'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && deliveryMethod === 'DOMICILIO' && (
              <div className="space-y-6 animate-fade-in">
                {/* Prioridad de Envío */}
                <div className="bg-white dark:bg-[#242729] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Prioridad de Envío
                  </h2>
                  <div className="space-y-4">
                    <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${deliverySpeed === 'NORMAL' ? 'border-brand-primary/80 bg-blue-50/50 shadow-md shadow-brand-primary/10' : 'hover:bg-slate-50 dark:bg-brand-dark transition-colors border-slate-200 dark:border-white/10'}`}>
                      <div className="flex items-center space-x-4">
                        <input 
                          type="radio" 
                          name="deliverySpeed" 
                          value="NORMAL"
                          checked={deliverySpeed === 'NORMAL'}
                          onChange={() => setDeliverySpeed('NORMAL')}
                          className="w-5 h-5 text-brand-primary border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 focus:ring-brand-primary/50"
                        />
                        <div>
                          <span className="block font-bold text-slate-800 dark:text-white transition-colors text-lg">Normal</span>
                          <span className="block text-sm text-slate-500 mt-1">3-5 días hábiles</span>
                        </div>
                      </div>
                      <span className="text-slate-500 font-bold">Gratis</span>
                    </label>
                    <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${deliverySpeed === 'PRIORITARIO' ? 'border-brand-primary/80 bg-blue-50/50 shadow-md shadow-brand-primary/10' : 'hover:bg-slate-50 dark:bg-brand-dark transition-colors border-slate-200 dark:border-white/10'}`}>
                      <div className="flex items-center space-x-4">
                        <input 
                          type="radio" 
                          name="deliverySpeed" 
                          value="PRIORITARIO"
                          checked={deliverySpeed === 'PRIORITARIO'}
                          onChange={() => setDeliverySpeed('PRIORITARIO')}
                          className="w-5 h-5 text-brand-primary border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 focus:ring-brand-primary/50"
                        />
                        <div>
                          <span className="block font-bold text-slate-800 dark:text-white transition-colors text-lg">Prioritario</span>
                          <span className="block text-sm text-slate-500 mt-1">En 24 horas</span>
                        </div>
                      </div>
                      <span className="text-slate-500 font-bold">+$5000</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handlePrevStep}
                    className="w-1/3 bg-white dark:bg-[#242729] border-2 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 text-slate-700 dark:text-slate-300 transition-colors font-bold py-4 px-6 rounded-xl transition-colors"
                  >
                    &larr; Volver
                  </button>
                  <button 
                    onClick={handleNextStep}
                    className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 text-lg"
                  >
                    Siguiente: Dirección &rarr;
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && deliveryMethod === 'DOMICILIO' && (
              <div className="space-y-6 animate-fade-in">
                {/* Datos de Contacto */}
                <div className="bg-white dark:bg-[#242729] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Datos de Contacto
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors mb-2">Nombre Completo *</label>
                      <input 
                        type="text" 
                        value={contactInfo.nombre}
                        onChange={(e) => setContactInfo({...contactInfo, nombre: e.target.value})}
                        placeholder="Ej: Juan Pérez"
                        className="w-full border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors mb-2">Teléfono de Contacto *</label>
                      <input 
                        type="tel" 
                        value={contactInfo.telefono}
                        onChange={(e) => setContactInfo({...contactInfo, telefono: e.target.value})}
                        placeholder="Ej: +56 9 1234 5678"
                        className="w-full border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Formulario de Dirección Detallado */}
                <div className="bg-white dark:bg-[#242729] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Dirección de Envío
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors mb-2">Ciudad *</label>
                      <input 
                        type="text" 
                        value={addressInfo.ciudad}
                        onChange={(e) => setAddressInfo({...addressInfo, ciudad: e.target.value})}
                        placeholder="Ej: Santiago"
                        className="w-full border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors mb-2">Comuna *</label>
                      <input 
                        type="text" 
                        value={addressInfo.comuna}
                        onChange={(e) => setAddressInfo({...addressInfo, comuna: e.target.value})}
                        placeholder="Ej: Providencia"
                        className="w-full border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                    <div className="md:col-span-8">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors mb-2">Calle *</label>
                      <input 
                        type="text" 
                        value={addressInfo.calle}
                        onChange={(e) => setAddressInfo({...addressInfo, calle: e.target.value})}
                        placeholder="Ej: Av. Nueva Providencia"
                        className="w-full border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors mb-2">Número *</label>
                      <input 
                        type="text" 
                        value={addressInfo.numeroCalle}
                        onChange={(e) => setAddressInfo({...addressInfo, numeroCalle: e.target.value})}
                        placeholder="Ej: 1234"
                        className="w-full border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors mb-2">Departamento / Oficina (Opcional)</label>
                    <input 
                      type="text" 
                      value={addressInfo.departamento}
                      onChange={(e) => setAddressInfo({...addressInfo, departamento: e.target.value})}
                      placeholder="Ej: Depto 502, Torre B"
                      className="w-full border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 rounded-xl p-3 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handlePrevStep}
                    className="w-1/3 bg-white dark:bg-[#242729] border-2 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 text-slate-700 dark:text-slate-300 transition-colors font-bold py-4 px-6 rounded-xl transition-colors"
                  >
                    &larr; Volver
                  </button>
                  <button 
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    className={`w-2/3 font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 text-lg ${
                      isProcessing 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                        : 'bg-brand-primary hover:bg-[#1A9089] text-white hover:shadow-brand-primary/30'
                    }`}
                  >
                    {isProcessing ? 'Procesando...' : 'Confirmar Orden'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha: Resumen (Siempre visible) */}
          <div className="w-full lg:w-96">
            <div className="bg-white dark:bg-[#242729] p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 transition-colors truncate pr-4">{item.cantidad}x {item.nombre}</span>
                    <span className="font-medium text-slate-800 dark:text-white transition-colors">{formatCurrencyCLP(item.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 transition-colors">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrencyCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 transition-colors">
                  <span>Envío</span>
                  <span className="font-medium">{shippingCost > 0 ? formatCurrencyCLP(shippingCost) : 'Gratis'}</span>
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

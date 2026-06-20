import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, HelpCircle, Globe, Shield, ChevronRight, Building2, Facebook, ArrowRight, Wrench } from 'lucide-react'
import { login } from '@/shared/services/auth.service'
import logo from '/ovelix-claro.png'
import { motion } from 'framer-motion'
export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error de login:', error)
      alert('Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-[#f9f9ff] text-[#191b23] select-none">
      {/* Left Section: Branding & Image (Split Screen) */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        {/* Real High-End Tech Workspace Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1733741020205-1ed0208314b6?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" 
          }}
        />
        {/* Overlay Gradient matching the hex values and design specs */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent/95 to-transparent/70 z-10"></div>
        
    <div className="relative z-20 max-w-lg text-white flex flex-col justify-center items-center h-full text-center py-16">
  <div className="flex flex-col items-center space-y-6">
    
    {/* ========== LOGO CON EFECTOS OSCUROS Y MASCULINOS ========== */}
    <motion.div
      className="relative group"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 1. Resplandor de fondo (azul oscuro/indigo) */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-800 via-blue-900 to-indigo-900 blur-2xl rounded-full scale-150"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* 2. Anillo exterior con degradado oscuro (gris acero a azul marino) */}
      <div className="p-[3px] rounded-full bg-gradient-to-br from-slate-400 via-blue-300 to-slate-600 shadow-2xl shadow-blue-900/40 transition-all duration-700 group-hover:shadow-blue-700/70">
        
        {/* 3. La imagen (con borde blanco sutil para contraste) */}
        <img 
          src={logo} 
          alt="Overlix" 
          className="w-40 h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" 
        />
      </div>
      
      {/* 4. Anillo decorativo pulsante (más sutil, blanco/azul) */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full border border-white/10"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>

   
    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
      <span className="bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
        La mejor ayuda
      </span>
      <br />
      <span className="text-blue-200/60 text-base lg:text-xl font-light tracking-[0.2em] uppercase">
        para tu taller
      </span>
    </h1>
  </div>
</div>
      </section>

      {/* Right Section: Login Form */}
      <section className="flex-1 flex flex-col justify-between min-h-screen p-6 lg:p-12 relative pattern-bg">
        {/* Mobile Logo Header */}
        <div className="w-full lg:hidden flex items-center justify-center py-4">
  <img 
    src={logo} 
    alt="Overlix" 
    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" 
  />
</div>

        {/* Center Card */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10 transition-all duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">Bienvenido</h2>
              <p className="text-sm text-[#424754]">Inicia sesión para acceder a tu panel de administración.</p>
            </div>

            

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#424754]" htmlFor="email">
                 Correo
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785]">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#c2c6d6] rounded-xl text-sm placeholder-[#727785] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@hotmail.com"
                    required
                    
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#424754]" htmlFor="password">
                    contraseña  
                  </label>
                  <button 
                    type="button" 
                    onClick={() => {
                      alert('Diagnostic Tip: Use any password with admin@techrepair.pro to sign-in directly!');
                    }}
                    className="text-xs font-medium text-[#0058be] hover:underline cursor-pointer"
                  >
                    Olvido la contraseña?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785]">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#c2c6d6] rounded-xl text-sm placeholder-[#727785] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                
                  />
                </div>
              </div>

             

              {/* Sign In Button */}
              <button 
                className="w-full mt-2 py-3.5 px-4 bg-[#0058be] text-white hover:bg-[#2170e4] active:scale-[0.99] font-medium text-sm rounded-xl shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 group"
                type="submit"
              >
               Inicia sesion
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c2c6d6]/60"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#727785] lowercase">Iniciar seccion con </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button 
              
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#c2c6d6] rounded-xl font-medium text-xs text-[#191b23] hover:bg-slate-50 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
              <button 
              
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#c2c6d6] rounded-xl font-medium text-xs text-[#191b23] hover:bg-slate-50 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path d="M0 0h23v23H0z" fill="#f3f3f3"></path>
                  <path d="M1 1h10v10H1z" fill="#f35325"></path>
                  <path d="M12 1h10v10H12z" fill="#81bc06"></path>
                  <path d="M1 12h10v10H1z" fill="#05a6f0"></path>
                  <path d="M12 12h10v10H12z" fill="#ffba08"></path>
                </svg>
                Microsoft
              </button>
            </div>

            {/* Admin Footer Tip */}
            <div className="mt-8 text-center">
              <p className="text-xs text-[#424754]">
                  ¿Necesitas acceso? 
                <button 
                  type="button"
                  onClick={() => alert('Access credentials: admin@techrepair.pro with any password. To add a new technician profile, please consult with your lead hardware directory desk or modify locally.')}
                  className="text-[#0058be] font-bold hover:underline ml-1 cursor-pointer"
                >
                  Contacta con soporte
                </button>
              </p>
            </div>
          </div>
        </div>

       
        
      </section>
    </main>
  )
}


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, HelpCircle, Globe, Shield, ChevronRight, Building2, ArrowRight } from 'lucide-react';
import { login } from '@/shared/services/auth.service';
import logo from '/ovelix-claro.png';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',        // este valor se enviará como "contraseña"
    codigoEmpresa: '',   // este valor se enviará como "codigo_empresa"
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Llamamos al servicio con los tres campos
      await login(
        formData.email,
        formData.password,
        formData.codigoEmpresa
      );
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error de login:', error);
      // Mostrar mensaje detallado del backend
      const mensaje = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      alert(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-[#f9f9ff] text-[#191b23] select-none">
      {/* Sección izquierda (branding) - la dejamos igual */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('...')" }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent/95 to-transparent/70 z-10"></div>
        <div className="relative z-20 max-w-lg text-white flex flex-col justify-center items-center h-full text-center py-16">
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              className="relative group"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-800 via-blue-900 to-indigo-900 blur-2xl rounded-full scale-150"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="p-[3px] rounded-full bg-gradient-to-br from-slate-400 via-blue-300 to-slate-600 shadow-2xl shadow-blue-900/40 transition-all duration-700 group-hover:shadow-blue-700/70">
                <img src={logo} alt="Overlix" className="w-40 h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" />
              </div>
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

      {/* Sección derecha (formulario) */}
      <section className="flex-1 flex flex-col justify-between min-h-screen p-6 lg:p-12 relative pattern-bg">
        {/* Logo móvil */}
        <div className="w-full lg:hidden flex items-center justify-center py-4">
          <img src={logo} alt="Overlix" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" />
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">Bienvenido</h2>
              <p className="text-sm text-[#424754]">Inicia sesión para acceder a tu panel de administración.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#424754]" htmlFor="email">Correo</label>
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Código de empresa (NUEVO) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#424754]" htmlFor="codigoEmpresa">
                  Código de empresa
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785]">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#c2c6d6] rounded-xl text-sm placeholder-[#727785] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
                    id="codigoEmpresa"
                    name="codigoEmpresa"
                    type="text"
                    placeholder="Ej: 80YTE2"
                    value={formData.codigoEmpresa}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#424754]" htmlFor="password">
                    Contraseña
                  </label>
                  <button type="button" className="text-xs font-medium text-[#0058be] hover:underline cursor-pointer">
                    ¿Olvidaste la contraseña?
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#727785] hover:text-[#191b23]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 bg-[#0058be] text-white hover:bg-[#2170e4] active:scale-[0.99] font-medium text-sm rounded-xl shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </form>

            {/* Social login y demás (mantener igual) */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c2c6d6]/60"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#727785] lowercase">Iniciar sesión con</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#c2c6d6] rounded-xl font-medium text-xs text-[#191b23] hover:bg-slate-50 transition-all cursor-pointer">
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#c2c6d6] rounded-xl font-medium text-xs text-[#191b23] hover:bg-slate-50 transition-all cursor-pointer">
                Microsoft
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
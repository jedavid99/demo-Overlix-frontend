import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Building2, 
  UserPlus, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  MapPin,
  FileText,
  Shield,
  Check,
  MessageCircle
} from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Card } from '../../shared/components/ui/card';
import { Label } from '../../shared/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../shared/components/ui/select';
import logo from '/ovelix-claro.png';

// Types
interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  nif?: string;
}

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyId?: string;
}

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  nif?: string;
}

// Hardcoded data
const VALID_ACTIVATION_CODE = 'OVERLIX-2024';
const EXISTING_COMPANIES: Company[] = [
  { id: '1', name: 'TechFix S.A.', address: 'Calle Principal 123', phone: '+34 600 123 456', email: 'info@techfix.com' },
  { id: '2', name: 'Reparaciones Express', address: 'Avenida Central 456', phone: '+34 600 789 012', email: 'contacto@reparaciones.com' },
  { id: '3', name: 'Taller Pro', address: 'Calle Industria 789', phone: '+34 600 345 678', email: 'info@tallerpro.com' },
];

// Step variants for animation
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95
  })
};

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activationCode, setActivationCode] = useState('');
  const [activationError, setActivationError] = useState('');
  const [registrationType, setRegistrationType] = useState<'new' | 'existing' | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    nif: ''
  });
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  };

  const validateActivationCode = () => {
    if (!activationCode.trim()) {
      setActivationError('Por favor, ingresa el código de activación');
      return false;
    }
    if (activationCode !== VALID_ACTIVATION_CODE) {
      setActivationError('Código de activación inválido');
      return false;
    }
    setActivationError('');
    return true;
  };

  const validateCompanyForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!companyData.name.trim()) newErrors.name = 'El nombre de la empresa es obligatorio';
    if (!companyData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!companyData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!validatePhone(companyData.phone)) newErrors.phone = 'Teléfono inválido';
    if (!companyData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!validateEmail(companyData.email)) newErrors.email = 'Email inválido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUserForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!userData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!userData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!validateEmail(userData.email)) newErrors.email = 'Email inválido';
    if (!userData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!validatePhone(userData.phone)) newErrors.phone = 'Teléfono inválido';
    if (!userData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (userData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!userData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (userData.password !== userData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (registrationType === 'existing' && !userData.companyId) newErrors.companyId = 'Selecciona una empresa';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step handlers
  const handleNextStep = () => {
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const handleActivationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateActivationCode()) {
      handleNextStep();
    }
  };

  const handleRegistrationTypeSelect = (type: 'new' | 'existing') => {
    setRegistrationType(type);
    handleNextStep();
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCompanyForm()) {
      // Save company data (simulated)
      const newCompany: Company = {
        id: Date.now().toString(),
        ...companyData
      };
      localStorage.setItem('newCompany', JSON.stringify(newCompany));
      userData.companyId = newCompany.id;
      handleNextStep();
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        const registrationData = {
          userData,
          companyData: registrationType === 'new' ? companyData : EXISTING_COMPANIES.find(c => c.id === userData.companyId),
          registrationType,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        console.log('Registration completed:', registrationData);
        
        setIsSubmitting(false);
        handleNextStep();
      }, 1500);
    }
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  // Stepper component
  const Stepper = () => {
    const steps = [
      { number: 1, label: 'Solicitar' },
      { number: 2, label: 'Activación' },
      { number: 3, label: 'Tipo' },
      { number: 4, label: 'Datos' },
      { number: 5, label: 'Confirmación' }
    ];

    const getStepStatus = (stepNumber: number) => {
      if (stepNumber < step + 1) return 'completed';
      if (stepNumber === step + 1) return 'current';
      return 'pending';
    };

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, index) => (
          <React.Fragment key={s.number}>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  getStepStatus(s.number) === 'completed'
                    ? 'bg-green-500 text-white'
                    : getStepStatus(s.number) === 'current'
                    ? 'bg-[#0058be] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {getStepStatus(s.number) === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  s.number
                )}
              </motion.div>
              <span className={`text-xs font-medium ${
                getStepStatus(s.number) === 'current' ? 'text-[#0058be]' : 'text-gray-500'
              }`}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${
                getStepStatus(s.number) === 'completed' ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-[#f9f9ff] text-[#191b23] select-none">
      {/* Left section - branding */}
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
                Únete a Overlix
              </span>
              <br />
              <span className="text-blue-200/60 text-base lg:text-xl font-light tracking-[0.2em] uppercase">
                Gestiona tu taller
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Right section - form */}
      <section className="flex-1 flex flex-col justify-between min-h-screen p-6 lg:p-12 relative">
        {/* Mobile logo */}
        <div className="w-full lg:hidden flex items-center justify-center py-4">
          <img src={logo} alt="Overlix" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" />
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[500px]">
            <AnimatePresence mode="wait" initial={false}>
              {/* Step 0: Request Code via WhatsApp */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Solicita tu código de activación
                    </h2>
                    <p className="text-sm text-[#424754]">
                      Para registrarte en Overlix, necesitas un código de activación. Solicítalo a través de WhatsApp.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#191b23] mb-2">¿Cómo obtener tu código?</h3>
                        <ul className="text-sm text-[#424754] space-y-1">
                          <li>• Haz clic en el botón de WhatsApp</li>
                          <li>• Envía el mensaje predefinido</li>
                          <li>• Recibirás tu código de activación</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/1234567890?text=Hola,%20me%20gustaría%20solicitar%20un%20código%20de%20activación%20para%20registrarme%20en%20Overlix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600"
                      size="lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Solicitar código por WhatsApp
                    </Button>
                  </a>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-[#727785]">
                      ¿Ya tienes tu código?{' '}
                      <button
                        onClick={handleNextStep}
                        className="text-[#0058be] font-medium hover:underline cursor-pointer"
                      >
                        Ingresa aquí
                      </button>
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleGoToLogin}
                    className="w-full mt-4"
                  >
                    Volver al login
                  </Button>
                </motion.div>
              )}

              {/* Step 1: Activation Code */}
              {step === 1 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Activación de cuenta
                    </h2>
                    <p className="text-sm text-[#424754]">
                      Ingresa el código de activación que te proporcionamos por WhatsApp.
                    </p>
                  </div>

                  <form onSubmit={handleActivationSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="activationCode">Código de activación</Label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785] w-5 h-5" />
                        <Input
                          id="activationCode"
                          type="text"
                          placeholder="Ej: OVERLIX-2024"
                          value={activationCode}
                          onChange={(e) => {
                            setActivationCode(e.target.value.toUpperCase());
                            setActivationError('');
                          }}
                          leftIcon={<Key className="w-5 h-5" />}
                          className="pl-11"
                          error={activationError}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#0058be] hover:bg-[#2170e4]"
                      size="lg"
                    >
                      Verificar código
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-[#727785]">
                      ¿Ya tienes una cuenta?{' '}
                      <button
                        onClick={handleGoToLogin}
                        className="text-[#0058be] font-medium hover:underline"
                      >
                        Inicia sesión
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Registration Type Selection */}
              {step === 2 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Tipo de registro
                    </h2>
                    <p className="text-sm text-[#424754]">
                      ¿Cómo deseas registrarte en Overlix?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRegistrationTypeSelect('new')}
                      className="w-full p-6 border-2 border-[#c2c6d6] rounded-xl hover:border-[#0058be] hover:bg-blue-50/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-[#0058be] transition-colors">
                          <Building2 className="w-6 h-6 text-[#0058be] group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#191b23] mb-1">
                            Registrar nueva empresa
                          </h3>
                          <p className="text-sm text-[#424754]">
                            Tu negocio aún no está en el sistema y deseas crear una nueva empresa.
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#727785] group-hover:text-[#0058be] transition-colors" />
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRegistrationTypeSelect('existing')}
                      className="w-full p-6 border-2 border-[#c2c6d6] rounded-xl hover:border-[#0058be] hover:bg-blue-50/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-500 transition-colors">
                          <UserPlus className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#191b23] mb-1">
                            Ya tengo una empresa registrada
                          </h3>
                          <p className="text-sm text-[#424754]">
                            Tu empresa ya existe en el sistema y deseas agregar un nuevo usuario.
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#727785] group-hover:text-[#0058be] transition-colors" />
                      </div>
                    </motion.button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    className="w-full mt-6"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                </motion.div>
              )}

              {/* Step 3a: Company Registration Form */}
              {step === 3 && registrationType === 'new' && (
                <motion.div
                  key="step2a"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Datos de la empresa
                    </h2>
                    <p className="text-sm text-[#424754]">
                      Ingresa la información de tu negocio.
                    </p>
                  </div>

                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName">Nombre de la empresa *</Label>
                      <Input
                        id="companyName"
                        placeholder="Ej: TechFix S.A."
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        leftIcon={<Building2 className="w-5 h-5" />}
                        error={errors.name}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="companyAddress">Dirección *</Label>
                      <Input
                        id="companyAddress"
                        placeholder="Ej: Calle Principal 123"
                        value={companyData.address}
                        onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                        leftIcon={<MapPin className="w-5 h-5" />}
                        error={errors.address}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="companyPhone">Teléfono *</Label>
                      <Input
                        id="companyPhone"
                        placeholder="Ej: +34 600 123 456"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                        leftIcon={<Phone className="w-5 h-5" />}
                        error={errors.phone}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="companyEmail">Email *</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        placeholder="Ej: info@empresa.com"
                        value={companyData.email}
                        onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                        leftIcon={<Mail className="w-5 h-5" />}
                        error={errors.email}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="companyNif">NIF/CIF (opcional)</Label>
                      <Input
                        id="companyNif"
                        placeholder="Ej: B12345678"
                        value={companyData.nif}
                        onChange={(e) => setCompanyData({ ...companyData, nif: e.target.value })}
                        leftIcon={<FileText className="w-5 h-5" />}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#0058be] hover:bg-[#2170e4]"
                      >
                        Continuar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3b: Company Selection */}
              {step === 3 && registrationType === 'existing' && (
                <motion.div
                  key="step2b"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Selecciona tu empresa
                    </h2>
                    <p className="text-sm text-[#424754]">
                      Elige la empresa a la que deseas asociarte.
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="companySelect">Empresa *</Label>
                      <Select
                        value={userData.companyId}
                        onValueChange={(value) => setUserData({ ...userData, companyId: value })}
                      >
                        <SelectTrigger id="companySelect" className={errors.companyId ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Selecciona una empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXISTING_COMPANIES.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.companyId && (
                        <p className="text-xs text-destructive font-medium mt-1">{errors.companyId}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#0058be] hover:bg-[#2170e4]"
                      >
                        Continuar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 4: User Registration Form */}
              {step === 4 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Datos del usuario
                    </h2>
                    <p className="text-sm text-[#424754]">
                      Completa tu información personal.
                    </p>
                  </div>

                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Nombre completo *</Label>
                      <Input
                        id="fullName"
                        placeholder="Ej: Juan Pérez"
                        value={userData.fullName}
                        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                        leftIcon={<UserPlus className="w-5 h-5" />}
                        error={errors.fullName}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="userEmail">Email *</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="Ej: juan@empresa.com"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        leftIcon={<Mail className="w-5 h-5" />}
                        error={errors.email}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="userPhone">Teléfono *</Label>
                      <Input
                        id="userPhone"
                        placeholder="Ej: +34 600 123 456"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        leftIcon={<Phone className="w-5 h-5" />}
                        error={errors.phone}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        leftIcon={<Lock className="w-5 h-5" />}
                        error={errors.password}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={userData.confirmPassword}
                        onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                        leftIcon={<Shield className="w-5 h-5" />}
                        error={errors.confirmPassword}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#0058be] hover:bg-[#2170e4]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Registrando...' : 'Completar registro'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 5: Confirmation */}
              {step === 5 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-3">
                    ¡Registro completado!
                  </h2>
                  <p className="text-sm text-[#424754] mb-8">
                    ¡Gracias por confiar en Overlix! Ahora eres parte de nuestra comunidad de talleres.
                  </p>

                  <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-[#191b23] mb-2 text-sm">Resumen del registro:</h3>
                    <div className="space-y-1 text-xs text-[#424754]">
                      <p><strong>Tipo:</strong> {registrationType === 'new' ? 'Nueva empresa' : 'Empresa existente'}</p>
                      <p><strong>Nombre:</strong> {userData.fullName}</p>
                      <p><strong>Email:</strong> {userData.email}</p>
                      {registrationType === 'new' && companyData.name && (
                        <p><strong>Empresa:</strong> {companyData.name}</p>
                      )}
                      {registrationType === 'existing' && userData.companyId && (
                        <p><strong>Empresa:</strong> {EXISTING_COMPANIES.find(c => c.id === userData.companyId)?.name}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleGoToLogin}
                    className="w-full bg-[#0058be] hover:bg-[#2170e4]"
                    size="lg"
                  >
                    Ir al login
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}

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
  codigoEmpresa?: string;
}

interface CompanyData {
  razonSocial: string;
  nombreFantasia: string;
  address: string;
  phone: string;
  email: string;
  cuit: string;
  owner: string;
  paymentMethod: string;
  workshopType: string;
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
    razonSocial: '',
    nombreFantasia: '',
    address: '',
    phone: '',
    email: '',
    cuit: '',
    owner: '',
    paymentMethod: '',
    workshopType: '',
    nif: ''
  });
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    codigoEmpresa: ''
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
    
    // Check if code exists in admin-generated codes
    const storedCodes = localStorage.getItem('activation_codes');
    if (!storedCodes) {
      setActivationError('Código de activación inválido');
      return false;
    }

    const codes = JSON.parse(storedCodes);
    const codeData = codes.find((c: any) => c.code === activationCode);
    
    if (!codeData) {
      setActivationError('Código de activación inválido');
      return false;
    }

    // Check if code is already used
    if (codeData.used) {
      setActivationError('Este código ya ha sido utilizado');
      return false;
    }

    // Check if code is expired
    const expiresAt = new Date(codeData.expiresAt);
    const now = new Date();
    if (expiresAt < now) {
      setActivationError('Este código de activación ha vencido');
      return false;
    }

    setActivationError('');
    return true;
  };

  const validateCompanyForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!companyData.razonSocial.trim()) newErrors.razonSocial = 'La razón social es obligatoria';
    if (!companyData.nombreFantasia.trim()) newErrors.nombreFantasia = 'El nombre de fantasía es obligatorio';
    if (!companyData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!companyData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!validatePhone(companyData.phone)) newErrors.phone = 'Teléfono inválido';
    if (!companyData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!validateEmail(companyData.email)) newErrors.email = 'Email inválido';
    if (!companyData.cuit.trim()) newErrors.cuit = 'El CUIT es obligatorio';
    if (!companyData.owner.trim()) newErrors.owner = 'El nombre del dueño es obligatorio';
    if (!companyData.paymentMethod) newErrors.paymentMethod = 'La forma de pago es obligatoria';
    if (!companyData.workshopType) newErrors.workshopType = 'El tipo de taller es obligatorio';
    
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
    if (registrationType === 'existing' && !userData.codigoEmpresa.trim()) newErrors.codigoEmpresa = 'El código de empresa es obligatorio';
    if (!userData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (userData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!userData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (userData.password !== userData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    
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
        name: companyData.razonSocial,
        address: companyData.address,
        phone: companyData.phone,
        email: companyData.email
      };
      localStorage.setItem('newCompany', JSON.stringify(newCompany));
      localStorage.setItem('companyDetails', JSON.stringify(companyData));
      handleNextStep();
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Mark activation code as used and save user info
        const storedCodes = localStorage.getItem('activation_codes');
        if (storedCodes) {
          const codes = JSON.parse(storedCodes);
          const updatedCodes = codes.map((c: any) => {
            if (c.code === activationCode) {
              return {
                ...c,
                used: true,
                usedAt: new Date().toISOString(),
                userEmail: userData.email,
                userName: userData.fullName,
                companyDetails: registrationType === 'new' ? companyData : null
              };
            }
            return c;
          });
          localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
        }

        const registrationData = {
          userData,
          companyData: registrationType === 'new' ? companyData : null,
          registrationType,
          activationCode,
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
      { number: 3, label: 'Empresa' },
      { number: 4, label: 'Usuario' },
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
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588515603140-81bd9f7d1db0?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
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
                  key="step2"
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
                            Agregar usuario a empresa existente
                          </h3>
                          <p className="text-sm text-[#424754]">
                            Tu empresa ya existe y deseas agregar un nuevo usuario con el código de empresa.
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
                      <Label htmlFor="razonSocial">Razón Social *</Label>
                      <Input
                        id="razonSocial"
                        placeholder="Ej: TechFix S.A."
                        value={companyData.razonSocial}
                        onChange={(e) => setCompanyData({ ...companyData, razonSocial: e.target.value })}
                        leftIcon={<Building2 className="w-5 h-5" />}
                        error={errors.razonSocial}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="nombreFantasia">Nombre de Fantasía *</Label>
                      <Input
                        id="nombreFantasia"
                        placeholder="Ej: TechFix"
                        value={companyData.nombreFantasia}
                        onChange={(e) => setCompanyData({ ...companyData, nombreFantasia: e.target.value })}
                        leftIcon={<Building2 className="w-5 h-5" />}
                        error={errors.nombreFantasia}
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
                      <Label htmlFor="cuit">CUIT *</Label>
                      <Input
                        id="cuit"
                        placeholder="Ej: 20-12345678-9"
                        value={companyData.cuit}
                        onChange={(e) => setCompanyData({ ...companyData, cuit: e.target.value })}
                        leftIcon={<FileText className="w-5 h-5" />}
                        error={errors.cuit}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="owner">Dueño / Responsable *</Label>
                      <Input
                        id="owner"
                        placeholder="Ej: Juan Pérez"
                        value={companyData.owner}
                        onChange={(e) => setCompanyData({ ...companyData, owner: e.target.value })}
                        leftIcon={<UserPlus className="w-5 h-5" />}
                        error={errors.owner}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="paymentMethod">Forma de Pago *</Label>
                      <Select
                        value={companyData.paymentMethod}
                        onValueChange={(value) => setCompanyData({ ...companyData, paymentMethod: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona forma de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                          <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                          <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                          <SelectItem value="mercadopago">MercadoPago</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.paymentMethod && (
                        <p className="text-xs text-destructive mt-1">{errors.paymentMethod}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="workshopType">Tipo de Taller *</Label>
                      <Select
                        value={companyData.workshopType}
                        onValueChange={(value) => setCompanyData({ ...companyData, workshopType: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona tipo de taller" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronica">Electrónica</SelectItem>
                          <SelectItem value="mecanica">Mecánica Automotriz</SelectItem>
                          <SelectItem value="computacion">Computación/IT</SelectItem>
                          <SelectItem value="celulares">Celulares</SelectItem>
                          <SelectItem value="electrodomesticos">Electrodomésticos</SelectItem>
                          <SelectItem value="bicicletas">Bicicletas</SelectItem>
                          <SelectItem value="general">General/Mixto</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.workshopType && (
                        <p className="text-xs text-destructive mt-1">{errors.workshopType}</p>
                      )}
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

              {/* Step 3b: Company Code Input */}
              {step === 3 && registrationType === 'existing' && (
                <motion.div
                  key="step3b"
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
                      Código de empresa
                    </h2>
                    <p className="text-sm text-[#424754]">
                      Ingresa el código de tu empresa para asociarte a ella.
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="companyCode" className="flex items-center gap-2 text-sm font-semibold">
                        <Building2 size={16} className="text-[#0058be]" />
                        Código de empresa <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="companyCode"
                        placeholder="Ej: AA2348"
                        value={userData.codigoEmpresa}
                        onChange={(e) => setUserData({ ...userData, codigoEmpresa: e.target.value })}
                        leftIcon={<Key className="w-5 h-5" />}
                        error={errors.codigoEmpresa}
                      />
                      <p className="text-xs text-[#727785]">
                        Este código lo proporciona el administrador de tu empresa.
                      </p>
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
                      <p><strong>Teléfono:</strong> {userData.phone}</p>
                      {registrationType === 'new' && companyData.razonSocial && (
                        <p><strong>Empresa:</strong> {companyData.razonSocial}</p>
                      )}
                      {registrationType === 'existing' && userData.codigoEmpresa && (
                        <p><strong>Código empresa:</strong> {userData.codigoEmpresa}</p>
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

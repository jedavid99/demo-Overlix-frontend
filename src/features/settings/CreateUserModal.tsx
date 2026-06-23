import React, { useState } from 'react'
import { X, UserPlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateUser: (user: any) => void
}

export default function CreateUserModal({ isOpen, onClose, onCreateUser }: CreateUserModalProps) {
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!newUser.fullName.trim()) newErrors.fullName = 'El nombre es obligatorio'
    if (!newUser.email.trim()) newErrors.email = 'El email es obligatorio'
    if (!newUser.phone.trim()) newErrors.phone = 'El teléfono es obligatorio'
    if (!newUser.password) newErrors.password = 'La contraseña es obligatoria'
    if (!newUser.confirmPassword) newErrors.confirmPassword = 'Confirma la contraseña'
    if (newUser.password !== newUser.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'
    if (!newUser.role) newErrors.role = 'El rol es obligatorio'

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onCreateUser(newUser)
      setNewUser({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: ''
      })
      setErrors({})
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#0058be]" />
              <h2 className="text-xl font-bold text-[#191b23]">Crear Nuevo Usuario</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nombre completo *</Label>
            <Input
              id="fullName"
              placeholder="Ej: Juan Pérez"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              error={errors.fullName}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej: juan@empresa.com"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              error={errors.email}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              placeholder="Ej: +34 600 123 456"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              error={errors.phone}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">Rol en la empresa *</Label>
            <Select
              value={newUser.role}
              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="recepcionista">Recepcionista</SelectItem>
                <SelectItem value="gerente">Gerente</SelectItem>
                <SelectItem value="contador">Contador</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              error={errors.password}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={newUser.confirmPassword}
              onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#0058be] hover:bg-[#2170e4]"
            >
              Crear Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { userService } from '@/services/userService';
import BackButton from '@/components/BackButton';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  gender: string;
  city: string;
};

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
        city: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (parseInt(formData.age) < 18) {
      setError('Debes ser mayor de 18 años');
      return;
    }

    setIsLoading(true);

    try {
      const { name, email, password, age, gender, city } = formData;
      const userToRegister = {
        name,
        email,
        password,
        age: parseInt(age),
        gender,
        city,
        photos: [],
        bio: '',
        verified: false,
        likes: [],
        dislikes: []
      };

      console.log('Intentando registrar usuario:', { ...userToRegister, password: '****' });
      await userService.register(userToRegister);
      router.push('/login');
    } catch (error: unknown) {
      console.error('Error en registro:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al registrar usuario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BackButton to="/" label="Ir al inicio" />
      {/* Logo y Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/flame-logo.png"
              alt="Flame Logo"
              width={200}
              height={80}
              className="mx-auto"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crea tu cuenta
            </h2>
        </div>
        
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
          </div>
        )}

          <div className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                  id="name"
                  name="name"
                type="text"
                  required
                value={formData.name}
                onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base"
                placeholder="Tu nombre"
              />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                  id="email"
                  name="email"
                type="email"
                  required
                value={formData.email}
                onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base"
                  placeholder="ejemplo@correo.com"
              />
            </div>

              <div className="grid grid-cols-2 gap-4">
            <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Edad
              </label>
              <input
                    id="age"
                    name="age"
                type="number"
                    required
                    min="18"
                    max="100"
                value={formData.age}
                onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base"
                    placeholder="18"
              />
            </div>

            <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Género
              </label>
              <select
                    id="gender"
                name="gender"
                    required
                value={formData.gender}
                onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base"
              >
                    <option value="">Selecciona</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
            </div>

            <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Ciudad
              </label>
              <input
                  id="city"
                  name="city"
                type="text"
                  required
                value={formData.city}
                onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base"
                placeholder="Tu ciudad"
              />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
              </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base"
                  placeholder="••••••••"
              />
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
              </label>
              <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base"
                  placeholder="••••••••"
              />
              </div>
            </div>

            <div>
            <button
              type="submit"
              disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#FE3C72] hover:bg-[#E62E5C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE3C72] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                  'Crear cuenta'
              )}
            </button>
          </div>
        </form>

          <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-medium text-[#FE3C72] hover:text-[#E62E5C]">
              Inicia sesión
            </Link>
          </p>
        </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-sm text-gray-500">
        <p>© 2024 Flame. Todos los derechos reservados.</p>
      </div>
    </div>
  );
} 
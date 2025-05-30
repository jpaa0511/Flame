'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { INTERESTS, DEPARTMENTS, GENDERS } from '@/constants';
import { authService } from '@/services/authService';
import type { FormData as FormDataType } from '@/types';
import toast from 'react-hot-toast';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const steps = ['Información Básica', 'Fotos e Intereses', 'Preferencias'];

const RegisterForm = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    age: 18,
    email: '',
    password: '',
    gender: '',
    department: '',
    city: '',
    interests: [],
    photos: [],
    bio: '',
    preferences: {
      gender: 'any',
      ageRange: {
        min: 18,
        max: 99
      },
      location: {
        department: '',
        city: ''
      }
    }
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [citiesForSelectedDepartment, setCitiesForSelectedDepartment] = useState<string[]>([]);
  const [preferredCities, setPreferredCities] = useState<string[]>([]);
  const [checkingEmail, setCheckingEmail] = useState(false);

  useEffect(() => {
    if (formData.department && DEPARTMENTS[formData.department as keyof typeof DEPARTMENTS]) {
      setCitiesForSelectedDepartment(DEPARTMENTS[formData.department as keyof typeof DEPARTMENTS]);
      if (!DEPARTMENTS[formData.department as keyof typeof DEPARTMENTS].includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: '' }));
      }
    } else {
      setCitiesForSelectedDepartment([]);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.department]);

  useEffect(() => {
    const dept = formData.preferences.location.department;
    if (dept && DEPARTMENTS[dept as keyof typeof DEPARTMENTS]) {
      setPreferredCities(DEPARTMENTS[dept as keyof typeof DEPARTMENTS]);
      if (!DEPARTMENTS[dept as keyof typeof DEPARTMENTS].includes(formData.preferences.location.city)) {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            location: {
              ...prev.preferences.location,
              city: ''
            }
          }
        }));
      }
    } else {
      setPreferredCities([]);
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          location: {
            ...prev.preferences.location,
            city: ''
          }
        }
      }));
    }
  }, [formData.preferences.location.department]);

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!validateStep(0)) {
        toast.error('Por favor completa todos los campos requeridos');
        return;
      }
      setCheckingEmail(true);
      const exists = await authService.checkEmailExists(formData.email);
      setCheckingEmail(false);
      if (exists) {
        setErrors(prev => ({ ...prev, email: 'El correo ya está registrado' }));
        toast.error('El correo ya está registrado');
        return;
      }
    }
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      toast.error('Por favor completa todos los campos requeridos');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      }
      return [...prev, interest];
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (uploadedPhotos.length + newFiles.length > 3) {
        toast.error('Solo puedes subir un máximo de 3 fotos');
        return;
      }
      setUploadedPhotos(prev => [...prev, ...newFiles]);
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handlePhotoDelete = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  // Nuevo handler para rc-slider
  const handleAgeRangeSlider = (values: [number, number]) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ageRange: { min: values[0], max: values[1] }
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 0:
        if (!formData.name.trim()) {
          newErrors.name = 'El nombre es requerido';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'El correo electrónico no es válido';
        }
        if (!formData.password) {
          newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!formData.age) {
          newErrors.age = 'La edad es requerida';
        } else if (formData.age < 18 || formData.age > 99) {
          newErrors.age = 'La edad debe estar entre 18 y 99 años';
        }
        if (!formData.gender) {
          newErrors.gender = 'El género es requerido';
        }
        if (!formData.department) {
          newErrors.department = 'El departamento es requerido';
        }
        if (!formData.city.trim()) {
          newErrors.city = 'La ciudad es requerida';
        }
        break;

      case 1:
        if (uploadedPhotos.length === 0) {
          newErrors.photos = 'Debes subir al menos una foto';
        }
        if (selectedInterests.length === 0) {
          newErrors.interests = 'Debes seleccionar al menos un interés';
        }
        break;

      case 2:
        if (formData.preferences.ageRange.min > formData.preferences.ageRange.max) {
          newErrors.ageRange = 'La edad mínima no puede ser mayor que la máxima';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      console.log('Iniciando registro...');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key !== 'photos' && key !== 'preferences' && key !== 'interests') {
          formDataToSend.append(key, String(formData[key as keyof FormDataType]));
        }
      });

      const preferencesToSend = {
        gender: formData.preferences.gender || 'any',
        ageRange: {
          min: formData.preferences.ageRange.min || 18,
          max: formData.preferences.ageRange.max || 99
        },
        location: {
          department: formData.preferences.location.department || '',
          city: formData.preferences.location.city || ''
        }
      };

      formDataToSend.append('preferences[gender]', preferencesToSend.gender);
      formDataToSend.append('preferences[ageRange][min]', String(preferencesToSend.ageRange.min));
      formDataToSend.append('preferences[ageRange][max]', String(preferencesToSend.ageRange.max));
      formDataToSend.append('preferences[location][department]', preferencesToSend.location.department);
      formDataToSend.append('preferences[location][city]', preferencesToSend.location.city);

      uploadedPhotos.forEach(photo => {
        formDataToSend.append('photos', photo);
      });

      selectedInterests.forEach(interest => {
        formDataToSend.append('interests[]', interest);
      });

      const response = await authService.register(formDataToSend);
      console.log('Respuesta del servidor:', response);

      if (response.success) {
        toast.success('Registro exitoso');
        // Login automático tras registro
        try {
          const user = await authService.login({ email: formData.email, password: formData.password });
          if (user) {
            router.push('/feed');
            return;
          }
        } catch (e) {
          // Si falla el login, redirige a login como fallback
          router.push('/login');
          return;
        }
      } else {
        toast.error(response.message || 'Error en el registro');
      }
    } catch (error: any) {
      console.error('Error en el registro:', error);
      toast.error(error.message || 'Error en el registro');
    }
  };

  const renderStepContent = (step: number) => {
    // Calculate the left and right positions for the filled part of the range
    const minAge = 18;
    const maxAge = 99;
    const range = maxAge - minAge;
    const leftFill = ((formData.preferences.ageRange.min - minAge) / range) * 100;
    const rightFill = 100 - ((formData.preferences.ageRange.max - minAge) / range) * 100;


    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleBasicInfoChange}
                required
                className={`mt-1 block w-full px-4 py-3 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900 caret-[#FE3C72]`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Edad
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleBasicInfoChange}
                  min="18"
                  max="99"
                  required
                  className={`mt-1 block w-full px-4 py-3 border ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900 caret-[#FE3C72]`}
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Género
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  required
                  className={`mt-1 block w-full px-4 py-3 border ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  } rounded-full shadow-sm focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900`}
                >
                  <option value="">Selecciona un género</option>
                  {GENDERS.filter(g => g !== 'any').map(gender => (
                    <option key={gender} value={gender}>
                      {gender === 'male' ? 'Masculino' : gender === 'female' ? 'Femenino' : 'Otro'}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleBasicInfoChange}
                required
                className={`mt-1 block w-full px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900 caret-[#FE3C72]`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleBasicInfoChange}
                required
                className={`mt-1 block w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900 caret-[#FE3C72]`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Departamento
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleSelectChange}
                  required
                  className={`mt-1 block w-full px-4 py-3 border ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  } rounded-full shadow-sm focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900`}
                >
                  <option value="">Selecciona un departamento</option>
                  {Object.keys(DEPARTMENTS).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleSelectChange}
                  required
                  className={`mt-1 block w-full px-4 py-3 border ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  } rounded-full shadow-sm focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900`}
                  disabled={!formData.department}
                >
                  <option value="">Selecciona una ciudad</option>
                  {citiesForSelectedDepartment.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sube tus fotos (máximo 3)</h3>
              <div className="flex items-center justify-center w-full">
                {/* Mostrar recuadro solo si hay menos de 3 fotos */}
                {uploadedPhotos.length < 3 && (
                  <label className={`flex flex-col items-center justify-center w-full h-64 border-2 ${
                    errors.photos ? 'border-red-500' : 'border-gray-300'
                  } border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                      <p className="text-xs text-gray-500">PNG, JPG o JPEG (MAX. 3 fotos)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>
              {errors.photos && (
                <p className="mt-1 text-sm text-red-600">{errors.photos}</p>
              )}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handlePhotoDelete(index)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Biografía */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={e => {
                  if (e.target.value.length <= 300) {
                    setFormData(prev => ({ ...prev, bio: e.target.value }));
                  }
                }}
                maxLength={300}
                rows={3}
                className={`mt-1 block w-full px-4 py-3 border ${formData.bio.length === 300 ? 'border-red-500' : 'border-gray-300'} rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900 resize-none`}
                placeholder="Cuéntanos algo sobre ti..."
              />
              <div className="flex justify-end text-xs mt-1">
                <span className={formData.bio.length === 300 ? 'text-red-500' : 'text-gray-500'}>
                  {formData.bio.length}/300
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Selecciona tus intereses</h3>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedInterests.includes(interest)
                        ? 'bg-[#FE3C72] text-white hover:bg-[#E62E5C]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {errors.interests && (
                <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Género preferido */}
            <div>
              <label htmlFor="preference-gender" className="block text-sm font-medium text-gray-700 mb-1">
                Género preferido
              </label>
              <select
                id="preference-gender"
                value={formData.preferences.gender}
                onChange={e => handlePreferenceChange('gender', e.target.value)}
                className={`mt-1 block w-full px-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-full shadow-sm focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900`}
              >
                <option value="any">Cualquiera</option>
                {GENDERS.filter(g => g !== 'any').map(gender => (
                  <option key={gender} value={gender}>
                    {gender === 'male' ? 'Masculino' : gender === 'female' ? 'Femenino' : 'Otro'}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Rango de edad preferido con rc-slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona el rango de edad que te interesa
              </label>
              <div className="w-full flex flex-col items-center">
                <Slider
                  range
                  min={18}
                  max={99}
                  allowCross={false}
                  value={[formData.preferences.ageRange.min, formData.preferences.ageRange.max]}
                  onChange={handleAgeRangeSlider}
                  trackStyle={[{ backgroundColor: '#FE3C72', height: 8 }]}
                  handleStyle={[
                    { backgroundColor: '#FE3C72', borderColor: '#FE3C72', height: 24, width: 24, marginTop: -8 },
                    { backgroundColor: '#FE3C72', borderColor: '#FE3C72', height: 24, width: 24, marginTop: -8 }
                  ]}
                  railStyle={{ backgroundColor: '#e5e7eb', height: 8 }}
                />
                <div className="flex justify-between w-full mt-4 px-1">
                  <span className="text-base font-semibold text-[#FE3C72]">{formData.preferences.ageRange.min} años</span>
                  <span className="text-base font-semibold text-[#FE3C72]">{formData.preferences.ageRange.max} años</span>
                </div>
                {errors.ageRange && (
                  <p className="mt-1 text-sm text-red-600">{errors.ageRange}</p>
                )}
              </div>
            </div>

            {/* Departamento y ciudad preferidos en la misma fila */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="preference-department" className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento preferido
                </label>
                <select
                  id="preference-department"
                  value={formData.preferences.location.department}
                  onChange={e => handlePreferenceChange('location', {
                    ...formData.preferences.location,
                    department: e.target.value
                  })}
                  className={`mt-1 block w-full px-4 py-3 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-full shadow-sm focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900`}
                >
                  <option value="">Cualquiera</option>
                  {Object.keys(DEPARTMENTS).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="preference-city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad preferida
                </label>
                <select
                  id="preference-city"
                  value={formData.preferences.location.city}
                  onChange={e => handlePreferenceChange('location', {
                    ...formData.preferences.location,
                    city: e.target.value
                  })}
                  className={`mt-1 block w-full px-4 py-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-full shadow-sm focus:outline-none focus:ring-[#FE3C72] focus:border-[#FE3C72] text-base text-gray-900`}
                  disabled={!formData.preferences.location.department}
                >
                  <option value="">{formData.preferences.location.department ? 'Selecciona una ciudad' : 'Selecciona un departamento primero'}</option>
                  {preferredCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-2">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h2 className="my-4 text-3xl font-semibold text-gray-800 tracking-tight">
              Registrarse
            </h2>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((label, index) => (
                  <div key={label} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index <= activeStep ? 'bg-[#FE3C72] text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className={`ml-2 text-sm font-medium ${
                      index <= activeStep ? 'text-[#FE3C72]' : 'text-gray-500'
                    }`}>
                      {label}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        index < activeStep ? 'bg-[#FE3C72]' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {renderStepContent(activeStep)}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={activeStep === 0}
                className={`px-6 py-3 rounded-full text-base font-medium ${
                  activeStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#FE3C72] border-2 border-[#FE3C72] hover:bg-[#FEE2E2]'
                }`}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                className="px-6 py-3 rounded-full text-base font-medium text-white bg-[#FE3C72] hover:bg-[#E62E5C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE3C72]"
                disabled={checkingEmail}
              >
                {checkingEmail ? 'Verificando...' : activeStep === steps.length - 1 ? 'Registrarse' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
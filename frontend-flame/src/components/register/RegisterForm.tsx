'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INTERESTS, DEPARTMENTS, GENDERS } from '@/constants';
import { authService } from '@/services/authService';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Paper,
  Slider,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FormData as FormDataType, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
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

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
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

  const handleSubmit = async () => {
    try {
      console.log('Iniciando registro...');
      const formDataToSend = new FormData();
      
      // Agregar datos básicos
      Object.keys(formData).forEach(key => {
        if (key !== 'photos' && key !== 'preferences' && key !== 'interests') {
          formDataToSend.append(key, String(formData[key as keyof FormDataType]));
        }
      });

      // Asegurarnos de que preferences sea un objeto válido
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

      // Agregar cada campo de preferences individualmente
      formDataToSend.append('preferences[gender]', preferencesToSend.gender);
      formDataToSend.append('preferences[ageRange][min]', String(preferencesToSend.ageRange.min));
      formDataToSend.append('preferences[ageRange][max]', String(preferencesToSend.ageRange.max));
      formDataToSend.append('preferences[location][department]', preferencesToSend.location.department);
      formDataToSend.append('preferences[location][city]', preferencesToSend.location.city);

      // Agregar fotos
      uploadedPhotos.forEach(photo => {
        formDataToSend.append('photos', photo);
      });

      // Agregar intereses como array
      selectedInterests.forEach(interest => {
        formDataToSend.append('interests[]', interest);
      });

      // Log para debugging
      console.log('Datos a enviar:', {
        ...Object.fromEntries(formDataToSend.entries()),
        photos: uploadedPhotos.map(p => p.name)
      });

      const response = await authService.register(formDataToSend);
      console.log('Respuesta del servidor:', response);

      if (response.success) {
        toast.success('Registro exitoso');
        router.push('/login');
      } else {
        toast.error(response.message || 'Error en el registro');
      }
    } catch (error: any) {
      console.error('Error en el registro:', error);
      toast.error(error.message || 'Error en el registro');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleBasicInfoChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Edad"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleBasicInfoChange}
                inputProps={{ min: 18, max: 100 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleBasicInfoChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleBasicInfoChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Género</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  required
                >
                  {GENDERS.filter(g => g !== 'any').map(gender => (
                    <MenuItem key={gender} value={gender}>
                      {gender === 'male' ? 'Masculino' : gender === 'female' ? 'Femenino' : 'Otro'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Departamento</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleSelectChange}
                  required
                >
                  {Object.keys(DEPARTMENTS).map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Ciudad</InputLabel>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleSelectChange}
                  required
                  disabled={!formData.department}
                >
                  {formData.department && DEPARTMENTS[formData.department as keyof typeof DEPARTMENTS].map(city => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Sube tus fotos (máximo 3)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                {previewUrls.map((url, index) => (
                  <Paper
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      backgroundImage: `url(${url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                      }}
                      onClick={() => handlePhotoDelete(index)}
                    >
                      <DeleteIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Paper>
                ))}
                {previewUrls.length < 3 && (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ width: 150, height: 150 }}
                  >
                    Subir foto
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Selecciona tus intereses
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {INTERESTS.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    onClick={() => handleInterestToggle(interest)}
                    color={selectedInterests.includes(interest) ? 'primary' : 'default'}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biografía"
                name="bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleBasicInfoChange}
                inputProps={{ maxLength: 300 }}
                helperText={`${formData.bio.length}/300 caracteres`}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Género preferido</InputLabel>
                <Select
                  value={formData.preferences.gender}
                  onChange={(e: SelectChangeEvent) => handlePreferenceChange('gender', e.target.value)}
                >
                  {GENDERS.map(gender => (
                    <MenuItem key={gender} value={gender}>
                      {gender === 'any' ? 'Cualquiera' : 
                       gender === 'male' ? 'Masculino' : 
                       gender === 'female' ? 'Femenino' : 'Otro'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Rango de edad preferido
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={[formData.preferences.ageRange.min, formData.preferences.ageRange.max]}
                  onChange={(_: Event, newValue: number | number[]) => {
                    const [min, max] = newValue as number[];
                    handlePreferenceChange('ageRange', { min, max });
                  }}
                  valueLabelDisplay="auto"
                  min={18}
                  max={100}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>{formData.preferences.ageRange.min} años</Typography>
                  <Typography>{formData.preferences.ageRange.max} años</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Departamento preferido</InputLabel>
                <Select
                  value={formData.preferences.location.department}
                  onChange={(e: SelectChangeEvent) => handlePreferenceChange('location', {
                    ...formData.preferences.location,
                    department: e.target.value
                  })}
                >
                  <MenuItem value="">Cualquiera</MenuItem>
                  {Object.keys(DEPARTMENTS).map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Ciudad preferida</InputLabel>
                <Select
                  value={formData.preferences.location.city}
                  onChange={(e: SelectChangeEvent) => handlePreferenceChange('location', {
                    ...formData.preferences.location,
                    city: e.target.value
                  })}
                  disabled={!formData.preferences.location.department}
                >
                  <MenuItem value="">Cualquiera</MenuItem>
                  {formData.preferences.location.department && 
                   DEPARTMENTS[formData.preferences.location.department as keyof typeof DEPARTMENTS].map(city => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Registro
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Atrás
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              type="button"
            >
              Registrarse
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterForm; 
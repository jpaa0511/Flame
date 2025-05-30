'use client';

import RegisterForm from '@/components/register/RegisterForm';
import Navbar from '@/components/Navbar';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-16">
        <RegisterForm />
      </div>
    </div>
  );
} 
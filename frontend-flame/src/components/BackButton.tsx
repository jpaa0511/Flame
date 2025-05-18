'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  to: string;
  label?: string;
}

export default function BackButton({ to, label = 'Regresar' }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(to)}
      className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-[#FE3C72] transition-colors"
    >
      <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
} 
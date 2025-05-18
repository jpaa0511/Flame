'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        <svg className="w-7 h-7 text-[#FE3C72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)}>
          <div
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6 text-[#FE3C72]">Menú</h2>
            <ul className="space-y-4">
              <li>
                <Link href="/cards" className="text-gray-700 hover:text-[#FE3C72]" onClick={() => setOpen(false)}>
                  Buscar personas
                </Link>
              </li>
              <li>
                <Link href="/chats" className="text-gray-700 hover:text-[#FE3C72]" onClick={() => setOpen(false)}>
                  Chats
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-700 hover:text-[#FE3C72]" onClick={() => setOpen(false)}>
                  Mi perfil
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
} 
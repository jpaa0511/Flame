"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/");
  };

  const renderNavLinks = () => {
    if (loading) return null;
    if (user) {
      return (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#000000] text-base truncate">{user.name}</span>
          <button
            title="Chats"
            onClick={() => router.push("/chat")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >

            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FE3C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
          </button>
          <button
            title="Perfil"
            onClick={() => router.push("/profile")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >

            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FE3C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          <button
            title="Cerrar sesión"
            onClick={handleLogout}
            className="px-4 py-2 rounded-full border-2 border-[#FE3C72] text-[#FE3C72] font-semibold hover:bg-[#FE3C72] hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      );
    }
    switch (pathname) {
      case "/login":
        return (
          <>
            <Link
              href="/register"
              className="px-4 py-2 rounded-full border-2 border-[#FE3C72] text-[#FE3C72] font-semibold hover:bg-[#FE3C72] hover:text-white transition-all"
            >
              Registrarse
            </Link>
          </>
        );
      case "/register":
        return (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-full border-2 border-[#FE3C72] text-[#FE3C72] font-semibold hover:bg-[#FE3C72] hover:text-white transition-all"
            >
              Iniciar sesión
            </Link>
          </>
        );
      default:
        return (
          <>
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-full bg-[#FE3C72] text-white font-semibold hover:bg-[#E62E5C] transition-colors"
            >
              Registrarse
            </Link>
          </>
        );
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-[#FDF7F7] backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src={require("@/utils/flame-logo.png")}
                alt="Flame Logo"
                width={36}
                height={36}
                className="h-9 w-9"
                priority
              />
              <span className="text-2xl font-bold" style={{ color: "#FE3C72" }}>
                Flame
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">{renderNavLinks()}</div>
        </div>
      </div>
    </nav>
  );
}

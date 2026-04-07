"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#e4f4ed]">
      {/* Top bar */}
      <div className="bg-[#264f41] text-white text-xs py-1.5 text-center font-medium tracking-wide">
        🎁 Frete grátis para pedidos acima de R$500 &nbsp;|&nbsp; Qualidade garantida ou seu dinheiro de volta
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#61c39a] to-[#3ca779] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-[#264f41] text-lg tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                La Casa
              </span>
              <span className="text-[#61c39a] text-xs font-semibold tracking-widest uppercase">de Sacola</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#categorias" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors">
              Sacolas
            </Link>
            <Link href="#como-funciona" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors">
              Como Funciona
            </Link>
            <Link href="#avaliacoes" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors">
              Avaliações
            </Link>
            <Link href="#contato" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors">
              Contato
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#3ca779] border border-[#61c39a] rounded-xl px-4 py-2 hover:bg-[#f0faf5] transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-sm font-semibold text-white bg-[#3ca779] rounded-xl px-4 py-2 hover:bg-[#2e8f65] transition-colors shadow-sm"
            >
              Fazer Pedido
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-[#264f41] hover:bg-[#f0faf5]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e4f4ed] px-4 pb-4 pt-2 flex flex-col gap-3">
          <Link href="#categorias" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Sacolas</Link>
          <Link href="#como-funciona" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Como Funciona</Link>
          <Link href="#avaliacoes" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Avaliações</Link>
          <Link href="#contato" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Contato</Link>
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1 text-center text-sm font-semibold text-[#3ca779] border border-[#61c39a] rounded-xl px-4 py-2">Entrar</Link>
            <Link href="/cadastro" className="flex-1 text-center text-sm font-semibold text-white bg-[#3ca779] rounded-xl px-4 py-2">Fazer Pedido</Link>
          </div>
        </div>
      )}
    </header>
  );
}

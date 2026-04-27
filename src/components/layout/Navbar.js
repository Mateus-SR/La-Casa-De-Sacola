"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  PlusIcon, 
  UpdateIcon
} from "@radix-ui/react-icons";
import { useCart } from "../../context/CartContext";
import toast,{ Toaster } from "react-hot-toast";
import useNavbarAuth from "../../hooks/loginAuthNavbar"; 
import ToastErroAuth, { opcoesErroAuth } from "./loginToastNavbar";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  //const [user, setUser] = useState(null);
  //const [cargo, setCargo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  //const [navbarLoading, setNavbarLoading] = useState (true);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleClickFora = (e) => {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora)
    };
  }, [dropdownOpen])

  const { user, cargo, navbarLoading, erro } = useNavbarAuth();
  useEffect(() => {
    if (erro) {
      toast.error(ToastErroAuth, opcoesErroAuth);
    }
  }, [erro]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch(error) {
      console.error("Erro no Logout:", error)
    } finally {
      setDropdownOpen(false);
      setMenuOpen(false);
      window.location.href= "/";
    }
  };


  
  return (
    <header className="sticky top-0 z-50 bg-[#f4f7f5] shadow-sm border-b border-[#e4f4ed]">
      {/* Top bar */}
      {/* <Toaster position="top-right" /> */}
      <div className="bg-[#292622] text-white text-xs py-1.5 text-center font-medium tracking-wide">
         Frete grátis para pedidos acima de R$500 &nbsp;|&nbsp; La Casa de Sacola
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#292622] to-[#8f0000] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <img 
              src="/img/logoSimples.png" 
              alt="Logo" 
              className="w-7 h-7 object-contain z-[999]" 
            />
              {/* Comentei o SVG da sacola pra testar com a imagem no lugar dele, mas pode trazer de volta se acharem melhor   -Mateus
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              */}
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-[#292622] text-lg tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                La Casa
              </span>
              <span className="text-[#8f0000] text-xs font-bold tracking-widest uppercase -mt-1">de Sacola</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#categorias" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors"> Sacolas </Link>
            <Link href="/#sobre" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors"> Quem Somos </Link>
            <Link href="/#como-funciona" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors"> Como Funciona </Link>
            <Link href="/#contato" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors"> Contato </Link>
            <Link href="/catalogo" className="text-sm font-medium text-[#3a5c4e] hover:text-[#3ca779] transition-colors">
             Produtos Modelos
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Ícone de Carrinho */}
            <Link href="/carrinho" className="relative p-2 text-[#264f41] hover:bg-[#f0faf5] rounded-xl transition-all group">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="group-hover:scale-110 transition-transform"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8f0000] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-sm animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>

            {navbarLoading ? (
              <div className="w-32 h-9 rounded-xl bg-[#e4f4ed] animate-pulse" />
            ) : !user ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-[#8f0000] border border-[#8f0000] rounded-xl px-4 py-2 hover:bg-[#f0faf5] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="text-sm font-semibold text-white bg-[#5ab58f] rounded-xl px-4 py-2 hover:bg-[#2e8f65] transition-colors shadow-sm"
                >
                  Cadastrar-se
                </Link>
                {/* Troquei o "fazer pedido" por "cadastrar-se"   -Mateus
                <Link
                  href="/login"
                  className="text-sm font-semibold text-white bg-[#5ab58f] rounded-xl px-4 py-2 hover:bg-[#2e8f65] transition-colors shadow-sm"
                >
                  Fazer Pedido
                </Link>
                */}
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#264f41] bg-white border border-[#e4f4ed] rounded-xl px-4 py-2 hover:bg-[#f0faf5] transition-all"
                >
                  <span className="max-w-[150px] truncate font-bold">
                    {/*Alterar futuramente para pegar o nome do usuário ao invés do e-mail. Deixar e-mail como failsafe, caso não consiga o nome por alguma razão -Mateus*/}
                    {user.email}
                    </span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e4f4ed] rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                    <Link href="/perfil" className="block px-4 py-3 text-sm font-bold text-[#264f41] hover:bg-[#f7f4eb]" onClick={() => setDropdownOpen(false)}>
                      Minha Conta
                      <span className="block text-xs font-medium text-[#6e8679] mt-0.5">Dados, pedidos e endereços</span>
                    </Link>
                    <div className="h-px bg-[#e4f4ed] mx-4" />
                      {cargo !== 'administrador' && (
                        <>
                          <Link href="/enderecos" className="block px-4 py-2 text-sm text-[#3a5c4e] hover:bg-[#f0faf5]" onClick={() => setDropdownOpen(false)}>
                            Meus Endereços
                          </Link>

                          <Link href="/pedidos" className="block px-4 py-2 text-sm text-[#3a5c4e] hover:bg-[#f0faf5]" onClick={() => setDropdownOpen(false)}>
                            Meus Pedidos
                          </Link>

                          <hr className="my-1 border-[#e4f4ed]" />

                          <Link href="/perfil" className="block px-4 py-3 text-sm font-bold text-[#264f41] hover:bg-[#f7f4eb]" onClick={() => setDropdownOpen(false)}>
                          <div className="flex flex-row items-center">
                            <PlusIcon className="size-4 mr-1"></PlusIcon> Fazer Pedido
                          </div>
                            <span className="block text-xs font-medium text-[#6e8679] mt-0.5">Dados, pedidos e endereços</span>
                          </Link>
                        </>
                      )}
                    {cargo === 'administrador' && (
                      <>
                      <Link href="/painel" className="block px-4 py-2 text-sm text-[#8f0000] hover:text-red-700 transition-colors" onClick={() => setDropdownOpen(false)}>
                        Painel Administrador
                      </Link>

                      <Link href="/producao" className="block px-4 py-2 text-sm text-[#8f0000] hover:text-red-700 transition-colors" onClick={() => setDropdownOpen(false)}>
                        Sacolas em Produção
                      </Link>
                      </>
                    )}
                    <hr className="my-1 border-[#e4f4ed]" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}


          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Carrinho Mobile */}
            <Link href="/carrinho" className="relative p-2 text-[#264f41]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#8f0000] text-white text-[9px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button
              className="p-2 rounded-lg text-[#264f41] hover:bg-[#f0faf5]"
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e4f4ed] px-4 pb-4 pt-2 flex flex-col gap-3">
          <Link href="/#categorias" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Sacolas</Link>
          <Link href="/#sobre" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Quem Somos</Link>
          <Link href="/#como-funciona" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Como Funciona</Link>
          <Link href="/#contato" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Contato</Link>
          <Link href="/catalogo" className="text-sm font-medium text-[#3a5c4e] py-2" onClick={() => setMenuOpen(false)}>Produtos Modelos</Link>
          
          <div className="flex flex-col gap-2 pt-2 border-t border-[#e4f4ed]">
          {navbarLoading ? (
              <div className="w-32 h-9 rounded-xl bg-[#e4f4ed] animate-pulse" />
            ) : !user ? (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1 text-center text-sm font-semibold text-[#8f0000] border border-[#8f0000] rounded-xl px-4 py-2" onClick={() => setMenuOpen(false)}>Entrar</Link>
                <Link href="/cadastro" className="flex-1 text-center text-sm font-semibold text-white bg-[#5ab58f] rounded-xl px-4 py-2" onClick={() => setMenuOpen(false)}>Cadastrar-se</Link>
                {/* Troquei o "fazer pedido" por "cadastrar-se"   -Mateus
                <Link href="/login" className="flex-1 text-center text-sm font-semibold text-white bg-[#5ab58f] rounded-xl px-4 py-2" onClick={() => setMenuOpen(false)}>Fazer Pedido</Link>
                */}
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 px-2">Logado como: <b>{user.email}</b></p>
                <Link href="/perfil" onClick={() => setDropdownOpen(false)}>
                      Minha Conta
                    </Link>
                    <div className="h-px bg-[#e4f4ed] mx-4" />
                      {cargo !== 'administrador' && (
                        <>
                          <Link href="/enderecos" className="text-sm font-bold text-[#264f41] py-2" onClick={() => setMenuOpen(false)}>
                            Meus Endereços
                          </Link>

                          <Link href="/pedidos" className="text-sm font-bold text-[#264f41] py-2" onClick={() => setMenuOpen(false)}>
                            Meus Pedidos
                          </Link>

                          <hr className="my-1 border-[#e4f4ed]" />

                          <Link href="/perfil" className="text-sm font-bold text-[#264f41] py-2" onClick={() => setMenuOpen(false)}>
                          <div className="flex flex-row items-center">
                            <PlusIcon className="size-4 mr-1"></PlusIcon> Fazer Pedido
                          </div>
                          </Link>
                        </>
                      )}
                    {cargo === 'administrador' && (
                      <>
                      <Link href="/painel" className="text-sm font-bold text-[#8f0000] py-2" onClick={() => setMenuOpen(false)}>
                        Painel Administrador
                      </Link>

                      <Link href="/producao" className="text-sm font-bold text-[#8f0000] py-2" onClick={() => setMenuOpen(false)}>
                        Sacolas em Produção
                      </Link>
                      </>
                    )}
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-bold text-red-600 py-2">
                    Sair
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
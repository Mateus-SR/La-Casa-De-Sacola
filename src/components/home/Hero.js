"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1a14] via-[#1a3828] to-[#0f2a1e] min-h-[92vh] flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#61c39a] opacity-[0.07] blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full bg-[#3ca779] opacity-[0.06] blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(97,195,154,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(97,195,154,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-[#61c39a]/10 border border-[#61c39a]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#61c39a] animate-pulse" />
              <span className="text-[#61c39a] text-sm font-medium">Gráfica Familiar desde 2010</span>
            </div>

            <h1
              className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Sacolas que{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#61c39a] to-[#a8e6c8]">
                contam a história
              </span>{" "}
              da sua marca
            </h1>

            <p className="text-[#a8c4b8] text-lg leading-relaxed mb-8 max-w-lg">
              Personalize sacolas kraft, de papel, plásticas e com alça de cordão com a sua arte. 
              Qualidade gráfica com o cuidado de uma empresa familiar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-[#3ca779] hover:bg-[#2e8f65] text-white font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-[#3ca779]/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Fazer Pedido Agora
              </Link>
              <Link
                href="#categorias"
                className="inline-flex items-center justify-center gap-2 border border-[#61c39a]/40 text-[#61c39a] hover:bg-[#61c39a]/10 font-semibold text-base px-8 py-4 rounded-2xl transition-all"
              >
                Ver Modelos
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: "+5.000", label: "Pedidos entregues" },
                { value: "4 tipos", label: "De sacolas" },
                { value: "100%", label: "Personalizado" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-[#7aaa96] text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Bag showcase */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Main bag card */}
              <div className="bg-gradient-to-br from-[#1e4535] to-[#163327] rounded-3xl p-8 border border-[#61c39a]/20 shadow-2xl">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#264f41] to-[#1a3828] flex items-center justify-center mb-6 relative overflow-hidden">
                  {/* Decorative bag illustration */}
                  <svg width="180" height="200" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Bag body */}
                    <rect x="20" y="70" width="140" height="120" rx="12" fill="#61c39a" fillOpacity="0.15" stroke="#61c39a" strokeWidth="2"/>
                    {/* Bag handle */}
                    <path d="M60 70 C60 40 120 40 120 70" stroke="#61c39a" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    {/* Brand area */}
                    <rect x="45" y="100" width="90" height="60" rx="8" fill="#61c39a" fillOpacity="0.2" stroke="#61c39a" strokeOpacity="0.4" strokeWidth="1.5"/>
                    {/* Logo text placeholder */}
                    <rect x="55" y="115" width="70" height="8" rx="4" fill="#61c39a" fillOpacity="0.5"/>
                    <rect x="65" y="130" width="50" height="6" rx="3" fill="#61c39a" fillOpacity="0.35"/>
                    <rect x="70" y="143" width="40" height="5" rx="2.5" fill="#61c39a" fillOpacity="0.25"/>
                    {/* Shine effect */}
                    <ellipse cx="50" cy="90" rx="15" ry="8" fill="white" fillOpacity="0.05" transform="rotate(-20 50 90)"/>
                  </svg>
                  {/* Floating label */}
                  <div className="absolute top-3 right-3 bg-[#3ca779] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Personalizada
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[#61c39a] font-bold text-lg mb-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    Sacola Kraft Premium
                  </p>
                  <p className="text-[#7aaa96] text-sm">A partir de 50 unidades</p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-[#e4f4ed]">
                <div className="w-8 h-8 rounded-xl bg-[#f0faf5] flex items-center justify-center">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3ca779" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#264f41] font-bold text-xs">Qualidade Garantida</p>
                  <p className="text-[#7aaa96] text-[10px]">Impressão de alta definição</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-[#e4f4ed]">
                <div className="w-8 h-8 rounded-xl bg-[#fff8f0] flex items-center justify-center">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#264f41] font-bold text-xs">4.9 ★ Avaliação</p>
                  <p className="text-[#7aaa96] text-[10px]">+200 avaliações</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0 60 C360 20 1080 20 1440 60 L1440 60 L0 60 Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

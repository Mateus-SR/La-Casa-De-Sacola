"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#292622] via-[#1a3828] to-[#5ab58f] min-h-[92vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#61c39a] opacity-[0.07] blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full bg-[#3ca779] opacity-[0.06] blur-3xl" />
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
          <div className="text-white">

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

            <p className="text-[#f4f7f5] text-lg leading-relaxed mb-8 max-w-lg">
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
                className="inline-flex items-center justify-center gap-2 border border-[#f4f7f5]/40 text-[#f4f7f5] hover:bg-[#f4f7f5]/10 font-semibold text-base px-8 py-4 rounded-2xl transition-all"
              >
                Ver Modelos
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <img 
              src="/img/sacola.png" 
              alt="Sacolas personalizadas de diferentes tipos" 
              className="w-full max-w-md rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0 60 C360 20 1080 20 1440 60 L1440 60 L0 60 Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

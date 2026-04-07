import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#292622] via-[#1a3828] to-[#5ab58f] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#61c39a] opacity-[0.06] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#3ca779] opacity-[0.05] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(97,195,154,0.8) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#61c39a]/10 border border-[#61c39a]/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#61c39a] animate-pulse" />
          <span className="text-[#61c39a] text-sm font-medium">Pedido mínimo a partir de 200 unidades</span>
        </div>

        <h2
          className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          Pronto para transformar sua{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#61c39a] to-[#a8e6c8]">
            embalagem em marketing?
          </span>
        </h2>

        <p className="text-[#f4f7f5] text-lg mb-10 max-w-2xl mx-auto">
          Cada sacola é uma oportunidade de fortalecer sua marca. Comece agora com um pedido personalizado 
          e veja a diferença que uma embalagem de qualidade faz.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 bg-[#3ca779] hover:bg-[#2e8f65] text-white font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-[#3ca779]/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Criar minha conta e pedir
          </Link>
          <Link
            href="#contato"
            className="inline-flex items-center justify-center gap-2 border border-[#f4f7f5]/40 text-[#f4f7f5] hover:bg-[#f4f7f5]/10 font-semibold text-base px-8 py-4 rounded-2xl transition-all"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Falar com a equipe
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";

const bags = [
  {
    id: "kraft",
    name: "Sacola Kraft",
    emoji: "🛍️",
    description: "Resistente e sustentável, feita de papel kraft. Ideal para lojas de moda, presentes e produtos premium.",
    minQty: 50,
    grammages: ["80g/m²", "100g/m²", "120g/m²"],
    colors: ["1 cor", "2 cores", "4 cores (CMYK)", "Verniz UV"],
    sizes: ["P (20x25cm)", "M (25x32cm)", "G (32x40cm)", "GG (40x50cm)"],
    highlight: "Mais Vendida",
    highlightColor: "bg-[#3ca779] text-white",
    cardBg: "from-[#f0faf5] to-[#e0f5ea]",
    iconBg: "bg-[#3ca779]",
    features: ["Papel reciclável", "Alta resistência", "Acabamento premium"],
    basePrice: "R$ 1,20",
  },
  {
    id: "papel",
    name: "Sacola de Papel",
    emoji: "📦",
    description: "Versátil e elegante, com acabamento liso ou texturizado. Perfeita para embalagens sofisticadas.",
    minQty: 100,
    grammages: ["120g/m²", "150g/m²", "180g/m²"],
    colors: ["1 cor", "2 cores", "4 cores (CMYK)", "Laminação Fosca", "Laminação Brilho"],
    sizes: ["P (18x22cm)", "M (22x28cm)", "G (28x36cm)"],
    highlight: "Elegante",
    highlightColor: "bg-[#264f41] text-white",
    cardBg: "from-[#f5f0fa] to-[#ede0f5]",
    iconBg: "bg-[#264f41]",
    features: ["Acabamento laminado", "Alta qualidade", "Impressão vibrante"],
    basePrice: "R$ 1,80",
  },
  {
    id: "plastica",
    name: "Sacola Plástica",
    emoji: "🏪",
    description: "Durável e impermeável, com impressão em alta definição. Ideal para supermercados e varejo.",
    minQty: 200,
    grammages: ["0,06mm", "0,08mm", "0,10mm"],
    colors: ["1 cor", "2 cores", "4 cores"],
    sizes: ["P (25x35cm)", "M (30x40cm)", "G (35x50cm)"],
    highlight: "Econômica",
    highlightColor: "bg-[#f59e0b] text-white",
    cardBg: "from-[#fffbf0] to-[#fef3c7]",
    iconBg: "bg-[#f59e0b]",
    features: ["Impermeável", "Alta durabilidade", "Custo acessível"],
    basePrice: "R$ 0,45",
  },
  {
    id: "cordao",
    name: "Sacola com Cordão",
    emoji: "👜",
    description: "Sofisticada com alça de cordão. Transmite exclusividade e é perfeita para presentes e eventos.",
    minQty: 50,
    grammages: ["150g/m²", "180g/m²", "250g/m²"],
    colors: ["1 cor", "2 cores", "4 cores (CMYK)", "Hot Stamping", "Verniz UV"],
    sizes: ["P (20x25cm)", "M (25x32cm)", "G (32x40cm)"],
    highlight: "Premium",
    highlightColor: "bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-white",
    cardBg: "from-[#fdf8f0] to-[#faf0e0]",
    iconBg: "bg-gradient-to-br from-[#b8860b] to-[#d4a017]",
    features: ["Alça de cordão", "Acabamento luxuoso", "Ideal para presentes"],
    basePrice: "R$ 2,50",
  },
];

export default function BagCategories() {
  const [activeTab, setActiveTab] = useState("kraft");
  const activeBag = bags.find((b) => b.id === activeTab);

  return (
    <section id="categorias" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#f0faf5] text-[#3ca779] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Nossos Produtos
          </span>
          <h2
            className="text-4xl font-extrabold text-[#264f41] mb-4"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Escolha o modelo ideal
          </h2>
          <p className="text-[#6b9e8a] text-lg max-w-2xl mx-auto">
            Quatro tipos de sacolas para cada necessidade do seu negócio. Todas com personalização completa da sua arte.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {bags.map((bag) => (
            <button
              key={bag.id}
              onClick={() => setActiveTab(bag.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === bag.id
                  ? "bg-[#264f41] text-white shadow-lg shadow-[#264f41]/20"
                  : "bg-[#f0faf5] text-[#3a5c4e] hover:bg-[#e0f5ea]"
              }`}
            >
              <span>{bag.emoji}</span>
              {bag.name}
            </button>
          ))}
        </div>

        {/* Active bag detail */}
        {activeBag && (
          <div className={`rounded-3xl bg-gradient-to-br ${activeBag.cardBg} border border-[#e4f4ed] overflow-hidden`}>
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Visual */}
              <div className="p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${activeBag.iconBg} flex items-center justify-center text-2xl shadow-lg`}>
                      {activeBag.emoji}
                    </div>
                    <div>
                      <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-1 ${activeBag.highlightColor}`}>
                        {activeBag.highlight}
                      </div>
                      <h3
                        className="text-2xl font-extrabold text-[#264f41]"
                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                      >
                        {activeBag.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#4a7a66] text-base leading-relaxed mb-6">{activeBag.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeBag.features.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1.5 bg-white/70 border border-[#c8e3d5] text-[#264f41] text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#3ca779" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-[#6b9e8a] text-sm">A partir de</p>
                    <p className="text-3xl font-extrabold text-[#264f41]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                      {activeBag.basePrice}
                      <span className="text-sm font-normal text-[#6b9e8a]"> / unid.</span>
                    </p>
                    <p className="text-[#6b9e8a] text-xs mt-0.5">Mínimo: {activeBag.minQty} unidades</p>
                  </div>
                  <Link
                    href="/cadastro"
                    className="inline-flex items-center gap-2 bg-[#3ca779] hover:bg-[#2e8f65] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Pedir Agora
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right: Specs */}
              <div className="bg-white/60 backdrop-blur-sm p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-[#e4f4ed]">
                <h4 className="font-bold text-[#264f41] text-lg mb-6">Especificações</h4>

                <div className="space-y-5">
                  {/* Gramatura */}
                  <div>
                    <p className="text-xs font-semibold text-[#6b9e8a] uppercase tracking-wider mb-2">Gramatura / Espessura</p>
                    <div className="flex flex-wrap gap-2">
                      {activeBag.grammages.map((g) => (
                        <span
                          key={g}
                          className="bg-[#f0faf5] border border-[#c8e3d5] text-[#264f41] text-sm font-medium px-3 py-1 rounded-xl"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cores */}
                  <div>
                    <p className="text-xs font-semibold text-[#6b9e8a] uppercase tracking-wider mb-2">Opções de Impressão</p>
                    <div className="flex flex-wrap gap-2">
                      {activeBag.colors.map((c) => (
                        <span
                          key={c}
                          className="bg-[#f0faf5] border border-[#c8e3d5] text-[#264f41] text-sm font-medium px-3 py-1 rounded-xl"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tamanhos */}
                  <div>
                    <p className="text-xs font-semibold text-[#6b9e8a] uppercase tracking-wider mb-2">Tamanhos Disponíveis</p>
                    <div className="flex flex-wrap gap-2">
                      {activeBag.sizes.map((s) => (
                        <span
                          key={s}
                          className="bg-[#f0faf5] border border-[#c8e3d5] text-[#264f41] text-sm font-medium px-3 py-1 rounded-xl"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quantidade mínima */}
                  <div className="bg-[#f0faf5] rounded-2xl p-4 border border-[#c8e3d5]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#3ca779] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-[#264f41] text-sm">Quantidade mínima</p>
                        <p className="text-[#6b9e8a] text-sm">
                          {activeBag.minQty} unidades por pedido
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All bags grid (quick view) */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {bags.map((bag) => (
            <button
              key={bag.id}
              onClick={() => setActiveTab(bag.id)}
              className={`group p-4 rounded-2xl border-2 transition-all text-left ${
                activeTab === bag.id
                  ? "border-[#3ca779] bg-[#f0faf5]"
                  : "border-[#e4f4ed] bg-white hover:border-[#61c39a] hover:bg-[#f8fdfb]"
              }`}
            >
              <div className="text-2xl mb-2">{bag.emoji}</div>
              <p className="font-bold text-[#264f41] text-sm">{bag.name}</p>
              <p className="text-[#6b9e8a] text-xs mt-0.5">A partir de {bag.basePrice}</p>
              <p className="text-[#9ab8ae] text-xs">Mín. {bag.minQty} unid.</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

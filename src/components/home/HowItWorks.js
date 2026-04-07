import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Escolha o modelo",
    description: "Selecione entre sacola kraft, de papel, plástica ou com alça de cordão. Defina gramatura, tamanho e quantidade.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Envie sua arte",
    description: "Faça upload do arquivo da sua arte (PDF, AI, CDR ou PNG em alta resolução). Nossa equipe valida e prepara para impressão.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Aprovação e produção",
    description: "Você recebe uma prova digital para aprovação. Após confirmar, iniciamos a produção com prazo garantido.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Receba em casa",
    description: "Suas sacolas chegam embaladas e prontas para uso. Entregamos em todo o Brasil com rastreamento.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-[#f4f7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#e0f5ea] text-[#3ca779] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Processo Simples
          </span>
          <h2
            className="text-4xl font-extrabold text-[#264f41] mb-4"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Como funciona?
          </h2>
          <p className="text-[#6b9e8a] text-lg max-w-2xl mx-auto">
            Do pedido à entrega em 4 passos simples. Sem complicação, com toda a qualidade que sua marca merece.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#e0f5ea] via-[#3ca779] to-[#e0f5ea]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-[#c8e3d5] group-hover:border-[#3ca779] group-hover:bg-[#f0faf5] flex items-center justify-center text-[#3ca779] shadow-sm group-hover:shadow-md transition-all mb-5">
                  {step.icon}
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#3ca779] text-white text-xs font-bold flex items-center justify-center shadow">
                    {index + 1}
                  </div>
                </div>

                <h3 className="font-bold text-[#264f41] text-lg mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  {step.title}
                </h3>
                <p className="text-[#6b9e8a] text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 bg-[#264f41] hover:bg-[#1a3828] text-white font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Começar meu pedido
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

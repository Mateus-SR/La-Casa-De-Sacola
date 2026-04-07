export default function Benefits() {
  const benefits = [
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Qualidade Garantida",
      description: "Satisfação 100% ou devolvemos seu dinheiro. Compromisso com cada pedido.",
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: "Entrega em Todo Brasil",
      description: "Enviamos para qualquer cidade. Prazo de entrega rápido e rastreamento em tempo real.",
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      title: "100% Personalizado",
      description: "Envie sua arte ou deixe nossa equipe criar. Sua marca em cada detalhe da sacola.",
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Empresa Familiar",
      description: "Atendimento próximo e personalizado. Tratamos cada pedido com cuidado e atenção.",
    },
  ];

  return (
    <section className="py-10 bg-white border-b border-[#e4f4ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl hover:bg-[#f0faf5] transition-colors group"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#f0faf5] group-hover:bg-[#e0f5ea] flex items-center justify-center text-[#3ca779] transition-colors">
                {benefit.icon}
              </div>
              <div>
                <p className="font-bold text-[#264f41] text-sm leading-tight">{benefit.title}</p>
                <p className="text-[#6b9e8a] text-xs mt-0.5 leading-snug hidden sm:block">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

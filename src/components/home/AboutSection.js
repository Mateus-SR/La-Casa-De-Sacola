export default function AboutSection() {
  const highlights = [
    {
      value: "+5.000",
      label: "Pedidos entregues",
      icon: "📦",
    },
    {
      value: "15 anos",
      label: "De experiência",
      icon: "🏆",
    },
    {
      value: "4.9/5",
      label: "Avaliação média",
      icon: "⭐",
    },
    {
      value: "100%",
      label: "Personalizado",
      icon: "🎨",
    },
  ];

  return (
    <section className="py-20 bg-[#f8fdfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block bg-[#e0f5ea] text-[#3ca779] text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Quem somos
            </span>
            <h2
              className="text-4xl font-extrabold text-[#264f41] mb-5 leading-tight"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Uma gráfica familiar com alma de{" "}
              <span className="text-[#3ca779]">grande empresa</span>
            </h2>
            <p className="text-[#4a7a66] text-base leading-relaxed mb-5">
              A La Casa de Sacola nasceu da paixão de uma família pelo universo gráfico. 
              Há mais de 15 anos, transformamos a identidade visual de marcas em sacolas 
              que encantam clientes e fortalecem negócios.
            </p>
            <p className="text-[#4a7a66] text-base leading-relaxed mb-8">
              Cada pedido é tratado com cuidado e atenção individual. Nossa equipe acompanha 
              todo o processo — do envio da arte até a entrega — garantindo que o resultado 
              supere suas expectativas.
            </p>

            {/* Values */}
            <div className="space-y-3">
              {[
                { title: "Atendimento personalizado", desc: "Cada cliente é único. Oferecemos suporte dedicado em cada etapa." },
                { title: "Compromisso com prazo", desc: "Entregamos no prazo combinado, sempre. Sem surpresas." },
                { title: "Qualidade premium", desc: "Usamos os melhores materiais e equipamentos de impressão." },
              ].map((value) => (
                <div key={value.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#3ca779] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-[#264f41] text-sm">{value.title}: </span>
                    <span className="text-[#6b9e8a] text-sm">{value.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-3xl p-6 border border-[#e4f4ed] hover:border-[#c8e3d5] hover:shadow-md transition-all text-center group"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div
                  className="text-3xl font-extrabold text-[#264f41] mb-1"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  {item.value}
                </div>
                <div className="text-[#6b9e8a] text-sm">{item.label}</div>
              </div>
            ))}

            {/* Large card */}
            <div className="col-span-2 bg-gradient-to-br from-[#264f41] to-[#1a3828] rounded-3xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#61c39a]/20 flex items-center justify-center text-xl">
                  🌱
                </div>
                <div>
                  <p className="font-bold text-sm">Compromisso Sustentável</p>
                  <p className="text-[#7aaa96] text-xs">Responsabilidade ambiental</p>
                </div>
              </div>
              <p className="text-[#a8c4b8] text-sm leading-relaxed">
                Priorizamos materiais recicláveis e processos sustentáveis. 
                Nossas sacolas kraft são feitas de papel certificado FSC, 
                contribuindo para um futuro mais verde.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

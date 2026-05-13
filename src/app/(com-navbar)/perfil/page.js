"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/layout/Footer";
import ProductSelectionModal from "@/components/pedidos/ProductSelectionModal";
import {
  ChevronRightIcon,
  EnvelopeIcon,
  HomeModernIcon,
  PhoneIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const STORAGE_PREFIX = "lcs-perfil";

export default function PerfilPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dadosConta, setDadosConta] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [ultimoSalvamento, setUltimoSalvamento] = useState(null);

  const storageKey = useMemo(() => {
    if (!user?.id) return null;
    return `${STORAGE_PREFIX}:${user.id}`;
  }, [user?.id]);

  useEffect(() => {
    const carregarDados = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const dadosSalvos = window.localStorage.getItem(`${STORAGE_PREFIX}:${user.id}`);
      const perfilLocal = dadosSalvos ? JSON.parse(dadosSalvos) : null;

      setDadosConta({
        nome: perfilLocal?.nome || user.user_metadata?.full_name || user.email?.split("@")[0] || "Seu perfil",
        email: perfilLocal?.email || user.email || "",
        telefone: perfilLocal?.telefone || "",
      });

      setUltimoSalvamento(perfilLocal?.ultimaAtualizacao || null);
      setCarregando(false);
    };

    carregarDados();
  }, [router]);

  const handleChange = (field) => (event) => {
    setDadosConta((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSalvar = async (event) => {
    event.preventDefault();

    setSalvando(true);

    const payload = {
      nome: dadosConta.nome.trim(),
      email: dadosConta.email.trim(),
      telefone: dadosConta.telefone.trim(),
      ultimaAtualizacao: new Date().toISOString(),
    };

    if (storageKey) {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    }

    setUltimoSalvamento(payload.ultimaAtualizacao);
    toast.success("Dados da conta atualizados nesta tela.");
    setSalvando(false);
  };

  const formatoData = ultimoSalvamento
    ? new Date(ultimoSalvamento).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Ainda não salvo";

  return (
    <div className="min-h-screen bg-[#eef5ee] flex flex-col text-[#264f41] relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Modal de Seleção de Produto */}
      <ProductSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(140deg,#f6fbf6_0%,#e8f6ea_20%,#d8eddc_42%,#c7e7cd_66%,#A8DCAB_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12% 12%, rgba(168,220,171,0.52) 0, rgba(168,220,171,0) 28%), radial-gradient(circle at 88% 18%, rgba(168,220,171,0.32) 0, rgba(168,220,171,0) 24%), radial-gradient(circle at 80% 86%, rgba(199,231,205,0.62) 0, rgba(199,231,205,0) 30%)",
            }}
          />
          <div className="absolute -top-28 right-0 w-96 h-96 rounded-full bg-[#A8DCAB]/42 blur-3xl" />
          <div className="absolute top-44 -left-24 w-80 h-80 rounded-full bg-[#cde8d2]/60 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-[#9cd6a4]/20 blur-3xl" />
          <div
            className="absolute inset-x-0 top-0 h-24 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(38,79,65,0.06) 1px, transparent 1px), linear-gradient(rgba(38,79,65,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#d48a2f]">Área do cliente</p>
            <h1 className="mt-2 text-3xl lg:text-4xl font-extrabold" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Minha conta
            </h1>
            <p className="mt-3 max-w-2xl text-sm lg:text-base text-[#527060]">
              Centralize aqui seus dados, encontre seus pedidos mais rápido e acesse seus endereços sem precisar procurar nas telas.
            </p>
          </div>

          {carregando ? (
            <div className="bg-white border border-white/70 rounded-3xl p-8 sm:p-12 text-center shadow-[0_18px_50px_rgba(38,79,65,0.08)]">
              <p className="text-sm text-[#6c8478] italic">Carregando seu perfil...</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
              <section className="space-y-6">
                <div className="rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_50px_rgba(38,79,65,0.08)] p-5 sm:p-6 lg:p-8 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A8DCAB]/20 via-white/0 to-[#E6D8B5]/20 pointer-events-none" />
                  <div className="absolute -right-20 top-0 w-56 h-56 rounded-full bg-[#A8DCAB]/20 blur-3xl pointer-events-none" />
                  <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#264f41] to-[#F2A154] text-white flex items-center justify-center shadow-lg shadow-[#264f41]/15 shrink-0">
                      <UserCircleIcon className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#d48a2f]">Bem-vindo(a)</p>
                      <h2 className="mt-1 text-2xl lg:text-3xl font-extrabold leading-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                        {dadosConta.nome}
                      </h2>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white border border-[#e7eee6] p-4">
                          <div className="flex items-center gap-3">
                            <EnvelopeIcon className="w-5 h-5 text-[#d48a2f]" />
                            <div>
                              <p className="text-xs uppercase tracking-widest text-[#8c7b58] font-bold">E-mail atual</p>
                              <p className="text-sm font-semibold break-all">{dadosConta.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white border border-[#e7eee6] p-4">
                          <div className="flex items-center gap-3">
                            <PhoneIcon className="w-5 h-5 text-[#d48a2f]" />
                            <div>
                              <p className="text-xs uppercase tracking-widest text-[#8c7b58] font-bold">Telefone</p>
                              <p className="text-sm font-semibold">{dadosConta.telefone || "Não informado"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Link
                    href="/pedidos"
                    className="group rounded-[1.75rem] border border-[#dfe9d7] bg-white p-5 sm:p-6 shadow-[0_14px_30px_rgba(38,79,65,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(38,79,65,0.1)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#A8DCAB]/35 flex items-center justify-center mb-4">
                          <ShoppingBagIcon className="w-6 h-6 text-[#2e6d56]" />
                        </div>
                        <h3 className="text-xl font-extrabold">Meus pedidos</h3>
                        <p className="mt-2 text-sm text-[#61786b]">Acesse seu histórico, status e detalhes com um clique.</p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-[#b89d61] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="group text-left rounded-[1.75rem] border border-[#d48a2f] bg-white p-5 sm:p-6 shadow-[0_14px_30px_rgba(38,79,65,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(38,79,65,0.1)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#d48a2f]/20 flex items-center justify-center mb-4">
                          <StarIcon className="w-6 h-6 text-[#d48a2f]" />
                        </div>
                        <h3 className="text-xl font-extrabold">Avaliar Produto</h3>
                        <p className="mt-2 text-sm text-[#61786b]">Conte-nos o que achou das nossas sacolas.</p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-[#b89d61] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <Link
                    href="/enderecos"
                    className="group rounded-[1.75rem] border border-[#e6d8b5] bg-white p-5 sm:p-6 shadow-[0_14px_30px_rgba(38,79,65,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(38,79,65,0.1)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#E6D8B5]/45 flex items-center justify-center mb-4">
                          <HomeModernIcon className="w-6 h-6 text-[#8f6a19]" />
                        </div>
                        <h3 className="text-xl font-extrabold">Meus endereços</h3>
                        <p className="mt-2 text-sm text-[#61786b]">Veja e gerencie seus endereços favoritos de entrega.</p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-[#b89d61] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </section>

              <aside className="space-y-6" id="dados-conta">
                <div className="rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_50px_rgba(38,79,65,0.08)] p-5 sm:p-6 lg:p-8 lg:sticky lg:top-24 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#A8DCAB] via-[#3f765f] to-[#F2A154]" />
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#d48a2f]">Dados da conta</p>
                      <h3 className="mt-1 text-2xl font-extrabold">Editar informações</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-[#A8DCAB]/35 flex items-center justify-center text-[#2e6d56]">
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <form onSubmit={handleSalvar} className="space-y-4">
                    <label className="block">
                      <span className="block text-xs font-black uppercase tracking-widest text-[#7b867b] mb-2">Nome</span>
                      <input
                        type="text"
                        value={dadosConta.nome}
                        onChange={handleChange("nome")}
                        className="w-full rounded-2xl border border-[#ded7c7] bg-[#fbfaf6] px-4 py-3 outline-none focus:border-[#A8DCAB] focus:ring-4 focus:ring-[#A8DCAB]/20 transition"
                        placeholder="Seu nome"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-xs font-black uppercase tracking-widest text-[#7b867b] mb-2">E-mail</span>
                      <input
                        type="email"
                        value={dadosConta.email}
                        onChange={handleChange("email")}
                        className="w-full rounded-2xl border border-[#ded7c7] bg-[#fbfaf6] px-4 py-3 outline-none focus:border-[#F2A154] focus:ring-4 focus:ring-[#F2A154]/15 transition"
                        placeholder="voce@exemplo.com"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-xs font-black uppercase tracking-widest text-[#7b867b] mb-2">Telefone</span>
                      <input
                        type="tel"
                        value={dadosConta.telefone}
                        onChange={handleChange("telefone")}
                        className="w-full rounded-2xl border border-[#ded7c7] bg-[#fbfaf6] px-4 py-3 outline-none focus:border-[#A8DCAB] focus:ring-4 focus:ring-[#A8DCAB]/20 transition"
                        placeholder="(11) 99999-9999"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={salvando}
                      className="w-full rounded-2xl bg-[#3ca779] px-4 py-3.5 font-extrabold text-white shadow-lg shadow-[#3ca779]/20 hover:bg-[#2e8f65] hover:-translate-y-0.5 transition disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {salvando ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </form>

                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

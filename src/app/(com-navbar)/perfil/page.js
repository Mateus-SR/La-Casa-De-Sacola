"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/layout/Footer";
import ProductSelectionModal from "@/components/pedidos/ProductSelectionModal";
import UserReviewsList from "@/components/pedidos/UserReviewsList";
import {
  ChevronRightIcon,
  EnvelopeIcon,
  HomeModernIcon,
  PhoneIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const STORAGE_PREFIX = "lcs-perfil";

export default function PerfilPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dados"); // "dados" ou "avaliacoes"
  const [dadosConta, setDadosConta] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [erroTelefone, setErroTelefone] = useState("");

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
      const { data: usuarioBanco } = await supabase
        .from("usuario")
        .select("nome_usu")
        .eq("uuid_usu", user.id)
        .maybeSingle();

      setDadosConta({
        nome:
          usuarioBanco?.nome_usu ||
          user.user_metadata?.full_name ||
          perfilLocal?.nome ||
          user.email?.split("@")[0] ||
          "Seu perfil",
        email: perfilLocal?.email || user.email || "",
        telefone: perfilLocal?.telefone || "",
      });

      setCarregando(false);
    };

    carregarDados();
  }, [router]);

  const formatarTelefone = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    
    if (apenasNumeros.length === 0) return "";
    if (apenasNumeros.length <= 2) return `(${apenasNumeros}`;
    if (apenasNumeros.length <= 6) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    if (apenasNumeros.length <= 10) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
    
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
  };

  const handleChange = (field) => (event) => {
    let valor = event.target.value;
    
    if (field === "telefone") {
      valor = formatarTelefone(valor);
      setErroTelefone("");
    }
    
    setDadosConta((current) => ({ ...current, [field]: valor }));
  };

  const validateTelefone = (telefone) => {
    if (!telefone.trim()) return { valid: true };
    const telefoneLimpo = telefone.replace(/\D/g, "");
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      return { valid: false, message: "Telefone deve ter 10 ou 11 dígitos." };
    }
    return { valid: true };
  };

  const handleSalvar = async (event) => {
    event.preventDefault();

    const validacaoTelefone = validateTelefone(dadosConta.telefone);
    if (!validacaoTelefone.valid) {
      setErroTelefone(validacaoTelefone.message);
      return;
    }

    setSalvando(true);

    const nomeLimpo = dadosConta.nome.trim();
    const telefoneLimpo = dadosConta.telefone.trim();

    const payload = {
      nome: nomeLimpo,
      email: dadosConta.email.trim(),
      telefone: telefoneLimpo,
      ultimaAtualizacao: new Date().toISOString(),
    };

    const [authResult, bancoResult] = await Promise.all([
      supabase.auth.updateUser({
        data: {
          full_name: nomeLimpo,
        },
      }),
      supabase
        .from("usuario")
        .upsert(
          {
            uuid_usu: user?.id,
            nome_usu: nomeLimpo,
            email_usu: payload.email,
          },
          { onConflict: "uuid_usu" }
        ),
    ]);

    if (authResult.error || bancoResult.error) {
      console.error("Erro ao salvar perfil:", {
        authError: authResult.error,
        bancoError: bancoResult.error,
      });
      toast.error("Não foi possível salvar os dados no sistema.");
      setSalvando(false);
      return;
    }

    if (storageKey) {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    }

    toast.success("Dados da conta atualizados.");
    setSalvando(false);
  };

  return (
    <div className="min-h-screen bg-[#eef5ee] flex flex-col text-[#264f41] relative overflow-hidden">
      <Toaster position="top-right" />
      
      <ProductSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(140deg,#f6fbf6_0%,#e8f6ea_20%,#d8eddc_42%,#c7e7cd_66%,#A8DCAB_100%)]" />
          <div className="absolute -top-28 right-0 w-96 h-96 rounded-full bg-[#A8DCAB]/42 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-[#9cd6a4]/20 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#d48a2f]">Área do cliente</p>
            <h1 className="mt-2 text-3xl lg:text-4xl font-extrabold" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Minha conta
            </h1>
          </div>

          {carregando ? (
            <div className="bg-white border border-white/70 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
              <p className="text-sm text-[#6c8478] italic">Carregando seu perfil...</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
              <section className="space-y-6">
                {/* Profile Summary Card */}
                <div className="rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_50px_rgba(38,79,65,0.08)] p-5 sm:p-6 lg:p-8 overflow-hidden relative">
                  <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#264f41] to-[#F2A154] text-white flex items-center justify-center shadow-lg shrink-0">
                      <UserCircleIcon className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#d48a2f]">Bem-vindo(a)</p>
                      <h2 className="mt-1 text-2xl lg:text-3xl font-extrabold leading-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                        {dadosConta.nome}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Link href="/pedidos" className="group rounded-[1.75rem] border border-[#dfe9d7] bg-white p-5 shadow-sm hover:-translate-y-1 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#A8DCAB]/35 flex items-center justify-center mb-4 text-[#2e6d56]">
                          <ShoppingBagIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-extrabold">Meus pedidos</h3>
                        <p className="mt-2 text-sm text-[#61786b]">Acesse seu histórico e detalhes.</p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-[#b89d61]" />
                    </div>
                  </Link>

                  <button onClick={() => setIsModalOpen(true)} className="group text-left rounded-[1.75rem] border border-[#d48a2f] bg-white p-5 shadow-sm hover:-translate-y-1 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#d48a2f]/20 flex items-center justify-center mb-4 text-[#d48a2f]">
                          <StarIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-extrabold">Avaliar Produto</h3>
                        <p className="mt-2 text-sm text-[#61786b]">Conte o que achou das sacolas.</p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-[#b89d61]" />
                    </div>
                  </button>
                </div>

                {/* User Reviews Section */}
                <div className="bg-white border border-white/70 rounded-[2rem] p-6 lg:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#264f41]" />
                    <h3 className="text-2xl font-extrabold" style={{ fontFamily: "'Quicksand', sans-serif" }}>Minhas Avaliações</h3>
                  </div>
                  <UserReviewsList />
                </div>
              </section>

              {/* Sidebar Form */}
              <aside className="space-y-6">
                <div className="rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_50px_rgba(38,79,65,0.08)] p-6 lg:p-8 overflow-hidden relative">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <h3 className="text-2xl font-extrabold">Editar perfil</h3>
                    <div className="w-11 h-11 rounded-2xl bg-[#A8DCAB]/35 flex items-center justify-center text-[#2e6d56]">
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <form onSubmit={handleSalvar} className="space-y-4">
                    <label className="block">
                      <span className="block text-xs font-black uppercase tracking-widest text-[#7b867b] mb-2">Nome</span>
                      <input type="text" value={dadosConta.nome} onChange={handleChange("nome")} className="w-full rounded-2xl border border-[#ded7c7] bg-[#fbfaf6] px-4 py-3 outline-none focus:border-[#A8DCAB] transition" />
                    </label>
                    <label className="block">
                      <span className="block text-xs font-black uppercase tracking-widest text-[#7b867b] mb-2">E-mail</span>
                      <input type="email" value={dadosConta.email} readOnly className="w-full rounded-2xl border border-[#ded7c7] bg-gray-50 px-4 py-3 outline-none opacity-70" />
                    </label>
                    <label className="block">
                      <span className="block text-xs font-black uppercase tracking-widest text-[#7b867b] mb-2">Telefone</span>
                      <input type="tel" value={dadosConta.telefone} onChange={handleChange("telefone")} className="w-full rounded-2xl border border-[#ded7c7] bg-[#fbfaf6] px-4 py-3 outline-none focus:border-[#A8DCAB] transition" placeholder="(11) 99999-9999" />
                      {erroTelefone && <p className="mt-1 text-xs text-red-500 font-bold">{erroTelefone}</p>}
                    </label>
                    <button type="submit" disabled={salvando} className="w-full rounded-2xl bg-[#3ca779] px-4 py-3.5 font-extrabold text-white shadow-lg hover:bg-[#2e8f65] transition disabled:opacity-60">
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

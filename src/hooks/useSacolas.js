import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

export function useSacolas({ obterCoresSelecionadasDoMaterial }) {
  const [sacolas, setSacolas] = useState([
    {
      id_sac: 1,
      nome_sac: "Carregando",
      tipo_sac: "Carregando",
      quantidademin_sac: 0,
      precounitario_sac: 0,
      tamanho_sac: "Carregando",
      peso_sac: "Carregando",
      status_sac: "Carregando",
    },
  ]);

  const [novaSacola, setNovaSacola] = useState({
    nome_sac: "",
    tipo_sac: "",
    quantidademin_sac: "",
    precounitario_sac: "",
    tamanho_sac: "",
    peso_sac: "",
    status_sac: "",
  });

  const [modalAberto, setModalAberto] = useState(false);

  const [sacolaEditandoId, setSacolaEditandoId] = useState(null);

  const [mostrarSacolasAtivas, setMostrarSacolasAtivas] = useState(true);
  const [mostrarSacolasOcultas, setMostrarSacolasOcultas] = useState(false);

  const obterCoresDisponiveisParaNovaSacola = () => {
    if (!novaSacola.tipo_sac) {
      return [];
    }

    return obterCoresSelecionadasDoMaterial(novaSacola.tipo_sac);
  };

  // Criamos a função que vai até a nuvem
  const carregarSacolas = async () => {
    // Pedimos tudo (*) de uma tabela específica
    const { data, error } = await supabase.from("sacola").select("*");

    if (error) {
      console.error("Erro ao buscar as sacolas:", error);
      return; // Se der erro, paramos por aqui
    }

    if (data) {
      // Se a resposta chegou, colocamos os dados na nossa lista principal!
      setSacolas(data);
    }
  };

  const handleAbrirEdicao = (sacolaEscolhida) => {
    setSacolaEditandoId(sacolaEscolhida.id_sac);
    setNovaSacola(sacolaEscolhida);
    setModalAberto(true);
  };

  const handleAbrirNovaSacola = () => {
    setSacolaEditandoId(null);

    setNovaSacola({
      nome_sac: "",
      tipo_sac: "",
      quantidademin_sac: "",
      precounitario_sac: "",
      tamanho_sac: "",
      peso_sac: "",
      status_sac: "",
    });

    setModalAberto(true);
  };

  const handleSalvarSacola = async (e) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário

    // 1. Preparamos a sacola final com um ID único provisório
    const sacolaPronta = {
      tipo_sac: novaSacola.tipo_sac,
      quantidademin_sac: parseInt(novaSacola.quantidademin_sac),
      precounitario_sac: parseFloat(novaSacola.precounitario_sac),
      tamanho_sac: novaSacola.tamanho_sac,
      peso_sac: novaSacola.peso_sac,
      nome_sac: novaSacola.nome_sac,
      status_sac: novaSacola.status_sac,
    };

    // 2. A Mágica do React: atualizamos a lista principal
    // Os "..." copiam as sacolas antigas, e colocamos a "sacolaPronta" no final
    if (sacolaEditandoId) {
      // ---------------- MODO EDIÇÃO ----------------
      const { data, error } = await supabase
        .from("sacola")
        .update({
          tipo_sac: novaSacola.tipo_sac,
          quantidademin_sac: parseInt(novaSacola.quantidademin_sac),
          precounitario_sac: parseFloat(novaSacola.precounitario_sac),
          tamanho_sac: novaSacola.tamanho_sac,
          peso_sac: novaSacola.peso_sac,
          nome_sac: novaSacola.nome_sac,
          status_sac: novaSacola.status_sac,
        })
        .eq("id_sac", sacolaEditandoId)
        .select();

      if (error) {
        console.error("Erro ao editar:", error);
      } else if (data) {
        // 👈 AQUI ESTÁ A MÁGICA: se data[0] for undefined, usamos o { ...sacola, ...novaSacola }
        const sacolasAtualizadas = sacolas.map((sacola) =>
          sacola.id_sac === sacolaEditandoId
            ? data[0] || { ...sacola, ...novaSacola }
            : sacola
        );
        setSacolas(sacolasAtualizadas);
        // Passo 3: Limpa o formulário de volta ao estado inicial
        setNovaSacola({
          nome_sac: "",
          tipo_sac: "",
          quantidademin_sac: "",
          precounitario_sac: "",
          tamanho_sac: "",
          peso_sac: "",
          status_sac: "",
        });

        // Passo 4: Fecha a janela do Radix
        setModalAberto(false);
        setSacolaEditandoId(null);
        toast.success("Sacola atualizada.");
      }
    } else {
      // ---------------- MODO CRIAÇÃO ----------------
      const { data, error } = await supabase
        .from("sacola")
        .insert([sacolaPronta])
        .select();

        if (error) {
        console.error("Erro ao criar:", error);
      } else if (data && data[0]) {
        // 👈 Protegemos aqui também para evitar inserir undefined
        setSacolas([...sacolas, data[0]]);
        toast.success("Sacola cadastrada.");
      }

      setNovaSacola({
        nome_sac: "",
        tipo_sac: "",
        quantidademin_sac: "",
        precounitario_sac: "",
        tamanho_sac: "",
        peso_sac: "",
        status_sac: "",
      });

      // Passo 4: Fecha a janela do Radix
      setModalAberto(false);
      setSacolaEditandoId(null);
    }
  };

  const handleOcultarSacola = async () => {
    const { error } = await supabase
      .from("sacola")
      .update({ status_sac: "Oculto" })
      .eq("id_sac", sacolaEditandoId);

    if (error) {
      console.error("Erro ao ocultar sacola:", error);
      toast.error("Não foi possível excluir a Sacola.");
    } else {
      setSacolas((prevSacolas) =>
        prevSacolas.map((sacola) =>
          sacola.id_sac === sacolaEditandoId
            ? { ...sacola, status_sac: "Oculto" }
            : sacola
        )
      );
      setModalAberto(false);
      setSacolaEditandoId(null);
      toast.success("Sacola Excluída.");
    }
  };

  const sacolasFiltradas = sacolas.filter((sacola) => {
    if (!sacola) return false;
    if (sacola.status_sac === "Oculto") {
      return mostrarSacolasOcultas;
    }
    return mostrarSacolasAtivas;
  });
  return {
    sacolas,
    novaSacola,
    setNovaSacola,
    modalAberto,
    setModalAberto,
    sacolaEditandoId,
    mostrarSacolasAtivas,
    setMostrarSacolasAtivas,
    mostrarSacolasOcultas,
    setMostrarSacolasOcultas,
    sacolasFiltradas,
    carregarSacolas,
    handleSalvarSacola,
    handleOcultarSacola,
    handleAbrirEdicao,
    handleAbrirNovaSacola,
    obterCoresDisponiveisParaNovaSacola,
  };
}

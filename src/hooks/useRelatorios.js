import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRelatorios() {
  const [coresData, setCoresData] = useState([]);
  const [tiposData, setTiposData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [faturamentoMensal, setFaturamentoMensal] = useState([]);
  const [totais, setTotais] = useState({
    pedidos: 0,
    receita: 0,
    sacolas: 0,
    clientes: 0,
  });
  const [loading, setLoading] = useState(true);

  const carregarRelatorios = async () => {
    setLoading(true);

    const [
      { data: itens, error: errItens },
      { data: pedidos, error: errPedidos },
      { data: clientes, error: errClientes },
    ] = await Promise.all([
      supabase
        .from("itens_pedido")
        .select(
          "quantidade, sacola (nome_sac, tipo_sac), cores (nome_cor, hex_cor), pedido!inner(status_ped, data_criacao)",
        ),
      supabase.from("pedido").select("status_ped, valor_total, data_criacao"),
      supabase
        .from("usuario")
        .select("uuid_usu", { count: "exact", head: true }),
    ]);

    if (errItens || errPedidos) {
      setLoading(false);
      return;
    }

    const coresMap = {};
    const tiposMap = {};
    const statusMap = {};
    const faturamentoMap = {};
    let totalSacolas = 0;
    let totalReceita = 0;

    if (itens) {
      const itensFiltrados = itens.filter(
        (item) =>
          item.pedido &&
          item.pedido.status_ped !== "No Carrinho" &&
          item.pedido.status_ped !== "Cancelado",
      );

      itensFiltrados.forEach((item) => {
        const qtd = item.quantidade || 0;
        totalSacolas += qtd;

        const cor = item.cores?.nome_cor || "Sem cor";
        const hex = item.cores?.hex_cor || "#cccccc";
        if (!coresMap[cor]) coresMap[cor] = { nome: cor, hex, quantidade: 0 };
        coresMap[cor].quantidade += qtd;

        const tipo = item.sacola?.tipo_sac || "Indefinido";
        const nomeSac = item.sacola?.nome_sac || tipo;
        if (!tiposMap[tipo])
          tiposMap[tipo] = { tipo, nome: nomeSac, quantidade: 0 };
        tiposMap[tipo].quantidade += qtd;
      });
    }

    if (pedidos) {
      totalReceita = pedidos.reduce(
        (sum, p) => sum + (Number(p.valor_total) || 0),
        0,
      );

      pedidos.forEach((p) => {
        const status = p.status_ped || "Indefinido";
        if (!statusMap[status]) statusMap[status] = { status, quantidade: 0 };
        statusMap[status].quantidade += 1;

        if (p.data_criacao) {
          const mes = p.data_criacao.substring(0, 7);
          if (!faturamentoMap[mes])
            faturamentoMap[mes] = { mes, receita: 0, pedidos: 0 };
          faturamentoMap[mes].receita += Number(p.valor_total) || 0;
          faturamentoMap[mes].pedidos += 1;
        }
      });
    }

    setCoresData(
      Object.values(coresMap).sort((a, b) => b.quantidade - a.quantidade),
    );
    setTiposData(
      Object.values(tiposMap).sort((a, b) => b.quantidade - a.quantidade),
    );
    setStatusData(
      Object.values(statusMap).sort((a, b) => b.quantidade - a.quantidade),
    );
    setFaturamentoMensal(
      Object.values(faturamentoMap).sort((a, b) => a.mes.localeCompare(b.mes)),
    );
    setTotais({
      pedidos: pedidos?.length || 0,
      receita: totalReceita,
      sacolas: totalSacolas,
      clientes: clientes?.count || 0,
    });
    setLoading(false);
  };

  useEffect(() => {
    carregarRelatorios();
  }, []);

  return {
    coresData,
    tiposData,
    statusData,
    faturamentoMensal,
    totais,
    loading,
    carregarRelatorios,
  };
}

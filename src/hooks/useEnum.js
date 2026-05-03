import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { salvarCoresNoBanco } from "@/components/admin/coresMaterialLogic";

export function useEnum({ coresSelecionadasPorMaterial, setCoresSelecionadasPorMaterial, toastPainel }) {
  const [opcoesMaterial, setOpcoesMaterial] = useState([]);
  const [opcoesTamanho, setOpcoesTamanho] = useState([]);

  const [modalEnumAberto, setModalEnumAberto] = useState(false);
  const [enumAtual, setEnumAtual] = useState("");
  const [novoValorEnum, setNovoValorEnum] = useState("");
  const [enumEditandoId, setEnumEditandoId] = useState(null)

  const carregarFiltros = async () => {
    // 1. Busca os Materiais
    const { data: tipo, error: erroMat } = await supabase
      .from('tipo')
      .select('id_tip, tipo_tip')
      .neq('excluido', true);
    
    if (tipo) setOpcoesMaterial(tipo);

    // 2. Busca os Tamanhos
    const { data: tamanho } = await supabase
      .from('tamanho')
      .select('id_tam, tamanho_tam')
      .neq('excluido', true);
    
    if (tamanho) setOpcoesTamanho(tamanho);

    // 3. NOVA LÓGICA: Busca os vínculos de cores já salvos no banco
    const { data: relacoes, error: erroRel } = await supabase
      .from('tipo_cor')
      .select(`
        id_tip,
        id_cor,
        tipo:id_tip ( tipo_tip ),
        cores:id_cor ( nome_cor, hex_cor )
      `)
      .eq('cores.excluido', false)

    if (relacoes && !erroRel) {
      const mapeamentoCores = {};

      relacoes.forEach(rel => {
        // Normaliza o nome do material para usar como chave (ex: "Plástico" -> "plástico")
        const chaveMaterial = rel.tipo.tipo_tip.trim().toLowerCase();
        
        if (!mapeamentoCores[chaveMaterial]) {
          mapeamentoCores[chaveMaterial] = [];
        }

        if (!rel.cores) return; // IGNORA COR INVÁLIDA
        // Adiciona a cor ao array desse material no estado
        mapeamentoCores[chaveMaterial].push({
          id: rel.id_cor,
          nome: rel.cores.nome_cor,
          hex: rel.cores.hex_cor
        });
      });

      // Atualiza o estado global com o que veio do banco
      if (setCoresSelecionadasPorMaterial) {
        setCoresSelecionadasPorMaterial(mapeamentoCores);
      }
    }
  };

  const handleAdicionarValorEnum = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 

    if (!novoValorEnum.trim()) return; 

    const tabelaAlvo = enumAtual === 'tipo' ? 'tipo' : 'tamanho';
    const nomeColuna = enumAtual === 'tipo' ? 'tipo_tip' : 'tamanho_tam';
    const listaCerta = enumAtual === 'tipo' ? opcoesMaterial : opcoesTamanho;

    const jaExiste = listaCerta.some(item => 
      item[nomeColuna].toLowerCase() === novoValorEnum.trim().toLowerCase()
    );
  
    if (jaExiste) {
      toastPainel(
        "error",
        `Esse ${enumAtual === 'tipo' ? 'material' : 'tamanho'} já existe`,
        "Escolha outro nome para continuar o cadastro."
      );
      return; 
    }

    const { data, error } = await supabase
      .from(tabelaAlvo)
      .insert([{ [nomeColuna]: novoValorEnum.trim() }])
      .select();

    if (error) {
      console.error("Erro ao adicionar na tabela:", error);
      toastPainel(
        "error",
        "Não foi possível cadastrar o material",
        "Tente novamente em instantes."
      );
    } else {
      if (enumAtual === 'tipo' && data && data.length > 0) {
        const idNovoMaterial = data[0].id_tip; 
        const materialChave = novoValorEnum.trim().toLowerCase();
        const coresParaSalvar = coresSelecionadasPorMaterial[materialChave] || [];

        if (coresParaSalvar.length > 0) {
          const resultadoCores = await salvarCoresNoBanco(idNovoMaterial, coresParaSalvar);

          if (!resultadoCores.ok) {
            return;
          }
        }
      }
      
      await carregarFiltros(); 
      setModalEnumAberto(false);
      setNovoValorEnum("");

      toastPainel(
        "success",
        `${enumAtual === 'tipo' ? 'Material' : 'Tamanho'} cadastrado`,
        `O novo ${enumAtual === 'tipo' ? 'material' : 'tamanho'} foi salvo com sucesso.`
      );
    }
  };

  const handleOcultarEnum = async (idParaOcultar) => {
    const tabelaAlvo = enumAtual === 'tipo' ? 'tipo' : 'tamanho';
    const colunaId = enumAtual === 'tipo' ? 'id_tip' : 'id_tam';
  
    const { error } = await supabase
      .from(tabelaAlvo)
      .update({ excluido: true })
      .eq(colunaId, idParaOcultar);
  
    if (error) {
      console.error("Erro ao ocultar:", error);
    } else {
      await carregarFiltros();
      setModalEnumAberto(false);
      setEnumEditandoId(null);
      setNovoValorEnum("");    
    }
  };
  
  const handleEditarValorEnum = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!novoValorEnum.trim() || !enumEditandoId) return;

    const tabelaAlvo = enumAtual === 'tipo' ? 'tipo' : 'tamanho';
    const nomeColuna = enumAtual === 'tipo' ? 'tipo_tip' : 'tamanho_tam';
    const idColuna = enumAtual === 'tipo' ? 'id_tip' : 'id_tam';

    const { error } = await supabase
      .from(tabelaAlvo)
      .update({ [nomeColuna]: novoValorEnum.trim() })
      .eq(idColuna, enumEditandoId);

    if (error) {
      console.error("Erro ao editar na tabela:", error);
      toastPainel(
        "error",
        "Não foi possível atualizar",
        "O item não pôde ser salvo no momento."
      );
    } else {
      if (enumAtual === 'tipo') {
        const materialChave = novoValorEnum.trim().toLowerCase();
        const coresParaSalvar = coresSelecionadasPorMaterial[materialChave] || [];
        const resultadoCores = await salvarCoresNoBanco(enumEditandoId, coresParaSalvar);

        if (!resultadoCores.ok) {
          return;
        }
      }

      await carregarFiltros();
      setModalEnumAberto(false);
      setNovoValorEnum("");
      setEnumEditandoId(null);

      toastPainel(
        "success",
        `${enumAtual === 'tipo' ? 'Material' : 'Tamanho'} atualizado`,
        `As alterações em ${enumAtual === 'tipo' ? 'material' : 'tamanho'} foram salvas com sucesso.`
      );
    }
  };

  return {
    opcoesMaterial,
    setOpcoesMaterial,
    opcoesTamanho,
    setOpcoesTamanho,
    modalEnumAberto,
    setModalEnumAberto,
    enumAtual,
    setEnumAtual,
    novoValorEnum,
    setNovoValorEnum,
    enumEditandoId,
    setEnumEditandoId,
    carregarFiltros,
    handleAdicionarValorEnum,
    handleOcultarEnum,
    handleEditarValorEnum
  };
}
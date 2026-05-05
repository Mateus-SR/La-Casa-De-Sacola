//Lógica Pura
import { supabase } from '../../lib/supabaseClient'; // Ajuste o caminho se necessário

// Lista de cores principais padrão
export const CORES_PRINCIPAIS_PADRAO = [
  { nome: "Preto", hex: "#000000" },
  { nome: "Branco", hex: "#ffffff" },
  { nome: "Vermelho", hex: "#dc2626" },
  { nome: "Azul", hex: "#2563eb" },
  { nome: "Verde", hex: "#16a34a" },
  { nome: "Amarelo", hex: "#eab308" },
];

// Garantir consistência nas chaves do objeto
export function normalizarMaterial(valor) {
  return (valor || "").trim().toLowerCase();
}


// Obtém as cores para um material específico, usando as cores principais como fallback
export function obterCoresDoMaterial({ nomeMaterial, coresPorMaterial, coresPrincipais }) {
  const chave = normalizarMaterial(nomeMaterial);
  const cadastradas = coresPorMaterial[chave] || [];
  return cadastradas.length > 0 ? cadastradas : coresPrincipais;
}

// Adiciona uma nova cor, validando se já existe na lista principal
export function adicionarCorLocal({
  nomeMaterial,
  novaCorNome,
  novaCorHex,
  coresPrincipais,
  coresPorMaterial,
}) {
  const materialNormalizado = normalizarMaterial(nomeMaterial);
  const nomeNormalizado = (novaCorNome || "").trim();

  if (!nomeNormalizado) {
    return { ok: false, mensagem: "Informe o nome da cor." };
  }

  if (!materialNormalizado) {
    const existeNaPrincipal = coresPrincipais.some(
      (cor) =>
        cor.nome.toLowerCase() === nomeNormalizado.toLowerCase() ||
        cor.hex.toLowerCase() === novaCorHex.toLowerCase()
    );

    if (existeNaPrincipal) {
      return { ok: false, mensagem: "Essa cor ja existe na lista principal." };
    }

    return {
      ok: true,
      tipo: "principal",
      coresPrincipaisAtualizadas: [...coresPrincipais, { nome: nomeNormalizado, hex: novaCorHex }],
    };
  }

  const baseAtual = coresPorMaterial[materialNormalizado] || coresPrincipais;
  const existeNoMaterial = baseAtual.some(
    (cor) =>
      cor.nome.toLowerCase() === nomeNormalizado.toLowerCase() ||
      cor.hex.toLowerCase() === novaCorHex.toLowerCase()
  );

  if (existeNoMaterial) {
    return { ok: false, mensagem: "Essa cor ja existe para este material." };
  }

  return {
    ok: true,
    tipo: "material",
    materialNormalizado,
    coresDoMaterialAtualizadas: [...baseAtual, { nome: nomeNormalizado, hex: novaCorHex }],
  };
}


// Remove uma cor e também remove de todas as seleções salvas
export function removerCorLocal({
  nomeMaterial,
  cor,
  coresPrincipais,
  coresPorMaterial,
  coresSelecionadasPorMaterial,
}) {
  const materialNormalizado = normalizarMaterial(nomeMaterial);
  const coresParaFiltrar = (lista) =>
    lista.filter((item) => !(item.nome === cor.nome && item.hex === cor.hex));

  const removerDasSelecoes = (selecoes) => {
    const selecoesAtualizadas = {};

    Object.entries(selecoes).forEach(([chave, lista]) => {
      selecoesAtualizadas[chave] = coresParaFiltrar(lista);
    });

    return selecoesAtualizadas;
  };

  if (!materialNormalizado) {
    const coresPrincipaisAtualizadas = coresParaFiltrar(coresPrincipais);

    return {
      ok: true,
      tipo: "principal",
      coresPrincipaisAtualizadas,
      coresSelecionadasPorMaterialAtualizadas: removerDasSelecoes(coresSelecionadasPorMaterial),
    };
  }

  const temListaCustomizada = Array.isArray(coresPorMaterial[materialNormalizado]);
  const coresDoMaterialAtuais = temListaCustomizada ? coresPorMaterial[materialNormalizado] : [];

  // Se o material ainda usa fallback das cores principais, a exclusao deve afetar a lista principal.
  if (!temListaCustomizada) {
    return {
      ok: true,
      tipo: "principal",
      coresPrincipaisAtualizadas: coresParaFiltrar(coresPrincipais),
      coresSelecionadasPorMaterialAtualizadas: removerDasSelecoes(coresSelecionadasPorMaterial),
    };
  }

  return {
    ok: true,
    tipo: "material",
    materialNormalizado,
    coresDoMaterialAtualizadas: coresParaFiltrar(coresDoMaterialAtuais),
    coresSelecionadasPorMaterialAtualizadas: removerDasSelecoes(coresSelecionadasPorMaterial),
  };
}

// Adicione esta nova função para salvar as relações no banco:
export async function salvarCoresNoBanco(idTipoMaterial, arrayDeCoresSelecionadas) {
  try {
    // 1. Limpa as cores antigas vinculadas a este material
    const { error: errorDelete } = await supabase
      .from('tipo_cor')
      .delete()
      .eq('id_tip', idTipoMaterial);

    if (errorDelete) throw errorDelete;

    // 2. Se houver cores selecionadas, insere as novas
    if (arrayDeCoresSelecionadas.length > 0) {
      const novasRelacoes = arrayDeCoresSelecionadas.map((cor) => ({
        id_tip: idTipoMaterial,
        id_cor: cor.id // Importante: seu estado local precisa armazenar o id_cor que vem do banco
      }));

      const { error: errorInsert } = await supabase
        .from('tipo_cor')
        .insert(novasRelacoes);
        
      if (errorInsert) throw errorInsert;
    }

    return { ok: true };
   }catch (error) {
  console.error("Erro ao persistir cores:", error.message || JSON.stringify(error));
  return { ok: false, error: error };
}
}
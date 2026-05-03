import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { salvarCorNoBanco, excluirCorNoBanco } from "@/services/coresService";
import { adicionarCorLocal, removerCorLocal } from "@/components/admin/coresMaterialLogic";

// Valor padrão vazio evita o crash se nada for passado
export function useCoresMaterial({ carregarFiltros = () => {} } = {}) {

const [coresPorMaterial, setCoresPorMaterial] = useState({});
      const [coresPrincipais, setCoresPrincipais] = useState([]);
      const [coresSelecionadasPorMaterial, setCoresSelecionadasPorMaterial] = useState({});
      const [novaCorNome, setNovaCorNome] = useState("");
      const [novaCorHex, setNovaCorHex] = useState("#000000");
      const [modalEditarCoresAberto, setModalEditarCoresAberto] = useState(false);



    const carregarCores = async () => {
        const { data, error } = await supabase
          .from('cores')
          .select('*')
          .or('excluido.is.null,excluido.eq.false');

        if (error) {
          console.error("Erro ao buscar cores:", error);
          return;
        }

        if (data) {
          const coresFormatadas = data.map((c) => ({
            nome: c.nome_cor,
            hex: c.hex_cor,
            id: c.id_cor
          }));

          setCoresPrincipais(coresFormatadas);
        }
      };

    const obterChaveSelecaoCor = (nomeMaterial) => {
        const chave = (nomeMaterial || "").trim().toLowerCase();
        return chave || "__principal__";
      };

    const obterCoresSelecionadasDoMaterial = (nomeMaterial) => {
        const chave = obterChaveSelecaoCor(nomeMaterial);
        return coresSelecionadasPorMaterial[chave] || [];
      };


      
            const handleToggleSelecaoCor = (nomeMaterial, cor) => {
              const chave = obterChaveSelecaoCor(nomeMaterial);
              const coresAtuais = coresSelecionadasPorMaterial[chave] || [];
              const existe = coresAtuais.some(
                (selecionada) => selecionada.id === cor.id
              );
      
              setCoresSelecionadasPorMaterial((anterior) => ({
                ...anterior,
                [chave]: existe
                  ? coresAtuais.filter(
                      (selecionada) => !(selecionada.nome === cor.nome && selecionada.hex === cor.hex)
                    )
                  : [...coresAtuais, cor],
              }));
            };
      
            const handleExcluirCorLocal = async (nomeMaterial, cor) => {
              //  EXCLUI NO BANCO
              if (cor.id) {
                const sucesso = await excluirCorNoBanco(cor.id);
      
              if (!sucesso) return;
      
              await carregarCores();
              await carregarFiltros();
      
              setCoresSelecionadasPorMaterial((prev) => {
                const novo = {};
      
                Object.keys(prev).forEach((material) => {
                  novo[material] = prev[material].filter(c => c.id !== cor.id);
                });
      
                return novo;
            }); //  ESSENCIAL
              }
      
              // continua sua lógica local
              const resultado = removerCorLocal({
                nomeMaterial,
                cor,
                coresPrincipais,
                coresPorMaterial,
                coresSelecionadasPorMaterial,
              });
      
              if (!resultado.ok) return;
      
              setCoresSelecionadasPorMaterial(resultado.coresSelecionadasPorMaterialAtualizadas);
      
              if (resultado.tipo === "principal") {
                setCoresPrincipais(resultado.coresPrincipaisAtualizadas);
              }
      
              if (resultado.tipo === "material") {
                setCoresPorMaterial((anterior) => ({
                  ...anterior,
                  [resultado.materialNormalizado]: resultado.coresDoMaterialAtualizadas,
                }));
              }
            };
      
            const resetFormularioCor = () => {
              setNovaCorNome("");
              setNovaCorHex("#000000");
            };

            const handleAdicionarCorMaterialLocal = async (nomeMaterial) => {
                const resultado = adicionarCorLocal({
                  nomeMaterial,
                  novaCorNome,
                  novaCorHex,
                  coresPrincipais,
                  coresPorMaterial,
                });
        
                if (!resultado.ok) {
                  toastPainel(
                    "error",
                    "Não foi possível salvar a cor",
                    resultado.mensagem || "Verifique os dados informados e tente novamente."
                  );
                  return;
                }
        
               // SALVA NO BANCO
                const corSalva = await salvarCorNoBanco(novaCorNome, novaCorHex);
        
                if (!corSalva) return;
        
                // continua sua lógica normal
                if (resultado.tipo === "principal") {
                  setCoresPrincipais((prev) => [
                    ...prev,
                    {
                      id: corSalva.id_cor,
                      nome: corSalva.nome_cor,
                      hex: corSalva.hex_cor
                    }
                  ]);
                }
        
                if (resultado.tipo === "material") {
                  setCoresPorMaterial((anterior) => ({
                    ...anterior,
                    [resultado.materialNormalizado]: resultado.coresDoMaterialAtualizadas,
                  }));
                }
        
                setNovaCorNome("");
                setNovaCorHex("#000000");
        
                toastPainel(
                  "success",
                  "Cor cadastrada com sucesso",
                  resultado.tipo === "principal"
                    ? "A nova cor foi adicionada à lista principal do painel."
                    : "A nova cor foi vinculada ao material selecionado."
                );
              };

              return {
                coresPrincipais,
                coresSelecionadasPorMaterial,
                setCoresSelecionadasPorMaterial,
                novaCorNome, setNovaCorNome,
                novaCorHex, setNovaCorHex,
                modalEditarCoresAberto, setModalEditarCoresAberto,
                carregarCores,
                obterCoresSelecionadasDoMaterial,
                handleToggleSelecaoCor,
                handleAdicionarCorMaterialLocal,
                handleExcluirCorLocal,
                resetFormularioCor,
              };
            }
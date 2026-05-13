// Para CSV
export function exportarParaCSV(dados, nomeArquivo = "relatorio.csv") {
  const cabecalho = Object.keys(dados[0]);
  const csv = [
    cabecalho.join(","),
    ...dados.map((linha) =>
      cabecalho.map((campo) => `"${linha[campo] ?? ""}"`).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nomeArquivo;
  link.click();
}

// Para PDF (necessário instalar jspdf e jspdf-autotable)
import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportarParaPDF(
  dados,
  nomeArquivo = "relatorio.pdf",
  titulo = "Relatório de Auditoria",
) {
  const doc = new jsPDF();
  doc.text(titulo, 14, 15);

  const colunas = Object.keys(dados[0]);
  const linhas = dados.map((obj) => colunas.map((col) => obj[col] ?? ""));

  doc.autoTable({ head: [colunas], body: linhas, startY: 20 });
  doc.save(nomeArquivo);
}

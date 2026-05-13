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

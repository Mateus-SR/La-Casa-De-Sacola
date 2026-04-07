import './globals.css';

export const metadata = {
  title: 'La Casa de Sacola — Sacolas Personalizadas',
  description: 'Gráfica familiar especializada em sacolas personalizadas: kraft, papel, plástica e com alça de cordão.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Quicksand:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Manrope', sans-serif" }}>
        {/* O 'children' é onde o Next.js vai injetar o conteúdo de cada página */}
        {children}
      </body>
    </html>
  );
}

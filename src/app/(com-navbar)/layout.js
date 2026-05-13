import '@/app/css/globals.css';
import Navbar from "@/components/layout/Navbar";
import AppToaster from "@/components/layout/AppToaster";
import { CartProvider } from '@/context/CartContext';
import Script from 'next/script';

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

        <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.ico" />
      </head>
      <body style={{ fontFamily: "'Manrope', sans-serif" }} className='custom-scrollbar'>
        <CartProvider>
          <AppToaster />
          <Navbar/>
          {children}
        </CartProvider>
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="2F8cKg0ZVn"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

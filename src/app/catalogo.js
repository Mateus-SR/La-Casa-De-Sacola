"use client";

import React, { useState } from "react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

const sacolasPreProntas = [
  { 
    id: 1, 
    nome: "Sacola Kraft Natural", 
    preco: "1,20", 
    imagem: "/img/sacola_exemplo2.jpg", 
    categoria: "Kraft",
    descricao: "Ideal para lojas de roupas e presentes eco-friendly."
  },
  { 
    id: 2, 
    nome: "Sacola Luxo Branca", 
    preco: "2,50", 
    imagem: "/img/sacola_exemplobranca.avif", 
    categoria: "Papel",
    descricao: "Acabamento premium com alça de cordão."
  },
  { 
    id: 3, 
    nome: "Sacola Plástica Alça Boca de Palhaço", 
    preco: "0,45", 
    imagem: "/img/sacola_exemplo3.webp", 
    categoria: "Plástica",
    descricao: "Alta resistência para supermercados e varejo."
  },
];

export default function CatalogoPage() {
  const [selecionada, setSelecionada] = useState(null);

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4 max-w-7xl mx-auto w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-mint-800 font-quicksand mb-4">
            Nosso Catálogo
          </h1>
          <p className="text-mint-600 max-w-2xl mx-auto">
            Explore nossas sacolas pré-prontas. Clique em um modelo para ver mais detalhes e simular sua compra.
          </p>
        </header>

        {/* GRID DE PRODUTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sacolasPreProntas.map((sacola) => (
            <div 
              key={sacola.id}
              className={`bg-white rounded-3xl overflow-hidden border-2 transition-all cursor-pointer hover:shadow-xl ${
                selecionada === sacola.id ? "border-mint-600 scale-[1.02]" : "border-mint-100 hover:border-mint-300"
              }`}
              onClick={() => setSelecionada(sacola.id)}
            >
              <img 
                src={sacola.imagem} 
                alt={sacola.nome} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <span className="text-xs font-bold text-mint-600 uppercase tracking-wider">{sacola.categoria}</span>
                <h3 className="text-xl font-bold text-mint-800 font-quicksand mt-1">{sacola.nome}</h3>
                <p className="text-mint-600 text-sm mt-2 line-clamp-2">{sacola.descricao}</p>
                
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <span className="text-xs text-mint-400 block uppercase">A partir de</span>
                    <span className="text-2xl font-extrabold text-mint-800">R$ {sacola.preco}</span>
                  </div>
                  
                  <button className="bg-mint-600 hover:bg-mint-700 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-md">
                    Ver mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
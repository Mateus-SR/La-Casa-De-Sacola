"use client";

export default function sacolaCRUD() {
    const sacolas = [
        { id: 1, tipo: 'Papel Kraft', qtdMinima: 100, preco: 1.50, tamanho: '30x40 cm', peso: '50g' },
        { id: 2, tipo: 'Plástico Alça Vazada', qtdMinima: 500, preco: 0.80, tamanho: '20x30 cm', peso: '15g' }
      ];

      return {
        sacolas
      }
}
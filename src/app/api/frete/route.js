import { NextResponse } from 'next/server';

export async function POST(request) {
  const { cepDestino, pacotes } = await request.json();

  try {
    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'La Casa De Sacola (seuemail@exemplo.com)' // Coloque seu e-mail aqui
      },
      body: JSON.stringify({
        from: { postal_code: '01001000' }, // Coloque o CEP de origem (da sua loja)
        to: { postal_code: cepDestino },
        products: pacotes
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao calcular frete' }, { status: 500 });
  }
}
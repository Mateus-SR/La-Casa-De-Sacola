import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cepDestino, produtos } = await request.json();
    const cepOrigem = "01001000"; // COLOQUE SEU CEP AQUI

    const formattedProducts = produtos.map(p => ({
      id: p.id_sac.toString(),
      width: parseFloat(p.largura_sac) || 20,
      height: parseFloat(p.altura_sac) || 2,
      length: parseFloat(p.comprimento_sac) || 30,
      weight: parseFloat(p.peso_sac) || 0.1,
      insurance_value: parseFloat(p.precounitario_sac) || 10,
      quantity: parseInt(p.quantity) || 1
    }));

    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SEU_TOKEN_AQUI', // COLOQUE SEU TOKEN DO MELHOR ENVIO
        'User-Agent': 'LaCasaDeSacola (contato@lacasadesacola.com.br )'
      },
      body: JSON.stringify({
        from: { postal_code: cepOrigem },
        to: { postal_code: cepDestino.replace(/\D/g, '') },
        products: formattedProducts,
        services: "1,2"
      })
    });

    const data = await response.json();
    return NextResponse.json(data.filter(s => !s.error).map(s => ({
      id: s.id, name: s.name, price: s.custom_price || s.price,
      delivery_time: s.custom_delivery_time || s.delivery_time, company: s.company.name
    })));
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao calcular frete' }, { status: 500 });
  }
}

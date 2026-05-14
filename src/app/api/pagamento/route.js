import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializa o cliente com o token de acesso
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export async function POST(request) {
  try {
    const { pedidoId, itens, frete } = await request.json();

    if (!pedidoId) {
      return NextResponse.json({ error: "ID do pedido ausente" }, { status: 400 });
    }

    const preference = new Preference(client);

    // Formatação dos itens para os padrões do Mercado Pago
    const items = itens.map(item => ({
      id: String(item.id_sac),
      title: String(`${item.nome_sac} - ${item.tamanho_sac}`),
      quantity: Number(item.quantity),
      unit_price: Number(item.precounitario_sac),
      currency_id: 'BRL',
    }));

    // Inclusão do frete como item adicional
    if (Number(frete) > 0) {
      items.push({
        id: 'FRETE',
        title: 'Valor do Frete',
        quantity: 1,
        unit_price: Number(frete),
        currency_id: 'BRL',
      });
    }

    // Define a URL base e verifica se é um ambiente seguro para o auto_return
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const isLocalhost = siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");

    const preferenceData = {
      body: {
        items: items,
        external_reference: String(pedidoId),
        back_urls: {
          success: `${siteUrl}/pedidos`,
          failure: `${siteUrl}/carrinho`,
          pending: `${siteUrl}/pedidos`
        },
        // O auto_return só é ativado se NÃO for localhost, evitando o erro 400
        auto_return: isLocalhost ? undefined : 'approved', 
      }
    };

    const response = await preference.create(preferenceData);

    return NextResponse.json({ init_point: response.init_point });

  } catch (error) {
    console.error("=== ERRO NA INTEGRAÇÃO MERCADO PAGO ===");
    console.error(error);
    return NextResponse.json({ error: "Falha ao processar pagamento" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
// Ajuste o caminho do supabaseClient se necessário
import { supabase } from '@/lib/supabaseClient'; 

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export async function POST(request) {
  try {
    // O Mercado Pago envia os dados na URL
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("data.id") || url.searchParams.get("id");

    // Verifica se é uma notificação de pagamento
    if (topic === "payment" && id) {
      const payment = new Payment(client);
      
      // Busca os detalhes oficiais do pagamento no Mercado Pago
      const paymentData = await payment.get({ id });

      const statusPagamento = paymentData.status; 
      const pedidoId = paymentData.external_reference; // O id_ped que enviamos no checkout!

      // Se o pagamento foi aprovado, atualiza o status_ped na tabela pedido
      if (statusPagamento === 'approved') {
        const { error } = await supabase
          .from('pedido')
          .update({ status_ped: 'em_producao' }) // ou 'pago', dependendo de como você organizou
          .eq('id_ped', pedidoId);

        if (error) {
          console.error("Erro ao atualizar status_ped no banco:", error);
        }
      }
    }

    // Retorna status 200 para o Mercado Pago saber que recebemos o aviso
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Erro no Webhook:", error);
    return NextResponse.json({ error: "Erro interno no webhook" }, { status: 500 });
  }
}
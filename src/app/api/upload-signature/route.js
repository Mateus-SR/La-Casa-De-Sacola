import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    const timestamp = Math.round(Date.now() / 1000);

    // Log para verificar se o secret está sendo lido corretamente
    console.log("API Secret (primeiros 6 chars):", process.env.CLOUDINARY_API_SECRET?.slice(0, 6));
    console.log("API Secret length:", process.env.CLOUDINARY_API_SECRET?.length);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    console.log("Assinatura gerada:", signature);

    return NextResponse.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Erro ao gerar assinatura:", error);
    return NextResponse.json(
      { error: "Erro ao gerar assinatura de upload." },
      { status: 500 }
    );
  }
}
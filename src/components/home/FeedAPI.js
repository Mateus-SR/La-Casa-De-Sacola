"use client";
import { useEffect } from "react";

export default function BeholdFeed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://w.behold.so/widget.js";
    document.head.appendChild(script);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-extrabold text-[#264f41]"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Nosso Instagram
          </h2>
        </div>
        {/* Cola aqui o ID do seu widget — o número que vem do Behold */}
        <behold-widget feed-id="zRy88loYbvP53knJOfdi"></behold-widget>
      </div>
    </section>
  );
}
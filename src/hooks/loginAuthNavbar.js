"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useNavbarAuth() {
  const [user, setUser] = useState(null);
  const [cargo, setCargo] = useState(null);
  const [navbarLoading, setNavbarLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    // Timer de segurança: se o Supabase não responder em 5 segundos,
    // libera a navbar e sinaliza erro para exibir o toast
    const timeout = setTimeout(() => {
      setErro(true);
      setNavbarLoading(false);
    }, 5000);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      clearTimeout(timeout); // Supabase respondeu, cancela o timer

      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: perfil, error: perfilError } = await supabase
            .from("usuario")
            .select("cargo")
            .eq("uuid_usu", currentUser.id)
            .single();

          if (perfilError) {
            console.error("Erro ao buscar cargo:", perfilError);
            setErro(true);
            return;
          }

          setCargo(perfil?.cargo ?? null);
        } else {
          setCargo(null);
        }
      } catch (e) {
        console.error("Erro inesperado na verificação:", e);
        setErro(true);
      } finally {
        // Sempre executa, independente do caminho percorrido acima
        setNavbarLoading(false);
      }
    });

    return () => {
      clearTimeout(timeout);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, cargo, navbarLoading, erro };
}
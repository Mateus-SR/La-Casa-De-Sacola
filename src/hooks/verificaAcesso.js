"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useVerificaAcessoAdmin() {
    const router = useRouter();
    const [cargo, setCargo] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() =>{
        const verificarAcessoAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            // Caso tente acessar uma pagina apenas para administradores, mas estiver sem conta (sem usuário), impede e manda pro login
            if (!user) {
                setTimeout(() => {
                    router.push("/login");
                  }, 2500);
                return;
            }

            const { data: perfil, error } = await supabase
                .from('usuario')
                .select('cargo')
                .eq('uuid_usu', user.id)
                .single();
            
            if (perfil) {
                setCargo(perfil.cargo);
            }
            setCarregando(false);

            if (error){
                console.error("Erro ao carregar perfil:", error);
            }

            if (perfil?.cargo !== 'administrador') {
                setTimeout(() => {
                    router.push("/");
                  }, 2500);
            }
        };

        verificarAcessoAdmin();
    }, [router]);

    return {
        cargo,
        carregando
    };
};
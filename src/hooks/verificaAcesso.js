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
            try{ 
            const { data: { user }, error: sessionError } = await supabase.auth.getUser();

            // Caso tente acessar uma pagina apenas para administradores, mas estiver sem conta (sem usuário), impede e manda pro login
            if (sessionError || !user) {
                    window.location.href= "/login";
                return;
            }

            const { data: perfil, error } = await supabase
                .from('usuario')
                .select('cargo')
                .eq('uuid_usu', user.id)
                .single();
            
            if (perfil) {
                setCargo(perfil.cargo);

            if (perfil?.cargo !== 'administrador') {
                        window.location.href= "/";
                }
            }

        } catch (error){
                console.error("Erro ao carregar perfil:", error);
                window.location.href= "/";
        } finally {
            setCarregando(false);
            }
        };

        verificarAcessoAdmin();
    }, [router]);

    return {
        cargo,
        carregando
    };
};
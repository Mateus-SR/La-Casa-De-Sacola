"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useVerificaAcessoAdmin() {
    const router = useRouter();
    const [cargo, setCargo] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() =>{
        const verificarAcessoAdmin = async () => {
            try{ 
            const { data: { user }, error: sessionError } = await supabase.auth.getUser();

            // Caso tente acessar uma pagina apenas para administradores, mas estiver sem conta (sem usuário), impede e manda pro login
            if (sessionError || !user) {
                    window.location.href= "/login";
                return;
            }

            const { data: perfil, error: perfilError } = await supabase
                .from('usuario')
                .select('cargo')
                .eq('uuid_usu', user.id)
                .single();

            if (perfilError) {
                setErro("Não foi possível validar seu acesso.\nVerifique sua conexão e recarregue a página.");
                return;
            }

            setCargo(perfil.cargo);
            if (perfil?.cargo !== 'administrador') {
                        window.location.href= "/";
                }


        } catch (error){
            setErro("Não foi possível validar seu acesso.\nVerifique sua conexão e recarregue a página.");
        } finally {
            setCarregando(false);
            }
        };

        verificarAcessoAdmin();
    }, []);

    return {
        cargo,
        carregando,
        erro
    };
};
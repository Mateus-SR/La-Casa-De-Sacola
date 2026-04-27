"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../../components/layout/Footer";
import toast from "react-hot-toast";
import * as Dialog from '@radix-ui/react-dialog';
import Navbar from '../../components/layout/Navbar';
import { MapPinIcon, PlusIcon, TrashIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function EnderecosPage() {
  const [enderecos, setEnderecos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [user, setUser] = useState(null);

  const [novoEndereco, setNovoEndereco] = useState({
    rua_end: "",
    num_end: "",
    bairro_end: "",
    cidade_end: "",
    uf_end: "",
    cep_end: ""
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);
      fetchEnderecos(user.id);
    };
    checkUser();
  }, []);

  // Função para buscar o CEP na API ViaCEP
  const handleBuscaCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    setNovoEndereco({ ...novoEndereco, cep_end: cepLimpo });

    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
          toast.error("CEP não encontrado.");
        } else {
          setNovoEndereco((prev) => ({
            ...prev,
            rua_end: data.logradouro,
            bairro_end: data.bairro,
            cidade_end: data.localidade,
            uf_end: data.uf,
            cep_end: cepLimpo
          }));
          toast.success("Endereço preenchido!");
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP.");
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  const fetchEnderecos = async (userId) => {
    const { data, error } = await supabase
      .from("endereco")
      .select("*")
      .eq("uuid_usu", userId);

    if (!error) setEnderecos(data || []);
    setCarregando(false);
  };

  const handleSalvarEndereco = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("endereco")
      .insert([{ ...novoEndereco, uuid_usu: user.id }])
      .select();

    if (error) {
      toast.error("Erro ao cadastrar endereço.");
    } else {
      setEnderecos([...enderecos, data[0]]);
      setModalAberto(false);
      setNovoEndereco({ rua_end: "", num_end: "", bairro_end: "", cidade_end: "", uf_end: "", cep_end: "" });
      toast.success("Endereço adicionado!");
    }
  };

  const handleExcluir = async (id) => {
    const { error } = await supabase.from("endereco").delete().eq("id_end", id);
    if (!error) {
      setEnderecos(enderecos.filter((e) => e.id_end !== id));
      toast.success("Endereço removido!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col">
      <Navbar/>
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-10">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#264f41]">Meus Endereços</h1>
            <p className="text-gray-600 text-sm">Gerencie seus locais de entrega</p>
          </div>

          <Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
            <Dialog.Trigger asChild>
              <button className="bg-[#5ab58f] hover:bg-[#2e8f65] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow-sm">
                <PlusIcon className="w-5 h-5" /> Novo Endereço
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-[min(92vw,30rem)] z-[100]">
                <Dialog.Title className="text-xl font-extrabold mb-6 text-[#264f41]">Cadastrar Endereço</Dialog.Title>
                
                <form onSubmit={handleSalvarEndereco} className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 col-span-2 relative">
                    <label className="text-xs font-bold text-gray-500 uppercase">CEP</label>
                    <div className="relative">
                      <input 
                        required 
                        maxLength="8"
                        placeholder="00000000"
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#5ab58f]" 
                        value={novoEndereco.cep_end}
                        onChange={(e) => handleBuscaCep(e.target.value)}
                      />
                      {buscandoCep && (
                        <ArrowPathIcon className="w-5 h-5 text-[#3ca779] animate-spin absolute right-3 top-3" />
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Rua / Logradouro</label>
                    <input 
                      required className="border border-gray-200 p-3 rounded-xl outline-none focus:border-[#5ab58f] bg-gray-50" 
                      value={novoEndereco.rua_end}
                      onChange={(e) => setNovoEndereco({...novoEndereco, rua_end: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Número</label>
                    <input 
                      required className="border border-gray-200 p-3 rounded-xl outline-none focus:border-[#5ab58f]" 
                      value={novoEndereco.num_end}
                      onChange={(e) => setNovoEndereco({...novoEndereco, num_end: e.target.value})}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Bairro</label>
                    <input 
                      required className="border border-gray-200 p-3 rounded-xl outline-none focus:border-[#5ab58f] bg-gray-50" 
                      value={novoEndereco.bairro_end}
                      onChange={(e) => setNovoEndereco({...novoEndereco, bairro_end: e.target.value})}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Cidade</label>
                    <input 
                      required className="border border-gray-200 p-3 rounded-xl outline-none focus:border-[#5ab58f] bg-gray-50" 
                      value={novoEndereco.cidade_end}
                      readOnly
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">UF</label>
                    <input 
                      required className="border border-gray-200 p-3 rounded-xl outline-none focus:border-[#5ab58f] bg-gray-50" 
                      value={novoEndereco.uf_end}
                      readOnly
                    />
                  </div>

                  <button type="submit" className="col-span-2 mt-4 bg-[#5ab58f] hover:bg-[#2e8f65] text-white p-4 rounded-xl font-bold transition shadow-lg">
                    Salvar Endereço
                  </button>
                </form>

                <Dialog.Close asChild>
                  <button className="absolute top-5 right-5 text-gray-400 hover:text-black transition"><XMarkIcon className="w-6 h-6"/></button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </header>

        {carregando ? (
          <div className="text-center py-20 italic text-gray-500">Buscando endereços...</div>
        ) : (
          <div className="grid gap-4">
            {enderecos.map((end) => (
              <div key={end.id_end} className="bg-white border border-[#e4f4ed] rounded-2xl p-5 flex justify-between items-center shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="bg-[#f0faf5] p-3 rounded-xl"><MapPinIcon className="w-6 h-6 text-[#3ca779]" /></div>
                  <div>
                    <p className="font-bold text-[#264f41]">{end.rua_end}, {end.num_end}</p>
                    <p className="text-sm text-gray-500">{end.bairro_end} - {end.cidade_end}/{end.uf_end}</p>
                  </div>
                </div>
                <button onClick={() => handleExcluir(end.id_end)} className="text-red-400 hover:text-red-600 p-2 transition"><TrashIcon className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

interface Membro {
  id: number;
  nome: string;
  email: string;
  telefone_celular: string;
  created_at: string;
  status: string;
  endereco: string;
  data_nascimento: string;
  profissao: string;
  estado_civil: string;
  batizado: boolean;
  data_batismo: string;
  observacoes: string;
}

export function MembroDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [membro, setMembro] = useState<Membro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembroDetalhes();
  }, [id]);

  async function fetchMembroDetalhes() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('membresia')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setMembro(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do membro:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!membro) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-gray-600 mb-4">Membro não encontrado</div>
        <button
          onClick={() => navigate('/membros')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Voltar para lista de membros
        </button>
      </div>
    );
  }

  return (
    <PageTransition>
      <Helmet>
        <title>{membro ? `${membro.nome} | Semeando Família` : 'Detalhes do Membro | Semeando Família'}</title>
      </Helmet>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate('/membros')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Voltar para lista de membros
        </motion.button>

        <motion.div
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="px-6 py-4 border-b border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold text-gray-900">{membro.nome}</h1>
            <motion.span
              className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                membro.status === 'Ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {membro.status}
            </motion.span>
          </motion.div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
                
                <div className="space-y-3">
                  {[
                    { label: 'Email', value: membro.email },
                    { label: 'Telefone', value: membro.telefone_celular },
                    { label: 'Data de Nascimento', value: formatDate(membro.data_nascimento) },
                    { label: 'Estado Civil', value: membro.estado_civil },
                    { label: 'Profissão', value: membro.profissao }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="transform transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg"
                    >
                      <label className="text-sm font-medium text-gray-500">{item.label}</label>
                      <p className="text-gray-900">{item.value || '-'}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Eclesiásticas</h2>
                
                <div className="space-y-3">
                  {[
                    { label: 'Batizado', value: membro.batizado ? 'Sim' : 'Não' },
                    ...(membro.batizado ? [{ label: 'Data do Batismo', value: formatDate(membro.data_batismo) }] : []),
                    { label: 'Data de Cadastro', value: formatDate(membro.created_at) }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="transform transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg"
                    >
                      <label className="text-sm font-medium text-gray-500">{item.label}</label>
                      <p className="text-gray-900">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {membro.endereco && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h2>
                <div className="transform transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg">
                  <p className="text-gray-900">{membro.endereco}</p>
                </div>
              </motion.div>
            )}

            {membro.observacoes && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações</h2>
                <div className="transform transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-line">{membro.observacoes}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

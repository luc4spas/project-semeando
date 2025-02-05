import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

interface Membro {
  id: number;
  nome: string;
  email: string;
  telefone_celular: string;
  created_at: string;
  status: string;
}

export function Membros() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    fetchMembros();
  }, [currentPage]);

  async function fetchMembros() {
    try {
      setLoading(true);
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;

      // Buscar total de registros
      const { count } = await supabase
        .from('membresia')
        .select('*', { count: 'exact', head: true });

      // Buscar dados da página atual
      const { data, error } = await supabase
        .from('membresia')
        .select(`
          id,
          nome,
          email,
          telefone_celular,
          created_at,
          status
        `)
        .range(from, to)
        .order('nome', { ascending: true });

      if (error) throw error;

      setMembros(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Membros | Semeando Família</title>
      </Helmet>
      <div className="p-6">
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">Membros</h1>
          <div className="text-sm text-gray-600">
            Total: {totalCount} membros
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            className="flex justify-center items-center h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-600">Carregando...</div>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Data de Cadastro
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {membros.map((membro, index) => (
                        <motion.tr
                          key={membro.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01, backgroundColor: 'rgba(249, 250, 251, 0.9)' }}
                        >
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-base font-medium text-gray-900">
                              {membro.nome}
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-base text-gray-500">{membro.email}</div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-base text-gray-500">{membro.telefone_celular}</div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <motion.span
                              className={`px-3 py-1 text-base inline-flex leading-5 font-semibold rounded-full ${
                                membro.status === 'Ativo' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {membro.status}
                            </motion.span>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-base text-gray-500">
                              {formatDate(membro.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <motion.button
                              onClick={() => navigate(`/membro/${membro.id}`)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-2"
                              title="Ver detalhes"
                              whileHover={{ scale: 1.05, x: 5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Eye size={20} />
                              <span className="text-base">Detalhes</span>
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Paginação */}
            {totalPages > 1 && (
              <motion.div
                className="flex items-center justify-between mt-4 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={16} />
                  Anterior
                </motion.button>
                <motion.span
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={currentPage}
                >
                  Página {currentPage + 1} de {totalPages}
                </motion.span>
                <motion.button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Próxima
                  <ChevronRight size={16} />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}

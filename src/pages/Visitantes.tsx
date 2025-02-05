import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PageTransition } from '../components/PageTransition';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { VisitantesCard } from '../components/VisitantesCard';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Visitante {
  id: number;
  nome: string;
  data_visita: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

export function Visitantes() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchVisitantes();
  }, [currentPage, searchTerm]);

  async function fetchVisitantes() {
    try {
      setLoading(true);
      const { count, error: countError } = await supabase
        .from('visitantes')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCount(count);

      let query = supabase
        .from('visitantes')
        .select('*')
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);

      if (searchTerm) {
        query = query.ilike('nome', `%${searchTerm}%`);
      }

      const { data: visitantes, error } = await query;

      if (error) throw error;
      console.log('Dados recebidos de visitantes:', visitantes);
      setVisitantes(visitantes || []);
    } catch (error) {
      console.error('Erro ao buscar visitantes:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleNextPage() {
    if ((currentPage + 1) * pageSize < totalCount) {
      setCurrentPage(currentPage + 1);
    }
  }

  function handlePrevPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Visitantes | Semeando Família</title>
      </Helmet>
      <div className="p-6">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Pesquisar visitantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 w-full pl-10"
          />
          <div className="absolute left-2 top-2.5">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">Visitantes</h1>
          <div className="text-sm text-gray-600">
            Total: {totalCount} visitantes
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
                      Data da Visita
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {visitantes.map((visitante, index) => (
                      <motion.tr
                        key={visitante.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="text-base font-medium text-gray-900">
                            {visitante.nome}
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="text-base text-gray-500">
                            {formatDate(visitante.data_visita)}
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <Link to={`/visitante/${visitante.id}`} className="text-blue-500 hover:underline">Detalhes</Link>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        <div className="flex justify-between mt-4">
          <button onClick={handlePrevPage} disabled={currentPage === 0} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">Anterior</button>
          <button onClick={handleNextPage} disabled={(currentPage + 1) * pageSize >= totalCount} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">Próximo</button>
        </div>
        <div className="flex justify-between mt-4">
          <span className="text-sm text-gray-600">
            Página {currentPage + 1} de {Math.ceil(totalCount / pageSize)}
          </span>
        </div>
      </div>
    </PageTransition>
  );
}

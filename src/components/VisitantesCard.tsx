import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BaggageClaim } from 'lucide-react';

export function VisitantesCard() {
  const [totalVisitantes, setTotalVisitantes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotalVisitantes() {
      const { count, error } = await supabase
        .from('visitantes')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Erro ao contar os registros:', error);
      } else {
        setTotalVisitantes(count);
      }
      setLoading(false);
    }

    fetchTotalVisitantes();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-full">
          <BaggageClaim className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Total de Visitantes</h3>
          {loading ? (
            <p className="text-2xl font-bold text-gray-600">Carregando...</p>
          ) : (
            <p className="text-2xl font-bold text-green-600">{totalVisitantes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

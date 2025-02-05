import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users } from 'lucide-react';

export function MembresiaCard() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotalUsers() {
      const { count, error } = await supabase
        .from('membresia')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Erro ao contar os registros:', error);
      } else {
        setTotalUsers(count);
      }
      setLoading(false);
    }

    fetchTotalUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 rounded-full">
          <Users className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Total de Membros</h3>
          {loading ? (
            <p className="text-2xl font-bold text-gray-600">Carregando...</p>
          ) : (
            <p className="text-2xl font-bold text-indigo-600">{totalUsers}</p>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PageTransition } from '../components/PageTransition';
import { Helmet } from 'react-helmet-async';

interface Visitante {
  id: number;
  nome: string;
  data_visita: string;
}

export function VisitanteDetalhes() {
  const { id } = useParams<{ id: string }>();
  const [visitante, setVisitante] = useState<Visitante | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitanteDetalhes();
  }, [id]);

  async function fetchVisitanteDetalhes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visitantes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setVisitante(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do visitante:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!visitante) {
    return <div>Visitante não encontrado.</div>;
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Detalhes do Visitante | Semeando Família</title>
      </Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Detalhes do Visitante</h1>
        <p><strong>Nome:</strong> {visitante.nome}</p>
        <p><strong>Data da Visita:</strong> {new Date(visitante.data_visita).toLocaleDateString('pt-BR')}</p>
      </div>
    </PageTransition>
  );
}

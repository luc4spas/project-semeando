import React from 'react';
import { MembresiaCard } from '../components/MembresiaCard';
import { VisitantesCard } from '../components/VisitantesCard';
import { PageTransition } from '../components/PageTransition';
import { Helmet } from 'react-helmet-async';

export function Home() {
  return (
    <PageTransition>
      <Helmet>
        <title>Home | Semeando Família</title>
      </Helmet>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <MembresiaCard />
        <VisitantesCard />
      </div>
    </PageTransition>
  );
}

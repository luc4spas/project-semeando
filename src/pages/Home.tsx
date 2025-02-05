import React from 'react';
import { MembresiaCard } from '../components/MembresiaCard';

export function Home() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Bem-vindo ao Sistema
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MembresiaCard />
      </div>
    </div>
  );
}

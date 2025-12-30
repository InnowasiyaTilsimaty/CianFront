'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header/Header';
import PropertyDetail from '@/components/PropertyDetail';

export default function PropertyDetailPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Header />
      <main>
        <PropertyDetail id={id} />
      </main>
    </>
  );
}


'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header/Header';
import PropertyMap from '@/components/PropertyMap/PropertyMap';

export default function PropertyMapPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Header />
      <main>
        <PropertyMap id={id} />
      </main>
    </>
  );
}


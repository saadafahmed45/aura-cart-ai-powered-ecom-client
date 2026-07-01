import React from 'react';
import ProductDetailsClient from './ProductDetailsClient';

export default function Page({ params }) {
  const unwrapped = React.use(params);
  return <ProductDetailsClient id={unwrapped.id} />;
}

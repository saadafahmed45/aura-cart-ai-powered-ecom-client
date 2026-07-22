import ProductDetailsClient from './ProductDetailsClient';

export default async function Page({ params }) {
  const { id } = await params;
  return <ProductDetailsClient id={id} />;
}

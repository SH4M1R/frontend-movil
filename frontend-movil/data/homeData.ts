type Item = { image?: any; title: string; description?: string };

export const promoItems: Item[] = [
  { image: require('@/assets/img/promo1.jpg'), title: 'Descuento Especial', description: '¡Aprovecha hasta 50% de descuento!' },
  { image: require('@/assets/img/promo2.jpg'), title: 'Compra 1 y Lleva 2', description: 'Oferta válida solo hoy.' },
  { image: require('@/assets/img/promo3.jpg'), title: 'Envío Gratis', description: 'En pedidos mayores a S/ 50.00' },
];

export const productItems: Item[] = [
  { image: require('@/assets/img/product1.jpg'), title: 'Chaqueta Casual', description: 'Comodidad y estilo.' },
  { image: require('@/assets/img/product2.jpg'), title: 'Zapatillas Urbanas', description: 'Perfectas para caminar.' },
  { image: require('@/assets/img/product3.jpg'), title: 'Bolso Elegante', description: 'Complementa tu outfit.' },
];

export const categories: Item[] = [
  { title: 'Ropa', image: require('@/assets/img/product4.jpg') },
  { title: 'Calzado', image: require('@/assets/img/product5.jpg') },
  { title: 'Accesorios', image: require('@/assets/img/product6.jpg') },
  { title: 'Promociones', image: require('@/assets/img/product1.jpg') },
];

export const tips: Item[] = [
  { title: 'Combina colores neutros con accesorios llamativos.' },
  { title: 'Usa capas para un look más versátil.' },
  { title: 'Elige prendas cómodas pero con estilo.' },
];

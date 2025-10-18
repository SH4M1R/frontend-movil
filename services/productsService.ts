export type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
};

export async function fetchProducts(): Promise<Product[]> {
  try {
    // Para API externa real
    // const response = await fetch('https://api.example.com/products');
    // if (!response.ok) throw new Error('Error al cargar productos');
    // const data = await response.json();

    // Para archivo local JSON
    const data: Product[] = require('../data/productos.json');

    return data;
  } catch (error) {
    console.error('fetchProducts error:', error);
    throw error; // Permite manejar el error en la pantalla
  }
}

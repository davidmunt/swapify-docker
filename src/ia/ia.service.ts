import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'; 
import { Product } from '../product/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductView } from '../product_view/product_view.entity';

@Injectable()
export class IAService {
  private readonly POLLINATIONS_API_URL = 'https://text.pollinations.ai/';

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductView) private readonly productViewRepo: Repository<ProductView>,
  ) {}

  async checkPriceOnCreateProduct(
    brand: string,
    model: string,
    description: string,
    price: number,
    category: string,
    state: string
  ): Promise<number | null> {
    try {
      const prompt = `¿Cuál es el precio medio en el mercado para un producto con las siguientes características? 
      Marca: ${brand}, Modelo: ${model}, Descripcion: ${description}, Categoría: ${category}, Estado: ${state}. 
      Devuelve solo un número sin signos ni palabras adicionales.`;
      const response = await fetch(this.POLLINATIONS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: 'openai',
          private: true,
        }),
      });
      if (!response.ok) {
        throw new HttpException('Error en la API de Pollinations', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      const data = await response.text();
      const recommendedPrice = parseFloat(data.trim());
      if (isNaN(recommendedPrice)) {
        throw new HttpException('No se pudo obtener un precio valido de la IA', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      const lowerLimit = recommendedPrice * 0.9;
      const upperLimit = recommendedPrice * 1.1;
      if (price < lowerLimit || price > upperLimit) {
        return parseFloat(recommendedPrice.toFixed(2));
      }
      return null;
    } catch (error) {
      throw new HttpException('Error al procesar la recomendacion de precio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async orderProductsByProductView(userId: string): Promise<Product[]> {
    try {
      const products = await this.productRepo.find({
        relations: [
          'user',
          'product_category',
          'product_state',
          'product_sale_state',
          'images',
          'likes',
          'likes.user',
          'buyer',
          'exchangedWith',
        ],
      });
      const views = await this.productViewRepo.find({
        where: { user: { id_user: userId } },
        relations: ['product', 'user'],
        order: { viewed_at: 'DESC' },
        take: 10,
      });
      if (views == null || views.length == 0) {
        return products;
      }
      const simplifiedViews = views.map((view) => ({
        user_id: userId,
        product_id: view.product.id_product,
        timestamp: view.viewed_at,
      }));
      const simplifiedProducts = products.map((p) => ({
        id_product: p.id_product,
        product_model: p.product_model,
        product_brand: p.product_brand,
        price: p.price,
        description: p.description,
        category: p.product_category?.name,
        state: p.product_state?.name,
      }));
      const prompt = `
Estas son las visitas recientes del usuario a productos (incluye el ID del producto y la hora de visualización):

${JSON.stringify(simplifiedViews, null, 2)}

Y estos son todos los productos disponibles actualmente en la plataforma, incluyendo su categoría, precio, marca, etc.:

${JSON.stringify(simplifiedProducts, null, 2)}

Quiero que me devuelvas únicamente los ID de todos los productos ordenados de mayor a menor interés para el usuario, según las visitas recientes que ha hecho.

- Ten en cuenta la frecuencia de vistas de cada producto y también la categoría de los productos más vistos.
- Si no hay visitas a ciertos productos, intenta ordenarlos de forma coherente usando similitudes con los productos visitados.
- Aun si un producto no ha sido visto, **debe aparecer igualmente en la lista ordenada**.
- La respuesta debe ser **solo** los IDs de los productos ordenados, separados por guiones, sin ningún texto extra.

Ejemplo de formato de salida:
4-2-5-1-3
(Sin comillas, sin texto adicional, solo los números separados por guiones).
`;
      const response = await fetch(this.POLLINATIONS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: 'openai',
          private: true,
        }),
      });
      if (!response.ok) {
        throw new HttpException('Error en la API de Pollinations', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      const resultText = await response.text();
      const cleaned = resultText.trim().replace(/[^0-9\-]/g, '');
      const ids = cleaned.split('-').map((id) => parseInt(id, 10));
      const orderedProducts = ids
        .map((id) => products.find((p) => p.id_product === id))
        .filter((p): p is Product => !!p); 
      return orderedProducts;
    } catch (error) {
      console.error('Error en orderProductsByProductView:', error);
      throw new HttpException('Error al ordenar los productos por visitas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }  
}
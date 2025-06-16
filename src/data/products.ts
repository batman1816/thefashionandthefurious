
import { Product } from '../types/Product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Lewis Hamilton Championship Tee',
    description: 'Premium cotton t-shirt celebrating Lewis Hamilton\'s legendary F1 career. Features vintage-inspired graphics and comfortable fit.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop',
    category: 'drivers',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50
  },
  {
    id: '2',
    name: 'Max Verstappen Racing Jersey',
    description: 'Official-style racing jersey inspired by Max Verstappen\'s dominant performances. Moisture-wicking fabric for ultimate comfort.',
    price: 65,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=500&fit=crop',
    category: 'drivers',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30
  },
  {
    id: '3',
    name: 'Ferrari Scuderia Heritage Tee',
    description: 'Classic Ferrari team t-shirt with vintage Scuderia logo. Perfect for any Ferrari fan and F1 enthusiast.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=500&fit=crop',
    category: 'teams',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 75
  },
  {
    id: '4',
    name: 'Red Bull Racing Team Shirt',
    description: 'Official Red Bull Racing inspired team shirt. Features the iconic Red Bull logo and racing stripes.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=500&fit=crop',
    category: 'teams',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40
  },
  {
    id: '5',
    name: 'Classic F1 Monaco Grand Prix Tee',
    description: 'Vintage-style Monaco Grand Prix t-shirt celebrating the most prestigious race in Formula 1.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=500&fit=crop',
    category: 'f1-classic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 60
  },
  {
    id: '6',
    name: 'Ayrton Senna Legend Tribute',
    description: 'Tribute t-shirt honoring the legendary Ayrton Senna. Features iconic helmet design and inspiring quotes.',
    price: 48,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop',
    category: 'f1-classic',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35
  },
  {
    id: '7',
    name: 'McLaren Papaya Orange Racing Tee',
    description: 'McLaren team t-shirt in signature papaya orange. Modern design with classic McLaren racing heritage.',
    price: 42,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=500&fit=crop',
    category: 'teams',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 45
  },
  {
    id: '8',
    name: 'Charles Leclerc Monaco Winner Shirt',
    description: 'Commemorative shirt celebrating Charles Leclerc\'s Monaco victory. Premium quality with embroidered details.',
    price: 58,
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=500&fit=crop',
    category: 'drivers',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25
  }
];

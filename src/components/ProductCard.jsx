import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="group relative rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img 
          src={product.cover} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Link to={`/product/${product._id}`}>
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.gender}
          </Badge>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 hover:underline dark:text-gray-100">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center  justify-between">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {product.price.toLocaleString('fr-FR')} F CFA
          </p>
          <Button size="sm" className='bg-pxcolor text-white' onClick={() => onAddToCart(product)}>
            <ShoppingCart className="mr-2 text-white h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};
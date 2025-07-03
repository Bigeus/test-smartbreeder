import React from 'react';
import { Heart } from 'lucide-react';
import { useProdutos } from '../context/ProdutosContext';

const Header: React.FC = () => {
  const { favoritos } = useProdutos();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Loja de Produtos
            </h1>
            <p className="text-gray-600">
              Encontre os melhores produtos com as melhores ofertas
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
            <Heart 
              className={`w-6 h-6 ${favoritos.length > 0 ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
            />
            <span className="font-semibold text-gray-700">
              {favoritos.length} {favoritos.length === 1 ? 'Favorito' : 'Favoritos'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


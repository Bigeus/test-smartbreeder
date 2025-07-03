import React from 'react';
import { Heart, Eye, Package, AlertCircle } from 'lucide-react';
import { useProdutos } from '../context/ProdutosContext';
import type { Produto } from '../types';

interface CardProdutoProps {
  produto: Produto;
  onDetalhes: () => void;
}

const CardProduto: React.FC<CardProdutoProps> = ({ produto, onDetalhes }) => {
  const { adicionarFavorito, removerFavorito, isFavorito, obterNomeCategoria } = useProdutos();

  const favorito = isFavorito(produto.id);
  const nome = produto.nome || 'Nome desconhecido';
  const preco = produto.preco || 'Preço não disponível';
  const temEstoque = produto.variacao.some(v => v.estoque === 'sim');

  const handleFavorito = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorito) {
      removerFavorito(produto.id);
    } else {
      adicionarFavorito(produto);
    }
  };

  const formatarPreco = (preco: string) => {
    if (preco === 'Preço não disponível') return preco;
    const numero = parseFloat(preco);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numero);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Header do card */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {nome}
            </h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {produto.categorias.slice(0, 2).map(categoriaId => (
                <span
                  key={categoriaId}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {obterNomeCategoria(categoriaId)}
                </span>
              ))}
              {produto.categorias.length > 2 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{produto.categorias.length - 2}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleFavorito}
            className={`p-2 rounded-full transition-colors ${
              favorito
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {produto.descricao}
        </p>

        {/* Preço */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {formatarPreco(preco)}
          </span>
        </div>

        {/* Status do estoque */}
        <div className="flex items-center mb-4">
          {temEstoque ? (
            <div className="flex items-center text-green-600">
              <Package className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Em estoque</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Sem estoque</span>
            </div>
          )}
        </div>

        {/* Variações disponíveis */}
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            {produto.variacao.length} {produto.variacao.length === 1 ? 'variação' : 'variações'} disponível
          </span>
        </div>

        {/* Botão de detalhes */}
        <button
          onClick={onDetalhes}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default CardProduto;


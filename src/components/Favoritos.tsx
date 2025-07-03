import React, { useState } from 'react';
import { Heart, Calendar } from 'lucide-react';
import { useProdutos } from '../context/ProdutosContext';
import type { Produto } from '../types';
import CardProduto from './CardProduto';
import ModalProduto from './ModalProduto';

const Favoritos: React.FC = () => {
  const { favoritos } = useProdutos();
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  if (favoritos.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhum produto favoritado
        </h2>
        <p className="text-gray-600">
          Adicione produtos aos seus favoritos para vê-los aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Meus Favoritos ({favoritos.length})
          </h2>
        </div>
        <p className="text-gray-600 mt-1">
          Produtos que você marcou como favoritos
        </p>
      </div>

      {/* Lista de favoritos */}
      <div className="space-y-6">
        {favoritos
          .sort((a, b) => b.dataFavorito.getTime() - a.dataFavorito.getTime())
          .map(({ produto, dataFavorito }) => (
            <div key={produto.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Favoritado em {formatarData(dataFavorito)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <CardProduto
                    produto={produto}
                    onDetalhes={() => setProdutoSelecionado(produto)}
                  />
                </div>
                
                <div className="lg:col-span-3">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {produto.nome || 'Nome desconhecido'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {produto.descricao}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Preço</div>
                          <div className="text-lg font-semibold">
                            {produto.preco 
                              ? new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(parseFloat(produto.preco))
                              : 'Preço não disponível'
                            }
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Variações</div>
                          <div className="text-lg font-semibold">
                            {produto.variacao.length}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Em estoque</div>
                          <div className="text-lg font-semibold text-green-600">
                            {produto.variacao.filter(v => v.estoque === 'sim').length}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setProdutoSelecionado(produto)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Ver Detalhes Completos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal de detalhes */}
      {produtoSelecionado && (
        <ModalProduto
          produto={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
        />
      )}
    </>
  );
};

export default Favoritos;


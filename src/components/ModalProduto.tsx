import React from 'react';
import { X, Heart, Package, AlertCircle, Shield, Zap, Ruler } from 'lucide-react';
import { useProdutos } from '../context/ProdutosContext';
import type { Produto } from '../types';

interface ModalProdutoProps {
  produto: Produto;
  onClose: () => void;
}

const ModalProduto: React.FC<ModalProdutoProps> = ({ produto, onClose }) => {
  const { adicionarFavorito, removerFavorito, isFavorito, obterNomeCategoria } = useProdutos();

  const favorito = isFavorito(produto.id);
  const nome = produto.nome || 'Nome desconhecido';
  const preco = produto.preco || 'Preço não disponível';

  const handleFavorito = () => {
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header do modal */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {nome}
            </h2>
            <div className="flex flex-wrap gap-2">
              {produto.categorias.map(categoriaId => (
                <span
                  key={categoriaId}
                  className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {obterNomeCategoria(categoriaId)}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFavorito}
              className={`p-2 rounded-full transition-colors ${
                favorito
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-6 h-6 ${favorito ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo do modal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informações principais */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Descrição
                </h3>
                <p className="text-gray-600">
                  {produto.descricao}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Preço
                </h3>
                <div className="text-3xl font-bold text-gray-900">
                  {formatarPreco(preco)}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumo das Variações
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Total de variações</div>
                    <div className="text-lg font-semibold">{produto.variacao.length}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Em estoque</div>
                    <div className="text-lg font-semibold text-green-600">
                      {produto.variacao.filter(v => v.estoque === 'sim').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Variações */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Variações Disponíveis
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {produto.variacao.map((variacao, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      variacao.estoque === 'sim' 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">
                        Variação {index + 1}
                      </span>
                      <div className="flex items-center">
                        {variacao.estoque === 'sim' ? (
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
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Vendedor:</span>
                        <span className="ml-1 font-medium">{variacao.vendedor}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fabricante:</span>
                        <span className="ml-1 font-medium">{variacao.fabricante}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cor:</span>
                        <span className="ml-1 font-medium">{variacao.cor}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tamanho:</span>
                        <span className="ml-1 font-medium">{variacao.tamanho}</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 text-gray-500 mr-1" />
                        <span className="text-gray-600">Voltagem:</span>
                        <span className="ml-1 font-medium">{variacao.voltagem}</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-3 h-3 text-gray-500 mr-1" />
                        <span className="text-gray-600">Garantia:</span>
                        <span className="ml-1 font-medium">{variacao.garantia}</span>
                      </div>
                      {variacao.peso && (
                        <div>
                          <span className="text-gray-600">Peso:</span>
                          <span className="ml-1 font-medium">{variacao.peso}</span>
                        </div>
                      )}
                      {variacao.dimensoes && (
                        <div className="flex items-center">
                          <Ruler className="w-3 h-3 text-gray-500 mr-1" />
                          <span className="text-gray-600">Dimensões:</span>
                          <span className="ml-1 font-medium">{variacao.dimensoes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProduto;


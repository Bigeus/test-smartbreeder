import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProdutos } from '../context/ProdutosContext';
import type { FiltrosProdutos, Produto } from '../types';
import CardProduto from './CardProduto';
import ModalProduto from './ModalProduto';

interface ListaProdutosProps {
  filtros: FiltrosProdutos;
}

const ListaProdutos: React.FC<ListaProdutosProps> = ({ filtros }) => {
  const { produtos, loading, obterNomeCategoria } = useProdutos();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const produtosPorPagina = 12;

  // Filtrar produtos
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(produto => {
      // nome
      if (filtros.nome) {
        const nome = produto.nome || 'Nome desconhecido';
        if (!nome.toLowerCase().includes(filtros.nome.toLowerCase())) {
          return false;
        }
      }

      // categ
      if (filtros.categoria) {
        if (!produto.categorias.includes(filtros.categoria)) {
          return false;
        }
      }

      // preço
      if (filtros.preco.min !== null || filtros.preco.max !== null) {
        const preco = produto.preco ? parseFloat(produto.preco) : 0;
        if (filtros.preco.min !== null && preco < filtros.preco.min) {
          return false;
        }
        if (filtros.preco.max !== null && preco > filtros.preco.max) {
          return false;
        }
      }

      // estoque
      if (filtros.estoque !== null) {
        const temEstoque = produto.variacao.some(v => v.estoque === 'sim');
        if (filtros.estoque && !temEstoque) {
          return false;
        }
        if (!filtros.estoque && temEstoque) {
          return false;
        }
      }

      return true;
    });
  }, [produtos, filtros]);

  // Calcular paginação
  /* "currentPage": 0,
   "hasNextPage": true,
   "totalPages": 5,
   "totalElementsPerPage": 20,
   "totalElements": 99,
   "content": [] */
  
  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
  const indiceInicio = (paginaAtual - 1) * produtosPorPagina;
  const indiceFim = indiceInicio + produtosPorPagina;
  const produtosPagina = produtosFiltrados.slice(indiceInicio, indiceFim);

  React.useEffect(() => {
    setPaginaAtual(1);
  }, [filtros]);

  const irParaPagina = (pagina: number) => {
    setPaginaAtual(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Carregando produtos...</span>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Produtos ({produtosFiltrados.length})
          </h2>
          {totalPaginas > 1 && (
            <span className="text-sm text-gray-600">
              Página {paginaAtual} de {totalPaginas}
            </span>
          )}
        </div>
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum produto encontrado com os filtros aplicados.
          </p>
        </div>
      ) : (
        <>
          {/* Grid de produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {produtosPagina.map(produto => (
              <CardProduto
                key={produto.id}
                produto={produto}
                onDetalhes={() => setProdutoSelecionado(produto)}
              />
            ))}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => irParaPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </button>

              {/* Números das páginas */}
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                <button
                  key={pagina}
                  onClick={() => irParaPagina(pagina)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pagina === paginaAtual
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pagina}
                </button>
              ))}

              <button
                onClick={() => irParaPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}

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

export default ListaProdutos;


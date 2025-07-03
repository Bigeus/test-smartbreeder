import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useProdutos } from '../context/ProdutosContext';
import type { FiltrosProdutos } from '../types';

interface PesquisaProps {
  filtros: FiltrosProdutos;
  onFiltrosChange: (filtros: FiltrosProdutos) => void;
}

const Pesquisa: React.FC<PesquisaProps> = ({ filtros, onFiltrosChange }) => {
  const { categorias } = useProdutos();

  const handleNomeChange = (nome: string) => {
    onFiltrosChange({ ...filtros, nome });
  };

  const handleCategoriaChange = (categoria: number | null) => {
    onFiltrosChange({ ...filtros, categoria });
  };

  const handlePrecoChange = (campo: 'min' | 'max', valor: string) => {
    const numeroValor = valor === '' ? null : parseFloat(valor);
    onFiltrosChange({
      ...filtros,
      preco: { ...filtros.preco, [campo]: numeroValor }
    });
  };

  const handleEstoqueChange = (estoque: boolean | null) => {
    onFiltrosChange({ ...filtros, estoque });
  };

  const limparFiltros = () => {
    onFiltrosChange({
      nome: '',
      categoria: null,
      preco: { min: null, max: null },
      estoque: null
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Filtros de Pesquisa</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pesquisa por nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Produto
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filtros.nome}
              onChange={(e) => handleNomeChange(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filtro por categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={filtros.categoria || ''}
            onChange={(e) => handleCategoriaChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faixa de Preço
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={filtros.preco.min || ''}
              onChange={(e) => handlePrecoChange('min', e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              value={filtros.preco.max || ''}
              onChange={(e) => handlePrecoChange('max', e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filtro por estoque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disponibilidade
          </label>
          <select
            value={filtros.estoque === null ? '' : filtros.estoque.toString()}
            onChange={(e) => handleEstoqueChange(
              e.target.value === '' ? null : e.target.value === 'true'
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="true">Em estoque</option>
            <option value="false">Sem estoque</option>
          </select>
        </div>
      </div>

      {/* Botão limpar filtros */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={limparFiltros}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};

export default Pesquisa;


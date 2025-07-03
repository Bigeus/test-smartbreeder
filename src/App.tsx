import { useState } from 'react';
import { ProdutosProvider } from './context/ProdutosContext';
import Header from './components/Header';
import ListaProdutos from './components/ListaProdutos';
import Favoritos from './components/Favoritos';
import Pesquisa from './components/Pesquisa';
import type { FiltrosProdutos } from './types';

function App() {
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'favoritos'>('produtos');
  const [filtros, setFiltros] = useState<FiltrosProdutos>({
    nome: '',
    categoria: null,
    preco: { min: null, max: null },
    estoque: null
  });

  return (
    <ProdutosProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-6">
          {/* Navegação por abas */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setAbaAtiva('produtos')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === 'produtos'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Produtos
                </button>
                <button
                  onClick={() => setAbaAtiva('favoritos')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === 'favoritos'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Favoritos
                </button>
              </nav>
            </div>
          </div>

          {/* Conteúdo das abas */}
          {abaAtiva === 'produtos' && (
            <>
              <Pesquisa filtros={filtros} onFiltrosChange={setFiltros} />
              <ListaProdutos filtros={filtros} />
            </>
          )}
          
          {abaAtiva === 'favoritos' && <Favoritos />}
        </div>
      </div>
    </ProdutosProvider>
  );
}

export default App;


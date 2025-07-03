import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Produto, Categoria, ProdutoFavorito } from '../types';
import produtosData from '../data/produtos_com_variacoes.json';
import categoriasData from '../data/categorias.json';

interface ProdutosContextType {
  produtos: Produto[];
  categorias: Categoria[];
  favoritos: ProdutoFavorito[];
  loading: boolean;
  adicionarFavorito: (produto: Produto) => void;
  removerFavorito: (produtoId: number) => void;
  isFavorito: (produtoId: number) => boolean;
  obterNomeCategoria: (categoriaId: number) => string;
}

const ProdutosContext = createContext<ProdutosContextType | undefined>(undefined);

export const useProdutos = () => {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error('useProdutos deve ser usado dentro de ProdutosProvider');
  }
  return context;
};

interface ProdutosProviderProps {
  children: ReactNode;
}

export const ProdutosProvider: React.FC<ProdutosProviderProps> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [favoritos, setFavoritos] = useState<ProdutoFavorito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProdutos(produtosData as Produto[]);
      setCategorias(categoriasData as Categoria[]);
      setLoading(false);
    };

    carregarDados();
  }, []);

  const adicionarFavorito = (produto: Produto) => {
    
    /* const produtosFavoritosPorCategoria = produto.categorias.map(categoriaId => {
      return favoritos.filter(fav => 
        fav.produto.categorias.includes(categoriaId)
      ).length;
    }); */

    produto.categorias.forEach(categoriaId => {
      const favoritosCategoria = favoritos.filter(fav => 
        fav.produto.categorias.includes(categoriaId)
      );
      
      // fav > 2 ?
      if (favoritosCategoria.length >= 2) {
        const maisAntigo = favoritosCategoria.sort((a, b) => 
          a.dataFavorito.getTime() - b.dataFavorito.getTime()
        )[0];
        
        setFavoritos(prev => prev.filter(fav => fav.produto.id !== maisAntigo.produto.id));
      }
    });

    //set date
    const novoFavorito: ProdutoFavorito = {
      produto,
      dataFavorito: new Date()
    };

    setFavoritos(prev => [...prev, novoFavorito]);
  };

  const removerFavorito = (produtoId: number) => {
    setFavoritos(prev => prev.filter(fav => fav.produto.id !== produtoId));
  };

  const isFavorito = (produtoId: number) => {
    return favoritos.some(fav => fav.produto.id === produtoId);
  };

  const obterNomeCategoria = (categoriaId: number) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria?.nome || 'Categoria desconhecida';
  };

  const value: ProdutosContextType = {
    produtos,
    categorias,
    favoritos,
    loading,
    adicionarFavorito,
    removerFavorito,
    isFavorito,
    obterNomeCategoria
  };

  return (
    <ProdutosContext.Provider value={value}>
      {children}
    </ProdutosContext.Provider>
  );
};


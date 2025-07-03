export interface Categoria {
  id: number;
  nome: string;
}

export interface Variacao {
  estoque: string;
  vendedor: string;
  fabricante: string;
  cor: string;
  voltagem: string;
  tamanho: string;
  garantia: string;
  peso: string | null;
  dimensoes: string | null;
}

export interface Produto {
  id: number;
  nome: string | null;
  categorias: number[];
  preco: string | null;
  descricao: string;
  variacao: Variacao[];
}

export interface ProdutoFavorito {
  produto: Produto;
  dataFavorito: Date;
}

export interface FiltrosProdutos {
  nome: string;
  categoria: number | null;
  preco: {
    min: number | null;
    max: number | null;
  };
  estoque: boolean | null;
}


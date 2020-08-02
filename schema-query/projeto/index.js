const { ApolloServer, gql } = require("apollo-server");

const perfis = [
  {
    id: 1,
    tipo: "Comum",
  },
  {
    id: 2,
    tipo: "Administrador",
  },
];

const typeDefs = gql`
  scalar Date

  type Perfil {
    id: Int
    tipo: String!
  }

  type Usuario {
    id: ID
    nome: String!
    email: String!
    idade: Int
    salario: Float
    vip: Boolean
  }

  type Produto {
    nome: String!
    preco: Float!
    desconto: Float
    precoComDesconto: Float
  }

  #pontos de entrada da sua API
  type Query {
    ola: String
    horaAtual: Date
    usuarioLogado: Usuario
    produtoEmDestaque: Produto
    numerosMegaSena: [Int!]!
    perfis: [Perfil!]!
    perfil(id: Int): Perfil
  }
`;

const resolvers = {
  Usuario: {
    salario(usuario) {
      return usuario.salario_real;
    },
  },
  Produto: {
    precoComDesconto(produto) {
      if (produto.desconto) return produto.preco * (1 - produto.desconto);
      else {
        return produto.preco;
      }
    },
  },

  Query: {
    ola() {
      return "Bom dia";
    },

    horaAtual() {
      return new Date();
    },
    usuarioLogado(obj) {
      console.log(obj);
      return {
        id: 1,
        nome: "matheus",
        email: "xxx",
        idade: 23,
        salario_real: 2000,
        vip: true,
      };
    },
    produtoEmDestaque() {
      return {
        nome: "notebook",
        preco: 1000,
        desconto: 0.15,
      };
    },
    numerosMegaSena() {
      const crescente = (a, b) => a - b;
      return Array(6)
        .fill(0)
        .map((n) => parseInt(Math.random() * 60 + 1))
        .sort(crescente);
    },
    perfis() {
      return perfis;
    },
    perfil(_, { id }) {
      const perfil = perfis.filter((x) => x.id === id);
      console.log(perfil);
      return perfil ? perfil[0] : null;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Executado na url:${url}`);
});

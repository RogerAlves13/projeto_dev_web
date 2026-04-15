# projeto_dev_web


## Integrantes

Alyce Mota da Silva - RA: 424107553

Everton da Fonseca Durães - RA: 1726109293

Gabriel Ferreira De Lima - RA: 924112094 

João Arthur Alves de Oliveira - RA: 924107841 

João Vitor Caporrino Souza - RA: 92410060 

Kathlyn Faustina de Paula Souza - RA: 924104900 

Layza Fernandes Silva - RA: 924104679 

Roger Henrique Alves Campos - RA: 924100757 

Ruan Ferreira Silva - RA: 924103220 

Vinícius Soares Barbosa - RA: 924202197 

Vitoria Antonio Dias - RA: 1726108233 

## Instruções de uso

# API de Mobilidade Urbana

Este projeto é uma API para cálculo de **paradas de ônibus mais próximas** com base na localização do usuário.

A aplicação utiliza coordenadas geográficas (latitude e longitude) para calcular a distância entre o usuário e as paradas cadastradas, retornando as mais próximas.

O projeto foi desenvolvido utilizando **Node.js, Express e TypeScript**, com o objetivo de simular funcionalidades semelhantes às encontradas em aplicativos de mobilidade urbana.

---

# Tecnologias utilizadas

- Node.js
- Express
- TypeScript
- npm

---

# Estrutura do projeto

mobilidade-app

│

├── public/               # Arquivos HTML estáticos

│

├── src/

│   ├── data/             # Base de dados das paradas

│   │   └── paradas.ts

│

│   ├── routes/           # Rotas da API

│

│   ├── services/         # Regras de negócio

│   │   ├── distancia.ts

│   │   └── encontrarParadas.ts

│

│   ├── types/            # Tipagens TypeScript

│   │   └── ParadaOnibus.ts

│

│   └── index.ts          # Arquivo principal do servidor

│

├── dist/                 # Código compilado

├── package.json

├── tsconfig.json

└── README.md

---

# Pré-requisitos

Antes de executar o projeto é necessário ter instalado:

- Node.js (versão 18 ou superior)
- npm
- Git

---

# Instalação

Clone o repositório:

```bash
git clone <https://github.com/RogerAlves13/projeto_dev_web?tab=readme-ov-file#projeto_dev_web>
```

Entre na pasta do projeto:

```bash
cd mobilidade-app
```

Instale as dependências:

```bash
npm install
```

---

# **Executando o projeto**

Compile o projeto TypeScript:

```bash
npx tsc
```

Execute o servidor:

```bash
**node dist/index.js**
```

O servidor iniciará em:

```bash
[http://localhost:3000](http://localhost:3000/)
```

---

# **Rotas da API**

**Status da API**

```bash
GET /
```

Retorno:

```bash
API de paradas funcionando 🚍
```

## **Buscar paradas próximas**

```bash
GET /paradas/proximas
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
| --- | --- | --- |
| lat | number | Latitude do usuário |
| lon | number | Longitude do usuário |

### Exemplo

```bash
/paradas/proximas?lat=-23.561684&lon=-46.656139
```

### **Exemplo de retorno**

```bash
[
  {
    "parada": {
      "id": 1,
      "nome": "Terminal Central",
      "latitude": -23.5505,
      "longitude": -46.6333
    },
    "distancia": 2.61
  }
]
```

---

# Como funciona o cálculo de distância

O sistema utiliza a fórmula de distância geográfica baseada em coordenadas de latitude e longitude para calcular a distância entre dois pontos no mapa.

Passos realizados:

1. Receber latitude e longitude do usuário
2. Calcular distância para cada parada cadastrada
3. Ordenar as paradas pela menor distância
4. Retornar as mais próximas

---

# Testando a API

Você pode testar utilizando:

- Navegador
- Postman
- Insomnia

Exemplo:

```bash
http://localhost:3000/paradas/proximas?lat=-23.561684&lon=-46.656139
```

---

# Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma nova branch

```bash
git checkout -b minha-feature
```

1. Faça suas alterações
2. Commit suas mudanças

```bash
git commit -m "feat: nova funcionalidade"
```

- Link do vídeo de como criar um Commit sem código

https://drive.google.com/drive/folders/1b9e_tEOwMcOG-tvOf6K-R6UOd5PdNg0h?usp=drive_link

**observação:** sempre utilizem o e-mail com o domínio Uni9.

1. Envie para o GitHub

```bash
git push origin minha-feature
```

1. Abra um Pull Request

---

# Melhorias futuras

- Integração com mapas
- Geolocalização do usuário
- Interface web
- Integração com API de transporte público
- Rotas de ônibus em tempo real

---

# Licença

Este projeto é de uso acadêmico e educacional.

## Descrição
Atualmente na cidade de São Paulo, a população enfrenta diversos desafios relacionados ao transporte público como superlotação, condições climáticas adversas e a quantidade de veículos disponíveis, fatores que impactam diretamente no tempo e na qualidade dos deslocamentos diários. 

Diante desse cenário, surge a Perseus, uma plataforma web, com o intuíto de expansão para dispositivos móveis, que tem como objetivo oferecer uma visualização detalhada dos trajetos que serão realizados pelos usuários. A aplicação permitirá consultar informações como condições climáticas baseadas na localização (com possibilidade de busca por outras regiões), cálculo de rotas, nível de lotação dos transportes públicos (como trens, metrôs e ônibus), além de dados sobre o trajeto, incluindo trânsito, acidentes e sinalizações, centralizando informações relevantes em um único ambiente, contribuindo para uma melhor tomada de decisão por parte dos usuários. 


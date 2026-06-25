# 🚇 Perseus — Plataforma de Mobilidade Urbana

> Todas as informações do seu trajeto em um único lugar.

[![TypeScript]](https://www.typescriptlang.org/)
[![CSS]](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![HTML]](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![Node.js]](https://nodejs.org/)
[![Supabase]](https://supabase.com/)

---

## 📖 Sobre o Projeto

A **Perseus** é uma plataforma web voltada para usuários do transporte público da cidade de São Paulo, com proposta de expansão para dispositivos móveis.

Inspirada em soluções como o **Moovit**, a Perseus centraliza em um único ambiente informações que hoje estão espalhadas em diferentes aplicativos — eliminando a necessidade de alternar entre apps para planejar um simples trajeto.

O projeto nasce de um contexto real: milhões de paulistanos dependem do transporte coletivo diariamente e enfrentam problemas como superlotação, atrasos, falta de previsibilidade e condições climáticas adversas. A Perseus oferece uma resposta tecnológica a esses desafios, promovendo autonomia, acessibilidade à informação e melhor qualidade de vida.

---

## ✨ Funcionalidades

### Tempo Real e Navegação
| # | Funcionalidade | Descrição |
|---|---|---|
| 1 | 📍 **Localização em tempo real** | Visualize a posição atual dos ônibus e trens |
| 2 | 🗺️ **Acompanhamento no mapa** | Acompanhe seu trajeto em tempo real |
| 3 | 🧭 **Navegação até o ponto** | Receba orientações até o embarque mais próximo |

### Planejamento de Rotas
| # | Funcionalidade | Descrição |
|---|---|---|
| 4 | 🛣️ **Consulta de rotas** | Encontre a melhor rota entre dois pontos |
| 5 | ⏱️ **Previsão de chegada** | Saiba quando o transporte vai chegar |
| 6 | 🔍 **Filtros personalizados** | Filtre por menos lotação, mais velocidade ou menos baldeações |

### Informações do Transporte
| # | Funcionalidade | Descrição |
|---|---|---|
| 7 | 🚌 **Nível de lotação** | Veja se o transporte está lotado antes de embarcar |
| 8 | 🔔 **Alertas de atrasos** | Receba notificações sobre interrupções e desvios |

### Colaboração dos Usuários
| # | Funcionalidade | Descrição |
|---|---|---|
| 9 | 📢 **Reporte de ocorrências** | Informe problemas no trajeto para outros usuários |
| 10 | 👀 **Visualização de ocorrências** | Veja relatos de outros passageiros em tempo real |

### Contexto Externo e Personalização
| # | Funcionalidade | Descrição |
|---|---|---|
| 11 | 🌦️ **Clima na rota** | Previsão do tempo ao longo do trajeto |
| 12 | ❤️ **Rotas e locais favoritos** | Salve destinos e linhas mais usadas |
| 13 | 📜 **Histórico de trajetos** | Acesse rotas anteriores rapidamente |
| 14 | 🔐 **Autenticação segura** | Conta de usuário com login e logout |

---

## 🛠️ Tecnologias Utilizadas

- **TypeScript** — linguagem principal do projeto
- **HTML5 / CSS3** — estrutura e estilização da interface
- **Node.js** — ambiente de execução
- **Vite** — bundler e servidor de desenvolvimento
- **Supabase** — banco de dados e autenticação

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado na máquina
- [Git](https://git-scm.com/) instalado

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/RogerAlves13/projeto_dev_web.git

# 2. Acesse a pasta do projeto
cd projeto_dev_web/perseus-web/perseus-dev

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** no seu navegador.

---

## 📁 Estrutura do Projeto

```
projeto_dev_web/
└── perseus-web/
    └── perseus-dev/
        ├── src/
        │   ├── assets/         # Imagens e recursos estáticos
        │   ├── auth/           # Autenticação de usuários
        │   ├── dados/          # Dados e configurações
        │   └── services/       # Integrações (clima, rotas, SPTrans etc.)
        ├── index.html
        ├── main.ts
        ├── style.css
        └── package.json
```

---

## 📋 Requisitos Não Funcionais

- ⚡ **Desempenho** — coordenadas atualizadas em curtos intervalos para precisão em tempo real
- 🟢 **Disponibilidade** — alta disponibilidade durante o horário de funcionamento das frotas
- 🔋 **Eficiência** — consumo mínimo de bateria e dados móveis
- ♿ **Acessibilidade** — interface seguindo diretrizes WCAG (contraste e leitores de tela)
- 📡 **Geolocalização** — precisão inferior a 15 metros em céu aberto
- 📈 **Escalabilidade** — suporte a picos de acesso nos horários de rush (07h e 18h)
- 📶 **Modo offline** — cache das últimas rotas pesquisadas para uso sem internet
- 🔒 **Segurança** — autenticação segura entre rastreadores GPS e servidor
- 🔗 **Interoperabilidade** — compatível com padrão GTFS para integração com outros serviços

---

## 📊 Gestão do Projeto

- 📌 [Kanban no GitHub Projects](https://github.com/users/RogerAlves13/projects/2)

---

## 👥 Equipe

| Nome | RA |
|---|---|
| Alyce Mota da Silva | 424107553 |
| Gabriel Ferreira De Lima | 924112094 |
| João Arthur Alves de Oliveira | 924107841 |
| João Vitor Caporrino Souza | 924100660 |
| Kathlyn Faustina de Paula Souza | 924104900 |
| Layza Fernandes Silva | 924104679 |
| Roger Henrique Alves Campos | 924100757 |
| Ruan Ferreira Silva | 924103220 |
| Vinícius Soares Barbosa | 924202197 |
| Vitoria Antonio Dias | 1726108233 |

---

## 🎓 Contexto Acadêmico

Projeto desenvolvido como parte do **5º Semestre** do curso de **Análise e Desenvolvimento de Sistemas** na **UNINOVE — Universidade Nove de Julho**, São Paulo, SP — 2026.

Disciplina: **Projeto de Extensão em Criação de Sistemas**

---

> *"Centralizando informações, simplificando deslocamentos."*

[HTML_BADGE]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[CSS_BADGE]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[JS_BADGE]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[LOCALSTORAGE_BADGE]: https://img.shields.io/badge/Storage-LocalStorage-4A5568?style=for-the-badge&logo=html5&logoColor=white
[EXCEL_BADGE]: https://img.shields.io/badge/Export-CSV_/_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white

<h1 align="center" style="font-weight: bold;">🍕 Calcula Pizza 2026: Engenharia de Cardápio & Precificação 📊</h1>

### 🛠️ Tecnologias Utilizadas
![html][HTML_BADGE] ![css][CSS_BADGE] ![javascript][JS_BADGE] ![localstorage][LOCALSTORAGE_BADGE] ![excel][EXCEL_BADGE]

<details open="open">
<summary>📑 Sumário</summary>

- [📋 Sobre o Projeto](#-sobre-o-projeto)
  - [🎯 Objetivos](#-objetivos)
  - [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🏗️ Arquitetura do Sistema](#-arquitetura-do-sistema)
- [📍 Estratégias Comerciais & Regras de Negócio](#-estratégias-comerciais--regras-de-negócio)
- [🚀 Futuras Melhorias (Roadmap)](#-futuras-melhorias-roadmap)
- [👨‍💻 Autor](#-autor)

</details>

## 📋 Sobre o Projeto

Gerenciar e precificar itens de cardápio em marketplaces de delivery é um desafio complexo devido à alta variabilidade de taxas (comissões de planos, taxas de pagamento online, custos de adiantamento de recebíveis, impostos e logística de entrega).

O **Calcula Pizza** foi desenvolvido para solucionar esse problema, permitindo que donos de pizzarias e gerentes calculem com precisão cirúrgica o **preço de venda ideal** com base na margem de lucro desejada, ou **simulem o lucro real** de preços já praticados no cardápio, evitando prejuízos ocultos nas principais plataformas de delivery do mercado (**iFood** e **99Food**).

### 🎯 Objetivos
1. **Eliminar Prejuízos Ocultos:** Mapear rigorosamente todas as deduções de taxas das plataformas, impostos federais e custos logísticos fixos por pedido.
2. **Previsibilidade Financeira:** Dar autonomia ao lojista para alternar entre metas de margem percentual líquida ou lucro fixo em moeda (R$).
3. **Agilidade Operacional:** Disponibilizar uma ferramenta web rápida, responsiva e com persistência de dados local sem necessidade de instalações complexas.

### ✨ Funcionalidades Principais
- **Alternância & Comparativo de Plataformas:** Alterne instantaneamente entre iFood e 99Food ou utilize a aba de comparação lado a lado para avaliar onde seu produto é mais rentável.
- **Gestão de Logística Dinâmica:** Escolha entre **Entrega Própria** (calculando o custo real do motoboy vs. taxa cobrada do cliente com subsídio dinâmico) ou **Entrega da Plataforma**.
- **Estratégias Comerciais Avançadas:**
  - Ativação de **Entrega Grátis** com cálculo de subsídio da loja.
  - Inclusão e ajuste de taxas de **Adiantamento de Recebíveis**.
  - **Promoções Inteligentes, Cupons e Campanhas:** Suporte a descontos percentuais, cupons 100% bancados pela loja e campanhas de coparticipação (onde parte do desconto é dada pelo iFood/99Food e parte é subsidiada pela pizzaria), gerando automaticamente a ancoragem visual *"De / Por"*.
- **Persistência com LocalStorage:** Suas taxas personalizadas (impostos, custos de entrega e taxas contratuais) são salvas automaticamente no navegador, dispensando redigitação a cada acesso.
- **Ferramentas de Otimização:** Botão de arredondamento psicológico inteligente para finais em `,90` e exportação estruturada de relatórios em formato **CSV** compatível com o Excel (padrão brasileiro `;`).

## 🏗️ Arquitetura do Sistema

O **Calcula Pizza** é uma aplicação web cliente (*Client-Side Application*) moderna desenvolvida inteiramente com foco em performance, portabilidade e ausência de dependências de servidores backend complexos:

- **Interface Gráfica e Estilização:** Construída utilizando **Tailwind CSS** por meio de CDN, garantindo um design system limpo, responsivo e adaptado com paleta em modo escuro (*Dark Mode*).
- **Motor de Cálculo e Reatividade:** Desenvolvido em **JavaScript puro (ES6+)** manipulando o DOM em tempo real. Cada alteração de input dispara instantaneamente o motor matemático de recálculo financeiro das margens.
- **Camada de Persistência Local:** Utiliza a API nativa do navegador **LocalStorage** para salvar e recuperar as preferências e taxas customizadas pelo usuário de forma segura e imediata.
- **Exportação de Dados:** Conversão de matrizes de objetos em arquivos de texto codificados em UTF-8 com BOM (`\uFEFF`) e separadores por ponto e vírgula, garantindo abertura limpa no Microsoft Excel ou Google Sheets sem quebras de colunas.

## 📍 Estratégias Comerciais & Regras de Negócio

O sistema aplica rigorosas fórmulas matemáticas para descontar as taxas em cascata sobre o valor transacionado:
- **Deduções Percentuais:** Soma de comissão do plano da plataforma + taxa de pagamento online + taxa de adiantamento de recebíveis + imposto sobre o faturamento (Simples Nacional / DAS).
- **Coparticipação de Cupons:** No modelo compartilhado de campanhas (ex: iFood), o sistema subtrai do repasse líquido apenas o subsídio real que sai do caixa da pizzaria, calculando corretamente o impacto na margem final.

## 🚀 Futuras Melhorias (Roadmap)

Pretendo implementar as seguintes evoluções no projeto em breve:
- [ ] **Catálogo de Pizzas (Múltiplos Produtos):** Permitir o cadastro de um cardápio completo (Calabresa, Margherita, Portuguesa, etc.) e exibir um painel consolidado com a rentabilidade geral da loja.
- [ ] **Simulador de CMV Dinâmico por Ingrediente:** Criar uma ficha técnica onde o lojista seleciona os insumos e gramaturas (ex: muçarela, massa, molho, calabresa) para o cálculo automático do custo de mercadoria vendida (CMV).
- [ ] **Gráficos de Composição de Custos:** Integrar biblioteca de gráficos (como Chart.js) para exibir a distribuição percentual de custos de cada pizza (Insumos, Taxas, Impostos e Lucro).
- [ ] **Calculadora de Desconto Máximo:** Ferramenta reversa que indica ao lojista o limite de desconto aplicável em campanhas sem entrar na faixa de prejuízo por pedido.
- [ ] **Modo Claro (Light Mode):** Adicionar um botão de alternância de tema para atender usuários que preferem interfaces claras durante o dia.

## 👨‍💻 Autor

Desenvolvido por **Vitor Pires**.  
Conheça meu portfólio e outros projetos em: [piresvitor.github.io](https://piresvitor.github.io)


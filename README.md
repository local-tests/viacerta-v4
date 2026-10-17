# Site Via Certa Internet — versão 02 (várias páginas)

Teste de estrutura no modelo da Adyl. A página inicial mostra só os três tipos de conexão, e cada um abre a sua própria página. A `versão-01` (página única) continua intacta na pasta ao lado, para comparar.

Continua sendo HTML, CSS e JavaScript puros, sem build. Funciona no GitHub Pages ou em qualquer hospedagem estática.

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Início: cartões **Para sua casa**, **Para sua empresa** e **Para seu evento** (com selo "Novo"), atalhos de cliente, avaliações do Google e "Em resumo" |
| `residencial.html` | Planos, benefícios, Indique e ganhe, cobertura, app e FAQ |
| `empresas.html` | Tipos de negócio, o que oferecemos, formulário de proposta e FAQ |
| `eventos.html` | Soluções para eventos, tipos de evento, como funciona, formulário de orçamento e FAQ |
| `atendimento.html` | Vendas, suporte e financeiro, loja com mapa e FAQ de clientes |

Nas páginas internas, abaixo do menu, há abas **Casa · Empresas · Eventos** para trocar de página com um toque.

O cabeçalho, o rodapé, a barra inferior do celular e as janelas são **iguais em todas as páginas**. Se mudar um deles, repita a mudança nas 5 páginas. Os blocos estão marcados com o comentário `(igual em todas as páginas)`.

Os ícones (WhatsApp, Google, Instagram, Facebook, TikTok etc.) ficam **dentro de cada página**, no início do `<body>`. Assim eles aparecem até quando o `index.html` é aberto direto da pasta, com duplo clique.

## Ilustrações

| Arquivo | Onde aparece |
|---|---|
| `assets/img/ilustra-casa.svg` | cartão "Para sua casa" no início e topo de `residencial.html` |
| `assets/img/ilustra-empresa.svg` | cartão "Para sua empresa" e topo de `empresas.html` |
| `assets/img/ilustra-evento.svg` | cartão "Para seu evento" e topo de `eventos.html` |

São ilustrações vetoriais nas cores da marca, leves (4 a 15 KB) e nítidas em qualquer tela. No celular, viram miniaturas nos cartões do início, para os três continuarem cabendo na primeira tela.

**Fotos reais do cliente funcionam ainda melhor**: equipe instalando, loja, um evento atendido. Para trocar, salve a foto em `assets/img/` (de preferência `.webp`, com até 1200 px de largura) e troque o `src` da imagem nas páginas.

## Cidade antes do WhatsApp

Todo botão de contato abre uma janela perguntando a cidade. A pergunta muda conforme o assunto:

| Assunto (`data-wa-ctx`) | Pergunta | Opções |
|---|---|---|
| `casa` | Onde você mora? | Moro em Nova Araçá · Moro em Paraí · Moro em outra cidade |
| `empresa` | Onde fica a sua empresa? | Em Nova Araçá · Em Paraí · Em outra cidade |
| `evento` | Onde será o evento? | Em Nova Araçá · Em Paraí · Em outra cidade da região |
| `cliente` | Onde fica a sua conexão? | Em Nova Araçá · Em Paraí · Em outra cidade |
| `geral` | De onde você fala? | Sou de Nova Araçá · Sou de Paraí · Sou de outra cidade |

A cidade entra no lugar de `{cidade}` na mensagem do botão (atributo `data-wa`). Por exemplo, o botão do plano Ideal tem:

```
data-wa="Olá! Quero contratar o plano IDEAL 700 Mega por R$ 99,90/mês em {cidade}."
```

Se a pessoa escolhe Paraí, a mensagem chega assim: *"Olá! Quero contratar o plano IDEAL 700 Mega por R$ 99,90/mês em Paraí-RS."* Em "outra cidade", ela digita o nome e o nome entra na mensagem.

- A última cidade escolhida fica destacada na próxima vez, até a pessoa fechar o navegador.
- Para um link pular a pergunta, use `data-wa-direto` (é o caso de "Mora em outra cidade da região? Pergunte pra gente").
- Os formulários (cobertura, indicação, empresa e evento) já pedem a cidade num campo próprio, então não abrem a janela.

## SEO

- Cada página tem título, descrição e H1 próprios, focados em uma busca: "planos de internet fibra Nova Araçá e Paraí", "internet para empresas…" e "internet para eventos…". Isso dá mais chance de aparecer em buscas diferentes do que uma página única.
- Schema por página:
  - `LocalBusiness` completo no início;
  - `Service` + `OfferCatalog` com os planos;
  - `Service` de empresas e de eventos;
  - `FAQPage` em cada página com FAQ;
  - `BreadcrumbList` nas páginas internas.
- O `sitemap.xml` lista as 5 páginas. O `llms.txt` ganhou empresas, eventos e a lista de páginas.

## Acessibilidade (revisão de 17/10/2026)

Foi feita uma auditoria automática nas 5 páginas, em 320, 375, 768, 1024 e 1280 px, com as janelas abertas e fechadas. Ela conferiu:
- contraste de todo texto visível (mínimo 4,5:1, ou 3:1 em títulos grandes);
- botões e links sem nome;
- campos sem rótulo;
- ordem dos títulos;
- IDs repetidos;
- áreas de toque menores que 24 px;
- textos estourando botões;
- conteúdo saindo da tela.

O que foi corrigido:
- Painel "Seu evento conectado": o texto estava escuro sobre o fundo escuro (1,4:1). Agora é branco.
- "Indique e ganhe": o degradê vermelho ficou mais escuro para o texto branco passar de 4,5:1.
- "WhatsApp" na barra inferior do celular (4,3:1) e textos do mockup do app (3,8:1).
- Bordas dos campos com 3:1 e texto de exemplo (placeholder) mais escuro.
- Áreas de toque maiores em "Início" (trilha), "Voltar ao topo" e no telefone da loja.
- Em telas de 320 a 400 px: o cabeçalho cabe inteiro, os botões quebram linha em vez de estourar e a grade de tipos de evento vira uma coluna.
- Leitores de tela:
  - o seletor de planos anuncia qual velocidade está marcada;
  - o carrossel de avaliações é anunciado como região;
  - campos com erro são marcados como inválidos.

As mesmas correções de contraste, toque e tela estreita foram aplicadas na `versão-01`.

Ao trocar cores, mantenha texto branco só sobre vermelhos iguais ou mais escuros que `#e10010`, e texto escuro só sobre fundos claros.

## Para confirmar com o cliente antes de publicar

### Loja de Paraí (adicionada em 17/10/2026)

- Endereço: Rua Sete de Setembro, 250, Centro, Paraí - RS, 95360-000. Mesmo telefone e WhatsApp de Nova Araçá.
- **Confirmar o horário.** O site usa o mesmo horário de Nova Araçá nas duas lojas, inclusive no schema.
- **Criar o Perfil da Empresa no Google para a loja de Paraí.** Hoje o Google Maps só mostra o endereço, sem a Via Certa. Um perfil próprio, com fotos, horário e avaliações, é o que mais ajuda a aparecer em "internet Paraí" no mapa e na busca local. Quando existir, troque o mapa e o "Como chegar" da loja de Paraí pelo link do perfil.


O texto das páginas **Empresas** e **Eventos** foi escrito a partir de modelos do mercado (a Infotech, no caso de eventos). Nada disso veio do cliente, então ele precisa confirmar:

1. **Eventos:**
   - quais destes serviços a Via Certa realmente oferece: link de internet temporário, Wi-Fi para o público, rede separada para maquininhas, transmissão ao vivo e suporte no local;
   - se atende fora de Nova Araçá e Paraí;
   - se faz visita técnica ao local;
   - se tem fotos de eventos já atendidos (ajudam muito) e se há algum evento ou cliente que pode ser citado.
2. **Empresas:**
   - quais produtos existem (planos empresariais, link dedicado, IP fixo);
   - se há atendimento prioritário para empresas.
3. Itens que continuam da versão 01: domínio, regras do Indique e ganhe, horário de segunda-feira e o que o plano Ultra tem a mais.

## Ver localmente

```bash
python -m http.server 5502 --directory versão-02
```

Depois é só abrir http://localhost:5502.

## Subir no GitHub

Igual à versão 01. Os arquivos `.gitignore`, `.gitattributes` e `.nojekyll` já estão na pasta. Com o GitHub Pages, os endereços ficam `/residencial.html`, `/empresas.html` etc. O GitHub Pages também aceita sem o `.html`.

# Especificação de Design - FiguCopa 2026
**Subsistema Core: Matching Engine, Layout de Trocas & Sincronização PWA**  
*Data: 24 de Maio de 2026*  
*Status: Aguardando Aprovação do Usuário*

---

## 1. Visão Geral e Escopo do MVP

O **FiguCopa 2026** é uma Progressive Web App (PWA) de alto nível que simplifica e gamifica a troca de figurinhas da Copa do Mundo 2026. Com base em nossa sessão de alinhamento estratégico, o MVP focará no **Fluxo de Matches & Troca Inteligente** como recurso central de validação.

### Metas do MVP
- Conectar colecionadores próximos com alta compatibilidade bilateral de trocas.
- Permitir entrada de dados (estoque do álbum) robusta que funcione mesmo em ambientes sem conectividade de internet (stadiums, escolas, feiras de troca).
- Fornecer uma interface visual premium, fluida e com suporte completo a temas claro/escuro.

---

## 2. Decisões de Arquitetura e UI/UX

### 2.1 Interface do Feed de Matches (Foco em Pessoas)
Adotaremos um **Feed de Cards Focado em Pessoas**, ordenando os usuários por distância geográfica e um algoritmo que calcula a compatibilidade mútua de figurinhas (Match Score).
- **Estrutura do Card**: Exibição em duas colunas claras: *Você Envia (Suas Repetidas Faltantes nele)* vs. *Você Recebe (Repetidas dele Faltantes em você)*.
- **Ações Rápidas**: Botão de destaque para propor a troca formal e atalho para ver o perfil completo do colecionador.
- **Vantagem**: Reduz a fricção transacional ao incentivar trocas em lote (multi-trocas de uma só vez).

### 2.2 Sistema de Temas e Identidade Visual (Tema Híbrido)
A aplicação implementará um sistema de estilo premium com **Chaveador de Tema (Tema Híbrido)**:
- **Tema Escuro (Dark Mode Premium)**: Estilo gamer/futurista com fundos escuros (#121214), degradês de azul elétrico e acentos verde neon. Confortável para eventos à noite e telas OLED.
- **Tema Claro (Light Mode Esportivo)**: Estilo dinâmico inspirado na FIFA, com fundo branco limpo, detalhes em azul royal, dourado e verde esmeralda. Alta legibilidade em ambientes externos.
- **Implementação**: Custom properties de CSS (Vanilla CSS), transição suave de cores e sincronização automática baseada na preferência de sistema do usuário (`prefers-color-scheme`), com opção de override manual no cabeçalho.

### 2.3 Estratégia "Offline-First" (Edição com Sincronização Local)
Para garantir usabilidade máxima nos locais lotados de troca presencial:
- **Armazenamento Local**: Uso de IndexedDB (ou localStorage para simplicidade inicial) para registrar novas figurinhas marcadas como adquiridas ou repetidas offline.
- **Indicador Visual**: Banner ou badge discreto informando o status da sincronização ("Modo offline - X alterações salvas no aparelho").
- **Fila de Sincronização**: Um Service Worker monitora o status da conexão. Ao restabelecer a rede, as atualizações locais são enviadas ao Supabase de forma transparente via API do PWA, resolvendo conflitos a favor do timestamp mais recente.

---

## 3. Arquitetura Técnica e Fluxo de Dados

```
[ Usuário (React PWA) ]
      │
      ├── (Offline) ──> [ Armazenamento Local: IndexedDB / Cache API ]
      │
      └── (Online)  ──> [ Supabase API ]
                             │
                             ├──> [ PostgreSQL (PostGIS) ] ──> Match Engine (Cálculo Geográfico)
                             └──> [ Supabase Realtime ]    ──> Chat e Notificações instantâneas
```

### 3.1 Modelagem de Dados Resumida
- **users**: ID, nome, foto, localização aproximada (cidade/bairro texto), time favorito.
- **stickers**: ID, número (ex: BRA-10), nome, seleção, posição, tipo (comum, brilhante/especial).
- **user_stickers**: user_id, sticker_id, owned (bool), quantity_extra (inteiro).
- **matches**: user_a_id, user_b_id, match_score, status, timestamp.
- **trades**: match_id, stickers_a_to_b (array), stickers_b_to_a (array), status (proposta, aceito, concluído).

---

## 4. Plano de Verificação

### Testes Automatizados
- Validação do algoritmo de matching bilateral com testes unitários no Jest/Vitest.
- Teste de persistência offline simulando queda de rede no ambiente de desenvolvimento.

### Verificação Manual
- Testes manuais de visualização em dispositivos móveis (Safari iOS e Chrome Android) via Chrome DevTools para validar responsividade e toque.
- Validação das transições suave de tema claro/escuro.

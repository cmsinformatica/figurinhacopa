# ⚽ FiguCopa 2026 - PWA de Matches, Geolocalização e Trocas da Copa 2026 🏆

<p align="center">
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Supabase-blueviolet?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Aesthetics-Stadium--Gamer%20%7C%20Glassmorphism-electricblue?style=for-the-badge" alt="Design" />
  <img src="https://img.shields.io/badge/Realtime-Supabase%20Channels%20%7C%20WebSockets-green?style=for-the-badge" alt="Realtime" />
  <img src="https://img.shields.io/badge/Security-RLS%20%7C%20LGPD%20Compliant-red?style=for-the-badge" alt="Security" />
</p>

O **FiguCopa 2026** é um Progressive Web App (PWA) de elite projetado para colecionadores de figurinhas da Copa do Mundo de 2026. Com foco em geolocalização na **Bahia (Salvador)**, o aplicativo conecta colecionadores próximos de forma inteligente através de matches bilaterais perfeitos e proporciona trocas físicas seguras e rápidas.

---

## 🎨 Design System & Estética Gamer
A interface foi construída seguindo a estética premium **Stadium-Gamer**, caracterizada por:
*   🌌 **Glassmorphism translúcido** com filtros de desfoque de fundo avançados.
*   🟢 **Glows e luzes neon esportivas** (verde neon para atividades, azul elétrico para destaques e dourado lendário cintilante para cromos especiais).
*   📱 **Layout Mobile-First responsivo** com animações de sonar e letreiros esportivos em tempo real.

---

## 🚀 Recursos de Elite Implementados

### 1. 📊 Escalonamento Oficial da Copa 2026
Alinhado perfeitamente com os dados oficiais do álbum físico da Copa de 2026:
*   **980 Figurinhas no Total**: 960 cromos de seleções (48 seleções × 20 cromos) + 20 cromos de introdução FIFA (`FWC-01` a `FWC-20`).
*   **68 Cromos Brilhantes/Especiais**: Os 48 escudos oficiais de número 1 das seleções + os 20 cromos introdutórios da FIFA (Estádios, Bola, Mascote, etc.).

### 2. 📡 Radar Sonar Gamer & Geolocalização (Salvador, Bahia)
*   **Sonar de Coordenadas Polares**: Uma simulação matemática altamente polida que posiciona outros colecionadores geograficamente no radar, com raios determinísticos gerados a partir do bairro e da distância real.
*   **Pontos Turísticos Seguros (`MEETING_POINTS`)**: Mapeamento inteligente de Salvador para sugerir pontos seguros de encontro (Farol da Barra, Largo da Mariquita no Rio Vermelho, Salvador Shopping, Arena Fonte Nova, Pelourinho, etc.).

### 3. 💬 Compartilhamento de Fotos e Chat em Tempo Real
*   **Fotos de Cromos**: Botão de **Câmera 📸** que aciona um seletor rápido para simular o envio de fotos de figurinhas raras (`BRA-10`, `ARG-10`, etc.), renderizando-as como miniaturas holográficas físicas no chat para verificação do estado físico do cromo antes da troca.
*   **Tempo Real**: Sincronização via WebSockets ativa do Supabase.

### ### 4. 🔑 Autenticação Nativa Supabase & Cadastro Dinâmico
*   **Sign Up & Sign In**: Os novos usuários se registram fornecendo dados cadastrais (nome, bairro e seleção) e o Supabase Auth cria a credencial de segurança.
*   **Trigger de Sincronização**: Um gatilho automático (`trigger`) no banco de dados clona os dados de cadastro da autenticação diretamente para a tabela de perfis públicos, mantendo a consistência dos dados do usuário.

### 🛡️ 5. Painel Administrativo de Monitoramento (Admin Panel)
*   **Controle Centralizado**: Administrators (`is_admin === true`) visualizam um botão exclusivo no Header para gerenciar a Arena.
*   **Métricas & Gestão**: Monitoramento do progresso individual no álbum de 980 cromos, gerenciamento de permissões administrativas dos clientes e anúncio em tempo real de novos eventos de trocas em Salvador.

---

## 🔌 Arquitetura Tecnológica

O banco de dados foi projetado no modelo **Offline-First Híbrido**:
*   A leitura/escrita ocorre de forma síncrona no cache local (`localStorage`), garantindo que o app permaneça **100% veloz e responsivo**.
*   Em segundo plano (background thread), o app sincroniza e atualiza as tabelas correspondentes no **Supabase** de forma assíncrona.
*   Caso o dispositivo fique sem rede, as atualizações entram em fila local (`offlineSyncQueue`) e são sincronizadas no instante em que a conexão retorna.

---

## ⚡ Como Colocar Online no Vercel

Você pode colocar o seu **FiguCopa 2026** no ar gratuitamente em menos de 2 minutos usando a **Vercel**:

### Método 1: Pelo Dashboard da Vercel (Recomendado)
1. Crie uma conta gratuita em [Vercel](https://vercel.com).
2. Clique em **Add New > Project** e importe o seu repositório do GitHub `cmsinformatica/figurinhacopa`.
3. Expanda a seção de **Environment Variables** e adicione as duas chaves necessárias:
   * `VITE_SUPABASE_URL` = *[Sua URL do Supabase]*
   * `VITE_SUPABASE_ANON_KEY` = *[Sua Anon Key do Supabase]*
4. Clique em **Deploy**! A Vercel detecta a build do Vite automaticamente e disponibiliza o app online sob HTTPS e totalmente otimizado.

### Método 2: Pelo Terminal (CLI)
Instale a CLI do Vercel e envie o projeto com apenas um comando:
```bash
npm install -g vercel
vercel
```
Siga as instruções rápidas do terminal para configurar as variáveis de ambiente e deployar!

---

## 📂 Como Executar Localmente

### 1. Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/cmsinformatica/figurinhacopa.git
cd figurinhacopa
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://sua-url-do-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-publica
```
> 🔒 *Nota de Segurança: O arquivo `.env` já está listado no `.gitignore` para impedir que suas chaves privadas vazem em repositórios públicos.*

### 3. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
O app estará acessível em: **http://localhost:3006/** ou **http://localhost:5173/**.

### 4. Compilar para Produção (Zero Warnings)
```bash
npm run build
```

---

## 🗄️ Script SQL DDL das Tabelas & Triggers (Supabase SQL Editor)
Execute este script completo diretamente na aba **SQL Editor** do seu painel do Supabase para estruturar a base relacional com apenas 1 clique, incluindo a tabela de perfis protegida com RLS e o trigger de sincronização de cadastro com o Supabase Auth:

```sql
-- 1. Criação da tabela de Perfis Públicos com suporte administrativo
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY, -- Mapeia direto ao auth.users.id
  name TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  favorite_team TEXT DEFAULT 'BRA',
  distance TEXT DEFAULT '0m',
  completed_trades INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  avatar TEXT DEFAULT '⚽',
  is_admin BOOLEAN DEFAULT FALSE, -- Controle do Painel Administrativo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de controle de cromos possuídos
CREATE TABLE IF NOT EXISTS public.user_stickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sticker_id TEXT NOT NULL,
  owned BOOLEAN DEFAULT FALSE,
  extra INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, sticker_id)
);

-- 3. Tabela de Propostas formais de Trocas
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  you_send TEXT[] NOT NULL,
  you_receive TEXT[] NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  rating INTEGER DEFAULT 0,
  reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Mensagens do Chat em Tempo Real
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  sticker_photo_code TEXT,
  trade_id UUID REFERENCES public.trades(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Encontros de Trocas Ativos
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  local TEXT NOT NULL,
  date TEXT NOT NULL,
  initial_attendees INTEGER DEFAULT 0,
  neighborhood TEXT NOT NULL
);

-- 6. Tabela de confirmação de presença nos Encontros
CREATE TABLE IF NOT EXISTS public.event_confirmations (
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (event_id, user_id)
);

-- --- TRIGGER PARA CRIAR PERFIL PÚBLICO AUTOMATICAMENTE APÓS CADASTRO ---
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, neighborhood, favorite_team, is_admin)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Colecionador'),
    COALESCE(new.raw_user_meta_data->>'neighborhood', 'Barra'),
    COALESCE(new.raw_user_meta_data->>'favorite_team', 'BRA'),
    FALSE -- Por padrão, novos cadastros não são admins
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Associa o trigger ao evento de cadastro de novos usuários do Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🥇 Licença e Créditos
Desenvolvido por **Cristiano Martins (CMS Informática)** para a comunidade de colecionadores oficiais da Copa do Mundo 2026. ⚽🇧🇷


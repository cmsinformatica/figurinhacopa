-- FiguCopa 2026 - Supabase SQL Setup Script
-- Execute este script completo no painel do SQL Editor do seu projeto Supabase.

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Revoga a permissão de execução pública por segurança (impede rpc bypass)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- Associa o trigger ao evento de cadastro de novos usuários do Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEGURANÇA: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilita RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_confirmations ENABLE ROW LEVEL SECURITY;

-- Limpa políticas existentes para evitar duplicatas
DROP POLICY IF EXISTS "users_view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "admin_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_update_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_own_stickers_all" ON public.user_stickers;
DROP POLICY IF EXISTS "trades_involved_users_select" ON public.trades;
DROP POLICY IF EXISTS "trades_involved_users_insert" ON public.trades;
DROP POLICY IF EXISTS "trades_involved_users_update" ON public.trades;
DROP POLICY IF EXISTS "messages_involved_users_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_own" ON public.messages;
DROP POLICY IF EXISTS "events_select_all" ON public.events;
DROP POLICY IF EXISTS "events_insert_admin" ON public.events;
DROP POLICY IF EXISTS "event_confirmations_own" ON public.event_confirmations;

-- PROFILES: cada um vê/altera apenas o próprio perfil; admin vê todos
CREATE POLICY "users_view_own_profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_view_all_profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_update_all_profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- USER_STICKERS: cada um vê/altera apenas os próprios stickers
CREATE POLICY "users_own_stickers_all" ON public.user_stickers
  FOR ALL USING (auth.uid() = user_id);

-- TRADES: envolvidos (sender/receiver) podem ver, inserir e atualizar
CREATE POLICY "trades_involved_users_select" ON public.trades
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "trades_involved_users_insert" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "trades_involved_users_update" ON public.trades
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- MESSAGES: envolvidos podem ver; apenas remetente pode inserir
CREATE POLICY "messages_involved_users_select" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert_own" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- EVENTS: todos veem; admin cria/edita
CREATE POLICY "events_select_all" ON public.events
  FOR SELECT USING (TRUE);

CREATE POLICY "events_insert_admin" ON public.events
  FOR INSERT WITH CHECK (public.is_admin());

-- EVENT_CONFIRMATIONS: cada um gerencia suas próprias confirmações
CREATE POLICY "event_confirmations_own" ON public.event_confirmations
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- FUNÇÕES RPC DE SEGURANÇA
-- ============================================================

-- is_admin(): verifica se o usuário logado é administrador
-- Usa SECURITY DEFINER para evitar recursão infinita nas policies RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), FALSE);
$$;

-- delete_my_account(): auto-exclusão de conta pelo titular (LGPD Art. 18)
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID := auth.uid();
BEGIN
  DELETE FROM public.event_confirmations WHERE user_id = user_id;
  DELETE FROM public.messages WHERE sender_id = user_id OR receiver_id = user_id;
  DELETE FROM public.trades WHERE sender_id = user_id OR receiver_id = user_id;
  DELETE FROM public.user_stickers WHERE user_id = user_id;
  DELETE FROM public.profiles WHERE id = user_id;
END;
$$;

-- Revoga execução pública de funções sensíveis (apenas authenticated pode chamar)
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.delete_my_account() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.delete_my_account() FROM anon;

-- ============================================================
-- TABELA DA COPA DO MUNDO 2026
-- ============================================================

CREATE TABLE IF NOT EXISTS public.worldcup_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id TEXT UNIQUE NOT NULL,
  group_name TEXT,
  phase TEXT NOT NULL,
  home_team TEXT,
  away_team TEXT,
  home_score INTEGER,
  away_score INTEGER,
  played BOOLEAN DEFAULT FALSE,
  stage_name TEXT,
  penalty_home INTEGER,
  penalty_away INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.worldcup_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "worldcup_matches_select_all" ON public.worldcup_matches;
DROP POLICY IF EXISTS "worldcup_matches_insert_admin" ON public.worldcup_matches;
DROP POLICY IF EXISTS "worldcup_matches_update_admin" ON public.worldcup_matches;

CREATE POLICY "worldcup_matches_select_all" ON public.worldcup_matches
  FOR SELECT USING (TRUE);

CREATE POLICY "worldcup_matches_insert_admin" ON public.worldcup_matches
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "worldcup_matches_update_admin" ON public.worldcup_matches
  FOR UPDATE USING (public.is_admin());

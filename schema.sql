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

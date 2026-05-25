# Plano de Correção — FiguCopa 2026

> Baseado no relatório de análise vs PRD. Prioridade: 🔴 Crítico > 🟡 Alto > 🟢 Médio > ⚪ Melhoria

---

## 🔴 PRIORIDADE CRÍTICA — SEGURANÇA & LGPD

### 1. Habilitar Row Level Security (RLS) no Supabase

**Problema:** As tabelas não têm RLS. Qualquer usuário autenticado pode ler/alterar dados de outros.

**Arquivo:** `schema.sql`

**O que fazer:** Adicionar após a criação de cada tabela:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_confirmations ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles: cada um vê/edita apenas o próprio perfil
CREATE POLICY "users_view_own_profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin pode ver todos (para o painel admin)
CREATE POLICY "admin_view_all_profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Políticas para user_stickers: cada um vê/altera apenas os próprios stickers
CREATE POLICY "users_own_stickers" ON public.user_stickers
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para trades: envolvidos (sender/receiver) podem ver
CREATE POLICY "trades_involved_users" ON public.trades
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Políticas para messages: envolvidos podem ver/enviar
CREATE POLICY "messages_involved_users" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert_own" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
```

### 2. Adicionar Consentimento LGPD no Cadastro

**Problema:** Sem checkbox obrigatório de consentimento. Violação do Art. 7º da LGPD.

**Arquivo:** `src/components/AuthScreen.jsx`

**O que fazer:**
- Adicionar estado `[lgpdConsent, setLgpdConsent] = useState(false)`
- Adicionar checkbox obrigatório antes do botão de submit:

```jsx
// Dentro do <form>, antes do botão submit
<label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
  <input
    type="checkbox"
    checked={lgpdConsent}
    onChange={(e) => setLgpdConsent(e.target.checked)}
    style={{ accentColor: 'var(--accent)' }}
  />
  <span>Li e aceito a <a href="/privacidade" target="_blank" style={{ color: 'var(--accent)' }}>Política de Privacidade</a> e autorizo o tratamento dos meus dados conforme a LGPD.</span>
</label>
```

- **Bloquear** o submit se `!lgpdConsent`:

```jsx
if (!lgpdConsent) {
  setErrorMsg('Você precisa aceitar a Política de Privacidade para se cadastrar.');
  setIsLoading(false);
  return;
}
```

- **Salvar consentimento** no `user_metadata`:

```jsx
options: {
  data: {
    name, neighborhood, favorite_team,
    lgpd_consent: true,
    lgpd_consent_at: new Date().toISOString()
  }
}
```

### 3. Implementar Exclusão Real de Conta no Supabase

**Problema:** `handleDeleteAccount` só limpa localStorage. Não exclui do Supabase Auth.

**Arquivo:** `src/components/ProfileTab.jsx` (linha 79-84)

**O que fazer:**

```javascript
const handleDeleteAccount = async () => {
  if (!confirm('Isso apagará PERMANENTEMENTE sua conta e todos os dados. Confirma?')) return;

  try {
    // 1. Deleta dados das tabelas (RLS vai permitir)
    const { error: albumErr } = await supabase.from('user_stickers').delete().eq('user_id', profile.id);
    const { error: tradesErr } = await supabase.from('trades').delete().or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
    const { error: msgsErr } = await supabase.from('messages').delete().or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
    const { error: confErr } = await supabase.from('event_confirmations').delete().eq('user_id', profile.id);
    const { error: profErr } = await supabase.from('profiles').delete().eq('id', profile.id);

    // 2. Deleta o usuário do Auth (requer função server-side ou Admin API)
    const { error: authErr } = await supabase.auth.admin.deleteUser(profile.id);
    // Se não tiver permissão de admin, chama uma função RPC
    // await supabase.rpc('delete_my_account');

    localStorage.clear();
    window.location.reload();
  } catch (err) {
    alert('Erro ao excluir conta: ' + err.message);
  }
};
```

**Criar função SQL para auto-exclusão:**

```sql
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void AS $$
DECLARE
  user_id UUID := auth.uid();
BEGIN
  DELETE FROM public.event_confirmations WHERE user_id = user_id;
  DELETE FROM public.messages WHERE sender_id = user_id OR receiver_id = user_id;
  DELETE FROM public.trades WHERE sender_id = user_id OR receiver_id = user_id;
  DELETE FROM public.user_stickers WHERE user_id = user_id;
  DELETE FROM public.profiles WHERE id = user_id;
  -- Nota: auth.users.delete não é possível via RPC sem admin
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Verificação Server-Side de Admin

**Problema:** `AdminPanel.jsx` confia que o valor `is_admin` do frontend está correto.

**Arquivo:** `src/components/AdminPanel.jsx`

**O que fazer:** Criar uma RPC (Remote Procedure Call) no Supabase:

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), FALSE);
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

No `AdminPanel.jsx`, chamar no `useEffect`:

```javascript
const { data: adminStatus } = await supabase.rpc('is_admin');
if (!adminStatus) {
  // Redirecionar ou mostrar erro
  setErrorMsg('Acesso negado. Você não é administrador.');
  return;
}
```

E no `handleToggleAdminStatus`, verificar se **quem está alterando** é admin:

```javascript
const { data: isAdmin } = await supabase.rpc('is_admin');
if (!isAdmin) {
  setErrorMsg('Apenas administradores podem alterar permissões.');
  return;
}
```

---

## 🟡 PRIORIDADE ALTA — FUNCIONALIDADES AUSENTES

### 5. Implementar Notificações Push (FCM)

**Problema:** PRD exige notificações push para novos matches, mensagens e eventos.

**Arquivos afetados:** `src/main.jsx`, `index.html`, novo arquivo `src/firebase-messaging-sw.js`, `src/notifications.js`

**O que fazer:**

```javascript
// src/notifications.js
import { supabase } from './supabaseClient.js';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return;
  
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // Salvar preferência
    localStorage.setItem('figucopa_push_enabled', 'true');
    registerServiceWorker();
  }
};

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    // Aqui integraria com FCM ou Web Push API
  }
};

export const sendLocalNotification = (title, body) => {
  if (localStorage.getItem('figucopa_push_enabled') !== 'true') return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200]
  });
};
```

- Criar `public/sw.js` para service worker com cache de assets
- Adicionar `manifest.json` para PWA installable
- Registrar service worker no `index.html`

### 6. Implementar Página Dedicada de Política de Privacidade

**Problema:** Texto inline no perfil não substitui uma página dedicada.

**Criar:** `src/components/PrivacyPolicy.jsx`

**O que fazer:** Página completa com:
- Dados coletados (nome, bairro, seleção favorita)
- Base legal (consentimento - Art. 7º LGPD)
- Direitos do titular (Art. 18 LGPD)
- Compartilhamento de dados (nenhum)
- Contato do DPO (encarregado)
- Prazo de retenção (até exclusão da conta)
- Link no footer do `AuthScreen.jsx` e `ProfileTab.jsx`

### 7. Adicionar Página de Contato DPO

**Criar:** `src/components/DPOContact.jsx`

**Conteúdo:**
- E-mail para exercer direitos LGPD
- Prazo de resposta (até 15 dias)
- Formulário simples de solicitação

---

## 🟢 PRIORIDADE MÉDIA — MELHORIAS FUNCIONAIS

### 8. Implementar Login Social (Google/Apple)

**Problema:** PRD exige OAuth (P0).

**Arquivo:** `src/components/AuthScreen.jsx`

**O que fazer:**

```jsx
// Adicionar botões antes do formulário de email
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) setErrorMsg(error.message);
};

const handleAppleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
  if (error) setErrorMsg(error.message);
};

// No JSX:
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
  <button onClick={handleGoogleLogin} style={...}>
    <Chrome size={16} /> Entrar com Google
  </button>
  {/*
  <button onClick={handleAppleLogin} style={...}>
    <Apple size={16} /> Entrar com Apple
  </button>
  */}
</div>
<div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '12px 0' }}>ou</div>
```

**No Supabase:** Ativar provedores Google e Apple em Authentication > Providers.

### 9. Implementar Fluxo de Verificação de Email

**Problema:** Após cadastro, app não espera confirmação.

**Arquivo:** `src/components/AuthScreen.jsx`, `src/App.jsx`

**O que fazer:**
- Após signup, verificar se `data.user?.email_confirmed_at` existe
- Se não, mostrar tela "Verifique seu email" com botão "Reenviar email de verificação"
- Oferecer "Já verifiquei, fazer login"

```jsx
// No handleSubmit do signup
const { data, error } = await supabase.auth.signUp({...});

if (data?.user?.identities?.length === 0) {
  setSuccessMsg('Este email já está cadastrado. Faça login.');
  return;
}

// Verificar se precisa confirmar email
if (data?.user?.email_confirmed_at === null) {
  setSuccessMsg(`Cadastro realizado! Verifique seu email ${email} e clique no link de confirmação.`);
  setShowVerificationBanner(true);
}
```

### 10. Implementar Rate Limiting no Chat (Anti-Spam)

**Problema:** Sem proteção contra spam no chat.

**Arquivo:** `src/components/ChatTab.jsx`

**O que fazer:**

```javascript
// No início do componente
const [lastMessageTime, setLastMessageTime] = useState(0);
const MESSAGE_COOLDOWN = 2000; // 2 segundos entre mensagens
const MAX_MESSAGES_PER_MINUTE = 10;

// No handleSendMessage
const now = Date.now();
if (now - lastMessageTime < MESSAGE_COOLDOWN) {
  alert('Aguarde alguns segundos antes de enviar outra mensagem.');
  return;
}

const messagesThisMinute = messages.filter(m => 
  m.senderId === currentUserId && now - m.timestamp < 60000
).length;
if (messagesThisMinute >= MAX_MESSAGES_PER_MINUTE) {
  alert('Você excedeu o limite de mensagens por minuto. Aguarde.');
  return;
}

setLastMessageTime(now);
```

---

## ⚪ MELHORIAS / PÓS-MVP

### 11. Implementar Acessibilidade (WCAG 2.1 AA)

**Arquivo:** `src/index.css` + componentes

- Adicionar `prefers-reduced-motion` para desabilitar animações
- Adicionar controlador de tamanho de fonte no `ProfileTab.jsx`
- Garantir contraste de cores (WCAG AA)
- Adicionar `aria-labels` em todos os botões

### 12. Badge de Confiança (>4.5 estrelas)

**Arquivo:** `src/db.js` (função `getUnlockedBadges`)

```javascript
// Adicionar badge 'trusted' para rating > 4.5
if ((profile.rating || 5.0) >= 4.5) unlocked.push('trusted');
```

```javascript
// No BADGES array
{ id: 'trusted', name: 'Colecionador Confiável', desc: 'Média de avaliação superior a 4.5 estrelas', icon: '🛡️' },
```

### 13. Backend Node.js para Matching Engine

**Criar:** `supabase/functions/calculate-matches/index.ts`

```typescript
// Edge Function do Supabase para calcular matches
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { user_id } = await req.json()
  // Lógica de matching server-side
  // ...

  return new Response(JSON.stringify({ matches }), { headers: { 'Content-Type': 'application/json' } })
})
```

### 14. CI/CD com GitHub Actions

**Criar:** `.github/workflows/deploy.yml`

```yaml
name: Deploy FiguCopa
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
```

### 15. PostGIS para Consultas Geográficas

**SQL:**

```sql
-- Instalar extensão
CREATE EXTENSION IF NOT EXISTS postgis;

-- Adicionar coluna geográfica à tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location GEOGRAPHY(Point, 4326);

-- Índice espacial
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles USING GIST (location);

-- Função para buscar por raio
CREATE OR REPLACE FUNCTION public.find_nearby_collectors(
  user_lat double precision,
  user_lng double precision,
  radius_km double precision
)
RETURNS SETOF public.profiles AS $$
  SELECT * FROM public.profiles
  WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_km * 1000
  );
$$ LANGUAGE sql STABLE;
```

---

## 📋 PLANO DE AÇÃO — ORDEM RECOMENDADA

| # | Tarefa | Esforço | Prioridade | Depende de |
|---|---|---|---|---|
| 1 | **RLS policies no schema.sql** | 2h | 🔴 Crítico | — |
| 2 | **Consentimento LGPD no cadastro** | 1h | 🔴 Crítico | 1 |
| 3 | **Exclusão real de conta (RPC)** | 2h | 🔴 Crítico | 1 |
| 4 | **Verificação admin server-side** | 1h | 🔴 Crítico | 1 |
| 5 | **Página de Política de Privacidade** | 2h | 🟡 Alto | — |
| 6 | **Notificações Push (FCM)** | 4h | 🟡 Alto | — |
| 7 | **Login Social (Google/Apple)** | 3h | 🟡 Alto | — |
| 8 | **Fluxo de verificação de email** | 1h | 🟡 Alto | — |
| 9 | **Rate limiting no chat** | 1h | 🟢 Médio | — |
| 10 | **Contato DPO** | 1h | 🟢 Médio | — |
| 11 | **Badge de Confiança** | 0.5h | 🟢 Médio | — |
| 12 | **Acessibilidade WCAG** | 4h | ⚪ Melhoria | — |
| 13 | **Backend Matching Engine** | 8h | ⚪ Melhoria | 1 |
| 14 | **CI/CD** | 2h | ⚪ Melhoria | — |
| 15 | **PostGIS** | 3h | ⚪ Melhoria | — |

---

## 🔍 VERIFICAÇÃO PÓS-CORREÇÃO

Após aplicar as correções, executar:

```bash
npm run build    # Verificar se compila sem erros
npm run dev      # Testar localmente
```

Checklist de verificação:

- [ ] RLS ativo: `SELECT * FROM pg_policies WHERE tablename = 'profiles'` retorna políticas
- [ ] Cadastro com consentimento: checkbox obrigatório funcional
- [ ] Exclusão de conta: dados removidos do Supabase + localStorage
- [ ] Admin Panel: verificação server-side funcional
- [ ] Login Google: redireciona e autentica
- [ ] Chat: rate limiting ativo após 10 mensagens/minuto
- [ ] Notificações: permissão solicitada no primeiro login
- [ ] Build: `npm run build` sem warnings

---

## 📦 RESUMO DOS ARQUIVOS A MODIFICAR/CRIAR

| Arquivo | Ação |
|---|---|
| `schema.sql` | 🔧 Adicionar RLS policies + funções |
| `src/components/AuthScreen.jsx` | 🔧 Consentimento LGPD + Login Social |
| `src/components/ProfileTab.jsx` | 🔧 Exclusão real de conta |
| `src/components/AdminPanel.jsx` | 🔧 Verificação server-side admin |
| `src/components/ChatTab.jsx` | 🔧 Rate limiting |
| `src/components/PrivacyPolicy.jsx` | ✨ Novo |
| `src/components/DPOContact.jsx` | ✨ Novo |
| `src/notifications.js` | ✨ Novo |
| `public/sw.js` | ✨ Novo |
| `public/manifest.json` | ✨ Novo |
| `supabase/functions/calculate-matches/index.ts` | ✨ Novo |
| `.github/workflows/deploy.yml` | ✨ Novo |
| `src/db.js` | 🔧 Badge de Confiança |

---

*Documento gerado em 25/05/2026 — Próxima revisão sugerida: após implementação dos itens 🔴 Críticos.*

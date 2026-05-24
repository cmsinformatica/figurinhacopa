import { supabase } from './supabaseClient.js';

// Lista Oficial de Seleções da Copa do Mundo 2026 (48 Países) organizada por Grupos
export const SELECTIONS = [
  // Grupo A
  { id: 'MEX', name: 'México', flag: '🇲🇽', count: 20 },
  { id: 'RSA', name: 'África do Sul', flag: '🇿🇦', count: 20 },
  { id: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷', count: 20 },
  { id: 'CZE', name: 'Rep. Tcheca', flag: '🇨🇿', count: 20 },
  // Grupo B
  { id: 'CAN', name: 'Canadá', flag: '🇨🇦', count: 20 },
  { id: 'BIH', name: 'Bósnia-Herzegovina', flag: '🇧🇦', count: 20 },
  { id: 'QAT', name: 'Catar', flag: '🇶🇦', count: 20 },
  { id: 'SUI', name: 'Suíça', flag: '🇨🇭', count: 20 },
  // Grupo C
  { id: 'BRA', name: 'Brasil', flag: '🇧🇷', count: 20 },
  { id: 'MAR', name: 'Marrocos', flag: '🇲🇦', count: 20 },
  { id: 'HAI', name: 'Haiti', flag: '🇭🇹', count: 20 },
  { id: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', count: 20 },
  // Grupo D
  { id: 'USA', name: 'Estados Unidos', flag: '🇺🇸', count: 20 },
  { id: 'PAR', name: 'Paraguai', flag: '🇵🇾', count: 20 },
  { id: 'AUS', name: 'Austrália', flag: '🇦🇺', count: 20 },
  { id: 'TUR', name: 'Turquia', flag: '🇹🇷', count: 20 },
  // Grupo E
  { id: 'GER', name: 'Alemanha', flag: '🇩🇪', count: 20 },
  { id: 'CUW', name: 'Curaçao', flag: '🇨🇼', count: 20 },
  { id: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮', count: 20 },
  { id: 'ECU', name: 'Equador', flag: '🇪🇨', count: 20 },
  // Grupo F
  { id: 'NED', name: 'Holanda', flag: '🇳🇱', count: 20 },
  { id: 'JPN', name: 'Japão', flag: '🇯🇵', count: 20 },
  { id: 'SWE', name: 'Suécia', flag: '🇸🇪', count: 20 },
  { id: 'TUN', name: 'Tunísia', flag: '🇹🇳', count: 20 },
  // Grupo G
  { id: 'BEL', name: 'Bélgica', flag: '🇧🇪', count: 20 },
  { id: 'EGY', name: 'Egito', flag: '🇪🇬', count: 20 },
  { id: 'IRN', name: 'Irã', flag: '🇮🇷', count: 20 },
  { id: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿', count: 20 },
  // Grupo H
  { id: 'ESP', name: 'Espanha', flag: '🇪🇸', count: 20 },
  { id: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', count: 20 },
  { id: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦', count: 20 },
  { id: 'URU', name: 'Uruguai', flag: '🇺🇾', count: 20 },
  // Grupo I
  { id: 'FRA', name: 'França', flag: '🇫🇷', count: 20 },
  { id: 'SEN', name: 'Senegal', flag: '🇸🇳', count: 20 },
  { id: 'IRQ', name: 'Iraque', flag: '🇮🇶', count: 20 },
  { id: 'NOR', name: 'Noruega', flag: '🇳🇴', count: 20 },
  // Grupo J
  { id: 'ARG', name: 'Argentina', flag: '🇦🇷', count: 20 },
  { id: 'ALG', name: 'Argélia', flag: '🇩🇿', count: 20 },
  { id: 'AUT', name: 'Áustria', flag: '🇦🇹', count: 20 },
  { id: 'JOR', name: 'Jordânia', flag: '🇯🇴', count: 20 },
  // Grupo K
  { id: 'POR', name: 'Portugal', flag: '🇵🇹', count: 20 },
  { id: 'COD', name: 'RD Congo', flag: '🇨🇩', count: 20 },
  { id: 'UZB', name: 'Uzbequistão', flag: '🇺🇿', count: 20 },
  { id: 'COL', name: 'Colômbia', flag: '🇨🇴', count: 20 },
  // Grupo L
  { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 20 },
  { id: 'CRO', name: 'Croácia', flag: '🇭🇷', count: 20 },
  { id: 'GHA', name: 'Gana', flag: '🇬🇭', count: 20 },
  { id: 'PAN', name: 'Panamá', flag: '🇵🇦', count: 20 }
];

// Gera stickers de exemplo
export const getStickersList = () => {
  const list = [];
  
  // 1. Gera 20 cromos especiais de introdução da FIFA (Estádios, Cidades-Sede, Troféu) -> FWC-01 a FWC-20 (Todos brilhantes/especiais)
  const fwcStickers = [
    { name: 'Taça da Copa do Mundo 🏆', code: 'FWC-01' },
    { name: 'Mascote Oficial da Copa 🌟', code: 'FWC-02' },
    { name: 'Bola Oficial da Partida ⚽', code: 'FWC-03' },
    { name: 'Emblema Oficial FIFA 🏅', code: 'FWC-04' },
    { name: 'Arena Fonte Nova (Salvador) 🏟️', code: 'FWC-05' },
    { name: 'Estádio Azteca (CDMX) 🏟️', code: 'FWC-06' },
    { name: 'MetLife Stadium (NY/NJ) 🏟️', code: 'FWC-07' },
    { name: 'SoFi Stadium (Los Angeles) 🏟️', code: 'FWC-08' },
    { name: 'Estádio Farol da Barra 🌅', code: 'FWC-09' },
    { name: 'Templo Pelourinho Histórico ⛪', code: 'FWC-10' },
    { name: 'Ingresso de Abertura Oficial 🎟️', code: 'FWC-11' },
    { name: 'Bandeira do Fair Play 🏳️', code: 'FWC-12' },
    { name: 'Chuteira de Ouro Adidas 👟', code: 'FWC-13' },
    { name: 'Luva de Ouro Golden Glove 🧤', code: 'FWC-14' },
    { name: 'Troféu do Melhor Jogador 🏆', code: 'FWC-15' },
    { name: 'Cidade-Sede Salvador 🌴', code: 'FWC-16' },
    { name: 'Cidade-Sede Miami 🌊', code: 'FWC-17' },
    { name: 'Cidade-Sede Vancouver ⛰️', code: 'FWC-18' },
    { name: 'Cidade-Sede Monterrey ⛰️', code: 'FWC-19' },
    { name: 'Fair Play FIFA Trophy 🌟', code: 'FWC-20' }
  ];

  fwcStickers.forEach((st, idx) => {
    list.push({
      id: st.code,
      code: st.code,
      number: idx + 1,
      team: 'FWC',
      playerName: st.name,
      isSpecial: true,
      teamName: 'FIFA World Cup'
    });
  });

  // 2. Gera 20 cromos por seleção para as 48 seleções (total 960 cromos)
  // Destes, o cromo número 1 (Escudo do País) é Especial/Brilhante (total de 48 escudos especiais)
  // Total Geral de Especiais: 20 (FWC) + 48 (Escudos) = EXATAMENTE 68 figurinhas brilhantes!
  // Total Geral de Figurinhas: 20 (FWC) + 960 (Selecões) = EXATAMENTE 980 figurinhas no total!
  SELECTIONS.forEach(sel => {
    for (let i = 1; i <= sel.count; i++) {
      list.push({
        id: `${sel.id}-${String(i).padStart(2, '0')}`,
        code: `${sel.id}-${String(i).padStart(2, '0')}`,
        number: i,
        team: sel.id,
        playerName: i === 1 ? `Escudo da Seleção 🛡️` :
                    i === 10 && sel.id === 'BRA' ? 'Neymar Jr' : 
                    i === 10 && sel.id === 'ARG' ? 'Lionel Messi' :
                    i === 7 && sel.id === 'POR' ? 'C. Ronaldo' : 
                    i === 10 && sel.id === 'FRA' ? 'K. Mbappé' :
                    i === 9 && sel.id === 'NOR' ? 'E. Haaland' :
                    i === 10 && sel.id === 'ENG' ? 'Harry Kane' :
                    i === 10 && sel.id === 'USA' ? 'C. Pulisic' :
                    i === 7 && sel.id === 'KOR' ? 'Son Heung-min' :
                    i === 10 && sel.id === 'EGY' ? 'Mohamed Salah' : `Jogador ${i}`,
        isSpecial: i === 1, // Exatamente o Escudo número 1 é Especial
        teamName: sel.name
      });
    }
  });

  return list;
};

// Mapeamento dos colecionadores com repetidas e faltantes com base na lista de 48 países
export const MOCK_COLLECTORS = [
  {
    id: 'user_cristiano',
    name: 'Cristiano Martins',
    avatar: 'CR',
    neighborhood: 'Barra',
    distance: '800m',
    favoriteTeam: 'Brasil',
    extraStickers: ['BRA-10', 'ARG-10', 'POR-07', 'FRA-01', 'GER-10', 'USA-10', 'NOR-09', 'ENG-10', 'MEX-01', 'CAN-01'],
    missingStickers: ['BRA-01', 'BRA-09', 'ARG-02', 'FRA-10', 'GER-02', 'KOR-07', 'EGY-10', 'CRO-10', 'JPN-01', 'URU-01']
  },
  {
    id: 'user_thiago',
    name: 'Thiago Silva',
    avatar: 'TS',
    neighborhood: 'Rio Vermelho',
    distance: '1.2km',
    favoriteTeam: 'Brasil',
    extraStickers: ['FRA-10', 'GER-01', 'GER-02', 'POR-10', 'KOR-07', 'EGY-10', 'CRO-10', 'JPN-01', 'URU-01'],
    missingStickers: ['BRA-10', 'BRA-05', 'FRA-02', 'ARG-10', 'USA-10', 'NOR-09', 'MEX-01', 'CAN-01']
  },
  {
    id: 'user_maria',
    name: 'Maria Oliveira',
    avatar: 'MO',
    neighborhood: 'Pituba',
    distance: '2.5km',
    favoriteTeam: 'Brasil',
    extraStickers: ['ARG-02', 'BRA-01', 'GER-05', 'USA-01', 'KOR-01'],
    missingStickers: ['POR-07', 'GER-10', 'ENG-10', 'FRA-01']
  },
  {
    id: 'user_acacio',
    name: 'Acácio Souza',
    avatar: 'AS',
    neighborhood: 'Pelourinho',
    distance: '3.1km',
    favoriteTeam: 'Brasil',
    extraStickers: ['POR-07', 'USA-10', 'MEX-01', 'CAN-01'],
    missingStickers: ['BRA-01', 'BRA-09', 'GER-02']
  },
  {
    id: 'user_gabriela',
    name: 'Gabriela Neves',
    avatar: 'GN',
    neighborhood: 'Itapuã',
    distance: '5.4km',
    favoriteTeam: 'Portugal',
    extraStickers: ['NOR-09', 'ARG-10', 'ENG-10', 'URU-01'],
    missingStickers: ['BRA-09', 'ARG-02']
  },
  {
    id: 'user_lucas',
    name: 'Lucas Lima',
    avatar: 'LL',
    neighborhood: 'Ondina',
    distance: '1.5km',
    favoriteTeam: 'Alemanha',
    extraStickers: ['BRA-10', 'GER-10', 'FRA-01', 'KOR-01'],
    missingStickers: ['BRA-01', 'GER-02']
  },
  {
    id: 'user_sandra',
    name: 'Sandra Rocha',
    avatar: 'SR',
    neighborhood: 'Caminho das Árvores',
    distance: '2.8km',
    favoriteTeam: 'Argentina',
    extraStickers: ['BRA-01', 'BRA-09', 'ARG-02'],
    missingStickers: ['POR-07', 'USA-10', 'NOR-09']
  },
  {
    id: 'user_mateus',
    name: 'Mateus Santos',
    avatar: 'MS',
    neighborhood: 'Bonfim',
    distance: '4.2km',
    favoriteTeam: 'Brasil',
    extraStickers: ['USA-10', 'FRA-10', 'GER-02'],
    missingStickers: ['BRA-09', 'ARG-02']
  },
  {
    id: 'user_juliana',
    name: 'Juliana Costa',
    avatar: 'JC',
    neighborhood: 'Brotas',
    distance: '2.2km',
    favoriteTeam: 'Brasil',
    extraStickers: ['POR-07', 'BRA-09', 'ARG-10'],
    missingStickers: ['BRA-01', 'GER-02']
  }
];

// BADGES oficiais da Gamificação
export const BADGES = [
  { id: 'first_sticker', name: 'Pé Quente', desc: 'Possui mais de 5 figurinhas no álbum', icon: '🔥' },
  { id: 'first_trade', name: 'Parceiro de Ouro', desc: 'Completou a primeira troca com sucesso', icon: '🤝' },
  { id: 'legendary', name: 'Colecionador Lendário', desc: 'Possui pelo menos um jogador estrela (Neymar Jr, Lionel Messi, C. Ronaldo ou K. Mbappé)', icon: '👑' },
  { id: 'trade_master', name: 'Negociador Supremo', desc: 'Completou 3 ou mais trocas', icon: '⚡' },
  { id: 'patriot', name: 'Espírito de Copa', desc: 'Definiu sua seleção favorita no perfil', icon: '🇧🇷' }
];

// --- SISTEMA DE PERSISTÊNCIA INTEGRADO ---

export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url !== 'https://seu-projeto.supabase.co' && !url.includes('placeholder');
};

export const toUuid = (id) => {
  if (!id) return null;
  if (id.includes('-') && id.length === 36) return id; // Já é UUID
  const mapping = {
    'user_cristiano': '00000000-0000-0000-0000-000000000001',
    'user_thiago': '00000000-0000-0000-0000-000000000002',
    'user_maria': '00000000-0000-0000-0000-000000000003',
    'user_acacio': '00000000-0000-0000-0000-000000000004',
    'user_gabriela': '00000000-0000-0000-0000-000000000005',
    'user_lucas': '00000000-0000-0000-0000-000000000006',
    'user_sandra': '00000000-0000-0000-0000-000000000007',
    'user_mateus': '00000000-0000-0000-0000-000000000008',
    'user_juliana': '00000000-0000-0000-0000-000000000009',
    'event_barra': '00000000-0000-0000-0000-000000000101',
    'event_shopping': '00000000-0000-0000-0000-000000000102',
    'event_mariquita': '00000000-0000-0000-0000-000000000103'
  };
  return mapping[id] || '00000000-0000-0000-0000-000000000099';
};

export const fromUuid = (uuid) => {
  const reverseMapping = {
    '00000000-0000-0000-0000-000000000001': 'user_cristiano',
    '00000000-0000-0000-0000-000000000002': 'user_thiago',
    '00000000-0000-0000-0000-000000000003': 'user_maria',
    '00000000-0000-0000-0000-000000000004': 'user_acacio',
    '00000000-0000-0000-0000-000000000005': 'user_gabriela',
    '00000000-0000-0000-0000-000000000006': 'user_lucas',
    '00000000-0000-0000-0000-000000000007': 'user_sandra',
    '00000000-0000-0000-0000-000000000008': 'user_mateus',
    '00000000-0000-0000-0000-000000000009': 'user_juliana',
    '00000000-0000-0000-0000-0000000101': 'event_barra',
    '00000000-0000-0000-0000-0000000102': 'event_shopping',
    '00000000-0000-0000-0000-0000000103': 'event_mariquita'
  };
  return reverseMapping[uuid] || uuid;
};

// Sincroniza álbum com Supabase
export const syncAlbumWithSupabase = async () => {
  if (!isSupabaseConfigured()) return;
  try {
    const profile = getUserProfile();
    const userUuid = toUuid(profile.id);
    const { data, error } = await supabase
      .from('user_stickers')
      .select('sticker_id, owned, extra')
      .eq('user_id', userUuid);

    if (error) throw error;

    if (data && data.length > 0) {
      const album = getUserAlbum();
      data.forEach(item => {
        if (album[item.sticker_id]) {
          album[item.sticker_id].owned = item.owned;
          album[item.sticker_id].extra = item.extra;
        }
      });
      localStorage.setItem('figucopa_user_album', JSON.stringify(album));
      console.log('[Supabase Sync] Álbum sincronizado da nuvem.');
    } else {
      const album = getUserAlbum();
      const rows = Object.keys(album).map(id => ({
        user_id: userUuid,
        sticker_id: id,
        owned: album[id].owned,
        extra: album[id].extra
      }));
      const { error: upsertError } = await supabase
        .from('user_stickers')
        .upsert(rows);
      if (upsertError) throw upsertError;
      console.log('[Supabase Sync] Estado local inicial enviado para a nuvem.');
    }
  } catch (err) {
    console.warn('[Supabase Sync Warning] Falha na sincronização do álbum, usando local:', err.message);
  }
};

// Sincroniza todas as informações do Supabase em background
export const syncAllDataWithSupabase = async () => {
  if (!isSupabaseConfigured()) return;
  console.log('[Supabase Sync] Iniciando sincronização em segundo plano...');
  
  const profile = getUserProfile();
  const userUuid = toUuid(profile.id);

  // 1. Garantir que o perfil do usuário existe no Supabase
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([{
        id: userUuid,
        name: profile.name,
        neighborhood: profile.neighborhood,
        favorite_team: profile.favoriteTeam,
        completed_trades: profile.completedTrades,
        rating: profile.rating,
        avatar: profile.avatar || '⚽'
      }]);
    if (profileError) throw profileError;
    console.log('[Supabase Sync] Perfil do usuário verificado/criado na nuvem.');
  } catch (err) {
    console.warn('[Supabase Sync Warning] Falha ao sincronizar perfil:', err.message);
  }

  // 2. Garantir que os eventos iniciais de Salvador existam no Supabase
  try {
    const eventRows = MOCK_EVENTS.map(evt => ({
      id: toUuid(evt.id),
      title: evt.title,
      local: evt.local,
      date: evt.date,
      initial_attendees: evt.initialAttendees,
      neighborhood: evt.neighborhood
    }));
    const { error: eventsError } = await supabase
      .from('events')
      .upsert(eventRows);
    if (eventsError) throw eventsError;
    console.log('[Supabase Sync] Eventos de Salvador verificados/criados na nuvem.');
  } catch (err) {
    console.warn('[Supabase Sync Warning] Falha ao sincronizar eventos:', err.message);
  }

  // 3. Sincronizar álbum
  await syncAlbumWithSupabase();
  
  // 4. Sincronizar mensagens
  try {
    const { data: msgs, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userUuid},receiver_id.eq.${userUuid}`);
    
    if (msgError) throw msgError;
    if (msgs) {
      const localMsgs = msgs.map(m => ({
        id: m.id,
        senderId: fromUuid(m.sender_id),
        receiverId: fromUuid(m.receiver_id),
        content: m.content,
        timestamp: new Date(m.created_at).getTime(),
        tradeId: m.trade_id,
        stickerPhotoCode: m.sticker_photo_code
      }));
      localStorage.setItem('figucopa_messages', JSON.stringify(localMsgs));
    }
  } catch (err) {
    console.warn('[Supabase Sync Warning] Falha ao sincronizar mensagens:', err.message);
  }
  
  // 5. Sincronizar presenças em encontros
  try {
    const { data: confs, error: confError } = await supabase
      .from('event_confirmations')
      .select('event_id')
      .eq('user_id', userUuid);
    
    if (confError) throw confError;
    if (confs) {
      const confirmedIds = confs.map(c => fromUuid(c.event_id));
      localStorage.setItem('figucopa_confirmed_events', JSON.stringify(confirmedIds));
    }
  } catch (err) {
    console.warn('[Supabase Sync Warning] Falha ao sincronizar presenças:', err.message);
  }
  console.log('[Supabase Sync] Sincronização em nuvem concluída.');
};

// Inicializa o álbum do usuário logado localmente (100% limpo por padrão)
export const initUserAlbum = () => {
  const key = 'figucopa_user_album';
  if (!localStorage.getItem(key)) {
    const defaultAlbum = {};
    getStickersList().forEach(st => {
      defaultAlbum[st.id] = { owned: false, extra: 0 };
    });
    localStorage.setItem(key, JSON.stringify(defaultAlbum));
  }
};

export const getUserAlbum = () => {
  initUserAlbum();
  return JSON.parse(localStorage.getItem('figucopa_user_album'));
};

export const saveUserAlbum = (album) => {
  localStorage.setItem('figucopa_user_album', JSON.stringify(album));
  
  if (isSupabaseConfigured()) {
    const profile = getUserProfile();
    const rows = Object.keys(album).map(id => ({
      user_id: toUuid(profile.id),
      sticker_id: id,
      owned: album[id].owned,
      extra: album[id].extra
    }));
    supabase.from('user_stickers').upsert(rows).then(({ error }) => {
      if (error) console.error('[Supabase Error] Falha ao atualizar álbum:', error.message);
    });
  }
  
  // Salva na fila de sincronização offline se estiver offline
  if (!navigator.onLine) {
    const offlineSyncKey = 'figucopa_offline_sync';
    const queue = JSON.parse(localStorage.getItem(offlineSyncKey) || '[]');
    queue.push({
      timestamp: Date.now(),
      action: 'UPDATE_ALBUM',
      data: album
    });
    localStorage.setItem(offlineSyncKey, JSON.stringify(queue));
  }
};

// --- CONFIGURAÇÃO DO PERFIL ---
export const initUserProfile = () => {
  const key = 'figucopa_user_profile';
  if (!localStorage.getItem(key)) {
    const defaultProfile = {
      id: 'user_cristiano',
      name: 'Cristiano Martins',
      neighborhood: 'Barra',
      favoriteTeam: 'BRA',
      completedTrades: 0,
      rating: 4.8
    };
    localStorage.setItem(key, JSON.stringify(defaultProfile));
  }
};

export const getUserProfile = () => {
  initUserProfile();
  return JSON.parse(localStorage.getItem('figucopa_user_profile'));
};

export const saveUserProfile = (profile) => {
  localStorage.setItem('figucopa_user_profile', JSON.stringify(profile));
};

// --- CONFIGURAÇÃO DAS TROCAS (TRADES) ---
export const getTrades = () => {
  return JSON.parse(localStorage.getItem('figucopa_trades') || '[]');
};

export const saveTrades = (trades) => {
  localStorage.setItem('figucopa_trades', JSON.stringify(trades));
  
  if (isSupabaseConfigured()) {
    const profile = getUserProfile();
    const rows = trades.map(t => ({
      sender_id: toUuid(profile.id),
      receiver_id: toUuid(t.collectorId),
      you_send: t.youSend,
      you_receive: t.youReceive,
      status: t.status,
      rating: t.rating,
      reviewed: t.reviewed
    }));
    supabase.from('trades').upsert(rows).then(({ error }) => {
      if (error) console.error('[Supabase Error] Falha ao sincronizar trocas:', error.message);
    });
  }
};

// --- CONFIGURAÇÃO DO CHAT (MESSAGES) ---
export const getMessages = () => {
  return JSON.parse(localStorage.getItem('figucopa_messages') || '[]');
};

export const saveMessages = (messages) => {
  localStorage.setItem('figucopa_messages', JSON.stringify(messages));
  
  if (isSupabaseConfigured()) {
    const profile = getUserProfile();
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && (lastMsg.senderId === profile.id || lastMsg.senderId === 'user_cristiano')) {
      supabase.from('messages').insert([{
        sender_id: toUuid(lastMsg.senderId),
        receiver_id: toUuid(lastMsg.receiverId),
        content: lastMsg.content,
        sticker_photo_code: lastMsg.stickerPhotoCode || null
      }]).then(({ error }) => {
        if (error) console.error('[Supabase Error] Falha ao enviar mensagem:', error.message);
      });
    }
  }
};

// Cria uma nova proposta formal e inicia chat
export const proposeTrade = (collectorId, youSend, youReceive) => {
  const trades = getTrades();
  const messages = getMessages();
  
  // Verifica se já existe uma proposta pendente com este colecionador
  const existingTrade = trades.find(t => t.collectorId === collectorId && t.status === 'pending');
  if (existingTrade) return existingTrade;
  
  const tradeId = 'trade_' + Date.now();
  const newTrade = {
    id: tradeId,
    collectorId,
    youSend,
    youReceive,
    status: 'pending',
    rating: 0,
    reviewed: false,
    createdAt: Date.now()
  };
  
  trades.push(newTrade);
  saveTrades(trades);

  // Envia mensagem mockada do colecionador aceitando conversar sobre a troca
  const collectorName = MOCK_COLLECTORS.find(c => c.id === collectorId)?.name || 'Colecionador';
  const newMessages = [
    ...messages,
    {
      id: 'msg_sys_' + Date.now(),
      senderId: 'system',
      receiverId: 'user_cristiano',
      content: `Proposta de Troca criada! Você enviará: ${youSend.join(', ')} e receberá: ${youReceive.join(', ')}.`,
      timestamp: Date.now() - 2000,
      tradeId: tradeId
    },
    {
      id: 'msg_bot_' + Date.now(),
      senderId: collectorId,
      receiverId: 'user_cristiano',
      content: `Olá Cristiano! Gostei muito do match de trocas. Eu tenho essas figurinhas que você quer (${youReceive.join(', ')}) e você tem as que eu preciso. Quer fechar o encontro para trocar?`,
      timestamp: Date.now(),
      tradeId: tradeId
    }
  ];
  saveMessages(newMessages);

  return newTrade;
};

// Aceita uma proposta de troca (afeta o álbum!)
export const acceptTrade = (tradeId, album, onAlbumUpdate) => {
  const trades = getTrades();
  const tradeIndex = trades.findIndex(t => t.id === tradeId);
  
  if (tradeIndex === -1 || trades[tradeIndex].status !== 'pending') return false;
  
  const trade = trades[tradeIndex];
  trade.status = 'accepted';
  trade.completedAt = Date.now();
  saveTrades(trades);
  
  // Atualiza o álbum do usuário
  const updatedAlbum = { ...album };
  
  // 1. Remove as repetidas enviadas (decrementa extra)
  trade.youSend.forEach(stickerId => {
    if (updatedAlbum[stickerId] && updatedAlbum[stickerId].extra > 0) {
      updatedAlbum[stickerId].extra -= 1;
    }
  });
  
  // 2. Adiciona as figurinhas recebidas
  trade.youReceive.forEach(stickerId => {
    if (updatedAlbum[stickerId]) {
      updatedAlbum[stickerId].owned = true;
    }
  });
  
  onAlbumUpdate(updatedAlbum);
  
  // Atualiza estatísticas do perfil
  const profile = getUserProfile();
  profile.completedTrades += 1;
  saveUserProfile(profile);

  // Insere mensagens de sucesso no chat
  const messages = getMessages();
  const collectorId = trade.collectorId;
  const newMessages = [
    ...messages,
    {
      id: 'msg_sys_acc_' + Date.now(),
      senderId: 'system',
      receiverId: 'user_cristiano',
      content: `Troca aceita! Seu álbum foi atualizado com as novas figurinhas.`,
      timestamp: Date.now(),
      tradeId: tradeId
    },
    {
      id: 'msg_bot_acc_' + Date.now(),
      senderId: collectorId,
      receiverId: 'user_cristiano',
      content: `Excelente! Figurinhas trocadas com sucesso. Foi muito bom negociar com você! Que tal nos avaliarmos? ⚽🤝`,
      timestamp: Date.now() + 500,
      tradeId: tradeId
    }
  ];
  saveMessages(newMessages);
  
  return true;
};

// Recusa proposta de troca
export const rejectTrade = (tradeId) => {
  const trades = getTrades();
  const tradeIndex = trades.findIndex(t => t.id === tradeId);
  
  if (tradeIndex === -1 || trades[tradeIndex].status !== 'pending') return false;
  
  trades[tradeIndex].status = 'rejected';
  saveTrades(trades);
  
  // Envia mensagem mockada avisando no chat
  const messages = getMessages();
  const newMessages = [
    ...messages,
    {
      id: 'msg_sys_rej_' + Date.now(),
      senderId: 'system',
      receiverId: 'user_cristiano',
      content: `A proposta de troca foi recusada/cancelada.`,
      timestamp: Date.now(),
      tradeId: tradeId
    }
  ];
  saveMessages(newMessages);
  
  return true;
};

// Submete avaliação da troca
export const submitReview = (tradeId, rating) => {
  const trades = getTrades();
  const tradeIndex = trades.findIndex(t => t.id === tradeId);
  
  if (tradeIndex === -1) return false;
  
  trades[tradeIndex].reviewed = true;
  trades[tradeIndex].rating = rating;
  saveTrades(trades);
  
  return true;
};

// Calcula quais conquistas (badges) o usuário atual desbloqueou
export const getUnlockedBadges = (album, profile) => {
  const unlocked = [];
  
  // 1. Pé Quente (Possui mais de 5 figurinhas)
  const ownedCount = Object.keys(album).filter(id => album[id].owned).length;
  if (ownedCount > 5) unlocked.push('first_sticker');
  
  // 2. Parceiro de Ouro (Completou 1 troca)
  if (profile.completedTrades >= 1) unlocked.push('first_trade');
  
  // 3. Negociador Supremo (Completou 3 ou mais trocas)
  if (profile.completedTrades >= 3) unlocked.push('trade_master');
  
  // 4. Espírito de Copa (Tem seleção favorita no perfil)
  if (profile.favoriteTeam && profile.favoriteTeam !== '') unlocked.push('patriot');
  
  // 5. Colecionador Lendário (Tem Neymar, Messi, Ronaldo ou Mbappé)
  // BRA-10 (Neymar Jr), ARG-10 (Messi), POR-07 (C. Ronaldo), FRA-10 (Mbappé)
  const hasLegendary = album['BRA-10']?.owned || album['ARG-10']?.owned || album['POR-07']?.owned || album['FRA-10']?.owned;
  if (hasLegendary) unlocked.push('legendary');
  
  return unlocked;
};

// Mapeamento oficial de Pontos de Encontro Turísticos e Seguros em Salvador, Bahia
export const MEETING_POINTS = {
  'Barra': 'Farol da Barra (Orla)',
  'Rio Vermelho': 'Largo da Mariquita (Food Trucks)',
  'Pituba': 'Praça Ana Lúcia Magalhães',
  'Pelourinho': 'Terreiro de Jesus (Largo)',
  'Itapuã': 'Farol de Itapuã (Orla)',
  'Ondina': 'Monumento às Gordinhas (Ondina)',
  'Caminho das Árvores': 'Salvador Shopping (Praça de Alimentação)',
  'Bonfim': 'Colina Sagrada (Igreja do Bonfim)',
  'Brotas': 'Arena Fonte Nova (Entrada Dique)',
  'Cabula': 'Plaza Shopping Cabula (Praça Central)',
  'Imbuí': 'Praça do Imbuí (Barracas de Pastel)',
  'Stella Maris': 'Praça de Stella Maris',
  'Stiep': 'FIB/Estácio (Entrada Principal)',
  'Graça': 'Masp - Museu de Arte da Bahia',
  'Vitória': 'Corredor da Vitória (Largo do Campo Grande)',
  'Campo Grande': 'Largo do Campo Grande (Praça Central)',
  'Liberdade': 'Largo da Lapinha (Praça Principal)',
  'Cajazeiras': 'Shopping Cajazeiras (Praça Central)',
  'Mussurunga': 'Estação de Integração Mussurunga',
  'Patamares': 'Parque de Pituaçu (Entrada)',
  'Piatã': 'Orla de Piatã (Quadras de Esporte)',
  'Costa Azul': 'Parque Costa Azul (Estacionamento)',
  'Amaralina': 'Largo de Amaralina (Calçadão)',
  'Horto Florestal': 'Almacen Pepe Horto (Entrada)',
  'Pernambués': 'Praça de Pernambués',
  'Paripe': 'Praça de Paripe (Largo Principal)',
  'Periperi': 'Praça da Revolução (Periperi)',
  'Federação': 'Praça de Esportes da Federação',
  'Canela': 'Reitoria da UFBA (Largo do Canela)',
  'São Caetano': 'Largo do Tanque (Entrada Principal)'
};

// --- MÉTODOS DE SEGURANÇA E BLOQUEIO (CONFORMIDADE LGPD E PROTEÇÃO) ---

export const getBlockedUsers = () => {
  return JSON.parse(localStorage.getItem('figucopa_blocked_users') || '[]');
};

export const blockUser = (userId) => {
  const blocked = getBlockedUsers();
  if (!blocked.includes(userId)) {
    blocked.push(userId);
    localStorage.setItem('figucopa_blocked_users', JSON.stringify(blocked));
  }
  
  // Recusa automaticamente todas as propostas de troca pendentes com este usuário
  const trades = getTrades();
  trades.forEach(t => {
    if (t.collectorId === userId && t.status === 'pending') {
      t.status = 'rejected';
    }
  });
  saveTrades(trades);
};

export const isUserBlocked = (userId) => {
  return getBlockedUsers().includes(userId);
};

// --- LEADERBOARD DE SALVADOR (COMPETIÇÃO SAUDÁVEL E GAMIFICAÇÃO) ---

export const getSalvadorLeaderboard = (album, profile) => {
  const totalStickersCount = getStickersList().length;
  const userOwnedCount = Object.keys(album).filter(id => album[id]?.owned).length;
  const userProgress = Math.round((userOwnedCount / totalStickersCount) * 100);
  
  const rawLeaderboard = [
    { id: 'user_cristiano', name: profile.name, avatar: 'CR', neighborhood: profile.neighborhood, progress: userProgress, completedTrades: profile.completedTrades, rating: profile.rating, isCurrentUser: true },
    { id: 'user_thiago', name: 'Thiago Silva', avatar: 'TS', neighborhood: 'Rio Vermelho', progress: 84, completedTrades: 11, rating: 4.9 },
    { id: 'user_maria', name: 'Maria Oliveira', avatar: 'MO', neighborhood: 'Pituba', progress: 76, completedTrades: 8, rating: 4.8 },
    { id: 'user_acacio', name: 'Acácio Souza', avatar: 'AS', neighborhood: 'Pelourinho', progress: 71, completedTrades: 6, rating: 4.7 },
    { id: 'user_juliana', name: 'Juliana Costa', avatar: 'JC', neighborhood: 'Brotas', progress: 68, completedTrades: 5, rating: 4.6 },
    { id: 'user_lucas', name: 'Lucas Lima', avatar: 'LL', neighborhood: 'Ondina', progress: 62, completedTrades: 4, rating: 4.8 },
    { id: 'user_sandra', name: 'Sandra Rocha', avatar: 'SR', neighborhood: 'Caminho das Árvores', progress: 59, completedTrades: 3, rating: 4.5 }
  ];
  
  // Ordena por progresso e depois por número de trocas e avaliação
  return rawLeaderboard.sort((a, b) => b.progress - a.progress || b.completedTrades - a.completedTrades);
};

// Calcula matches bilaterais baseado no álbum do usuário logado e filtra bloqueados
export const calculateMatches = () => {
  const userAlbum = getUserAlbum();
  const profile = getUserProfile();
  const blockedList = getBlockedUsers();
  
  // Filtra as repetidas que o usuário tem
  const userExtras = Object.keys(userAlbum).filter(id => userAlbum[id].extra > 0);
  // Filtra as faltantes que o usuário precisa
  const userMissing = Object.keys(userAlbum).filter(id => !userAlbum[id].owned);
  
  return MOCK_COLLECTORS
    // Filtra o próprio Cristiano Martins para não dar match consigo mesmo e ignora os bloqueados
    .filter(col => col.id !== profile.id && !blockedList.includes(col.id))
    .map(col => {
      // Figurinhas que ele tem repetidas que eu preciso
      const youReceive = col.extraStickers.filter(stId => userMissing.includes(stId));
      // Figurinhas que eu tenho repetidas que ele precisa
      const youSend = col.missingStickers.filter(stId => userExtras.includes(stId));
      
      // Cálculo simples de score de matching bilateral
      const totalMatchCount = youReceive.length + youSend.length;
      // O Score é de 0 a 100
      const score = totalMatchCount > 0 ? Math.min(Math.round((totalMatchCount / 10) * 100), 100) : 0;
      
      return {
        ...col,
        youSend,
        youReceive,
        score
      };
    })
    .filter(match => match.score > 0) // Mostra apenas matches úteis
    .sort((a, b) => b.score - a.score); // Ordena por maior compatibilidade
};

// Busca colecionadores reais do Supabase e calcula matches bilaterais em tempo real
export const fetchRealCollectorsAndCalculateMatches = async (currentUserProfile, currentUserAlbum) => {
  if (!isSupabaseConfigured() || !currentUserProfile) {
    return [];
  }
  try {
    const userUuid = toUuid(currentUserProfile.id);
    const blockedList = getBlockedUsers().map(id => toUuid(id));

    // 1. Busca todos os perfis do Supabase (exceto o próprio logado e os bloqueados)
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', userUuid);

    if (pError) throw pError;
    if (!profiles || profiles.length === 0) return [];

    // Filtra os perfis que não estão bloqueados
    const activeProfiles = profiles.filter(p => !blockedList.includes(p.id));

    // 2. Busca todas as figurinhas de todos os outros usuários
    const { data: allStickers, error: sError } = await supabase
      .from('user_stickers')
      .select('*')
      .neq('user_id', userUuid);

    if (sError) throw sError;

    // 3. Constrói a lista de colecionadores reais de forma dinâmica
    const collectors = activeProfiles.map(p => {
      const userStickers = allStickers ? allStickers.filter(s => s.user_id === p.id) : [];
      
      // Figurinhas repetidas: owned = true e extra > 0
      const extraStickers = userStickers.filter(s => s.owned && s.extra > 0).map(s => s.sticker_id);
      // Figurinhas faltantes: owned = false
      const missingStickers = userStickers.filter(s => !s.owned).map(s => s.sticker_id);

      return {
        id: fromUuid(p.id),
        name: p.name,
        avatar: p.avatar || p.name.substring(0, 2).toUpperCase(),
        neighborhood: p.neighborhood,
        distance: p.distance || `${(Math.random() * 2.5 + 0.5).toFixed(1)}km`,
        favoriteTeam: p.favorite_team,
        extraStickers,
        missingStickers,
        completedTrades: p.completed_trades || 0,
        rating: p.rating || 5.0
      };
    });

    // 4. Calcula matches bilaterais com base no álbum do usuário logado
    const userExtras = Object.keys(currentUserAlbum).filter(id => currentUserAlbum[id].extra > 0);
    const userMissing = Object.keys(currentUserAlbum).filter(id => !currentUserAlbum[id].owned);

    return collectors
      .map(col => {
        // Figurinhas que ele tem repetidas que eu preciso
        const youReceive = col.extraStickers.filter(stId => userMissing.includes(stId));
        // Figurinhas que eu tenho repetidas que ele precisa
        const youSend = col.missingStickers.filter(stId => userExtras.includes(stId));
        
        const totalMatchCount = youReceive.length + youSend.length;
        const score = totalMatchCount > 0 ? Math.min(Math.round((totalMatchCount / 10) * 100), 100) : 0;
        
        return {
          ...col,
          youSend,
          youReceive,
          score
        };
      })
      .filter(match => match.score > 0) // Mostra apenas matches úteis
      .sort((a, b) => b.score - a.score);

  } catch (err) {
    console.error('[Supabase Realtime Matches Error]', err.message);
    return [];
  }
};

// --- MOCK DE EVENTOS DE TROCAS EM SALVADOR-BA (PRD F07) ---
export const MOCK_EVENTS = [
  {
    id: 'event_barra',
    title: 'Mega Encontro Farol da Barra 📅',
    local: 'Farol da Barra (Orla - Gramado Principal)',
    date: 'Sábado, 30/Maio às 15:00h',
    initialAttendees: 42,
    neighborhood: 'Barra'
  },
  {
    id: 'event_shopping',
    title: 'Encontro Gamer de Trocas 🎮',
    local: 'Shopping da Bahia (Praça de Alimentação - L3)',
    date: 'Domingo, 31/Maio às 14:00h',
    initialAttendees: 28,
    neighborhood: 'Caminho das Árvores'
  },
  {
    id: 'event_mariquita',
    title: 'Troca das Estrelas Largo da Mariquita ⚽',
    local: 'Largo da Mariquita (Rio Vermelho - Food Trucks)',
    date: 'Quarta-feira, 03/Junho às 18:30h',
    initialAttendees: 19,
    neighborhood: 'Rio Vermelho'
  }
];

export const getConfirmedEvents = () => {
  return JSON.parse(localStorage.getItem('figucopa_confirmed_events') || '[]');
};

export const toggleEventConfirmation = (eventId) => {
  const confirmed = getConfirmedEvents();
  let added = false;
  let newConfirmed = [];
  
  if (confirmed.includes(eventId)) {
    newConfirmed = confirmed.filter(id => id !== eventId);
  } else {
    newConfirmed = [...confirmed, eventId];
    added = true;
  }
  
  localStorage.setItem('figucopa_confirmed_events', JSON.stringify(newConfirmed));
  
  if (isSupabaseConfigured()) {
    const profile = getUserProfile();
    const userUuid = toUuid(profile.id);
    const eventUuid = toUuid(eventId);
    if (added) {
      supabase.from('event_confirmations').insert([{ event_id: eventUuid, user_id: userUuid }]).then(({ error }) => {
        if (error) console.error('[Supabase Error] Falha ao confirmar presença:', error.message);
      });
    } else {
      supabase.from('event_confirmations').delete().match({ event_id: eventUuid, user_id: userUuid }).then(({ error }) => {
        if (error) console.error('[Supabase Error] Falha ao remover presença:', error.message);
      });
    }
  }
  
  return added;
};

// --- NOTÍCIAS REAIS E OFICIAIS DO SITE DA FIFA DA COPA 2026 ---
export const MOCK_NEWS = [
  {
    id: 'news_1',
    title: 'Estádio Azteca Sediará Jogo de Abertura da Copa 2026! 🏟️🇲🇽',
    summary: 'A FIFA confirmou oficialmente que o lendário e histórico Estádio Azteca, na Cidade do México, sediará a grande partida de abertura no dia 11 de junho de 2026.',
    tag: 'Abertura'
  },
  {
    id: 'news_2',
    title: 'MetLife Stadium em Nova York Sediará a Grande Final! 🏆🇺🇸',
    summary: 'A decisão do maior torneio de futebol do planeta, que contará pela primeira vez com 48 equipes, foi agendada para o dia 19 de julho de 2026 em Nova York / Nova Jersey.',
    tag: 'Grande Final'
  },
  {
    id: 'news_3',
    title: 'Canadá fará sua Estreia Histórica em Toronto! 🍁🇨🇦',
    summary: 'A seleção do Canadá jogará sua primeira partida oficial jogando em casa na história das Copas no dia 12 de junho de 2026 no BMO Field, em Toronto.',
    tag: 'Canadá'
  },
  {
    id: 'news_4',
    title: 'Novo Formato Oficial com 104 Jogos Aprovado! ⚽🌍',
    summary: 'O Conselho da FIFA ratificou a expansão para 48 seleções divididas em 12 grupos de 4 equipes, garantindo o maior e mais espetacular torneio da história.',
    tag: 'Regulamento'
  }
];

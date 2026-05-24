// Lista Oficial de Seleções da Copa do Mundo 2026 (48 Países) organizada por Grupos
export const SELECTIONS = [
  // Grupo A
  { id: 'MEX', name: 'México', flag: '🇲🇽', count: 10 },
  { id: 'RSA', name: 'África do Sul', flag: '🇿🇦', count: 10 },
  { id: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷', count: 10 },
  { id: 'CZE', name: 'Rep. Tcheca', flag: '🇨🇿', count: 10 },
  // Grupo B
  { id: 'CAN', name: 'Canadá', flag: '🇨🇦', count: 10 },
  { id: 'BIH', name: 'Bósnia-Herzegovina', flag: '🇧🇦', count: 10 },
  { id: 'QAT', name: 'Catar', flag: '🇶🇦', count: 10 },
  { id: 'SUI', name: 'Suíça', flag: '🇨🇭', count: 10 },
  // Grupo C
  { id: 'BRA', name: 'Brasil', flag: '🇧🇷', count: 10 },
  { id: 'MAR', name: 'Marrocos', flag: '🇲🇦', count: 10 },
  { id: 'HAI', name: 'Haiti', flag: '🇭🇹', count: 10 },
  { id: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', count: 10 },
  // Grupo D
  { id: 'USA', name: 'Estados Unidos', flag: '🇺🇸', count: 10 },
  { id: 'PAR', name: 'Paraguai', flag: '🇵🇾', count: 10 },
  { id: 'AUS', name: 'Austrália', flag: '🇦🇺', count: 10 },
  { id: 'TUR', name: 'Turquia', flag: '🇹🇷', count: 10 },
  // Grupo E
  { id: 'GER', name: 'Alemanha', flag: '🇩🇪', count: 10 },
  { id: 'CUW', name: 'Curaçao', flag: '🇨🇼', count: 10 },
  { id: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮', count: 10 },
  { id: 'ECU', name: 'Equador', flag: '🇪🇨', count: 10 },
  // Grupo F
  { id: 'NED', name: 'Holanda', flag: '🇳🇱', count: 10 },
  { id: 'JPN', name: 'Japão', flag: '🇯🇵', count: 10 },
  { id: 'SWE', name: 'Suécia', flag: '🇸🇪', count: 10 },
  { id: 'TUN', name: 'Tunísia', flag: '🇹🇳', count: 10 },
  // Grupo G
  { id: 'BEL', name: 'Bélgica', flag: '🇧🇪', count: 10 },
  { id: 'EGY', name: 'Egito', flag: '🇪🇬', count: 10 },
  { id: 'IRN', name: 'Irã', flag: '🇮🇷', count: 10 },
  { id: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿', count: 10 },
  // Grupo H
  { id: 'ESP', name: 'Espanha', flag: '🇪🇸', count: 10 },
  { id: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', count: 10 },
  { id: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦', count: 10 },
  { id: 'URU', name: 'Uruguai', flag: '🇺🇾', count: 10 },
  // Grupo I
  { id: 'FRA', name: 'França', flag: '🇫🇷', count: 10 },
  { id: 'SEN', name: 'Senegal', flag: '🇸🇳', count: 10 },
  { id: 'IRQ', name: 'Iraque', flag: '🇮🇶', count: 10 },
  { id: 'NOR', name: 'Noruega', flag: '🇳🇴', count: 10 },
  // Grupo J
  { id: 'ARG', name: 'Argentina', flag: '🇦🇷', count: 10 },
  { id: 'ALG', name: 'Argélia', flag: '🇩🇿', count: 10 },
  { id: 'AUT', name: 'Áustria', flag: '🇦🇹', count: 10 },
  { id: 'JOR', name: 'Jordânia', flag: '🇯🇴', count: 10 },
  // Grupo K
  { id: 'POR', name: 'Portugal', flag: '🇵🇹', count: 10 },
  { id: 'COD', name: 'RD Congo', flag: '🇨🇩', count: 10 },
  { id: 'UZB', name: 'Uzbequistão', flag: '🇺🇿', count: 10 },
  { id: 'COL', name: 'Colômbia', flag: '🇨🇴', count: 10 },
  // Grupo L
  { id: 'ENG', name: 'Inglaterra', flag: '🏴\u200d🏴\u200d🏴\u200d', count: 10 },
  { id: 'CRO', name: 'Croácia', flag: '🇭🇷', count: 10 },
  { id: 'GHA', name: 'Gana', flag: '🇬🇭', count: 10 },
  { id: 'PAN', name: 'Panamá', flag: '🇵🇦', count: 10 }
];

// Gera stickers de exemplo
export const getStickersList = () => {
  const list = [];
  SELECTIONS.forEach(sel => {
    // Reduzido para 10 stickers por seleção para navegação móvel super fluida (total 480 stickers)
    for (let i = 1; i <= sel.count; i++) {
      list.push({
        id: `${sel.id}-${String(i).padStart(2, '0')}`,
        code: `${sel.id}-${String(i).padStart(2, '0')}`,
        number: i,
        team: sel.id,
        playerName: i === 10 && sel.id === 'BRA' ? 'Neymar Jr' : 
                    i === 10 && sel.id === 'ARG' ? 'Lionel Messi' :
                    i === 7 && sel.id === 'POR' ? 'C. Ronaldo' : 
                    i === 10 && sel.id === 'FRA' ? 'K. Mbappé' :
                    i === 9 && sel.id === 'NOR' ? 'E. Haaland' :
                    i === 10 && sel.id === 'ENG' ? 'Harry Kane' :
                    i === 10 && sel.id === 'USA' ? 'C. Pulisic' :
                    i === 7 && sel.id === 'KOR' ? 'Son Heung-min' :
                    i === 10 && sel.id === 'EGY' ? 'Mohamed Salah' : `Jogador ${i}`,
        isSpecial: i === 10 || i === 1,
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
    neighborhood: 'Copacabana',
    distance: '800m',
    favoriteTeam: 'Brasil',
    extraStickers: ['BRA-10', 'ARG-10', 'POR-07', 'FRA-01', 'GER-10', 'USA-10', 'NOR-09', 'ENG-10', 'MEX-01', 'CAN-01'],
    missingStickers: ['BRA-01', 'BRA-09', 'ARG-02', 'FRA-10', 'GER-02', 'KOR-07', 'EGY-10', 'CRO-10', 'JPN-01', 'URU-01']
  },
  {
    id: 'user_thiago',
    name: 'Thiago Silva',
    avatar: 'TS',
    neighborhood: 'Ipanema',
    distance: '1.2km',
    favoriteTeam: 'Fluminense',
    extraStickers: ['FRA-10', 'GER-01', 'GER-02', 'POR-10', 'KOR-07', 'EGY-10', 'CRO-10', 'JPN-01', 'URU-01'],
    missingStickers: ['BRA-10', 'BRA-05', 'FRA-02', 'ARG-10', 'USA-10', 'NOR-09', 'MEX-01', 'CAN-01']
  },
  {
    id: 'user_maria',
    name: 'Maria Oliveira',
    avatar: 'MO',
    neighborhood: 'Leblon',
    distance: '2.5km',
    favoriteTeam: 'Brasil',
    extraStickers: ['ARG-02', 'BRA-01', 'GER-05', 'USA-01', 'KOR-01'],
    missingStickers: ['POR-07', 'GER-10', 'ENG-10', 'FRA-01']
  }
];

// Inicializa o álbum do usuário logado localmente
export const initUserAlbum = () => {
  const key = 'figucopa_user_album';
  if (!localStorage.getItem(key)) {
    const defaultAlbum = {};
    getStickersList().forEach(st => {
      defaultAlbum[st.id] = { owned: false, extra: 0 };
    });
    // Populando algumas figurinhas iniciais interativas baseadas na Copa 2026
    defaultAlbum['BRA-01'] = { owned: true, extra: 1 }; // Tem repetida
    defaultAlbum['BRA-09'] = { owned: true, extra: 2 }; // Tem repetidas
    defaultAlbum['ARG-02'] = { owned: true, extra: 1 }; // Tem repetida
    defaultAlbum['GER-02'] = { owned: true, extra: 1 }; // Tem repetida
    defaultAlbum['POR-07'] = { owned: false, extra: 0 }; // Faltante importante
    defaultAlbum['BRA-10'] = { owned: false, extra: 0 }; // Faltante importante
    defaultAlbum['USA-10'] = { owned: false, extra: 0 }; // Faltante importante
    defaultAlbum['NOR-09'] = { owned: false, extra: 0 }; // Faltante importante
    
    localStorage.setItem(key, JSON.stringify(defaultAlbum));
  }
};

export const getUserAlbum = () => {
  initUserAlbum();
  return JSON.parse(localStorage.getItem('figucopa_user_album'));
};

export const saveUserAlbum = (album) => {
  localStorage.setItem('figucopa_user_album', JSON.stringify(album));
  
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

// Calcula matches bilaterais baseado no álbum do usuário logado
export const calculateMatches = () => {
  const userAlbum = getUserAlbum();
  
  // Filtra as repetidas que o usuário tem
  const userExtras = Object.keys(userAlbum).filter(id => userAlbum[id].extra > 0);
  // Filtra as faltantes que o usuário precisa
  const userMissing = Object.keys(userAlbum).filter(id => !userAlbum[id].owned);
  
  return MOCK_COLLECTORS.map(col => {
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
  }).filter(match => match.score > 0) // Mostra apenas matches úteis
    .sort((a, b) => b.score - a.score); // Ordena por maior compatibilidade
};

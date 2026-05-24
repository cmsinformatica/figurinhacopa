// Lista de Seleções e Figurinhas de Exemplo
export const SELECTIONS = [
  { id: 'BRA', name: 'Brasil', flag: '🇧🇷', count: 20 },
  { id: 'ARG', name: 'Argentina', flag: '🇦🇷', count: 20 },
  { id: 'FRA', name: 'França', flag: '🇫🇷', count: 20 },
  { id: 'GER', name: 'Alemanha', flag: '🇩🇪', count: 20 },
  { id: 'POR', name: 'Portugal', flag: '🇵🇹', count: 20 }
];

// Gera stickers de exemplo
export const getStickersList = () => {
  const list = [];
  SELECTIONS.forEach(sel => {
    for (let i = 1; i <= sel.count; i++) {
      list.push({
        id: `${sel.id}-${String(i).padStart(2, '0')}`,
        code: `${sel.id}-${String(i).padStart(2, '0')}`,
        number: i,
        team: sel.id,
        playerName: i === 10 && sel.id === 'BRA' ? 'Neymar Jr' : 
                    i === 10 && sel.id === 'ARG' ? 'Lionel Messi' :
                    i === 7 && sel.id === 'POR' ? 'C. Ronaldo' : 
                    i === 10 && sel.id === 'FRA' ? 'K. Mbappé' : `Jogador ${i}`,
        isSpecial: i === 10 || i === 1,
        teamName: sel.name
      });
    }
  });
  return list;
};

// Mapeamento dos usuários colecionadores para simular matches
export const MOCK_COLLECTORS = [
  {
    id: 'user_cristiano',
    name: 'Cristiano Martins',
    avatar: 'CR',
    neighborhood: 'Copacabana',
    distance: '800m',
    favoriteTeam: 'Brasil',
    // Figurinhas que ele tem repetidas (que você precisa)
    extraStickers: ['BRA-10', 'ARG-10', 'POR-07', 'FRA-01', 'GER-10'],
    // Figurinhas que ele precisa (que você tem repetidas)
    missingStickers: ['BRA-01', 'BRA-09', 'ARG-02', 'FRA-10', 'GER-02']
  },
  {
    id: 'user_thiago',
    name: 'Thiago Silva',
    avatar: 'TS',
    neighborhood: 'Ipanema',
    distance: '1.2km',
    favoriteTeam: 'Fluminense',
    extraStickers: ['FRA-10', 'GER-01', 'GER-02', 'POR-10'],
    missingStickers: ['BRA-10', 'BRA-05', 'FRA-02', 'ARG-10']
  },
  {
    id: 'user_maria',
    name: 'Maria Oliveira',
    avatar: 'MO',
    neighborhood: 'Leblon',
    distance: '2.5km',
    favoriteTeam: 'Brasil',
    extraStickers: ['ARG-02', 'BRA-01', 'GER-05'],
    missingStickers: ['POR-07', 'GER-10']
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
    // Populando algumas figurinhas iniciais para a demonstração ser interativa
    defaultAlbum['BRA-01'] = { owned: true, extra: 1 }; // Tem repetida
    defaultAlbum['BRA-09'] = { owned: true, extra: 2 }; // Tem repetidas
    defaultAlbum['ARG-02'] = { owned: true, extra: 1 }; // Tem repetida
    defaultAlbum['GER-02'] = { owned: true, extra: 1 }; // Tem repetida
    defaultAlbum['POR-07'] = { owned: false, extra: 0 }; // Faltante importante
    defaultAlbum['BRA-10'] = { owned: false, extra: 0 }; // Faltante importante
    
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
    const score = totalMatchCount > 0 ? Math.min(Math.round((totalMatchCount / 6) * 100), 100) : 0;
    
    return {
      ...col,
      youSend,
      youReceive,
      score
    };
  }).filter(match => match.score > 0) // Mostra apenas matches úteis
    .sort((a, b) => b.score - a.score); // Ordena por maior compatibilidade
};

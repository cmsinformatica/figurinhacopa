import React, { useState } from 'react';
import { getStickersList, SELECTIONS } from '../db.js';
import { Plus, Minus, Check, Search, Share2, CheckCircle2, FileText, X } from 'lucide-react';

export default function AlbumGrid({ album, onAlbumUpdate }) {
  const [selectedTeam, setSelectedTeam] = useState('BRA');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'missing' | 'extra' | 'special'
  const [showShareToast, setShowShareToast] = useState(false);
  
  // Estados para o Modal de Cadastro Rápido (Importador Inteligente)
  const [showQuickImport, setShowQuickImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importSuccessMessage, setImportSuccessMessage] = useState('');

  const handleToggleOwned = (stickerId) => {
    const updated = { ...album };
    updated[stickerId].owned = !updated[stickerId].owned;
    if (!updated[stickerId].owned) {
      updated[stickerId].extra = 0; // Se não possui, não pode ter repetida
    }
    onAlbumUpdate(updated);
  };

  const handleIncrementExtra = (e, stickerId) => {
    e.stopPropagation(); // Evita marcar/desmarcar posse
    const updated = { ...album };
    if (!updated[stickerId].owned) {
      updated[stickerId].owned = true;
    }
    updated[stickerId].extra += 1;
    onAlbumUpdate(updated);
  };

  const handleDecrementExtra = (e, stickerId) => {
    e.stopPropagation();
    const updated = { ...album };
    if (updated[stickerId].extra > 0) {
      updated[stickerId].extra -= 1;
      onAlbumUpdate(updated);
    }
  };

  // Estatísticas do álbum
  const totalStickersCount = getStickersList().length;
  const ownedStickersCount = Object.keys(album).filter(id => album[id]?.owned).length;
  const extraStickersCount = Object.keys(album).reduce((acc, id) => acc + (album[id]?.extra || 0), 0);
  const percentComplete = Math.round((ownedStickersCount / totalStickersCount) * 100);

  // Filtra as figurinhas com base no time selecionado, busca e status
  const allStickers = getStickersList();
  const stickers = allStickers.filter(st => {
    // 1. Filtro por Seleção (apenas se não houver busca ativa, permitindo busca global)
    const matchesTeam = searchQuery ? true : st.team === selectedTeam;
    
    // 2. Filtro por Busca
    const matchesSearch = searchQuery 
      ? st.playerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        st.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.teamName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // 3. Filtro por Status
    const state = album[st.id] || { owned: false, extra: 0 };
    let matchesStatus = true;
    if (statusFilter === 'missing') matchesStatus = !state.owned;
    else if (statusFilter === 'extra') matchesStatus = state.extra > 0;
    else if (statusFilter === 'special') matchesStatus = st.isSpecial;
    
    return matchesTeam && matchesSearch && matchesStatus;
  });

  // Copiar resumo do álbum para compartilhar no WhatsApp
  const handleShareAlbum = () => {
    const userProfile = JSON.parse(localStorage.getItem('figucopa_user_profile') || '{"name": "Cristiano Martins", "neighborhood": "Barra"}');
    
    const myExtras = allStickers.filter(st => album[st.id]?.extra > 0).map(st => `${st.code} (+${album[st.id].extra})`);
    const myMissing = allStickers.filter(st => !album[st.id]?.owned).map(st => st.code);
    
    const textToShare = `⚽ *FiguCopa 2026 - Minhas Figurinhas!* ⚽
🙋‍♂️ *Colecionador:* ${userProfile.name} (${userProfile.neighborhood})
📊 *Progresso:* ${percentComplete}% completo (${ownedStickersCount}/${totalStickersCount})

🔁 *MINHAS REPETIDAS:*
${myExtras.length > 0 ? myExtras.join(', ') : 'Nenhuma repetida ainda.'}

❌ *ESTOU PRECISANDO DE:*
${myMissing.length > 0 ? myMissing.slice(0, 60).join(', ') + (myMissing.length > 60 ? ' ... e outras.' : '') : 'Nenhuma! Álbum completo! 🏆'}

_Quer trocar comigo? Abra o FiguCopa 2026!_ 🔄`;

    navigator.clipboard.writeText(textToShare).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    });
  };

  // Processa a importação de texto em lote (Cadastro Rápido / Smart Parser)
  const handleImportText = (type) => {
    if (!importText.trim()) return;
    
    const officialCodes = allStickers.map(st => st.code);
    
    // Regex inteligente: encontra blocos como BRA-10, bra10, bRa-02, arg-10 de forma insensível
    const tokens = importText.toUpperCase().match(/[A-Z]{3}-?\d{2}/g) || [];
    
    const validCodes = [];
    tokens.forEach(tok => {
      let formatted = tok;
      if (!tok.includes('-')) {
        formatted = tok.slice(0, 3) + '-' + tok.slice(3);
      }
      if (officialCodes.includes(formatted) && !validCodes.includes(formatted)) {
        validCodes.push(formatted);
      }
    });

    if (validCodes.length === 0) {
      alert("Nenhum código de figurinha válido encontrado! Formatos aceitos: BRA-01, ARG-10, ou colado do WhatsApp.");
      return;
    }

    const updated = { ...album };
    validCodes.forEach(code => {
      if (type === 'owned') {
        updated[code].owned = true;
      } else if (type === 'extra') {
        if (!updated[code].owned) {
          updated[code].owned = true;
        }
        updated[code].extra += 1;
      }
    });

    onAlbumUpdate(updated);
    setImportSuccessMessage(`Sucesso! Foram importadas ${validCodes.length} figurinhas como ${type === 'owned' ? 'Possuídas' : 'Repetidas'}!`);
    setImportText('');
    
    setTimeout(() => {
      setImportSuccessMessage('');
      setShowQuickImport(false);
    }, 3000);
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '100px' }}>
      
      {/* 📊 Resumo Estatístico Glassmorphic */}
      <section
        className="glass-ethereal"
        style={{
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Seu Progresso Geral</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cadastre seu estoque oficial para encontrar matches</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{percentComplete}%</span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Completo</div>
          </div>
        </div>

        {/* Barra de Progresso Neon */}
        <div style={{ background: 'rgba(0,0,0,0.2)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
          <div
            style={{
              background: 'linear-gradient(90deg, var(--accent), var(--success))',
              height: '100%',
              width: `${percentComplete}%`,
              boxShadow: '0 0 8px rgba(37, 117, 252, 0.4)',
              transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Possui</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }}>{ownedStickersCount} / {totalStickersCount}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Faltam</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--error)', marginTop: '2px' }}>{totalStickersCount - ownedStickersCount}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Repetidas</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--gold)', marginTop: '2px' }}>{extraStickersCount}</div>
          </div>
        </div>

        {/* Botões de Ação Auxiliares em Linha Dupla */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => setShowQuickImport(true)}
            style={{
              background: 'var(--accent-light)',
              border: '1px solid rgba(37, 117, 252, 0.25)',
              borderRadius: '12px',
              padding: '10px',
              color: 'var(--accent)',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
          >
            <FileText size={14} />
            <span>Cadastro Rápido</span>
          </button>
          
          <button
            onClick={handleShareAlbum}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '10px',
              color: 'var(--text-primary)',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
          >
            <Share2 size={14} />
            <span>Compartilhar</span>
          </button>
        </div>
      </section>

      {/* 🔍 Caixa de Busca e Filtros de Status (Controle Unificado) */}
      <section
        className="glass-ethereal"
        style={{
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Barra de Busca Neon */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Buscar por jogador, código ou seleção..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.2)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px 12px 40px',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'var(--transition)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          />
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        </div>

        {/* Filtros Pills de Status */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          {['all', 'missing', 'extra', 'special'].map(filterType => {
            const isActive = statusFilter === filterType;
            const label = filterType === 'all' ? 'Todas' :
                          filterType === 'missing' ? 'Faltantes' :
                          filterType === 'extra' ? 'Repetidas' : 'Especiais ⭐';
            return (
              <button
                key={filterType}
                onClick={() => setStatusFilter(filterType)}
                style={{
                  background: isActive ? 'var(--accent)' : 'rgba(0,0,0,0.15)',
                  color: isActive ? '#fff' : 'var(--text-primary)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 0 10px rgba(37,117,252,0.2)' : 'none',
                  transition: 'var(--transition)'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Seletor de Times PWA (Oculto se houver busca global ativa) */}
      {!searchQuery && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '1rem',
            scrollSnapType: 'x mandatory'
          }}
        >
          {SELECTIONS.map(team => {
            const teamStickers = getStickersList().filter(st => st.team === team.id);
            const teamOwned = teamStickers.filter(st => album[st.id]?.owned).length;
            const isSelected = selectedTeam === team.id;
            
            return (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                style={{
                  flexShrink: 0,
                  background: isSelected ? 'var(--accent)' : 'rgba(18, 25, 41, 0.45)',
                  backdropFilter: 'var(--backdrop-blur)',
                  color: isSelected ? '#fff' : 'var(--text-primary)',
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '0 4px 12px rgba(37, 117, 252, 0.25)' : 'var(--shadow-sm)',
                  transition: 'var(--transition)'
                }}
              >
                <span>{team.flag}</span>
                <span>{team.name}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}
                >
                  {teamOwned}/{team.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Grid de Figurinhas Físicas Realistas */}
      {stickers.length === 0 ? (
        <div className="glass-ethereal" style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px solid var(--border)', borderRadius: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
          <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Nenhuma figurinha encontrada</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>Tente ajustar os filtros ou digitar outro termo na busca.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '14px'
          }}
        >
          {stickers.map(st => {
            const state = album[st.id] || { owned: false, extra: 0 };
            const hasGoldGlow = st.isSpecial && state.owned;
            
            return (
              <div
                key={st.id}
                onClick={() => handleToggleOwned(st.id)}
                className={`card-physical ${hasGoldGlow ? 'glow-gold' : ''}`}
                style={{
                  background: state.owned 
                    ? (st.isSpecial 
                        ? 'linear-gradient(135deg, hsl(43, 96%, 14%), hsl(43, 96%, 5%))' 
                        : 'var(--accent-light)')
                    : 'rgba(18, 25, 41, 0.45)',
                  backgroundImage: (state.owned && st.isSpecial) 
                    ? 'repeating-linear-gradient(135deg, rgba(255,215,0,0.02) 0px, rgba(255,215,0,0.02) 4px, transparent 4px, transparent 8px), linear-gradient(135deg, hsl(43, 96%, 14%), hsl(43, 96%, 5%))' 
                    : undefined,
                  border: `2px solid ${
                    state.owned 
                      ? (st.isSpecial ? 'var(--gold)' : 'var(--accent)') 
                      : 'var(--border)'
                  }`,
                  borderRadius: '18px',
                  padding: '12px',
                  textAlign: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  backdropFilter: 'var(--backdrop-blur)',
                  transition: 'var(--transition)',
                  boxShadow: hasGoldGlow ? '0 8px 24px rgba(255, 215, 0, 0.25)' : 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '160px'
                }}
              >
                {/* Código da figurinha */}
                <div
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 800,
                    color: state.owned ? (st.isSpecial ? 'var(--gold)' : 'var(--accent)') : 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontFamily: 'monospace' }}>{st.code}</span>
                  {state.owned && <Check size={12} style={{ strokeWidth: 3 }} />}
                </div>

                {/* Nome do jogador */}
                <div style={{ margin: '8px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      color: state.owned ? (st.isSpecial ? '#fff' : 'var(--text-primary)') : 'var(--text-secondary)',
                      lineHeight: 1.2
                    }}
                  >
                    {st.playerName}
                  </div>
                  {st.isSpecial && (
                    <span
                      style={{
                        fontSize: '0.55rem',
                        background: 'var(--gold)',
                        color: '#000',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 900,
                        alignSelf: 'center',
                        marginTop: '6px',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Especial ⭐
                    </span>
                  )}
                </div>

                {/* Controle de Repetidas */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: state.owned ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.15)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '3px'
                  }}
                >
                  <button
                    disabled={!state.owned || state.extra === 0}
                    onClick={(e) => handleDecrementExtra(e, st.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      transition: 'var(--transition)',
                      opacity: (!state.owned || state.extra === 0) ? 0.2 : 1
                    }}
                  >
                    <Minus size={11} style={{ strokeWidth: 3 }} />
                  </button>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: state.extra > 0 ? 'var(--gold)' : 'var(--text-secondary)'
                    }}
                  >
                    {state.extra > 0 ? `+${state.extra}` : '0'}
                  </span>
                  <button
                    disabled={!state.owned}
                    onClick={(e) => handleIncrementExtra(e, st.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      transition: 'var(--transition)',
                      opacity: !state.owned ? 0.2 : 1
                    }}
                  >
                    <Plus size={11} style={{ strokeWidth: 3 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🚀 Modal de Cadastro Rápido (Quick Import / Smart Parser) */}
      {showQuickImport && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'var(--backdrop-blur)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="glass-ethereal animate-slide-up"
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '24px',
              padding: '24px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Fechar modal */}
            <button
              onClick={() => setShowQuickImport(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.2)',
                border: 'none',
                color: 'var(--text-primary)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em' }}>
              <FileText size={20} style={{ color: 'var(--accent)' }} />
              <span>Cadastro Rápido</span>
            </h3>
            
            <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
              Cole seu texto do WhatsApp ou digite os códigos. Nosso sistema inteligente filtra automaticamente figurinhas válidas! 
              <br />Exemplo: <code>BRA-01, bra09, ARG-10 e Neymar</code>.
            </p>

            {/* Sucesso de Importação */}
            {importSuccessMessage ? (
              <div
                style={{
                  background: 'var(--success-light)',
                  border: '1px solid rgba(79, 243, 37, 0.2)',
                  color: 'var(--success)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}
              >
                {importSuccessMessage}
              </div>
            ) : (
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Cole a lista de figurinhas aqui... ex: 'BRA-01, bra10, ARG-02'"
                rows={5}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.25)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '12px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'none',
                  marginBottom: '16px',
                  fontFamily: 'monospace'
                }}
              />
            )}

            {/* Ações da Importação */}
            {!importSuccessMessage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => handleImportText('owned')}
                    disabled={!importText.trim()}
                    style={{
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      opacity: !importText.trim() ? 0.35 : 1,
                      transition: 'var(--transition)'
                    }}
                  >
                    Possuo
                  </button>
                  <button
                    onClick={() => handleImportText('extra')}
                    disabled={!importText.trim()}
                    style={{
                      background: 'var(--gold)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      opacity: !importText.trim() ? 0.35 : 1,
                      transition: 'var(--transition)'
                    }}
                  >
                    Repetidas (+1)
                  </button>
                </div>
                
                <button
                  onClick={() => setShowQuickImport(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast de Confirmação de Compartilhamento */}
      {showShareToast && (
        <div
          className="animate-slide-up"
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: 'var(--success)',
            color: 'white',
            borderRadius: '12px',
            padding: '12px 18px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 2000,
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          <CheckCircle2 size={20} />
          <span>Resumo copiado para a área de transferência!</span>
        </div>
      )}

    </div>
  );
}

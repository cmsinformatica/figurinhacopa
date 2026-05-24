import React, { useState } from 'react';
import { getStickersList, SELECTIONS } from '../db.js';
import { Plus, Minus, Check } from 'lucide-react';

export default function AlbumGrid({ album, onAlbumUpdate }) {
  const [selectedTeam, setSelectedTeam] = useState('BRA');
  const stickers = getStickersList().filter(st => st.team === selectedTeam);

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
  const ownedStickersCount = Object.keys(album).filter(id => album[id].owned).length;
  const extraStickersCount = Object.keys(album).reduce((acc, id) => acc + album[id].extra, 0);
  const percentComplete = Math.round((ownedStickersCount / totalStickersCount) * 100);

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '80px' }}>
      
      {/* Resumo Estatístico Premium */}
      <section
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Seu Progresso Geral</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cadastre seu estoque oficial para encontrar matches</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{percentComplete}%</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completo</div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div style={{ background: 'var(--bg-primary)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
          <div
            style={{
              background: 'linear-gradient(90deg, var(--accent), var(--success))',
              height: '100%',
              width: `${percentComplete}%`,
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Possui</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{ownedStickersCount} / {totalStickersCount}</div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Faltam</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--error)' }}>{totalStickersCount - ownedStickersCount}</div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Repetidas</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--gold)' }}>{extraStickersCount}</div>
          </div>
        </div>
      </section>

      {/* Seleção de Times */}
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
          const teamOwned = teamStickers.filter(st => album[st.id].owned).length;
          
          return (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              style={{
                flexShrink: 0,
                background: selectedTeam === team.id ? 'var(--accent)' : 'var(--bg-secondary)',
                color: selectedTeam === team.id ? '#fff' : 'var(--text-primary)',
                border: `1px solid ${selectedTeam === team.id ? 'var(--accent)' : 'var(--border)'}`,
                padding: '10px 16px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: selectedTeam === team.id ? '0 4px 10px rgba(10, 132, 255, 0.2)' : 'var(--shadow-sm)',
                transition: 'var(--transition)'
              }}
            >
              <span>{team.flag}</span>
              <span>{team.name}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  background: selectedTeam === team.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)',
                  color: selectedTeam === team.id ? '#fff' : 'var(--text-secondary)',
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

      {/* Grid de Figurinhas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '12px'
        }}
      >
        {stickers.map(st => {
          const state = album[st.id];
          const hasGoldGlow = st.isSpecial && state.owned;
          
          return (
            <div
              key={st.id}
              onClick={() => handleToggleOwned(st.id)}
              style={{
                background: state.owned 
                  ? (st.isSpecial ? 'linear-gradient(135deg, hsl(43, 96%, 15%), hsl(43, 96%, 8%))' : 'var(--accent-light)')
                  : 'var(--bg-secondary)',
                border: `2px solid ${
                  state.owned 
                    ? (st.isSpecial ? 'var(--gold)' : 'var(--accent)') 
                    : 'var(--border)'
                }`,
                borderRadius: '16px',
                padding: '12px',
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer',
                transition: 'var(--transition)',
                boxShadow: hasGoldGlow ? '0 4px 16px rgba(255, 215, 0, 0.25)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '150px'
              }}
            >
              {/* Código da figurinha */}
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  color: state.owned ? (st.isSpecial ? 'var(--gold)' : 'var(--accent)') : 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{st.code}</span>
                {state.owned && <Check size={12} />}
              </div>

              {/* Nome do jogador */}
              <div style={{ margin: '8px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: state.owned ? (st.isSpecial ? '#fff' : 'var(--text-primary)') : 'var(--text-secondary)'
                  }}
                >
                  {st.playerName}
                </div>
                {st.isSpecial && (
                  <span
                    style={{
                      fontSize: '0.6rem',
                      background: 'var(--gold)',
                      color: '#000',
                      padding: '1px 4px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      marginTop: '4px',
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
                  background: state.owned ? 'rgba(0,0,0,0.1)' : 'var(--bg-primary)',
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
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'var(--transition)',
                    opacity: (!state.owned || state.extra === 0) ? 0.3 : 1
                  }}
                >
                  <Minus size={12} />
                </button>
                <span
                  style={{
                    fontSize: '0.8rem',
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
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'var(--transition)',
                    opacity: !state.owned ? 0.3 : 1
                  }}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

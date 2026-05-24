import React, { useState } from 'react';
import { Send, MapPin, User, CheckCircle2 } from 'lucide-react';

export default function MatchFeed({ matches, onProposeTrade }) {
  const [successModal, setSuccessModal] = useState(null);

  const triggerProposeTrade = (match) => {
    setSuccessModal(match);
    if (onProposeTrade) onProposeTrade(match);
    setTimeout(() => {
      setSuccessModal(null);
    }, 3000); // Fecha o alert em 3s
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '80px' }}>
      
      {/* Título de Seção */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Matches Recomendados</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Baseado nas figurinhas que faltam no seu álbum e nas suas repetidas cadastradas.
        </p>
      </div>

      {matches.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
          <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Nenhum Match Encontrado</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto' }}>
            Vá até a aba <strong>Álbum</strong> e adicione algumas figurinhas como <strong>"Possuo"</strong> e clique em <strong>"+"</strong> para adicionar repetidas!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {matches.map(match => (
            <div
              key={match.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-md)',
                transition: 'var(--transition)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Cabeçalho do Card */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--accent-light)',
                      color: 'var(--accent)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}
                  >
                    {match.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{match.name}</span>
                      <span style={{ fontSize: '0.65rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '20px' }}>
                        Time: {match.favoriteTeam}
                      </span>
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      <MapPin size={12} />
                      <span>{match.neighborhood} (a {match.distance})</span>
                    </div>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div
                  style={{
                    background: match.score > 80 ? 'var(--success-light)' : 'var(--accent-light)',
                    color: match.score > 80 ? 'var(--success)' : 'var(--accent)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  Match {match.score}%
                </div>
              </div>

              {/* Bilateral Columns: Envia vs Recebe */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '1.25rem'
                }}
              >
                {/* Você Envia */}
                <div
                  style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    borderLeft: '4px solid var(--error)'
                  }}
                >
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 800 }}>
                    Você Envia ({match.youSend.length})
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      marginTop: '6px'
                    }}
                  >
                    {match.youSend.map(st => (
                      <span
                        key={st}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Você Recebe */}
                <div
                  style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    borderLeft: '4px solid var(--success)'
                  }}
                >
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 800 }}>
                    Você Recebe ({match.youReceive.length})
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      marginTop: '6px'
                    }}
                  >
                    {match.youReceive.map(st => (
                      <span
                        key={st}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => triggerProposeTrade(match)}
                  style={{
                    flex: 1,
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'var(--transition)',
                    boxShadow: '0 4px 12px rgba(10, 132, 255, 0.15)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--accent-hover)'}
                  onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}
                >
                  <Send size={14} />
                  <span>Propor Troca Bilateral</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal / Toast de Sucesso Simulado */}
      {successModal && (
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
          <span>Proposta de troca enviada para {successModal.name}!</span>
        </div>
      )}

    </div>
  );
}

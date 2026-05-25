import React, { useState, useEffect } from 'react';
import { getWorldCupMatches, SELECTIONS, GROUP_LABELS, calculateGroupStandings, getTeamGroup, KNOCKOUT_STAGES } from '../db.js';
import { Trophy, ChevronDown, ChevronRight, Swords, Shield, Goal } from 'lucide-react';

const getTeamInfo = (id) => SELECTIONS.find(s => s.id === id);

export default function WorldCupTable() {
  const [matches, setMatches] = useState(() => getWorldCupMatches());
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' | 'knockout' | 'matches'
  const [expandedGroup, setExpandedGroup] = useState('A');

  const groupMatches = matches.filter(m => m.phase === 'group');
  const knockoutMatches = matches.filter(m => m.phase !== 'group');

  const allMatchesSorted = [...groupMatches].sort((a, b) => {
    const gA = a.group || '';
    const gB = b.group || '';
    if (gA !== gB) return gA.localeCompare(gB);
    const idA = parseInt(a.id.replace('match_', ''));
    const idB = parseInt(b.id.replace('match_', ''));
    return idA - idB;
  });

  const getStandings = (groupLabel) => {
    const teamIds = SELECTIONS.filter(s => getTeamGroup(s.id) === groupLabel).map(s => s.id);
    const groupMs = groupMatches.filter(m => m.group === groupLabel);
    return calculateGroupStandings(teamIds, groupMs);
  };

  const renderFlag = (teamId) => {
    const team = getTeamInfo(teamId);
    return team ? `${team.flag} ${team.name}` : teamId;
  };

  const renderScore = (m) => {
    if (!m.played || m.homeScore === null) return <span style={{ color: 'var(--text-tertiary)' }}>—</span>;
    if (m.penaltyHome !== null) {
      return `${m.homeScore} (${m.penaltyHome}) x (${m.penaltyAway}) ${m.awayScore}`;
    }
    return `${m.homeScore} x ${m.awayScore}`;
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '100px' }}>

      {/* Hero Header */}
      <section className="glass-ethereal" style={{ borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Copa do Mundo <span style={{ color: 'var(--accent)' }}>2026</span></h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>48 seleções · 12 grupos · 104 jogos · Canadá, México & EUA</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>🇨🇦 Canadá</span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>🇲🇽 México</span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>🇺🇸 Estados Unidos</span>
        </div>
      </section>

      {/* Navegação de abas */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border)' }}>
        {[
          { id: 'groups', label: 'Grupos', icon: '📋' },
          { id: 'matches', label: 'Jogos', icon: '⚽' },
          { id: 'knockout', label: 'Mata-Mata', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ABA: GRUPOS */}
      {activeTab === 'groups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {GROUP_LABELS.map(group => {
            const standings = getStandings(group);
            const isExpanded = expandedGroup === group;

            return (
              <div key={group} className="glass-ethereal" style={{ borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                {/* Header do Grupo */}
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.15)',
                    border: 'none',
                    borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={14} style={{ color: 'var(--gold)' }} />
                    Grupo {group}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      {standings.filter(s => s.gp > 0).length} jogos
                    </span>
                    {isExpanded ? <ChevronDown size={16} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />}
                  </div>
                </button>

                {/* Tabela de classificação */}
                <div style={{ padding: isExpanded ? '8px 14px 14px 14px' : '0', maxHeight: isExpanded ? '500px' : '0', overflow: 'hidden', transition: 'var(--transition)' }}>
                  {/* Cabeçalho da tabela */}
                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.8fr', gap: '4px', padding: '6px 0', fontSize: '0.55rem', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--border)' }}>
                    <span>Time</span>
                    <span style={{ textAlign: 'center' }}>P</span>
                    <span style={{ textAlign: 'center' }}>V</span>
                    <span style={{ textAlign: 'center' }}>E</span>
                    <span style={{ textAlign: 'center' }}>D</span>
                    <span style={{ textAlign: 'center' }}>SG</span>
                    <span style={{ textAlign: 'center', fontWeight: 900 }}>Pts</span>
                  </div>

                  {standings.map((s, idx) => {
                    const team = getTeamInfo(s.teamId);
                    return (
                      <div key={s.teamId} style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.8fr',
                        gap: '4px',
                        padding: '7px 0',
                        fontSize: '0.75rem',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        background: idx < 2 ? 'rgba(37,117,252,0.04)' : 'transparent',
                        borderRadius: '6px'
                      }}>
                        <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', width: '16px', fontWeight: 800 }}>{idx + 1}º</span>
                          {team?.flag} {team?.name || s.teamId}
                        </span>
                        <span style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.gp}</span>
                        <span style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.w}</span>
                        <span style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.d}</span>
                        <span style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.l}</span>
                        <span style={{ textAlign: 'center', color: s.gd > 0 ? 'var(--success)' : 'var(--error)' }}>{s.gd > 0 ? `+${s.gd}` : s.gd}</span>
                        <span style={{ textAlign: 'center', fontWeight: 900, color: 'var(--accent)', fontSize: '0.85rem' }}>{s.pts}</span>
                      </div>
                    );
                  })}

                  {/* Jogos do grupo */}
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Jogos do Grupo</span>
                    {groupMatches.filter(m => m.group === group).map(m => (
                      <div key={m.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.12)',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        border: '1px solid var(--border)'
                      }}>
                        <span style={{ fontWeight: 600 }}>{renderFlag(m.home)}</span>
                        <span style={{ fontWeight: 900, color: m.played ? 'var(--text-primary)' : 'var(--warning)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {renderScore(m)}
                        </span>
                        <span style={{ fontWeight: 600 }}>{renderFlag(m.away)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ABA: JOGOS */}
      {activeTab === 'matches' && (
        <div className="glass-ethereal" style={{ borderRadius: '20px', padding: '1.25rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            <Swords size={16} style={{ color: 'var(--accent)' }} />
            <span>Calendário de Jogos — Fase de Grupos</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {allMatchesSorted.map(m => {
              const played = m.played;
              return (
                <div key={m.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: played ? 'rgba(79,243,37,0.03)' : 'rgba(0,0,0,0.1)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${played ? 'rgba(79,243,37,0.1)' : 'var(--border)'}`,
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 'bold', width: '28px', flexShrink: 0 }}>{m.group}</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.75rem', textAlign: 'right' }}>{renderFlag(m.home)}</span>
                  <span style={{
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    color: played ? 'var(--text-primary)' : 'var(--warning)',
                    minWidth: '60px',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.15)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {renderScore(m)}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.75rem' }}>{renderFlag(m.away)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA: MATA-MATA */}
      {activeTab === 'knockout' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {KNOCKOUT_STAGES.map(stage => {
            const stageMs = knockoutMatches.filter(m => m.phase === stage.id);

            return (
              <div key={stage.id} className="glass-ethereal" style={{ borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14} style={{ color: 'var(--gold)' }} />
                  <span>{stage.icon} {stage.name}</span>
                </h3>

                {stageMs.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem' }}>
                    Confrontos definidos após a fase de grupos.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                    {stageMs.map(m => (
                      <div key={m.id} style={{
                        background: 'rgba(0,0,0,0.12)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        {m.home ? (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                              <span>{renderFlag(m.home)}</span>
                              <span style={{
                                fontWeight: 900,
                                fontFamily: 'monospace',
                                color: m.played ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                fontSize: '0.8rem'
                              }}>
                                {m.played ? renderScore(m) : '—'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                              <span>{renderFlag(m.away)}</span>
                              <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>
                                {m.played ? (m.penaltyHome !== null ? 'pênaltis' : 'tempo normal') : 'a definir'}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '6px 0' }}>
                            ⏳ Aguardando definição
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legenda */}
      <div style={{ marginTop: '1.5rem', fontSize: '0.65rem', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5, padding: '0 1rem' }}>
        <p>📋 P = Partidas · V = Vitórias · E = Empates · D = Derrotas · SG = Saldo de Gols · Pts = Pontos</p>
        <p style={{ marginTop: '4px' }}>Os 2 primeiros de cada grupo + 8 melhores 3º lugares avançam às Oitavas de Final</p>
      </div>
    </div>
  );
}

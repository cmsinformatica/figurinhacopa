import React, { useState, useEffect } from 'react';
import { SELECTIONS, BADGES, getUnlockedBadges, getStickersList, getSalvadorLeaderboard } from '../db.js';
import { User, MapPin, Award, Shield, Download, Trash2, CheckCircle2, ChevronDown, Sparkles, Trophy } from 'lucide-react';

export default function ProfileTab({ album, onAlbumUpdate, profile, onProfileUpdate, realLeaderboard }) {
  const [name, setName] = useState(profile?.name || '');
  const [neighborhood, setNeighborhood] = useState(profile?.neighborhood || 'Barra');
  const [favoriteTeam, setFavoriteTeam] = useState(profile?.favoriteTeam || 'BRA');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setNeighborhood(profile.neighborhood || 'Barra');
      setFavoriteTeam(profile.favoriteTeam || 'BRA');
    }
  }, [profile]);

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid var(--border)' }} className="animate-slide-up">
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⚽</div>
        <h4 style={{ fontWeight: 800, color: '#fff' }}>Sincronizando Arena...</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Buscando perfil do jogador no Supabase</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    onProfileUpdate({
      ...profile,
      name,
      neighborhood,
      favoriteTeam
    });
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Estatísticas calculadas do Álbum
  const totalStickersCount = getStickersList().length;
  const ownedStickersCount = Object.keys(album).filter(id => album[id]?.owned).length;
  const extraStickersCount = Object.keys(album).reduce((acc, id) => acc + (album[id]?.extra || 0), 0);
  const missingStickersCount = totalStickersCount - ownedStickersCount;
  const percentComplete = Math.round((ownedStickersCount / totalStickersCount) * 100);

  // Conquistas desbloqueadas
  const unlockedBadges = getUnlockedBadges(album, profile);

  // Exportar dados (LGPD)
  const handleExportData = () => {
    const dataStr = JSON.stringify({
      profile,
      album,
      trades: JSON.parse(localStorage.getItem('figucopa_trades') || '[]'),
      messages: JSON.parse(localStorage.getItem('figucopa_messages') || '[]'),
      exportedAt: new Date().toISOString()
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `figucopa_data_${profile.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Excluir conta (LGPD)
  const handleDeleteAccount = () => {
    if (confirm('Aviso Crítico: Isso apagará permanentemente todos os seus dados locais do aplicativo (álbum, histórico de trocas e chats). Tem certeza de que deseja prosseguir?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const selectedTeamFlag = SELECTIONS.find(s => s.id === favoriteTeam)?.flag || '⚽';

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '100px' }}>
      
      {/* 👤 Cabeçalho do Perfil Premium */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        {/* Avatar */}
        <div
          style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--accent), var(--success))',
            color: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(37, 117, 252, 0.25)',
            position: 'relative',
            zIndex: 1
          }}
        >
          {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '-0.01em' }}>
            <span>{name}</span>
            <span style={{ fontSize: '1rem' }} title="Seleção favorita">{selectedTeamFlag}</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <MapPin size={12} style={{ color: 'var(--accent)' }} />
            <span>{neighborhood}, Salvador, BA</span>
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
              ★ {profile.rating}
            </span>
            <span style={{ fontSize: '0.65rem', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(79,243,37,0.15)', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
              {profile.completedTrades} troca(s)
            </span>
          </div>
        </div>
      </section>

      {/* ⚙️ Formulário de Configuração */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          <User size={16} style={{ color: 'var(--accent)' }} />
          <span>Configurações da Conta</span>
        </h3>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Seu Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'var(--transition)'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Bairro / Cidade
              </label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Seleção Favorita
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <option value="">Nenhuma</option>
                  {SELECTIONS.map(sel => (
                    <option key={sel.id} value={sel.id} style={{ background: 'var(--bg-primary)' }}>
                      {sel.flag} {sel.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
              marginTop: '6px',
              transition: 'var(--transition)',
              boxShadow: '0 4px 14px rgba(37, 117, 252, 0.2)'
            }}
          >
            Salvar Alterações
          </button>
        </form>
      </section>

      {/* 📈 Estatísticas Detalhadas Glassmorphic */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          <Sparkles size={16} style={{ color: 'var(--gold)' }} />
          <span>Estatísticas de Inventário</span>
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>{percentComplete}%</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-tertiary)', marginTop: '4px', textTransform: 'uppercase' }}>Progresso</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>{ownedStickersCount}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-tertiary)', marginTop: '4px', textTransform: 'uppercase' }}>Possuídas</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--error)' }}>{missingStickersCount}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-tertiary)', marginTop: '4px', textTransform: 'uppercase' }}>Faltantes</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold)' }}>{extraStickersCount}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-tertiary)', marginTop: '4px', textTransform: 'uppercase' }}>Repetidas</div>
          </div>
        </div>
      </section>

      {/* 🏆 Conquistas e Badges Premium */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          <Award size={16} style={{ color: 'var(--success)' }} />
          <span>Suas Conquistas ({unlockedBadges.length} / {BADGES.length})</span>
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {BADGES.map(badge => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: isUnlocked ? 'rgba(0,0,0,0.15)' : 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '12px',
                  opacity: isUnlocked ? 1 : 0.35,
                  transition: 'var(--transition)'
                }}
              >
                {/* Ícone de Badge com Efeito Glow */}
                <div
                  style={{
                    fontSize: '1.6rem',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: isUnlocked 
                      ? (badge.id === 'legendary' ? 'linear-gradient(135deg, var(--gold), var(--warning))' : 'rgba(255,255,255,0.05)') 
                      : 'rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isUnlocked ? '0 0 12px rgba(255,215,0,0.1)' : 'none'
                  }}
                >
                  {badge.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{badge.name}</span>
                    {isUnlocked && (
                      <span style={{ fontSize: '0.55rem', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(79,243,37,0.15)', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                        Desbloqueada
                      </span>
                    )}
                  </h4>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🏆 Ranking da Arena (Salvador, Bahia) */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          <Trophy size={16} style={{ color: 'var(--gold)' }} />
          <span>Ranking de Salvador 🏆</span>
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.35' }}>
          Competição de progresso ativa entre colecionadores de Salvador-BA. Complete mais figurinhas no seu Álbum para subir de posição no ranking!
        </p>

        {/* Tabela de Ranking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(realLeaderboard || []).map((leader, idx) => {
            const isMe = leader.isCurrentUser;
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`;
            return (
              <div
                key={leader.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isMe ? 'var(--accent-light)' : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${isMe ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '14px',
                  padding: '10px 14px',
                  transition: 'var(--transition)',
                  boxShadow: isMe ? '0 0 12px rgba(37,117,252,0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Medalha / Posição */}
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, width: '28px', color: idx < 3 ? 'inherit' : 'var(--text-tertiary)' }}>
                    {medal}
                  </span>

                  {/* Iniciais do Colecionador */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      background: isMe ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}
                  >
                    {leader.avatar}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.825rem', fontWeight: 800, color: isMe ? '#fff' : 'var(--text-primary)' }}>
                      {leader.name} {isMe && <span style={{ fontSize: '0.65rem', background: 'var(--accent)', color: '#fff', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px', fontWeight: 'bold' }}>Você</span>}
                    </h4>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{leader.neighborhood}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)' }}>{leader.progress}%</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    ★ {leader.rating} · {leader.completedTrades} troca(s)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🛡️ Centro de Privacidade LGPD */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          <Shield size={16} style={{ color: 'var(--text-primary)' }} />
          <span>Privacidade e Segurança (LGPD)</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.45' }}>
          Em conformidade com a LGPD, o FiguCopa 2026 funciona de modo local e privado no seu aparelho. Suas informações de localização são restritas a texto de bairro/cidade e seus chats são 100% seguros contra contatos indesejados.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
          <button
            onClick={handleExportData}
            style={{
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
          >
            <Download size={14} style={{ color: 'var(--accent)' }} />
            <span>Exportar JSON</span>
          </button>
          
          <button
            onClick={handleDeleteAccount}
            style={{
              background: 'var(--error-light)',
              color: 'var(--error)',
              border: '1px solid rgba(255,110,132,0.15)',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
          >
            <Trash2 size={14} />
            <span>Excluir Conta</span>
          </button>
        </div>

        {/* Acordeão para Política de Privacidade */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <button
            type="button"
            onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'pointer',
              color: 'var(--accent)',
              outline: 'none'
            }}
          >
            <span>Ver Termos e Política de Privacidade</span>
            <ChevronDown size={14} style={{ transform: isPrivacyOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
          </button>
          
          {isPrivacyOpen && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.5', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <strong>1. Coleta de Dados:</strong> Apenas dados informados (Nome, Bairro e Seleção Favorita) são salvos temporariamente. Não rastreamos coordenadas de GPS reais.<br/><br/>
              <strong>2. Menores de 13 anos:</strong> A conta deve ser configurada e moderada com um responsável. O chat fica disponível somente após match confirmado entre colecionadores de figurinhas complementares, eliminando contatos frios aleatórios.<br/><br/>
              <strong>3. Cloud Vision Moderation:</strong> As imagens enviadas no chat são moderadas automaticamente para impedir conteúdos inadequados.<br/><br/>
              <strong>4. Seus Direitos:</strong> Você possui o direito à portabilidade (botão Exportar acima) e à eliminação (botão Excluir acima) imediata e integral de qualquer registro.
            </div>
          )}
        </div>
      </section>

      {/* Modal / Toast de Sucesso Simulado */}
      {showSuccessToast && (
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
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import { toUuid } from '../db.js';
import { Users, BarChart3, Plus, Trophy, MapPin, ShieldAlert, Award } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({ totalUsers: 0, avgProgress: 0, totalEvents: 0 });
  const [showEventModal, setShowEventModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');  // Substitui alert() nativo

  // Formulário de Novo Evento
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocal, setEventLocal] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventNeighborhood, setEventNeighborhood] = useState('Barra');
  const [eventAttendees, setEventAttendees] = useState(10);
  const [eventSuccess, setEventSuccess] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Carrega Perfis
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*');
      if (pError) throw pError;

      // 2. Carrega figurinhas possuídas por todos os usuários para calcular progresso
      const { data: stickers, error: sError } = await supabase
        .from('user_stickers')
        .select('user_id, owned')
        .eq('owned', true);
      if (sError) throw sError;

      // 3. Carrega contagem de eventos
      const { count: eventsCount, error: eError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
      if (eError) throw eError;

      // Mapeia progresso de figurinhas para cada usuário (total de 980 figurinhas)
      const usersWithProgress = profiles.map(profile => {
        const ownedCount = stickers.filter(s => s.user_id === profile.id).length;
        const progress = Math.round((ownedCount / 980) * 100);
        return {
          ...profile,
          progress
        };
      });

      setUsers(usersWithProgress);

      // Calcula métricas gerais
      const totalUsers = profiles.length;
      const avgProgress = totalUsers > 0 
        ? Math.round(usersWithProgress.reduce((sum, u) => sum + u.progress, 0) / totalUsers) 
        : 0;

      setMetrics({
        totalUsers,
        avgProgress,
        totalEvents: eventsCount || 0  // Sem fallback fictício
      });

    } catch (err) {
      console.error('[Admin Panel Error] Falha ao buscar dados administrativos:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle || !eventLocal || !eventDate) return;

    try {
      const newEventId = 'event_created_' + Date.now();
      const { error } = await supabase
        .from('events')
        .insert([{
          id: toUuid(newEventId),
          title: eventTitle,
          local: eventLocal,
          date: eventDate,
          initial_attendees: parseInt(eventAttendees),
          neighborhood: eventNeighborhood
        }]);

      if (error) throw error;

      setEventSuccess(true);
      setEventTitle('');
      setEventLocal('');
      setEventDate('');
      
      fetchAdminData();
      
      setTimeout(() => {
        setEventSuccess(false);
        setShowEventModal(false);
      }, 2000);

    } catch (err) {
      setErrorMsg('Erro ao criar evento: ' + err.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleToggleAdminStatus = async (user) => {
    const newAdminStatus = !user.is_admin;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: newAdminStatus })
        .eq('id', user.id);

      if (error) throw error;

      // Atualiza estado local
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_admin: newAdminStatus } : u));
    } catch (err) {
      setErrorMsg('Erro ao alterar status admin: ' + err.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }} className="animate-slide-up">
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <h4 style={{ fontWeight: 800 }}>Carregando Painel Administrativo...</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compilando métricas da Arena em Salvador</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '80px' }}>
      
      {/* Toast de Erro (substitui alert nativo) */}
      {errorMsg && (
        <div style={{ background: 'var(--error-light)', color: 'var(--error)', border: '1px solid rgba(255,75,85,0.2)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Cabeçalho */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} style={{ color: 'var(--gold)' }} />
            <span>Painel de Controle Admin</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Visão geral da base de clientes cadastrados na Arena FiguCopa
          </p>
        </div>

        <button
          onClick={() => setShowEventModal(true)}
          style={{
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '0.775rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'var(--transition)',
            boxShadow: '0 4px 10px rgba(37,117,252,0.2)'
          }}
        >
          <Plus size={14} />
          <span>Novo Encontro</span>
        </button>
      </div>

      {/* Grade de Estatísticas Gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
        <div className="glass-ethereal" style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <Users size={18} style={{ color: 'var(--accent)', marginBottom: '6px' }} />
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Clientes Ativos</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{metrics.totalUsers}</div>
        </div>

        <div className="glass-ethereal" style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <Trophy size={18} style={{ color: 'var(--gold)', marginBottom: '6px' }} />
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Álbum Concluído</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{metrics.avgProgress}% <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>médio</span></div>
        </div>

        <div className="glass-ethereal" style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <BarChart3 size={18} style={{ color: 'var(--success)', marginBottom: '6px' }} />
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Encontros Criados</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{metrics.totalEvents}</div>
        </div>
      </div>

      {/* Lista de Clientes Cadastrados */}
      <section className="glass-ethereal" style={{ borderRadius: '20px', padding: '1.25rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--text-secondary)' }}>
          Gestão de Usuários
        </h4>

        {users.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>Nenhum usuário cadastrado.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users.map(u => (
              <div
                key={u.id}
                style={{
                  background: 'rgba(0,0,0,0.15)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      background: u.is_admin ? 'linear-gradient(135deg, var(--gold), var(--warning))' : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                      color: u.is_admin ? '#000' : 'white',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}
                  >
                    {u.avatar || '⚽'}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.825rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{u.name}</span>
                      {u.is_admin && (
                        <span style={{ fontSize: '0.55rem', background: 'var(--warning-light)', color: 'var(--warning)', border: '1px solid rgba(255,178,0,0.2)', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                          Admin
                        </span>
                      )}
                    </h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
                      <MapPin size={10} style={{ color: 'var(--accent)' }} />
                      <span>{u.neighborhood}</span>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Álbum Progress Bar */}
                  <div style={{ width: '100px', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Progresso</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--success))', width: `${u.progress}%` }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: u.progress > 80 ? 'var(--success)' : 'var(--text-secondary)' }}>{u.progress}%</span>
                    </div>
                  </div>

                  {/* Atribuir/Revogar Admin */}
                  <button
                    onClick={() => handleToggleAdminStatus(u)}
                    style={{
                      background: u.is_admin ? 'rgba(255, 75, 85, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      color: u.is_admin ? 'var(--error)' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '0.675rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {u.is_admin ? 'Revogar Admin' : 'Tornar Admin'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal Criar Encontro */}
      {showEventModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'var(--backdrop-blur)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <form
            onSubmit={handleCreateEvent}
            className="glass-ethereal animate-slide-up"
            style={{
              width: '100%',
              maxWidth: '380px',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)'
            }}
          >
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff', textAlign: 'center' }}>
              Criar Encontro em Salvador 📅
            </h4>

            {eventSuccess && (
              <div style={{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(79,243,37,0.2)', padding: '10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
                ✔ Encontro anunciado com sucesso!
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Título do Encontro</label>
                <input
                  type="text"
                  placeholder="Ex: Troca dos Campeões na Orla"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 10px', fontSize: '0.775rem', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Local Físico</label>
                <input
                  type="text"
                  placeholder="Ex: Largo da Mariquita (Food Trucks)"
                  value={eventLocal}
                  onChange={(e) => setEventLocal(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 10px', fontSize: '0.775rem', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Data e Horário</label>
                <input
                  type="text"
                  placeholder="Ex: Sábado, 06/Junho às 16:00h"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 10px', fontSize: '0.775rem', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Bairro de Salvador</label>
                  <select
                    value={eventNeighborhood}
                    onChange={(e) => setEventNeighborhood(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px', fontSize: '0.775rem', color: '#fff', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Barra" style={{ background: 'var(--bg-primary)' }}>Barra</option>
                    <option value="Rio Vermelho" style={{ background: 'var(--bg-primary)' }}>Rio Vermelho</option>
                    <option value="Pituba" style={{ background: 'var(--bg-primary)' }}>Pituba</option>
                    <option value="Pelourinho" style={{ background: 'var(--bg-primary)' }}>Pelourinho</option>
                    <option value="Itapuã" style={{ background: 'var(--bg-primary)' }}>Itapuã</option>
                    <option value="Ondina" style={{ background: 'var(--bg-primary)' }}>Ondina</option>
                    <option value="Caminho das Árvores" style={{ background: 'var(--bg-primary)' }}>Caminho das Árvores</option>
                    <option value="Bonfim" style={{ background: 'var(--bg-primary)' }}>Bonfim</option>
                    <option value="Brotas" style={{ background: 'var(--bg-primary)' }}>Brotas</option>
                    <option value="Cabula" style={{ background: 'var(--bg-primary)' }}>Cabula</option>
                    <option value="Imbuí" style={{ background: 'var(--bg-primary)' }}>Imbuí</option>
                    <option value="Stella Maris" style={{ background: 'var(--bg-primary)' }}>Stella Maris</option>
                    <option value="Stiep" style={{ background: 'var(--bg-primary)' }}>Stiep</option>
                    <option value="Graça" style={{ background: 'var(--bg-primary)' }}>Graça</option>
                    <option value="Vitória" style={{ background: 'var(--bg-primary)' }}>Vitória</option>
                    <option value="Campo Grande" style={{ background: 'var(--bg-primary)' }}>Campo Grande</option>
                    <option value="Liberdade" style={{ background: 'var(--bg-primary)' }}>Liberdade</option>
                    <option value="Cajazeiras" style={{ background: 'var(--bg-primary)' }}>Cajazeiras</option>
                    <option value="Mussurunga" style={{ background: 'var(--bg-primary)' }}>Mussurunga</option>
                    <option value="Patamares" style={{ background: 'var(--bg-primary)' }}>Patamares</option>
                    <option value="Piatã" style={{ background: 'var(--bg-primary)' }}>Piatã</option>
                    <option value="Costa Azul" style={{ background: 'var(--bg-primary)' }}>Costa Azul</option>
                    <option value="Amaralina" style={{ background: 'var(--bg-primary)' }}>Amaralina</option>
                    <option value="Horto Florestal" style={{ background: 'var(--bg-primary)' }}>Horto Florestal</option>
                    <option value="Pernambués" style={{ background: 'var(--bg-primary)' }}>Pernambués</option>
                    <option value="Paripe" style={{ background: 'var(--bg-primary)' }}>Paripe</option>
                    <option value="Periperi" style={{ background: 'var(--bg-primary)' }}>Periperi</option>
                    <option value="Federação" style={{ background: 'var(--bg-primary)' }}>Federação</option>
                    <option value="Canela" style={{ background: 'var(--bg-primary)' }}>Canela</option>
                    <option value="São Caetano" style={{ background: 'var(--bg-primary)' }}>São Caetano</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Confirmações Iniciais</label>
                  <input
                    type="number"
                    value={eventAttendees}
                    onChange={(e) => setEventAttendees(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 10px', fontSize: '0.775rem', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                Criar Encontro
              </button>
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

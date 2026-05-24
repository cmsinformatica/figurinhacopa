import React, { useState, useEffect } from 'react';
import { Send, MapPin, CheckCircle2, TrendingUp, Filter, Compass, Calendar, Newspaper } from 'lucide-react';
import { MEETING_POINTS, MOCK_EVENTS, MOCK_NEWS, getConfirmedEvents, toggleEventConfirmation } from '../db.js';

export default function MatchFeed({ matches, onProposeTrade }) {
  const [successModal, setSuccessModal] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'radar'
  const [selectedRadarMatch, setSelectedRadarMatch] = useState(null);
  const [confirmedEvents, setConfirmedEvents] = useState(() => getConfirmedEvents());
  
  // Contador vivo de trocas simulado para Salvador
  const [liveTradesCount, setLiveTradesCount] = useState(847291);

  // Estados dos Filtros de Proximidade (Salvador, Bahia)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All'); // 'All' | 'Barra' | 'Rio Vermelho' | 'Pituba'
  const [maxDistance, setMaxDistance] = useState(99); // 99 (Todos) | 1.0 (1km) | 2.0 (2km) | 3.0 (3km)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTradesCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerProposeTrade = (match) => {
    setSuccessModal(match);
    if (onProposeTrade) onProposeTrade(match);
    setTimeout(() => {
      setSuccessModal(null);
    }, 3000);
  };

  const handleToggleEvent = (eventId) => {
    toggleEventConfirmation(eventId);
    setConfirmedEvents(getConfirmedEvents());
  };

  // Filtra matches localmente por bairro e raio de Salvador
  const filteredMatches = matches.filter(match => {
    // 1. Filtro de Bairro
    const matchesNeighborhood = selectedNeighborhood === 'All' ? true : match.neighborhood === selectedNeighborhood;
    
    // 2. Filtro de Distância Inteligente (converte '800m' -> 0.8km e '1.2km' -> 1.2km)
    const distNum = match.distance.includes('m') && !match.distance.includes('k')
      ? parseFloat(match.distance) / 1000
      : parseFloat(match.distance);
      
    const matchesDistance = distNum <= maxDistance;
    
    return matchesNeighborhood && matchesDistance;
  });

  const marqueeItems = [
    { text: "⚽ BRA-10 trocada na Barra, Salvador • há 4s", color: "var(--success)" },
    { text: "⭐ Messi ARG-10 encontrada no Rio Vermelho • há 11s", color: "var(--gold)" },
    { text: "⚽ MEX-01 trocada na Pituba • há 18s", color: "var(--success)" },
    { text: "⚡ 142 matches gerados em Salvador agora", color: "var(--accent)" },
    { text: "⚽ CAN-01 trocada no Caminho das Árvores • há 24s", color: "var(--success)" },
    { text: "⭐ C. Ronaldo POR-07 encontrada no Pelourinho • há 31s", color: "var(--gold)" },
    { text: "⚽ GER-10 trocada em Itapuã • há 38s", color: "var(--success)" },
    { text: "🔥 2.418 colecionadores ativos no bairro", color: "var(--warning)" }
  ];

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '100px' }}>
      
      {/* 🚀 1. Letreiro de Transações em Tempo Real (Live Marquee) */}
      <div className="marquee-container" style={{ borderRadius: '12px', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div className="marquee-track">
          {marqueeItems.concat(marqueeItems).map((item, idx) => (
            <span key={idx} className="marquee-item" style={{ color: item.color, marginRight: '30px' }}>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* 🏟️ 2. Painel de Estatísticas da "Arena de Trocas" (Hero Banner) */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--success)', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.05em' }}>
            <span className="pulse-dot"></span>
            Arena de Trocas Ativa · Salvador, Bahia
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px', letterSpacing: '-0.02em' }}>
            Troque Figurinhas da Copa <span style={{ color: 'var(--accent)' }}>2026</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
            Encontre matches bilaterais com segurança baseados na sua localização.
          </p>
        </div>

        {/* Grade de Estatísticas Dinâmicas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 8px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Trocas Concluídas</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0', fontFamily: 'monospace' }}>
              {liveTradesCount.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.6rem', color: 'var(--success)', fontWeight: 'bold' }}>+12.847 hoje</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 8px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Colecionadores</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0' }}>48.291</div>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 'bold' }}>2.418 online</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 8px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Match Médio</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0' }}>4m 18s</div>
            <span style={{ fontSize: '0.65rem', color: 'var(--warning)', fontWeight: 'bold' }}>tempo recorde</span>
          </div>
        </div>
      </section>

      {/* 🧭 3. Filtros Geográficos Avançados (Salvador, Bahia) */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          <Filter size={14} style={{ color: 'var(--accent)' }} />
          <span>Filtros de Proximidade (Bahia)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* Seletor de Bairro */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Bairro de Salvador</span>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '8px 10px',
                fontSize: '0.75rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All" style={{ background: 'var(--bg-primary)' }}>Todos os Bairros</option>
              <option value="Barra" style={{ background: 'var(--bg-primary)' }}>Barra</option>
              <option value="Rio Vermelho" style={{ background: 'var(--bg-primary)' }}>Rio Vermelho</option>
              <option value="Pituba" style={{ background: 'var(--bg-primary)' }}>Pituba</option>
              <option value="Pelourinho" style={{ background: 'var(--bg-primary)' }}>Pelourinho</option>
              <option value="Itapuã" style={{ background: 'var(--bg-primary)' }}>Itapuã</option>
              <option value="Ondina" style={{ background: 'var(--bg-primary)' }}>Ondina</option>
              <option value="Caminho das Árvores" style={{ background: 'var(--bg-primary)' }}>Caminho das Árvores</option>
              <option value="Bonfim" style={{ background: 'var(--bg-primary)' }}>Bonfim</option>
              <option value="Brotas" style={{ background: 'var(--bg-primary)' }}>Brotas</option>
            </select>
          </div>

          {/* Seletor de Raio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Raio de Distância</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '8px 10px',
                fontSize: '0.75rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={99} style={{ background: 'var(--bg-primary)' }}>Qualquer raio</option>
              <option value={1.0} style={{ background: 'var(--bg-primary)' }}>Até 1.0 km</option>
              <option value={2.0} style={{ background: 'var(--bg-primary)' }}>Até 2.0 km</option>
              <option value={3.0} style={{ background: 'var(--bg-primary)' }}>Até 3.0 km</option>
              <option value={4.5} style={{ background: 'var(--bg-primary)' }}>Até 4.5 km</option>
              <option value={6.0} style={{ background: 'var(--bg-primary)' }}>Até 6.0 km</option>
            </select>
          </div>
        </div>
      </section>

      {/* 📰 Copa 2026 - Central de Notícias (PRD F07) */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          <Newspaper size={16} style={{ color: 'var(--accent)' }} />
          <span>Central de Notícias Copa 2026 📰</span>
        </h3>
        
        {/* Carrossel de Notícias Horizontal */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px', scrollSnapType: 'x mandatory' }}>
          {MOCK_NEWS.map(news => (
            <div
              key={news.id}
              style={{
                flex: '0 0 250px',
                background: 'rgba(0,0,0,0.18)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '10px 12px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '110px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.55rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {news.tag}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '4px' }}>{news.title}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                  {news.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📅 Eventos de Troca Presenciais em Salvador (PRD F07) */}
      <section
        className="glass-ethereal"
        style={{
          borderRadius: '20px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          <Calendar size={16} style={{ color: 'var(--gold)' }} />
          <span>Encontros de Trocas em Salvador 📅</span>
        </h3>
        <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.35 }}>
          Troque com segurança em locais públicos movimentados. Confirme sua presença e encontre mais colecionadores!
        </p>

        {/* Grade de Eventos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MOCK_EVENTS.map(event => {
            const isConfirmed = confirmedEvents.includes(event.id);
            const totalAttendees = event.initialAttendees + (isConfirmed ? 1 : 0);
            return (
              <div
                key={event.id}
                style={{
                  background: isConfirmed ? 'var(--accent-light)' : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${isConfirmed ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'var(--transition)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.825rem', fontWeight: 800, color: '#fff' }}>{event.title}</h4>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    📍 {event.local}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '2px', fontWeight: 'bold' }}>
                    🕒 {event.date} · <span style={{ color: 'var(--success)' }}>{totalAttendees} confirmados</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleEvent(event.id)}
                  style={{
                    background: isConfirmed ? 'var(--success)' : 'rgba(255,255,255,0.03)',
                    color: isConfirmed ? 'white' : 'var(--text-primary)',
                    border: isConfirmed ? 'none' : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition)',
                    boxShadow: isConfirmed ? '0 0 8px var(--success)' : 'none'
                  }}
                >
                  {isConfirmed ? 'Confirmado! ✔' : 'Marcar Presença'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Título da Seção com Alternador Gamer */}
      <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Matches Recomendados</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Filtro geográfico local ativado</p>
        </div>
        
        {/* Alternador Gamer de Visualização (Lista vs Radar) */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: '10px', padding: '3px' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              background: viewMode === 'list' ? 'var(--accent)' : 'transparent',
              color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Lista
          </button>
          <button
            onClick={() => {
              setViewMode('radar');
              setSelectedRadarMatch(null);
            }}
            style={{
              background: viewMode === 'radar' ? 'var(--accent)' : 'transparent',
              color: viewMode === 'radar' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Compass size={12} />
            Radar 📡
          </button>
        </div>
      </div>

      {/* 🚀 Visualização por Radar Sonar de Salvador-BA */}
      {viewMode === 'radar' ? (
        <div
          className="glass-ethereal animate-slide-up"
          style={{
            borderRadius: '24px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>Radar Sonar de Salvador</h4>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '320px', lineHeight: 1.3 }}>
            Toque nos pontos brilhantes do sonar para identificar colecionadores ativos e sugerir trocas.
          </p>

          {/* Círculo do Sonar Gamer */}
          <div
            style={{
              position: 'relative',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(18, 25, 41, 0.9) 0%, rgba(5, 7, 12, 0.98) 100%)',
              border: '2px solid var(--border)',
              boxShadow: 'inset 0 0 24px rgba(37, 117, 252, 0.15), 0 8px 32px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              marginBottom: '1.5rem'
            }}
          >
            {/* Linhas concêntricas do Sonar */}
            <div style={{ position: 'absolute', top: '25%', left: '25%', right: '25%', bottom: '25%', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '12%', left: '12%', right: '12%', bottom: '12%', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '37%', left: '37%', right: '37%', bottom: '37%', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%' }} />
            
            {/* Eixos do radar */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Facho giratório do radar (Radar Sweep) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '50%',
                height: '50%',
                background: 'linear-gradient(45deg, rgba(37, 117, 252, 0.22) 0%, transparent 80%)',
                transformOrigin: '0% 0%',
                animation: 'radar-sweep 4s linear infinite',
                borderLeft: '1px solid rgba(37, 117, 252, 0.4)',
                borderRadius: '0 0 100% 0'
              }}
            />

            {/* Ponto Central - Usuário logado "Você" na Barra */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--accent)',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px var(--accent)'
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: '54%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.525rem',
                fontWeight: 900,
                color: 'var(--accent)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Você (Barra)
            </span>

            {/* Pins de outros colecionadores ativos de Salvador */}
            {filteredMatches.map(match => {
              const distNum = match.distance.includes('m') && !match.distance.includes('k')
                ? parseFloat(match.distance) / 1000
                : parseFloat(match.distance);
                
              const radius = Math.min(18 + (distNum / 6.0) * 72, 85);
              const angle = (match.name.charCodeAt(0) * 45) % 360;
              const angleRad = (angle * Math.PI) / 180;
              const x = 50 + radius * Math.cos(angleRad) * 0.45;
              const y = 50 + radius * Math.sin(angleRad) * 0.45;

              const isGold = match.score >= 80;
              const isSelected = selectedRadarMatch?.id === match.id;

              return (
                <button
                  key={match.id}
                  onClick={() => setSelectedRadarMatch(match)}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isSelected ? '18px' : '14px',
                    height: isSelected ? '18px' : '14px',
                    borderRadius: '50%',
                    background: isGold ? 'var(--gold)' : 'var(--success)',
                    border: `2px solid ${isSelected ? '#fff' : 'var(--bg-primary)'}`,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: `0 0 12px ${isGold ? 'var(--gold)' : 'var(--success)'}`,
                    animation: isSelected ? 'pulse-glow-selected 1s infinite ease-in-out' : 'pulse-glow 2.5s infinite ease-in-out',
                    zIndex: isSelected ? 30 : 20,
                    transition: 'width 0.2s, height 0.2s'
                  }}
                  title={`${match.name} (${match.neighborhood})`}
                />
              );
            })}
          </div>

          {/* Card Detalhado do Colecionador Selecionado */}
          {selectedRadarMatch ? (
            <div
              className="animate-slide-up"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '14px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 800 }}>{selectedRadarMatch.name}</h5>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.675rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    <MapPin size={10} style={{ color: 'var(--accent)' }} />
                    <span>{selectedRadarMatch.neighborhood} (a {selectedRadarMatch.distance})</span>
                  </div>
                </div>
                <div
                  style={{
                    background: selectedRadarMatch.score >= 80 ? 'var(--success-light)' : 'var(--accent-light)',
                    color: selectedRadarMatch.score >= 80 ? 'var(--success)' : 'var(--accent)',
                    border: `1px solid ${selectedRadarMatch.score >= 80 ? 'rgba(79,243,37,0.2)' : 'rgba(37,117,252,0.2)'}`,
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}
                >
                  Match {selectedRadarMatch.score}%
                </div>
              </div>

              {/* Figurinhas de Envio/Recebimento simplificadas */}
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.675rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <span>Você envia: <strong style={{ color: 'var(--error)' }}>{selectedRadarMatch.youSend.length}</strong></span>
                <span>•</span>
                <span>Você recebe: <strong style={{ color: 'var(--success)' }}>{selectedRadarMatch.youReceive.length}</strong></span>
              </div>

              {/* Ponto de encontro baiano correspondente */}
              <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', background: 'rgba(0,0,0,0.15)', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px', border: '1px solid var(--border)' }}>
                <Compass size={12} style={{ color: 'var(--success)' }} />
                <span>Ponto sugerido: <strong style={{ color: '#fff' }}>{MEETING_POINTS[selectedRadarMatch.neighborhood] || 'Local Público Seguro'}</strong></span>
              </div>

              <button
                onClick={() => triggerProposeTrade(selectedRadarMatch)}
                style={{
                  width: '100%',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'var(--transition)'
                }}
              >
                <Send size={12} />
                <span>Propor Troca Bilateral</span>
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '10px' }}>
              📡 Toque em um pin luminoso do radar para exibir detalhes da troca.
            </div>
          )}
        </div>
      ) : (
        /* 🚀 Visualização por Lista de Matches Tradicionais */
        filteredMatches.length === 0 ? (
          <div
            className="glass-ethereal"
            style={{
              borderRadius: '20px',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Nenhum Match Encontrado</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto', lineHeight: 1.4 }}>
              Tente expandir o raio de busca ou selecionar "Todos os Bairros" de Salvador para encontrar outros colecionadores.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredMatches.map(match => (
              <div
                key={match.id}
                className="glass-ethereal card-physical"
                style={{
                  borderRadius: '20px',
                  padding: '1.25rem',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
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
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Avatar do Colecionador */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                        color: 'white',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 10px rgba(37,117,252,0.15)'
                      }}
                    >
                      {match.avatar}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{match.name}</span>
                        <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '20px', fontWeight: 600 }}>
                          Time: {match.favoriteTeam}
                        </span>
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.725rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        <MapPin size={11} style={{ color: 'var(--accent)' }} />
                        <span>{match.neighborhood} (a {match.distance})</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    style={{
                      background: match.score > 80 ? 'var(--success-light)' : 'var(--accent-light)',
                      color: match.score > 80 ? 'var(--success)' : 'var(--accent)',
                      border: `1px solid ${match.score > 80 ? 'rgba(79,243,37,0.2)' : 'rgba(37,117,252,0.2)'}`,
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      boxShadow: 'var(--shadow-sm)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    Match {match.score}%
                  </div>
                </div>

                {/* Bilateral Columns: Envia vs Recebe (Estilo Assimétrico Avançado) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '1.25rem'
                  }}
                >
                  {/* Você Envia (Borda Vermelha) */}
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.12)',
                      borderRadius: '14px',
                      padding: '10px 12px',
                      borderLeft: '4px solid var(--error)',
                      border: '1px solid rgba(255,75,85,0.06)',
                      borderLeftWidth: '4px'
                    }}
                  >
                    <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 800, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--error)' }}></span>
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
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border)',
                            padding: '3px 6px',
                            borderRadius: '6px',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace'
                          }}
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Você Recebe (Borda Verde) */}
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.12)',
                      borderRadius: '14px',
                      padding: '10px 12px',
                      borderLeft: '4px solid var(--success)',
                      border: '1px solid rgba(79,243,37,0.06)',
                      borderLeftWidth: '4px'
                    }}
                  >
                    <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 800, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--success)' }}></span>
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
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border)',
                            padding: '3px 6px',
                            borderRadius: '6px',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace'
                          }}
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ponto de Encontro Sugerido (Bahia) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0,0,0,0.18)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Compass size={13} style={{ color: 'var(--success)' }} />
                  <span>Ponto sugerido: <strong style={{ color: '#fff' }}>{MEETING_POINTS[match.neighborhood] || 'Local Público Seguro'}</strong></span>
                </div>

                {/* Botão de Ação Reativo */}
                <button
                  onClick={() => triggerProposeTrade(match)}
                  style={{
                    width: '100%',
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'var(--transition)',
                    boxShadow: '0 4px 14px rgba(37, 117, 252, 0.2)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--accent-hover)'}
                  onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}
                >
                  <Send size={14} />
                  <span>Propor Troca Bilateral</span>
                </button>

              </div>
            ))}
          </div>
        )
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

      {/* CSS das Animações do Radar Sonar Gamer */}
      <style>{`
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); box-shadow: 0 0 16px inherit; }
          100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pulse-glow-selected {
          0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 10px #fff; }
          50% { transform: translate(-50%, -50%) scale(1.3); box-shadow: 0 0 20px #fff, 0 0 10px var(--accent); }
          100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 10px #fff; }
        }
      `}</style>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  getTrades, 
  getMessages, 
  saveMessages, 
  acceptTrade, 
  rejectTrade, 
  submitReview,
  MEETING_POINTS,
  blockUser,
  isUserBlocked,
  isSupabaseConfigured
} from '../db.js';
import { supabase } from '../supabaseClient.js';
import { Send, ArrowLeft, MapPin, CheckCircle2, MessageSquare, Star, ShieldAlert, Compass, Camera } from 'lucide-react';

const STICKER_DETAILS = {
  'BRA-10': { name: 'Neymar Jr', flag: '🇧🇷', country: 'Brasil', isSpecial: true },
  'ARG-10': { name: 'Lionel Messi', flag: '🇦🇷', country: 'Argentina', isSpecial: true },
  'POR-07': { name: 'C. Ronaldo', flag: '🇵🇹', country: 'Portugal', isSpecial: true },
  'FRA-10': { name: 'K. Mbappé', flag: '🇫🇷', country: 'França', isSpecial: true }
};

export default function ChatTab({ activeCollectorId, setActiveCollectorId, album, onAlbumUpdate, collectors = [], profile, realMatches = [] }) {
  const currentUserId = profile?.id || null;
  const [messages, setMessages] = useState(() => getMessages());
  const [trades, setTrades] = useState(() => getTrades());
  const [textInput, setTextInput] = useState('');
  const [showStickerSelect, setShowStickerSelect] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const messagesEndRef = useRef(null);

  const reloadData = () => {
    setMessages(getMessages());
    setTrades(getTrades());
    if (activeCollectorId) {
      setIsBlocked(isUserBlocked(activeCollectorId));
    }
  };

  useEffect(() => {
    reloadData();
    
    let channel = null;
    if (activeCollectorId && currentUserId && isSupabaseConfigured()) {
      channel = supabase
        .channel(`public:messages:receiver_${currentUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${currentUserId}`
          },
          (payload) => {
            console.log('[Supabase Realtime] Nova mensagem recebida:', payload.new);
            const currentMsgs = getMessages();
            if (!currentMsgs.some(m => m.id === payload.new.id)) {
              currentMsgs.push({
                id: payload.new.id,
                senderId: payload.new.sender_id,
                receiverId: payload.new.receiver_id,
                content: payload.new.content,
                timestamp: new Date(payload.new.created_at).getTime(),
                tradeId: payload.new.trade_id,
                stickerPhotoCode: payload.new.sticker_photo_code
              });
              saveMessages(currentMsgs);
              setMessages(currentMsgs);
            }
          }
        )
        .subscribe();
    }

    const interval = setInterval(reloadData, 1000);
    return () => {
      clearInterval(interval);
      if (channel) supabase.removeChannel(channel);
    };
  }, [activeCollectorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeCollectorId]);

  // Colecionadores com chats ativos (excluindo os bloqueados para segurança e LGPD)
  const activeChatsList = (collectors || []).filter(collector => {
    return !isUserBlocked(collector.id) && 
           (messages.some(m => m.senderId === collector.id || m.receiverId === collector.id) ||
            trades.some(t => t.collectorId === collector.id));
  });

  const activeCollector = (collectors || []).find(c => c.id === activeCollectorId);
  const activeTrade = trades.find(t => t.collectorId === activeCollectorId && t.status === 'pending') ||
                      trades.filter(t => t.collectorId === activeCollectorId && t.status !== 'pending').sort((a,b) => b.createdAt - a.createdAt)[0];

  const activeMessages = messages.filter(m => m.tradeId === activeTrade?.id || 
    ((m.senderId === activeCollectorId && m.receiverId === currentUserId) || 
     (m.senderId === currentUserId && m.receiverId === activeCollectorId))
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!textInput.trim() || !activeCollectorId) return;

    const userMessageId = 'msg_user_' + Date.now();
    const newMsg = {
      id: userMessageId,
      senderId: currentUserId,
      receiverId: activeCollectorId,
      content: textInput,
      timestamp: Date.now(),
      tradeId: activeTrade?.id || null
    };

    const updatedMessages = [...messages, newMsg];
    saveMessages(updatedMessages);
    setMessages(updatedMessages);
    setTextInput('');

    // Resposta mockada automática após 1.5s
    setTimeout(() => {
      const responses = [
        "Beleza! Acho uma boa nos encontrarmos em um ponto público, como o Farol da Barra ou na orla do Rio Vermelho.",
        "Ótimo! Você consegue fazer a troca amanhã por volta das 18h?",
        "Perfeito! Vou separar as figurinhas aqui em um saquinho para não amassar. Até logo!",
        "Combinado! Assim que eu chegar no local te aviso por aqui.",
        "Maravilha! Muito obrigado por responder rápido."
      ];
      const botResponse = {
        id: 'msg_bot_reply_' + Date.now(),
        senderId: activeCollectorId,
        receiverId: currentUserId,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        tradeId: activeTrade?.id || null
      };
      
      const messagesWithBot = [...getMessages(), botResponse];
      saveMessages(messagesWithBot);
      setMessages(messagesWithBot);
    }, 1500);
  };

  const handleSendStickerPhoto = (code) => {
    if (!activeCollectorId) return;
    const userMessageId = 'msg_user_' + Date.now();
    const newMsg = {
      id: userMessageId,
      senderId: currentUserId,
      receiverId: activeCollectorId,
      content: `[Foto da Figurinha ${code} Anexada]`,
      timestamp: Date.now(),
      tradeId: activeTrade?.id || null,
      stickerPhotoCode: code
    };
    const updatedMessages = [...messages, newMsg];
    saveMessages(updatedMessages);
    setMessages(updatedMessages);
    setShowStickerSelect(false);

    // Simulated bot reaction after 1.5s
    setTimeout(() => {
      const responses = [
        `Caramba! Essa ${code} está zerada mesmo, muito bem conservada! Combinado!`,
        `Sensacional! Valeu pela foto da ${code}, está perfeita. Vamos fechar a troca!`,
        `Que figurinha linda! O brilho holográfico dela está impecável. Nos vemos logo.`
      ];
      const botResponse = {
        id: 'msg_bot_reply_' + Date.now(),
        senderId: activeCollectorId,
        receiverId: currentUserId,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        tradeId: activeTrade?.id || null
      };
      const messagesWithBot = [...getMessages(), botResponse];
      saveMessages(messagesWithBot);
      setMessages(messagesWithBot);
    }, 1500);
  };

  const handleAccept = () => {
    if (!activeTrade) return;
    const success = acceptTrade(activeTrade.id, album, onAlbumUpdate);
    if (success) reloadData();
  };

  const handleReject = () => {
    if (!activeTrade) return;
    const success = rejectTrade(activeTrade.id);
    if (success) reloadData();
  };

  const handleReviewSubmit = (rating) => {
    if (!activeTrade) return;
    submitReview(activeTrade.id, rating);
    setReviewRating(rating);
    reloadData();
  };

  const handleBlockUser = () => {
    blockUser(activeCollectorId);
    setIsBlocked(true);
    setShowBlockModal(false);
    reloadData();
  };

  // 1. Tela de Lista de Conversas Ativas
  if (!activeCollectorId) {
    return (
      <div className="animate-slide-up" style={{ paddingBottom: '80px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Suas Conversas</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Negocie propostas e agende encontros seguros com colecionadores próximos.
          </p>
        </div>

        {activeChatsList.length === 0 ? (
          <div
            className="glass-ethereal"
            style={{
              borderRadius: '20px',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Nenhuma conversa ativa</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto', lineHeight: 1.4 }}>
              Vá até a aba de **Matches** e clique em **"Propor Troca Bilateral"** para iniciar um chat com colecionadores compatíveis!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeChatsList.map(collector => {
              const collTrade = trades.find(t => t.collectorId === collector.id && t.status === 'pending');
              const collMsgs = messages.filter(m => m.senderId === collector.id || m.receiverId === collector.id);
              const lastMsg = collMsgs[collMsgs.length - 1];

              return (
                <div
                  key={collector.id}
                  onClick={() => setActiveCollectorId(collector.id)}
                  className="glass-ethereal card-physical"
                  style={{
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                        color: 'white',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      {collector.avatar}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {collector.name}
                        {collTrade && (
                          <span style={{ fontSize: '0.55rem', background: 'var(--warning-light)', color: 'var(--warning)', border: '1px solid rgba(255,178,0,0.2)', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                            Proposta
                          </span>
                        )}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '280px', marginTop: '2px' }}>
                        {lastMsg ? lastMsg.content : 'Proposta de troca enviada.'}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    <div>{collector.distance}</div>
                    <div style={{ marginTop: '4px', fontWeight: 'bold', color: 'var(--success)' }}>
                      Match {(() => {
                        const m = realMatches.find(r => r.id === collector.id);
                        return m ? `${m.score}%` : '—';
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 2. Janela de Conversa Ativa
  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', position: 'relative' }}>
      
      {/* Cabeçalho da Conversa Glassmorphic */}
      <div
        className="glass-ethereal"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRadius: '16px',
          padding: '10px 14px',
          marginBottom: '10px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <button
          onClick={() => setActiveCollectorId(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <div
          style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            color: 'white',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.85rem'
          }}
        >
          {activeCollector.avatar}
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 800 }}>{activeCollector.name}</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
            <MapPin size={10} style={{ color: 'var(--accent)' }} />
            <span>{activeCollector.neighborhood} ({activeCollector.distance})</span>
          </p>
        </div>

        <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', marginRight: '4px' }}>
          ★ {activeCollector.rating || 5.0}
        </div>

        {/* Botão de Denúncia/Bloqueio (PRD F05) */}
        {!isBlocked && (
          <button
            onClick={() => setShowBlockModal(true)}
            title="Bloquear/Denunciar Colecionador"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--error)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,75,85,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <ShieldAlert size={16} />
          </button>
        )}
      </div>

      {/* Condicional de Bloqueio de Usuário (Proteção LGPD) */}
      {isBlocked ? (
        <div
          className="glass-ethereal animate-slide-up"
          style={{
            borderRadius: '20px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            border: '1px solid var(--border)',
            margin: '20px 0',
            background: 'rgba(255, 75, 85, 0.03)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
          <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--error)', marginBottom: '0.5rem' }}>Colecionador Bloqueado</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto', lineHeight: 1.45, marginBottom: '1.5rem' }}>
            Você denunciou e bloqueou este usuário. Para sua proteção e em total conformidade com as diretrizes da LGPD, as propostas ativas foram canceladas e toda a comunicação foi interrompida de forma segura.
          </p>
          <button
            onClick={() => setActiveCollectorId(null)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            Voltar para Conversas
          </button>
        </div>
      ) : (
        <>
          {/* Stream de Mensagens */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              background: 'rgba(0,0,0,0.15)',
              borderRadius: '18px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '10px'
            }}
          >
            {/* Card de Proposta Bilateral */}
            {activeTrade && (
              <div
                className="glass-ethereal"
                style={{
                  borderRadius: '16px',
                  padding: '14px',
                  border: `2px solid ${
                    activeTrade.status === 'accepted' ? 'var(--success)' : 
                    activeTrade.status === 'rejected' ? 'var(--border)' : 'var(--warning)'
                  }`,
                  boxShadow: 'var(--shadow-md)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.02em' }}>
                    ⚽ Proposta de Troca
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      background: 
                        activeTrade.status === 'accepted' ? 'var(--success-light)' : 
                        activeTrade.status === 'rejected' ? 'var(--error-light)' : 'var(--warning-light)',
                      color: 
                        activeTrade.status === 'accepted' ? 'var(--success)' : 
                        activeTrade.status === 'rejected' ? 'var(--error)' : 'var(--warning)',
                      padding: '2px 8px',
                      borderRadius: '20px'
                    }}
                  >
                    {activeTrade.status === 'pending' ? 'Pendente' : 
                     activeTrade.status === 'accepted' ? 'Concluída' : 'Recusada'}
                  </span>
                </div>

                {/* Troca Detalhada */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '12px', marginBottom: '10px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Você Envia</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {activeTrade.youSend.map(s => (
                        <span key={s} style={{ fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', padding: '2px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Você Recebe</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {activeTrade.youReceive.map(s => (
                        <span key={s} style={{ fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', padding: '2px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>{s}</span>
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
                    borderRadius: '10px',
                    padding: '6px 10px',
                    marginBottom: '10px',
                    fontSize: '0.675rem',
                    color: 'var(--text-tertiary)'
                  }}
                >
                  <Compass size={11} style={{ color: 'var(--success)' }} />
                  <span>Ponto sugerido: <strong style={{ color: '#fff' }}>{MEETING_POINTS[activeCollector.neighborhood] || 'Local Público Seguro'}</strong></span>
                </div>

                {/* Ações da proposta pendente */}
                {activeTrade.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleAccept}
                      style={{
                        flex: 1,
                        background: 'var(--success)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      Aceitar e Atualizar Álbum
                    </button>
                    <button
                      onClick={handleReject}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      Recusar
                    </button>
                  </div>
                )}

                {/* Widget de Avaliação Estrelas */}
                {activeTrade.status === 'accepted' && !activeTrade.reviewed && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Como foi a experiência de troca presencial?
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleReviewSubmit(star)}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', outline: 'none' }}
                        >
                          <Star
                            size={18}
                            style={{
                              fill: star <= (reviewHover || reviewRating) ? 'var(--gold)' : 'none',
                              color: star <= (reviewHover || reviewRating) ? 'var(--gold)' : 'var(--text-tertiary)',
                              filter: star <= (reviewHover || reviewRating) ? 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))' : 'none',
                              transition: 'var(--transition)'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sucesso de avaliação */}
                {activeTrade.status === 'accepted' && activeTrade.reviewed && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold', borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>Troca avaliada com {activeTrade.rating} estrela(s)!</span>
                  </div>
                )}
              </div>
            )}

            {/* Histórico das Mensagens */}
            {activeMessages.map((msg) => {
              const isUser = currentUserId ? msg.senderId === currentUserId : msg.senderId !== activeCollectorId && msg.senderId !== 'system';
              const isSys = msg.senderId === 'system';

              if (isSys) {
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: 'center',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.675rem',
                      fontWeight: 'bold',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      textAlign: 'center',
                      maxWidth: '85%'
                    }}
                  >
                    {msg.content}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    background: isUser ? 'var(--accent)' : 'var(--bg-tertiary)',
                    border: isUser ? 'none' : '1px solid var(--border)',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '10px 14px',
                    maxWidth: '75%',
                    boxShadow: 'var(--shadow-sm)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  {msg.stickerPhotoCode && (
                    <div 
                      className="card-physical glow-gold animate-slide-up"
                      style={{
                        width: '130px',
                        height: '160px',
                        background: 'linear-gradient(135deg, hsl(43, 96%, 14%), hsl(43, 96%, 5%))',
                        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,215,0,0.02) 0px, rgba(255,215,0,0.02) 4px, transparent 4px, transparent 8px), linear-gradient(135deg, hsl(43, 96%, 14%), hsl(43, 96%, 5%))',
                        border: '2px solid var(--gold)',
                        borderRadius: '14px',
                        padding: '10px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 8px 20px rgba(255, 215, 0, 0.3)',
                        marginBottom: '8px',
                        position: 'relative',
                        overflow: 'hidden',
                        alignSelf: 'center'
                      }}
                    >
                      {/* Top Row: Flag & Code */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', fontWeight: 'bold', width: '100%' }}>
                        <span>{STICKER_DETAILS[msg.stickerPhotoCode]?.flag || '🇧🇷'} {STICKER_DETAILS[msg.stickerPhotoCode]?.country || 'Brasil'}</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--gold)' }}>{msg.stickerPhotoCode}</span>
                      </div>
                      
                      {/* Middle: Player Name */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '4px 0' }}>
                        <div style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>⭐</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#fff', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                          {STICKER_DETAILS[msg.stickerPhotoCode]?.name || 'Jogador'}
                        </div>
                      </div>

                      {/* Bottom Stamp: Status de Verificação */}
                      <div style={{ background: 'rgba(79, 243, 37, 0.15)', color: 'var(--success)', border: '1px solid rgba(79,243,37,0.25)', padding: '2px 4px', borderRadius: '6px', fontSize: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', width: '100%' }}>
                        Impecável ✔
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', lineHeight: '1.45', wordBreak: 'break-word', alignSelf: 'stretch' }}>{msg.content}</div>
                  <div
                    style={{
                      fontSize: '0.55rem',
                      textAlign: 'right',
                      color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)',
                      marginTop: '4px',
                      alignSelf: 'flex-end'
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Pop-up de Seleção Rápida de Fotos de Figurinhas */}
          {showStickerSelect && (
            <div
              className="glass-ethereal animate-slide-up"
              style={{
                position: 'absolute',
                bottom: '60px',
                left: '10px',
                right: '10px',
                borderRadius: '20px',
                padding: '14px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                background: 'rgba(18, 25, 41, 0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📸 Enviar Foto de Estado Físico (Simulado)
                </span>
                <button 
                  type="button"
                  onClick={() => setShowStickerSelect(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Object.keys(STICKER_DETAILS).map(code => {
                  const details = STICKER_DETAILS[code];
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleSendStickerPhoto(code)}
                      className="card-physical glow-gold"
                      style={{
                        background: 'linear-gradient(135deg, hsl(43, 96%, 12%), hsl(43, 96%, 4%))',
                        border: '1px solid var(--gold)',
                        borderRadius: '12px',
                        padding: '8px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '75px',
                        transition: 'var(--transition)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.6rem', fontWeight: 'bold' }}>
                        <span>{details.flag} {details.country}</span>
                        <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>{code}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginTop: '4px' }}>
                        {details.name}
                      </div>
                      <div style={{ fontSize: '0.55rem', color: 'var(--success)', fontWeight: 'bold', marginTop: '2px' }}>
                        Fotografar cromo 📸
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Caixa de Entrada de Mensagens */}
          <form
            onSubmit={handleSendMessage}
            className="glass-ethereal"
            style={{
              display: 'flex',
              gap: '8px',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: 'var(--shadow-sm)',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setShowStickerSelect(!showStickerSelect)}
              style={{
                background: showStickerSelect ? 'var(--accent-light)' : 'rgba(255,255,255,0.03)',
                color: showStickerSelect ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${showStickerSelect ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '12px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                if (!showStickerSelect) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                if (!showStickerSelect) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <Camera size={18} />
            </button>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Digite uma mensagem..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                padding: '8px',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              style={{
                background: textInput.trim() ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                color: textInput.trim() ? 'white' : 'var(--text-tertiary)',
                border: 'none',
                borderRadius: '12px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
                boxShadow: textInput.trim() ? '0 0 10px rgba(37, 117, 252, 0.3)' : 'none'
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </>
      )}

      {/* Modal de Bloqueio/Denúncia Premium */}
      {showBlockModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'var(--backdrop-blur)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-ethereal animate-slide-up"
            style={{
              width: '100%',
              maxWidth: '380px',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.01em' }}>Confirmar Bloqueio & Denúncia</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '20px' }}>
              Deseja realmente bloquear e denunciar <strong>{activeCollector.name}</strong> por segurança? Esta ação cancelará propostas pendentes e ocultará permanentemente futuros matches.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleBlockUser}
                style={{
                  background: 'var(--error)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  boxShadow: '0 4px 12px rgba(255, 75, 85, 0.2)'
                }}
              >
                Confirmar Bloqueio
              </button>
              <button
                onClick={() => setShowBlockModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

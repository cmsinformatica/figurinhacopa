import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { SELECTIONS, NEIGHBORHOODS } from '../db.js';
import { Wifi, Key, Mail, User, MapPin, CheckCircle2 } from 'lucide-react';

export default function AuthScreen({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('Barra');
  const [favoriteTeam, setFavoriteTeam] = useState('BRA');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Fluxo de Cadastro (Sign Up) com Metadados do Perfil
        if (!name) {
          setErrorMsg('Por favor, digite seu nome.');
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              neighborhood,
              favorite_team: favoriteTeam
            }
          }
        });

        if (error) throw error;

        setSuccessMsg('Cadastro realizado com sucesso! Verifique seu e-mail ou faça login.');
        setIsSignUp(false);
      } else {
        // Fluxo de Login (Sign In)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (onAuthSuccess) onAuthSuccess(data.session);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="animate-slide-up"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '1rem'
      }}
    >
      <div
        className="glass-ethereal"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '24px',
          padding: '2rem 1.5rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow de fundo */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '2.2rem' }}>⚽</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '10px' }}>
            FiguCopa <span style={{ color: 'var(--accent)' }}>2026</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isSignUp ? 'Crie sua conta para começar a trocar!' : 'Faça login para gerenciar suas figurinhas'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
          {errorMsg && (
            <div style={{ background: 'var(--error-light)', color: 'var(--error)', border: '1px solid rgba(255,75,85,0.2)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(79,243,37,0.2)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              ✔ {successMsg}
            </div>
          )}

          {isSignUp && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Nome Completo</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Seu nome oficial"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '10px 12px 10px 34px',
                    fontSize: '0.825rem',
                    color: '#fff',
                    outline: 'none',
                    transition: 'var(--transition)'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>E-mail</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-tertiary)' }} />
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '10px 12px 10px 34px',
                  fontSize: '0.825rem',
                  color: '#fff',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Senha</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Key size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-tertiary)' }} />
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '10px 12px 10px 34px',
                  fontSize: '0.825rem',
                  color: '#fff',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
              />
            </div>
          </div>

          {isSignUp && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Bairro (Salvador)</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.8rem',
                    color: '#fff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {NEIGHBORHOODS.map(nb => (
                    <option key={nb} value={nb} style={{ background: 'var(--bg-primary)' }}>
                      {nb}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Seleção Favorita</label>
                <select
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.8rem',
                    color: '#fff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {SELECTIONS.map(sel => (
                    <option key={sel.id} value={sel.id} style={{ background: 'var(--bg-primary)' }}>
                      {sel.flag} {sel.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'var(--transition)',
              boxShadow: '0 4px 12px rgba(37, 117, 252, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Aguarde...' : (isSignUp ? 'Cadastrar e Entrar' : 'Entrar na Arena')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.775rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 1 }}>
          {isSignUp ? (
            <span>
              Já possui uma conta?{' '}
              <button onClick={() => setIsSignUp(false)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>
                Fazer Login
              </button>
            </span>
          ) : (
            <span>
              Não tem uma conta?{' '}
              <button onClick={() => setIsSignUp(true)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>
                Cadastre-se grátis
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

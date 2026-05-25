import React, { useState } from 'react';
import { Shield, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function DPOContact({ onBack }) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Monta email com os dados do formulário
    const subject = encodeURIComponent(`[LGPD FiguCopa] ${data.subject}`);
    const body = encodeURIComponent(
      `Nome: ${data.name}\nEmail: ${data.email}\n\n${data.message}\n\n---\nSolicitação enviada via FiguCopa 2026`
    );
    window.open(`mailto:dpo@figucopa2026.app.br?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <Shield size={20} style={{ color: 'var(--accent)' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Fale com o Encarregado (DPO)</h2>
      </div>

      <div className="glass-ethereal" style={{ borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Para exercer seus direitos previstos na LGPD (Art. 18), como solicitar informações, corrigir ou eliminar seus dados, preencha o formulário abaixo. Responderemos em até <strong>15 dias úteis</strong>.
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={40} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
            <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Solicitação enviada!</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Seu cliente de email foi aberto. Envie a mensagem para concluir.<br />
              Ou escreva diretamente para: <strong style={{ color: 'var(--accent)' }}>dpo@figucopa2026.app.br</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Nome completo</label>
              <input name="name" required style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px', fontSize: '0.8rem', color: '#fff', outline: 'none', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Email para resposta</label>
              <input name="email" type="email" required style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px', fontSize: '0.8rem', color: '#fff', outline: 'none', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Assunto</label>
              <select name="subject" required style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px', fontSize: '0.8rem', color: '#fff', outline: 'none', marginTop: '4px', cursor: 'pointer' }}>
                <option value="">Selecione</option>
                <option value="Solicitação de Informações">Solicitação de Informações</option>
                <option value="Correção de Dados">Correção de Dados</option>
                <option value="Exclusão de Conta">Exclusão de Conta</option>
                <option value="Portabilidade de Dados">Portabilidade de Dados</option>
                <option value="Revogação de Consentimento">Revogação de Consentimento</option>
                <option value="Reclamação">Reclamação</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Mensagem</label>
              <textarea name="message" rows={5} required style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px', fontSize: '0.8rem', color: '#fff', outline: 'none', marginTop: '4px', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Send size={14} />
              Enviar Solicitação
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

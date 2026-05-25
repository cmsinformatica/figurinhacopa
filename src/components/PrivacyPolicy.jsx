import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <Shield size={20} style={{ color: 'var(--accent)' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Política de Privacidade</h2>
      </div>

      <div className="glass-ethereal" style={{ borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border)', fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Última atualização: Maio de 2026</p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>1. Quem somos</h4>
        <p>O FiguCopa 2026 é um aplicativo PWA para colecionadores de figurinhas da Copa do Mundo 2026, desenvolvido pela CMS Informática. Seu uso é voluntário e gratuito.</p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>2. Dados coletados (coleta mínima)</h4>
        <p>Coletamos exclusivamente os dados que você informa voluntariamente no cadastro:</p>
        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
          <li>Nome completo</li>
          <li>Endereço de e-mail</li>
          <li>Bairro de residência (Salvador, BA)</li>
          <li>Seleção favorita da Copa 2026</li>
        </ul>
        <p style={{ marginTop: '0.5rem' }}><strong>Não</strong> coletamos coordenadas de GPS, localização em tempo real, dados biométricos ou conteúdo de mensagens privadas além do necessário para a troca.</p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>3. Base legal (LGPD Art. 7º)</h4>
        <p>O tratamento dos seus dados é baseado no <strong>consentimento</strong> (Art. 7º, I da LGPD), fornecido no momento do cadastro através de checkbox obrigatório. Você pode revogar este consentimento a qualquer momento excluindo sua conta.</p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>4. Finalidade do tratamento</h4>
        <p>Seus dados são utilizados exclusivamente para:</p>
        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
          <li>Criar e gerenciar sua conta</li>
          <li>Calcular matches de troca com outros colecionadores</li>
          <li>Sugerir pontos de encontro próximos ao seu bairro</li>
          <li>Exibir ranking de progresso entre colecionadores</li>
        </ul>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>5. Compartilhamento de dados</h4>
        <p>Não compartilhamos seus dados com terceiros. Os dados visíveis para outros usuários se limitam a: nome, bairro, seleção favorita, progresso do álbum e avaliação. Seu e-mail permanece sempre privado.</p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>6. Armazenamento e segurança</h4>
        <p>Seus dados são armazenados no Supabase (PostgreSQL) com criptografia em trânsito (HTTPS) e em repouso. Utilizamos Row Level Security (RLS) para garantir que cada usuário acesse apenas seus próprios dados.</p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>7. Retenção e exclusão</h4>
        <p>Seus dados são mantidos enquanto sua conta estiver ativa. Ao excluir sua conta (disponível em Perfil &gt; Privacidade), todos os seus dados pessoais, álbum, trocas e mensagens são removidos permanentemente.</p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>8. Menores de 13 anos</h4>
        <p>O FiguCopa 2026 é seguro para todas as idades. Recomendamos que usuários menores de 13 anos utilizem o aplicativo com supervisão de um responsável. O chat só é ativado após match confirmado com outro colecionador (sem contato frio).</p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>9. Direitos do titular (LGPD Art. 18)</h4>
        <p>Você pode a qualquer momento:</p>
        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
          <li><strong>Exportar</strong> seus dados (JSON) — disponível na tela de Perfil</li>
          <li><strong>Excluir</strong> sua conta permanentemente — disponível na tela de Perfil</li>
          <li><strong>Solicitar informações</strong> via contato do DPO abaixo</li>
        </ul>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>10. Encarregado (DPO)</h4>
        <p style={{ background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '0.5rem' }}>
          <strong>Cristiano Martins (CMS Informática)</strong><br />
          📧 dpo@figucopa2026.app.br<br />
          ⏱ Resposta em até 15 dias úteis (LGPD Art. 19)
        </p>

        <h4 style={{ color: 'var(--accent)', marginTop: '1.2rem', marginBottom: '0.5rem' }}>11. Alterações nesta política</h4>
        <p>Esta política pode ser atualizada periodicamente. Notificaremos alterações significativas através do aplicativo ou e-mail cadastrado.</p>
      </div>
    </div>
  );
}

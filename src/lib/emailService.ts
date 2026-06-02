import { Pedido } from './pedidos';

/**
 * Função utilitária para extrair a cidade a partir do endereço completo.
 * O formato padrão esperado é: "Rua, Número, Bairro, Cidade - Estado".
 */
export function extrairCidade(endereco: string): string {
  if (!endereco) return '';
  const partes = endereco.split(',');
  if (partes.length >= 4) {
    // Ex: "Rua Teste", "123", "Bairro Novo", "São Paulo - SP" -> "São Paulo - SP"
    return partes[3].trim();
  } else if (partes.length >= 3) {
    return partes[2].trim();
  }
  return endereco;
}

/**
 * Formata o plano de forma legível.
 */
export function formatarPlano(plano: string): string {
  if (!plano) return '';
  const p = plano.toLowerCase();
  if (p === 'essencial') return 'Essencial (Limpeza Básica)';
  if (p === 'performance') return 'Performance (Completo + Inspeções)';
  if (p === 'elite') return 'Elite (Pró Mensal + Monitoramento)';
  return plano;
}

/**
 * Dispara notificação de novo pedido via EmailJS REST API.
 * 
 * Se der erro ou se a Public Key não estiver configurada, o erro é registrado
 * no console silenciosamente sem interromper a jornada do cliente.
 */
export async function notificarNovoPedido(pedido: any): Promise<boolean> {
  try {
    const serviceId = 'service_sunex2136';
    const templateId = 'template_sunex2026';
    const recipient = 'sunex589@gmail.com';
    
    // Tenta ler a chave do ambiente ou usa um fallback instrutivo/vazio
    const publicKey = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || '';

    if (!publicKey) {
      console.warn(
        'EmailJS: O envio automatizado requer que a chave pública (Public Key) esteja configurada em seu painel de Segredos como VITE_EMAILJS_PUBLIC_KEY.'
      );
      // Retornamos true mesmo se não houver a chave no ambiente local para não arruinar o fluxo do cliente
      return false;
    }

    const cidade = extrairCidade(pedido.endereco);
    const planoFormatado = formatarPlano(pedido.servico || pedido.plano || '');
    const formaPagamento = String(pedido.pagamento).toUpperCase();
    
    // DataFormatada no fuso de Brasília
    const dataFormatada = (() => {
      try {
        const d = pedido.data ? new Date(pedido.data) : new Date();
        return d.toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch (err) {
        return pedido.data || new Date().toLocaleString('pt-BR');
      }
    })();

    // Mapeamento redundante (Português/Inglês) para suportar qualquer nomenclatura de campo no template
    const templateParams = {
      // Português
      id_pedido: pedido.id,
      pedido_id: pedido.id,
      id: pedido.id,

      nome_cliente: pedido.nome,
      cliente_nome: pedido.nome,
      nome: pedido.nome,

      whatsapp: pedido.telefone,
      cliente_whatsapp: pedido.telefone,
      telefone: pedido.telefone,

      cidade: cidade,
      cliente_cidade: cidade,
      endereco: pedido.endereco,
      cliente_endereco: pedido.endereco,

      plano_selecionado: planoFormatado,
      plano: planoFormatado,
      servico: planoFormatado,

      quantidade_placas: pedido.placas,
      placas: pedido.placas,

      forma_pagamento: formaPagamento,
      pagamento: formaPagamento,

      data_solicitacao: dataFormatada,
      data: dataFormatada,

      // Destinatários / Informações de Controle
      to_email: recipient,
      destinatario_email: recipient,
      subject: `☀️ Novo Pedido Recebido - ${pedido.id}`
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      })
    });

    if (response.ok) {
      console.log(`[EmailJS] Notificação enviada com sucesso para o pedido ${pedido.id}.`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[EmailJS Status ${response.status}] erro ao enviar e-mail:`, errorText);
      return false;
    }
  } catch (error) {
    console.error('[EmailJS Sandbox Error] Houve um problema ao disparar a notificação de novo pedido:', error);
    return false;
  }
}

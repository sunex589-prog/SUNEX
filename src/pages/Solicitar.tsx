import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { criarPedido } from '../lib/pedidos';
import { notificarNovoPedido } from '../lib/emailService';
import { generateId } from '../lib/utils';
import { analytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, ChevronDown, Rocket, ShieldCheck, ClipboardCopy, Sparkles } from 'lucide-react';
import QRCode from 'react-qr-code';

const PLANOS_OPCOES = [
  { value: 'Essencial', label: 'Essencial (Limpeza Básica • R$18/placa)' },
  { value: 'Performance', label: 'Performance (Completo + Inspeções • R$15/placa)' },
  { value: 'Elite', label: 'Elite (Pró Mensal + Monitoramento • R$13/placa)' }
];

export default function Solicitar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const paramPlano = searchParams.get('plano');
  const paramPlacas = searchParams.get('placas');

  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
  // States for form data - includes both 'servico' (compat) and 'plano' as requested
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    placas: paramPlacas || '',
    plano: (paramPlano && ['essencial', 'performance', 'elite'].includes(paramPlano.toLowerCase())) 
      ? paramPlano.charAt(0).toUpperCase() + paramPlano.slice(1).toLowerCase()
      : 'Performance', // performance default is the best seller
    pagamento: 'pix'
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPlano = (val: string) => {
    setFormData(prev => ({ ...prev, plano: val }));
    setIsSelectOpen(false);
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.nome || !formData.email || !formData.telefone || !formData.endereco) {
        alert("Por favor, preencha todos os campos de contato.");
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }
      
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.placas || Number(formData.placas) <= 0) {
      alert("Por favor, informe uma quantidade válida de placas.");
      return;
    }

    setLoading(true);

    try {
      const novoId = generateId();
      
      const payload = {
        id: novoId,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        placas: Number(formData.placas),
        // Write both plano (new spec) and servico (old database compat)
        plano: formData.plano, 
        servico: formData.plano as any, 
        pagamento: formData.pagamento as any,
        status: 'aguardando_pagamento' as any,
        comprovanteUrl: '',
        data: new Date().toISOString()
      };

      await criarPedido(payload);
      
      // Notificação EmailJS (em segundo plano, com tratamento resiliente contra falhas)
      try {
        notificarNovoPedido(payload).catch(err => {
          console.error("Erro assíncrono ao gerar notificação de novo pedido no EmailJS:", err);
        });
      } catch (emailErr) {
        console.error("Erro síncrono ao disparar notificação EmailJS:", emailErr);
      }
      
      // Log Analytics Event
      analytics.then(a => {
        if (a) {
          logEvent(a, 'generate_lead', {
            service_type: formData.plano,
            payment_method: formData.pagamento,
            panel_count: Number(formData.placas),
            value: Number(formData.placas) * 15 
          });
        }
      });

      setSuccessId(novoId);
    } catch (error) {
      alert('Erro ao criar pedido. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };



  if (successId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sunex-accent/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="glass-panel text-center p-12 max-w-lg w-full bg-sunex-card border border-white/5 shadow-2xl">
          <div className="mx-auto bg-sunex-accent/20 border border-sunex-accent/30 shadow-[0_0_50px_rgba(255,122,0,0.4)] text-sunex-gold p-5 rounded-full inline-flex mb-8 animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight uppercase text-white mb-3">Pedido Registrado!</h2>
          <p className="text-sunex-muted text-sm font-semibold leading-relaxed mb-8">
            Sua solicitação do plano <span className="text-white font-black">{formData.plano.toUpperCase()}</span> foi salva. Acompanhe abaixo o status de confirmação e faça o pagamento.
          </p>
          
          <div className="bg-black/50 border border-white/5 rounded-xl p-6 mb-8 shadow-inner relative group">
            <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent tracking-widest block select-all">
              {successId}
            </span>
            <div className="text-[9px] uppercase tracking-wider font-extrabold text-sunex-muted mt-2">
              Clique no código acima para copiar
            </div>
          </div>

          {/* QR Code to scan and access tracking page */}
          <div className="flex flex-col items-center justify-center bg-black/30 border border-white/5 rounded-xl p-6 mb-8">
            <div className="bg-white p-3 rounded-lg inline-block shadow-md">
              <QRCode 
                value={`${window.location.origin}/acompanhar?id=${successId}`} 
                size={130} 
                level="M" 
              />
            </div>
            <p className="text-[11px] uppercase tracking-wider font-extrabold text-sunex-gold mt-3">
              QR Code do Pedido
            </p>
            <p className="text-[10px] text-sunex-muted mt-1 max-w-xs leading-relaxed font-semibold">
              Escaneie com a câmera do celular para abrir o acompanhamento instantaneamente no celular.
            </p>
          </div>

          <button
            onClick={() => navigate(`/acompanhar?id=${successId}`)}
            className="btn-primary group w-full py-4 text-sm font-black flex items-center justify-center gap-2 shadow-lg"
          >
            Acompanhar Agora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 lg:grid lg:grid-cols-[1fr_1.2fr] p-6 lg:p-0 relative w-full max-w-[1600px] mx-auto z-10">
      
      {/* Visual / Info Left Side */}
      <div className="hidden lg:flex flex-col justify-center p-[4rem_6rem] relative">
         <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-sunex-gold/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
         
         <div className="hero-badge mb-6 gap-2">
           <Rocket className="w-3.5 h-3.5 text-sunex-accent" /> Agendamento Industrial Fast
         </div>
         <h2 className="text-[4rem] leading-[1.05] font-black text-white mb-8 tracking-tight uppercase">
           Pronto para<br/>brilhar <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">mais?</span>
         </h2>
         <p className="text-sunex-muted max-w-lg text-md font-medium leading-relaxed mb-12">
           Preencha a solicitação técnica de manutenção. Nossa equipe analisará as perdas térmicas e estruturará o atendimento prioritário sob medida.
         </p>

         <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl backdrop-blur-md">
              <ShieldCheck className="text-sunex-gold w-6 h-6 shrink-0" />
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-white block">Tecnologia Segura</span>
                <span className="text-[10px] text-sunex-muted block mt-0.5">Garantia integral de fábrica preservada</span>
              </div>
            </div>
         </div>
      </div>

      {/* Form Right Side */}
      <div className="bg-gradient-to-l from-white/[0.01] to-transparent lg:border-l border-white/5 flex flex-col justify-center items-center lg:p-12 w-full">
        <div className="glass-panel p-8 sm:p-10 w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-500 bg-sunex-card shadow-2xl">
          
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
              Solicitar Serviço
            </h3>
            <span className="text-[10px] font-black tracking-wider uppercase text-sunex-accent bg-sunex-accent/10 px-2.5 py-1 rounded-md">
              Etapa {step} de 2
            </span>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-10">
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-gradient-to-r from-sunex-gold to-sunex-accent shadow-[0_0_15px_rgba(255,122,0,0.3)]' : 'bg-white/10'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 delay-100 ${step >= 2 ? 'bg-gradient-to-r from-sunex-gold to-sunex-accent shadow-[0_0_15px_rgba(255,122,0,0.3)]' : 'bg-white/10'}`}></div>
          </div>

          <form onSubmit={step === 1 ? nextStep : handleSubmit} className="space-y-6">
            
            {/* STEP 1: Dados Pessoais */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-5">
                <h4 className="text-xs font-black uppercase tracking-widest text-sunex-gold mb-6 flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-sunex-accent block"></span> 1. Dados para Contato
                </h4>
                
                <div>
                  <label className="input-label">Nome Completo</label>
                  <input 
                    required 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleInputChange} 
                    type="text" 
                    className="input-field bg-black/40" 
                    placeholder="Ex: João da Silva"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">E-mail</label>
                    <input 
                      required 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      type="email" 
                      className="input-field bg-black/40" 
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="input-label">Telefone / WhatsApp</label>
                    <input 
                      required 
                      name="telefone" 
                      value={formData.telefone} 
                      onChange={handleInputChange} 
                      type="tel" 
                      className="input-field bg-black/40" 
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="input-label">Endereço de Instalação</label>
                  <input 
                    required 
                    name="endereco" 
                    value={formData.endereco} 
                    onChange={handleInputChange} 
                    type="text" 
                    className="input-field bg-black/40" 
                    placeholder="Rua, Número, Bairro, Cidade - Estado"
                  />
                </div>

                <div className="pt-6 mt-6 border-t border-white/5">
                  <button type="submit" className="btn-primary group flex items-center justify-center gap-2 py-4">
                    Avançar Detalhes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Detalhes do Serviço */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-sunex-gold mb-6 flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-sunex-accent block"></span> 2. Dados da Usina Solar
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="input-label">Quantidade de Placas</label>
                    <input 
                      required 
                      name="placas" 
                      value={formData.placas} 
                      onChange={handleInputChange} 
                      type="number" 
                      min="1" 
                      className="input-field bg-black/40 text-center font-mono font-bold text-lg" 
                      placeholder="Ex: 8"
                    />
                  </div>
                  
                  {/* Plano field SELECT drop container */}
                  <div className="relative">
                    <label className="input-label">Plano de Limpeza</label>
                    <div 
                      className="input-field cursor-pointer text-sm flex items-center justify-between group bg-black/40"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      <span className="text-white font-extrabold uppercase tracking-wide">
                        {formData.plano}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-sunex-muted transition-transform ${isSelectOpen ? 'rotate-180 text-sunex-accent' : 'group-hover:text-white'}`} />
                    </div>
                    {isSelectOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-[#141416]/95 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-3xl">
                        {PLANOS_OPCOES.map(opt => (
                          <div 
                            key={opt.value}
                            className={`px-4 py-3.5 text-xs cursor-pointer transition-colors font-bold uppercase tracking-wider border-b border-white/5 last:border-0 ${formData.plano === opt.value ? 'bg-sunex-accent/15 text-sunex-gold' : 'text-white hover:bg-white/5'}`}
                            onClick={() => handleSelectPlano(opt.value)}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Forma de pagamento */}
                <div>
                  <label className="input-label mb-3">Método de pagamento</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative flex cursor-pointer rounded-xl border border-white/5 bg-black/25 p-4 transition-all hover:bg-white/[0.02]">
                      <input type="radio" name="pagamento" value="pix" onChange={handleInputChange} checked={formData.pagamento === 'pix'} className="peer sr-only" />
                      <div className="flex flex-col w-full text-center">
                        <span className="font-black text-sunex-muted text-xs peer-checked:text-sunex-gold uppercase tracking-widest transition-colors">PIX</span>
                      </div>
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-sunex-accent pointer-events-none transition-colors shadow-[0_0_15px_rgba(255,122,0,0)] peer-checked:shadow-[0_0_15px_rgba(255,122,0,0.15)]"></div>
                    </label>
                    
                    <label className="relative flex cursor-pointer rounded-xl border border-white/5 bg-black/25 p-4 transition-all hover:bg-white/[0.02]">
                      <input type="radio" name="pagamento" value="local" onChange={handleInputChange} checked={formData.pagamento === 'local'} className="peer sr-only" />
                      <div className="flex flex-col w-full text-center">
                        <span className="font-black text-sunex-muted text-xs peer-checked:text-sunex-gold uppercase tracking-widest transition-colors">Pago no Local</span>
                      </div>
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-sunex-accent pointer-events-none transition-colors shadow-[0_0_15px_rgba(255,122,0,0)] peer-checked:shadow-[0_0_15px_rgba(255,122,0,0.15)]"></div>
                    </label>
                  </div>
                </div>



                {/* Form Controls */}
                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                  <button type="button" onClick={prevStep} className="btn-secondary sm:w-1/3 flex items-center justify-center gap-2 py-4">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary sm:w-2/3 flex items-center justify-center gap-2 flex-1 py-4 text-sm font-black text-white"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
                    {loading ? 'PROCESSANDO...' : 'CONFIRMAR SOLICITAÇÃO'}
                  </button>
                </div>
              </div>
            )}
          </form>

        </div>
      </div>
      
    </div>
  );
}

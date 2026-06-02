import React from 'react';
import { Shield, Sparkles, Activity, Cpu, Droplet, Users, CheckSquare, Award, Check, HeartHandshake, Eye, ShieldCheck } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="flex-1 w-full relative">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sunex-accent/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-40 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sunex-gold/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-30 mix-blend-screen" />

      {/* Main Wrapper */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-black tracking-[4px] uppercase text-sunex-accent bg-sunex-accent/10 border border-sunex-accent/25 px-4 py-1.5 rounded-full">
            <Award className="w-3.5 h-3.5" /> Quem Somos & Como Trabalhamos
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase text-white tracking-tight mb-4 mt-2">
            Sobre a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">SUNEX</span>
          </h1>
          <p className="text-sunex-muted text-lg max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-[1px] text-xs">
            Excelência em limpeza e manutenção de sistemas fotovoltaicos.
          </p>
        </div>

        {/* SECTION 1: Quem Somos & Como Trabalhamos (Side by Side / Dynamic Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-20 animate-in fade-in duration-[900ms]">
          
          {/* Card: Quem Somos */}
          <div className="glass-panel p-8 md:p-10 border-t border-t-white/10 flex flex-col justify-between bg-sunex-card">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-sunex-accent rounded-full block"></span> Quem Somos
              </h2>
              <p className="text-sunex-muted leading-[1.8] font-medium text-md mb-6">
                A SUNEX nasceu com o propósito de elevar o padrão de eficiência no mercado de energia solar. Compreendemos que o acúmulo de sujeira e poluentes impede a captação perfeita de luz e pode roubar até 30% da rentabilidade da sua usina.
              </p>
              <p className="text-sunex-muted leading-[1.8] font-medium text-md">
                Unindo inovação e tecnologia industrial, disponibilizamos serviços de alta especialização para residências, condomínios e usinas fotovoltaicas comerciais, garantindo que sua economia seja máxima e seu retorno de investimento seja acelerado.
              </p>
            </div>

            {/* Bottom Slogan Bar */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 bg-white/[0.01] p-4 rounded-xl border border-white/5">
              <Check className="w-5 h-5 text-[#FFC300] shrink-0" />
              <p className="text-xs font-semibold text-white tracking-wide uppercase">
                Nossa missão é garantir que cada raio de sol se transforme em máxima geração para você.
              </p>
            </div>
          </div>

          {/* Card: Como Trabalhamos */}
          <div className="glass-panel p-8 md:p-10 border-t border-t-white/10 bg-sunex-card flex flex-col justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-sunex-accent rounded-full block"></span> Como Trabalhamos
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Item 1 */}
                <div className="flex gap-4">
                  <div className="shrink-0 bg-sunex-accent/10 border border-sunex-accent/20 p-2.5 rounded-lg h-fit text-sunex-gold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Tecnologia Avançada</h4>
                    <p className="text-xs text-sunex-muted font-medium leading-relaxed">Equipamentos de última geração e processos altamente especializados.</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-4">
                  <div className="shrink-0 bg-sunex-accent/10 border border-sunex-accent/20 p-2.5 rounded-lg h-fit text-sunex-gold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Profissionais</h4>
                    <p className="text-xs text-sunex-muted font-medium leading-relaxed">Equipe própria, treinada e qualificada para executar com total segurança.</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex gap-4">
                  <div className="shrink-0 bg-sunex-accent/10 border border-sunex-accent/20 p-2.5 rounded-lg h-fit text-sunex-gold">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Água Purificada</h4>
                    <p className="text-xs text-sunex-muted font-medium leading-relaxed">Água desmineralizada de alta pureza que preserva seus módulos.</p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex gap-4">
                  <div className="shrink-0 bg-sunex-accent/10 border border-sunex-accent/20 p-2.5 rounded-lg h-fit text-sunex-gold">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Suporte Premium</h4>
                    <p className="text-xs text-sunex-muted font-medium leading-relaxed">Acompanhamento transparente em tempo real em todas as etapas.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Industrial Stats Widget */}
            <div className="grid grid-cols-4 gap-2 pt-6 border-t border-white/5 mt-8 text-center">
              <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5 hover:border-sunex-accent/20 transition-all">
                <span className="block text-sm sm:text-md font-extrabold text-sunex-accent leading-none">+500</span>
                <span className="text-[8px] font-bold text-sunex-muted uppercase tracking-wider block mt-1.5">Clientes</span>
              </div>
              <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5 hover:border-sunex-accent/20 transition-all">
                <span className="block text-sm sm:text-md font-extrabold text-sunex-accent leading-none">+2k</span>
                <span className="text-[8px] font-bold text-sunex-muted uppercase tracking-wider block mt-1.5">Serviços</span>
              </div>
              <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5 hover:border-sunex-accent/20 transition-all">
                <span className="block text-sm sm:text-md font-extrabold text-sunex-accent leading-none">+3.5 MW</span>
                <span className="text-[8px] font-bold text-sunex-muted uppercase tracking-wider block mt-1.5">Limpos</span>
              </div>
              <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5 hover:border-sunex-accent/20 transition-all">
                <span className="block text-sm sm:text-md font-extrabold text-sunex-accent leading-none">98%</span>
                <span className="text-[8px] font-bold text-sunex-muted uppercase tracking-wider block mt-1.5">Retenção</span>
              </div>
            </div>
          </div>
        </div>


        {/* SECTION 2: Nossos Diferenciais */}
        <section className="mb-20 animate-in fade-in duration-1000">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2 text-[10px] font-black tracking-[4px] uppercase text-[#FFC300] bg-sunex-gold/5 px-4 py-1 rounded-full border border-sunex-gold/20">
              <Sparkles className="w-3.5 h-3.5" /> EXCELÊNCIA INDUSTRIAL
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase text-white tracking-tight">
              Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">Diferenciais</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 1: Segurança */}
            <div className="glass-panel p-6 bg-sunex-card border-t border-t-white/10 hover:border-sunex-accent/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sunex-accent/10 border border-sunex-accent/25 flex items-center justify-center text-sunex-accent mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-black/80">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2.5 group-hover:text-sunex-gold transition-colors">Segurança</h3>
              <p className="text-sm text-sunex-muted leading-relaxed font-semibold">
                Integração total e manuseio especializado. Equipamentos antichoque com isolamento térmico estrito, blindando seus módulos fotovoltaicos contra qualquer dano mecânico e resguardando integralmente sua garantia de fábrica.
              </p>
            </div>

            {/* CARD 2: Eficiência */}
            <div className="glass-panel p-6 bg-sunex-card border-t border-t-white/10 hover:border-sunex-accent/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sunex-accent/10 border border-sunex-accent/25 flex items-center justify-center text-sunex-accent mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-black/80">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2.5 group-hover:text-sunex-gold transition-colors">Eficiência</h3>
              <p className="text-sm text-sunex-muted leading-relaxed font-semibold">
                Resultados imediatos. A desobstrução técnica eleva a absorção de luz solar e recupera em até 30% a eficiência de geração da usina de forma imediata pós-conclusão da limpeza especializada.
              </p>
            </div>

            {/* CARD 3: Monitoramento */}
            <div className="glass-panel p-6 bg-sunex-card border-t border-t-white/10 hover:border-sunex-accent/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sunex-accent/10 border border-sunex-accent/25 flex items-center justify-center text-sunex-accent mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-black/80">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2.5 group-hover:text-sunex-gold transition-colors">Monitoramento</h3>
              <p className="text-sm text-sunex-muted leading-relaxed font-semibold">
                Transparência completa. Registro digital em tempo real integrado ao painel. O cliente acompanha status operacional, gera seus boletos PIX e monitora os relatórios fotográficos emitidos na vistoria.
              </p>
            </div>

            {/* CARD 4: Qualidade */}
            <div className="glass-panel p-6 bg-sunex-card border-t border-t-white/10 hover:border-sunex-accent/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sunex-accent/10 border border-sunex-accent/25 flex items-center justify-center text-sunex-accent mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-black/80">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2.5 group-hover:text-sunex-gold transition-colors">Qualidade</h3>
              <p className="text-sm text-sunex-muted leading-relaxed font-semibold">
                Insumos de alto padrão. Utilização exclusiva de água desmineralizada desprovida de calcário ou íons que poderiam manchar o vidro, associada a cerdas macias alemãs de microfibra específica.
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* Modern Compact Contact Wrap */}
      <div className="bg-black/30 border-t border-white/5 py-12 text-center text-xs font-bold tracking-widest text-sunex-muted w-full">
        SUNEX - LIMPEZA TÉCNICA E INDUSTRIAL DE PAINÉIS SOLARES &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}

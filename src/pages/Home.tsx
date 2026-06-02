import { Link } from 'react-router-dom';
import { Zap, Target, ShieldCheck, ArrowRight, Activity, SunDim, Sparkles, Check, Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col relative z-10 w-full">
      {/* Background Decorators */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sunex-accent/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-40 mix-blend-screen" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-sunex-gold/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-30 mix-blend-screen" />

      {/* Main Hero & Description Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] w-full max-w-[1600px] mx-auto border-b border-white/5">
        {/* Left Hero Column */}
        <section className="flex flex-col justify-center relative p-8 md:p-16 lg:p-[5rem_6rem] pt-12 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="mb-6 flex items-center gap-3">
            <div className="hero-badge gap-2">
              <SunDim className="w-3.5 h-3.5 text-sunex-accent animate-pulse" /> EFICIÊNCIA ENERGÉTICA
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.05] font-black mb-8 tracking-tight uppercase text-white">
            Energia Limpa,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold via-sunex-accent to-sunex-accent-secondary">
              Máxima Performance.
            </span>
          </h1>
          <p className="text-sunex-muted text-lg font-medium leading-[1.7] max-w-[550px] mb-10">
            Especialistas em limpeza técnica de placas solares. Aumente a eficiência do seu sistema fotovoltaico em até <span className="text-white font-bold">30%</span> com nossa tecnologia especializada industrial.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-[500px]">
            <Link to="/solicitar" className="btn-primary flex items-center justify-center gap-2 font-black !py-4 shadow-xl">
              Solicitar Serviço <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/simulacao" className="btn-secondary flex items-center justify-center gap-2 font-black !py-4 border border-white/10 hover:border-sunex-accent/30 hover:bg-white/5">
              Simular Economia
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-3 md:gap-5 mb-10 w-full max-w-[555px]">
            <div className="glass-panel p-4 text-center hover:border-sunex-accent/20 transition-all duration-300">
              <span className="block text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-sunex-gold to-sunex-accent mb-1">+25%</span>
              <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-sunex-muted block">Ganho Médio</span>
            </div>
            <div className="glass-panel p-4 text-center hover:border-sunex-accent/20 transition-all duration-300">
              <span className="block text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-sunex-gold to-sunex-accent mb-1">1.2k</span>
              <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-sunex-muted block">Painéis Limpos</span>
            </div>
            <div className="glass-panel p-4 text-center hover:border-sunex-accent/20 transition-all duration-300">
              <span className="block text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-sunex-gold to-sunex-accent mb-1">100%</span>
              <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-sunex-muted block">Sustentável</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs font-bold tracking-wider uppercase text-sunex-muted bg-black/30 p-4 rounded-xl border border-white/5 w-fit backdrop-blur-sm">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)] relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
            </div>
            Sistemas Firebase Online • Monitoramento em Tempo Real
          </div>
        </section>

        {/* Right Why SUNEX Column */}
        <section className="bg-gradient-to-l from-white/[0.01] to-transparent lg:border-l border-white/5 p-8 md:p-16 lg:p-[5rem_4rem] flex flex-col justify-center relative animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="glass-panel p-8 xl:p-10 w-full max-w-[500px] border-t border-t-white/15 bg-[#111111]/80 mx-auto">
            <h3 className="text-xl md:text-2xl font-black mb-8 text-white flex items-center gap-3 uppercase tracking-wider">
              <Activity className="w-6 h-6 text-sunex-accent animate-pulse" /> Por que a SUNEX?
            </h3>
            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="shrink-0 bg-gradient-to-br from-sunex-accent/20 to-transparent border border-sunex-accent/30 p-4 rounded-xl h-fit shadow-[0_0_20px_rgba(255,122,0,0.15)] group-hover:scale-110 transition-transform">
                  <Zap className="h-5 w-5 text-sunex-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2 text-md transition-colors group-hover:text-sunex-accent">Mais Geração, Menos Perda</h4>
                  <p className="text-sm text-sunex-muted leading-relaxed font-semibold">A sujeira bloqueia a luz solar. Nossa limpeza técnica garante máxima absorção de fótons.</p>
                </div>
              </div>
              
              <div className="flex gap-5 group">
                <div className="shrink-0 bg-gradient-to-br from-sunex-accent/20 to-transparent border border-sunex-accent/30 p-4 rounded-xl h-fit shadow-[0_0_20px_rgba(255,122,0,0.15)] group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-5 w-5 text-sunex-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2 text-md transition-colors group-hover:text-sunex-accent">Segurança Tecnológica</h4>
                  <p className="text-sm text-sunex-muted leading-relaxed font-semibold">Equipamentos adequados e água purificada desmineralizada para manter a garantia dos seus módulos.</p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="shrink-0 bg-gradient-to-br from-sunex-accent/20 to-transparent border border-sunex-accent/30 p-4 rounded-xl h-fit shadow-[0_0_20px_rgba(255,122,0,0.15)] group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5 text-sunex-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2 text-md transition-colors group-hover:text-sunex-accent">Serviço de Alta Precisão</h4>
                  <p className="text-sm text-sunex-muted leading-relaxed font-semibold">Acompanhe seu pedido online com nosso sistema e tenha o serviço executado com rigorosa pontualidade.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* NEW SECTION: Nossos Planos */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto w-full animate-in fade-in duration-1000">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-black tracking-[4px] uppercase text-sunex-accent bg-sunex-accent/10 border border-sunex-accent/20 px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> PLANOS E PREÇOS
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
            Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">Planos</span>
          </h2>
          <p className="text-sunex-muted mt-4 max-w-[600px] mx-auto font-medium">
            Escolha a modalidade que melhor atende à sua usina ou residência e recupere até 30% da potência perdida.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plano 1: ESSENCIAL */}
          <div className="glass-panel p-8 flex flex-col justify-between border-t border-t-white/10 relative hover:border-white/15 hover:scale-[1.02] transition-all duration-300 bg-[#111111]/85">
            <div>
              <div className="text-xs font-black tracking-widest text-sunex-muted uppercase mb-2">Ideal para manutenção básica</div>
              <h3 className="text-2xl font-extrabold text-white tracking-widest uppercase mb-4">ESSENCIAL</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-white">R$ 18</span>
                <span className="text-sunex-muted text-sm font-medium">/ placa</span>
              </div>
              <p className="text-sm text-sunex-muted leading-relaxed mb-8 font-medium">
                Ideal para quem quer manter o sistema funcionando bem com foco em custo-benefício.
              </p>
              <div className="border-t border-white/5 pt-6">
                <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-4">O que inclui:</h4>
                <ul className="space-y-3.5">
                  <li className="flex items-center gap-3 text-sm text-sunex-muted font-medium">
                    <Check className="w-4 h-4 text-sunex-gold shrink-0" />
                    <span>Uma limpeza completa</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10">
              <Link to="/solicitar?plano=essencial" className="btn-secondary text-center w-full !py-3.5 tracking-wider hover:border-sunex-accent/40">
                Escolher Essencial
              </Link>
            </div>
          </div>

          {/* Plano 2: PERFORMANCE (Destacado) */}
          <div className="glass-panel p-8 flex flex-col justify-between border-2 border-sunex-accent relative scale-100 lg:scale-105 shadow-[0_0_35px_rgba(255,122,0,0.15)] bg-[#111111] hover:scale-[1.07] transition-all duration-300">
            {/* Best Seller Ribbon */}
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-sunex-accent to-sunex-accent-secondary text-white text-[10px] font-black tracking-[2px] uppercase px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-black/50">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-sunex-gold" /> PLANO MAIS VENDIDO
            </div>
            
            <div>
              <div className="text-xs font-black tracking-widest text-[#FFC300] uppercase mb-2">Máximo Retorno Financeiro</div>
              <h3 className="text-2xl font-extrabold text-white tracking-widest uppercase mb-4">PERFORMANCE</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#eeeeee]">R$ 15</span>
                <span className="text-sunex-muted text-sm font-medium">/ placa</span>
              </div>
              <div className="inline-block bg-sunex-accent/15 text-sunex-gold text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md mb-6 border border-sunex-accent/20">
                Frequência: a cada 4 meses
              </div>
              <p className="text-sm text-[#ddd] leading-relaxed mb-8 font-medium">
                Alta performance recomendada para manter a eficiência máxima constante ao longo do ano.
              </p>
              <div className="border-t border-white/10 pt-6">
                <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-4">O que inclui:</h4>
                <ul className="space-y-3.5">
                  <li className="flex items-center gap-3 text-sm text-[#eee] font-medium">
                    <Check className="w-4 h-4 text-sunex-accent shrink-0 font-bold" />
                    <span>Uma limpeza completa</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#eee] font-medium">
                    <Check className="w-4 h-4 text-sunex-accent shrink-0 font-bold" />
                    <span>Inspeção técnica</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#eee] font-medium">
                    <Check className="w-4 h-4 text-sunex-accent shrink-0 font-bold" />
                    <span>Inspeção elétrica preventiva</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10">
              <Link to="/solicitar?plano=performance" className="btn-primary text-center w-full !py-4 shadow-xl shadow-sunex-accent/10">
                Escolher Performance
              </Link>
            </div>
          </div>

          {/* Plano 3: ELITE */}
          <div className="glass-panel p-8 flex flex-col justify-between border-t border-t-white/10 relative hover:border-white/15 hover:scale-[1.02] transition-all duration-300 bg-[#111111]/85">
            <div>
              <div className="text-xs font-black tracking-widest text-sunex-muted uppercase mb-2">Acompanhamento Consultivo Completo</div>
              <h3 className="text-2xl font-extrabold text-white tracking-widest uppercase mb-4">ELITE</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-white">R$ 13</span>
                <span className="text-sunex-muted text-sm font-medium">/ placa</span>
              </div>
              <div className="inline-block bg-white/5 text-sunex-muted text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md mb-6 border border-white/5">
                Frequência: a cada 6 meses
              </div>
              <p className="text-sm text-sunex-muted leading-relaxed mb-8 font-medium">
                O máximo cuidado para sistemas de grande porte ou chácaras com elevado nível de poeira.
              </p>
              <div className="border-t border-white/5 pt-6">
                <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-4">O que inclui:</h4>
                <ul className="space-y-3.5">
                  <li className="flex items-center gap-3 text-sm text-sunex-muted font-medium">
                    <Check className="w-4 h-4 text-sunex-gold shrink-0" />
                    <span>Limpeza profissional mensal</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-sunex-muted font-medium">
                    <Check className="w-4 h-4 text-sunex-gold shrink-0" />
                    <span>Avaliação técnica</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-sunex-muted font-medium">
                    <Check className="w-4 h-4 text-sunex-gold shrink-0" />
                    <span>Monitoramento</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-sunex-muted font-medium">
                    <Check className="w-4 h-4 text-sunex-gold shrink-0" />
                    <span>Análise de perdas de eficiência</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-sunex-muted font-medium">
                    <Check className="w-4 h-4 text-sunex-gold shrink-0" />
                    <span>Relatório técnico simplificado</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10">
              <Link to="/solicitar?plano=elite" className="btn-secondary text-center w-full !py-3.5 tracking-wider hover:border-sunex-accent/40">
                Escolher Elite
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto py-12 border-t border-white/5 bg-black/40 text-center text-xs font-bold tracking-widest text-sunex-muted w-full">
        SUNEX - INTELIGÊNCIA EM ENERGIA SOLAR &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

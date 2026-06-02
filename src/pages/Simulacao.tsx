import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Check, Sparkles, TrendingUp, ShieldAlert, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANOS = {
  Essencial: {
    preco: 18.0,
    descricao: "Ideal para quem quer manter o sistema funcionando bem com foco em custo-benefício.",
    inclui: ["Uma limpeza completa"]
  },
  Performance: {
    preco: 15.0,
    descricao: "O plano mais equilibrado e mais vendido para usinas ou residências de alta performance.",
    inclui: [
      "Uma limpeza completa",
      "Inspeção técnica detalhada dos painéis",
      "Inspeção elétrica preventiva estrutural"
    ]
  },
  Elite: {
    preco: 13.0,
    descricao: "O máximo cuidado e acompanhamento constante para geração ininterrupta de grande porte.",
    inclui: [
      "Limpeza profissional mensal programada",
      "Avaliação técnica termográfica",
      "Monitoramento ativo de perdas térmicas",
      "Análise aprofundada de perdas de eficiência",
      "Relatório técnico simplificado mensal"
    ]
  }
};

export default function Simulacao() {
  const [placas, setPlacas] = useState<number | ''>('');
  const [plano, setPlano] = useState<keyof typeof PLANOS>('Essencial');

  const calcularValor = useMemo(() => {
    try {
      if (!placas || placas <= 0) return 0;
      const total = Number(placas) * PLANOS[plano].preco;
      return isNaN(total) ? 0 : total;
    } catch (e) {
      return 0;
    }
  }, [placas, plano]);

  const handlePlacasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setPlacas('');
    } else {
      const num = parseInt(value, 10);
      if (!num || isNaN(num)) {
        setPlacas('');
      } else if (num >= 0) {
        setPlacas(num);
      }
    }
  };

  return (
    <div className="flex-1 w-full relative">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] -z-10 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle, rgba(255, 122, 0, 0.05) 0%, rgba(255, 122, 0, 0) 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] -z-10 pointer-events-none opacity-30 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle, rgba(255, 195, 0, 0.05) 0%, rgba(255, 195, 0, 0) 70%)' }} />

      {/* Main Container */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8 sm:py-16">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-16 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 mb-3 text-[10px] sm:text-xs font-black tracking-[2px] sm:tracking-[4px] uppercase text-sunex-accent bg-sunex-accent/10 border border-sunex-accent/25 px-3 sm:px-4 py-1.5 rounded-full">
            <Calculator className="w-3.5 h-3.5 animate-pulse" /> Simulador de Investimento
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase text-white tracking-tight mb-4 mt-2">
            Simulador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">Investimento</span>
          </h1>
          <p className="text-sunex-muted text-sm sm:text-md max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Calcule o valor do serviço em tempo real e entenda o custo sob demanda para a sua usina fotovoltaica.
          </p>
        </div>
 
        {/* Responsive Grid Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 md:gap-12 items-stretch animate-in fade-in duration-900">
          
          {/* LEFT COLUMN: The Calculator Widget */}
          <div className="glass-panel p-5 sm:p-8 md:p-10 border-t border-t-white/10 bg-sunex-card flex flex-col justify-between">
            <div className="space-y-6 sm:space-y-8">
              
              {/* Form Input: Placas */}
              <div className="group">
                <label className="input-label mb-3 text-xs font-bold uppercase tracking-widest text-sunex-muted group-focus-within:text-white transition-colors flex items-center gap-2">
                  <span>Quantidade de Placas Solares</span>
                  <span className="text-sunex-accent font-bold">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1"
                    value={placas}
                    onChange={handlePlacasChange}
                    className="input-field text-xl sm:text-2xl font-black text-left font-mono py-4 sm:py-5 pl-5 sm:pl-6 pr-24 border border-white/10 hover:border-white/20 bg-black/40 focus:border-sunex-accent text-white"
                    placeholder="Ex: 12"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-sunex-muted uppercase tracking-widest pointer-events-none">
                    Unidades
                  </div>
                </div>
              </div>
 
              {/* Plano Selector Radios */}
              <div>
                <label className="input-label mb-4 text-xs font-bold uppercase tracking-widest text-sunex-muted block">
                  Escolha a modalidade de serviço:
                </label>
                
                <div className="space-y-4">
                  {(Object.keys(PLANOS) as Array<keyof typeof PLANOS>).map((key) => {
                    const isSelected = plano === key;
                    const item = PLANOS[key];
                    return (
                      <label 
                        key={key}
                        className={`relative flex flex-col cursor-pointer rounded-xl border p-4 sm:p-5 transition-all duration-300 ${
                          isSelected 
                            ? 'border-sunex-accent bg-sunex-accent/5 shadow-[0_5px_30px_rgba(255,122,0,0.15)]'
                            : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="plano_simulador" 
                          value={key} 
                          checked={isSelected}
                          onChange={(e) => setPlano(e.target.value as keyof typeof PLANOS)}
                          className="sr-only" 
                        />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-sunex-accent' : 'border-white/20'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-sunex-accent" />}
                            </div>
                            <span className={`font-extrabold text-sm sm:text-md uppercase tracking-wider ${isSelected ? 'text-sunex-gold' : 'text-white'}`}>
                              {key}
                            </span>
                            {key === 'Performance' && (
                              <span className="text-[9px] bg-sunex-accent/15 text-sunex-gold px-2.5 py-0.5 rounded-full uppercase tracking-widest font-black border border-sunex-accent/20 animate-pulse whitespace-nowrap">
                                Plano Mais Vendido
                              </span>
                            )}
                          </div>
                          
                          <span className={`font-mono font-black text-sm sm:text-md shrink-0 ${isSelected ? 'text-sunex-accent' : 'text-sunex-muted'}`}>
                            R$ {item.preco.toFixed(2).replace('.', ',')} <span className="text-[10px] uppercase font-sans tracking-widest font-bold">/ placa</span>
                          </span>
                        </div>
 
                        {/* Extra features reveal drawer on checked */}
                        {isSelected && (
                          <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in duration-300">
                            <p className="text-sunex-muted text-xs leading-relaxed mb-4 font-semibold">
                              {item.descricao}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {item.inclui.map((inc, index) => (
                                <div key={index} className="flex items-start gap-2 text-xs font-semibold text-white">
                                  <Check className="w-4 h-4 text-sunex-accent shrink-0 mt-0.5" />
                                  <span>{inc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
 
            </div>
 
            {/* Price Result Banner */}
            <div className="pt-8 border-t border-white/5 mt-8 text-center bg-black/40 p-5 sm:p-8 rounded-xl border border-white/5">
              <span className="text-sunex-muted text-xs uppercase tracking-widest font-black mb-2 block">
                Valor Total Estimado
              </span>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-sunex-gold to-sunex-accent mb-6 font-mono">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularValor)}
              </div>
              
              <Link to={`/solicitar?plano=${plano.toLowerCase()}&placas=${placas || ''}`} className="btn-primary flex items-center justify-center gap-2 group w-full py-4 text-sm font-black shadow-lg">
                Agendar com {plano} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
 
          {/* RIGHT COLUMN: Benefícios Side Card */}
          <div className="glass-panel p-5 sm:p-8 md:p-10 border-t border-t-white/10 bg-sunex-card flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 text-[10px] font-black tracking-[3px] uppercase text-[#FFC300] bg-sunex-gold/5 px-3 py-1 rounded-full border border-sunex-gold/20">
                <Sparkles className="w-3 h-3" /> Benefícios Reais
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest mb-6">
                Por que Limpeza Profissional?
              </h2>
              <p className="text-sunex-muted text-sm leading-relaxed mb-8 font-medium">
                Limpar painéis solares não é equivalente a lavar vidros comuns. O acúmulo de poeira química, fezes de pássaros e fuligem industrial cria opacidade que reduz dramaticamente a entrada de luz e danifica as células fotoelétricas em longo prazo.
              </p>

              {/* Bullet List Section */}
              <div className="space-y-6">
                
                {/* Bullet 1 */}
                <div className="flex gap-4 group">
                  <div className="shrink-0 bg-sunex-accent/10 border border-sunex-accent/20 p-2.5 rounded-lg text-sunex-accent group-hover:bg-sunex-accent group-hover:text-white transition-all">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-1">Mais Geração</h4>
                    <p className="text-xs text-sunex-muted leading-relaxed font-semibold">
                      Garante aumento imediato de até 30% na performance de captação de fótons após a execução técnica.
                    </p>
                  </div>
                </div>

                {/* Bullet 2 */}
                <div className="flex gap-4 group">
                  <div className="shrink-0 bg-sunex-accent/10 border border-sunex-accent/20 p-2.5 rounded-lg text-sunex-accent group-hover:bg-sunex-accent group-hover:text-white transition-all">
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-1">Menos Perdas</h4>
                    <p className="text-xs text-sunex-muted leading-relaxed font-semibold">
                      Previne a formação de focos de curto-circuito térmico (hotspots) que geram pontos de fadiga extrema na placa.
                    </p>
                  </div>
                </div>

                {/* Bullet 3 */}
                <div className="flex gap-4 group">
                  <div className="shrink-0 bg-sunex-accent/10 border border-sunex-accent/20 p-2.5 rounded-lg text-sunex-accent group-hover:bg-sunex-accent group-hover:text-white transition-all">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-1">Maior Vida Útil</h4>
                    <p className="text-xs text-sunex-muted leading-relaxed font-semibold">
                      Preserva as características técnicas protetoras do vidro temperado e as ligas metálicas autolubrificantes.
                    </p>
                  </div>
                </div>

                {/* Bullet 4 */}
                <div className="flex gap-4 group">
                  <div className="shrink-0 bg-sunex-accent/10 border border-sunex-accent/20 p-2.5 rounded-lg text-sunex-accent group-hover:bg-sunex-accent group-hover:text-white transition-all">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-1">Maior Segurança</h4>
                    <p className="text-xs text-sunex-muted leading-relaxed font-semibold">
                      Serviço executado com profissionais qualificados, equipamentos de escalada e água totalmente desmineralizada purificada.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Side-Card Info Slogan */}
            <div className="mt-8 pt-6 border-t border-white/5 bg-white/[0.01] p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-center font-bold uppercase tracking-widest text-sunex-gold leading-normal">
                Recupere a rentabilidade do seu sistema de forma limpa, segura e ecológica.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="bg-black/30 border-t border-white/5 py-12 text-center text-xs font-bold tracking-widest text-sunex-muted w-full">
        SUNEX - SOFTWARE DE SIMULAÇÃO TÉCNICA ENERGÉTICA &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}

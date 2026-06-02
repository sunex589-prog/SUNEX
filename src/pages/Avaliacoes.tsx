import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, Award, Sparkles, UserCheck } from 'lucide-react';

interface Avaliacao {
  id: string;
  nome: string;
  comentario: string;
  nota: number;
  data: string;
}

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [nome, setNome] = useState('');
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState<number>(5);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sunex_avaliacoes');
      if (stored) {
        setAvaliacoes(JSON.parse(stored));
      } else {
        // Initial reviews matching exact brand layout
        const iniciais: Avaliacao[] = [
          { 
            id: '1', 
            nome: 'Carlos M.', 
            comentario: 'Serviço impecável! Minha geração aumentou muito depois da limpeza. Recomendo demais!', 
            nota: 5, 
            data: new Date().toISOString() 
          },
          { 
            id: '2', 
            nome: 'Mariana R.', 
            comentario: 'Profissionais muito atenciosos e equipamentos de qualidade. Resultado acima do esperado!', 
            nota: 5, 
            data: new Date(Date.now() - 86400000).toISOString() 
          },
          { 
            id: '3', 
            nome: 'João P.', 
            comentario: 'Excelente atendimento e pontualidade. Acompanhei tudo pelo sistema, muito prático!', 
            nota: 5, 
            data: new Date(Date.now() - 172800000).toISOString() 
          },
          { 
            id: '4', 
            nome: 'Fernanda L.', 
            comentario: 'Minha conta de energia reduziu bastante. SUNEX está de parabéns pelo serviço.', 
            nota: 5, 
            data: new Date(Date.now() - 259200000).toISOString() 
          }
        ];
        setAvaliacoes(iniciais);
        localStorage.setItem('sunex_avaliacoes', JSON.stringify(iniciais));
      }
    } catch (e) {
      console.error("Erro ao carregar avaliações", e);
    }
  }, []);

  const adicionarAvaliacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !comentario.trim()) return;

    const novaAvaliacao: Avaliacao = {
      id: Math.random().toString(36).substring(2, 9),
      nome: nome.trim(),
      comentario: comentario.trim(),
      nota: nota,
      data: new Date().toISOString()
    };

    try {
      const novaLista = [novaAvaliacao, ...avaliacoes];
      setAvaliacoes(novaLista);
      localStorage.setItem('sunex_avaliacoes', JSON.stringify(novaLista));
      
      // Clear form
      setNome('');
      setComentario('');
      setNota(5);
    } catch (e) {
      console.error("Erro ao salvar avaliação", e);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-5 h-5 drop-shadow-sm transition-all ${
              star <= rating 
                ? 'fill-sunex-gold text-sunex-gold' 
                : 'text-white/10'
            } ${interactive ? 'cursor-pointer hover:scale-125 hover:rotate-12' : ''}`}
            onClick={() => interactive && setNota(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full relative">
      {/* Background Decorators */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-sunex-gold/5 rounded-full blur-[120px] -z-10 pointer-events-none opacity-40 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sunex-accent/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-30 mix-blend-screen" />

      {/* Main Container */}
      <div className="max-w-[1300px] mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-black tracking-[4px] uppercase text-sunex-accent bg-sunex-accent/10 border border-sunex-accent/25 px-4 py-1.5 rounded-full">
            <MessageSquareQuote className="w-3.5 h-3.5" /> Depoimentos e Feedback
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase text-white tracking-tight mb-4 mt-2">
            Avaliações de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">Clientes</span>
          </h1>
          <p className="text-sunex-muted text-md max-w-2xl mx-auto font-medium">
            A satisfação real de quem confia a eficiência de seus painéis fotovoltaicos ao time técnico da SUNEX.
          </p>
        </div>

        {/* Form + List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.5fr] gap-10 xl:gap-14 items-start">
          
          {/* LEFT COLUMN: Submit Review Panel */}
          <div className="lg:sticky lg:top-32 animate-in slide-in-from-left-8 duration-700">
            <div className="glass-panel p-8 md:p-10 border-t border-t-white/10 bg-sunex-card relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sunex-accent/5 rounded-bl-full -z-10 blur-2xl" />
              
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-8 border-b border-white/5 pb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-sunex-accent rounded-full block"></span> Deixe sua Opinião
              </h3>
              
              <form onSubmit={adicionarAvaliacao} className="space-y-6">
                
                {/* Input 1 */}
                <div className="group">
                  <label className="input-label mb-2 text-xs font-bold uppercase tracking-widest text-sunex-muted group-focus-within:text-white transition-colors block">
                    Nome Completo
                  </label>
                  <input 
                    type="text" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="input-field shadow-inner bg-black/40" 
                    placeholder="Ex: Carlos M."
                    required
                  />
                </div>
                
                {/* Star rating selector container */}
                <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                  <label className="input-label mb-3 text-[10px] font-bold uppercase tracking-widest text-sunex-muted block text-center">
                    Sua Classificação (Estrelas)
                  </label>
                  <div className="flex justify-center">
                    {renderStars(nota, true)}
                  </div>
                </div>

                {/* Input 2 */}
                <div className="group">
                  <label className="input-label mb-2 text-xs font-bold uppercase tracking-widest text-sunex-muted group-focus-within:text-white transition-colors block">
                    Relato de Serviço
                  </label>
                  <textarea 
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="input-field min-h-[120px] resize-none shadow-inner bg-black/40" 
                    placeholder="Como foi o resultado e a eficiência das placas?"
                    required
                  />
                </div>

                {/* Action button */}
                <button type="submit" className="btn-primary w-full py-4 text-sm font-black shadow-lg shadow-sunex-accent/10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-sunex-gold" /> Publicar Avaliação
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Reviews List */}
          <div className="space-y-6">
            {avaliacoes.length === 0 ? (
              <div className="glass-panel p-16 text-center text-sunex-muted flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 bg-sunex-card border border-white/5">
                <MessageSquareQuote className="w-14 h-14 mb-4 opacity-35 text-sunex-accent" />
                <p className="font-semibold text-md uppercase tracking-wider text-white">Nenhum relato publicado ainda</p>
                <p className="text-xs text-sunex-muted mt-2">Seja o primeiro a enviar sua experiência com o nosso serviço técnico!</p>
              </div>
            ) : (
              avaliacoes.map((av, idx) => (
                <div 
                  key={av.id} 
                  className="glass-panel p-6 md:p-8 border-t border-t-white/10 bg-[#111111]/90 hover:border-sunex-accent/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar placeholder with first letter */}
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-sunex-accent/10 to-[#111111] border border-sunex-accent/20 flex items-center justify-center text-md font-black text-sunex-gold shadow-md shrink-0 group-hover:scale-105 transition-transform">
                        {av.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-md tracking-wide group-hover:text-sunex-accent transition-colors">{av.nome}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <UserCheck className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-sunex-muted">
                            Cliente Verificado • {new Date(av.data).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Stars box */}
                    <div className="shrink-0 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 flex items-center justify-center">
                      {renderStars(av.nota)}
                    </div>
                  </div>
                  
                  {/* Review Text */}
                  <div className="relative pl-4 border-l-2 border-sunex-accent/40">
                    <p className="text-sm text-[#eee] leading-relaxed font-medium italic">
                      "{av.comentario}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>

      </div>

      {/* Footer */}
      <div className="bg-black/30 border-t border-white/5 py-12 text-center text-xs font-bold tracking-widest text-sunex-muted w-full">
        SUNEX - SEGURANÇA E PERFORMANCE EM ENERGIA SOLAR &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}

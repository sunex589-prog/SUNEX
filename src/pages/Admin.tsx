import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { escutarPedidos, atualizarStatus, zerarPedidos, deletarPedido, anexarImagemAdmin, Pedido, StatusPedido } from '../lib/pedidos';
import { formatDate } from '../lib/utils';
import { ExternalLink, LogOut, Trash2, Search, ImagePlus, Loader2, X, Eye, Download, AlertCircle, Filter, Kanban, Layers, Calendar } from 'lucide-react';

const STATUS_OPTIONS: {value: StatusPedido, label: string}[] = [
  { value: 'aguardando_pagamento', label: 'Aguardando Pagamento' },
  { value: 'pagamento_enviado', label: 'Pagamento em Análise' },
  { value: 'confirmado', label: 'Pedido Confirmado' },
  { value: 'agendado', label: 'Serviço Agendado' },
  { value: 'em_execucao', label: 'Em Execução' },
  { value: 'finalizado', label: 'Finalizado' }
];

export default function Admin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);
  
  // Filters states
  const [filterNome, setFilterNome] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlano, setFilterPlano] = useState<string>('all'); // NEW
  const [filterData, setFilterData] = useState('');
  
  const [uploadingAdminImage, setUploadingAdminImage] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState<{ url: string, title: string } | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Erro ao sair do Firebase:", err);
    }
    sessionStorage.removeItem('sunex_admin_auth');
    navigate('/login');
  };

  const handleAnexarAdmin = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setUploadingAdminImage(id);
    try {
      await anexarImagemAdmin(id, file);
    } catch (err) {
      alert('Erro ao anexar imagem do admin. Tente novamente.');
    } finally {
      setUploadingAdminImage(null);
    }
  };

  const handleZerar = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Zerar Pedidos',
      message: 'Tem certeza que deseja DELETAR TODOS os pedidos? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        setLoading(true);
        setConfirmDialog(null);
        try {
          await zerarPedidos();
        } catch (e) {
          console.error("Erro ao zerar pedidos:", e);
        }
        setLoading(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Pedido',
      message: `Tem certeza que deseja excluir o pedido ${id}? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deletarPedido(id);
        } catch (e) {
          console.error("Erro ao deletar pedido:", e);
        }
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    setAuthError(null);
    const unsubscribe = escutarPedidos((lista) => {
      setPedidos(lista);
      setLoading(false);
    }, (err) => {
      console.error("Erro na escuta de pedidos:", err);
      if (err.message.includes('permission') || err.message.includes('permissions')) {
        setAuthError('Acesso Negado: Sua conta não tem permissão de administrador neste projeto Firebase. Use sunex589@gmail.com ou admin@sunex.com.br.');
      } else {
        setAuthError('Erro ao carregar pedidos. Verifique se o projeto sunex-e27a9 está configurado corretamente.');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, novoStatus: StatusPedido) => {
    try {
      await atualizarStatus(id, novoStatus);
    } catch (e) {
      alert("Erro ao mudar status.");
    }
  };

  // Filter application - supports both new 'plano' and old 'servico' compatibility
  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filterNome && !pedido.nome.toLowerCase().includes(filterNome.toLowerCase())) return false;
    if (filterStatus !== 'all' && pedido.status !== filterStatus) return false;
    
    // Plan Filter check
    if (filterPlano !== 'all') {
      const recordPlano = (pedido.plano || pedido.servico || '').toLowerCase();
      if (recordPlano !== filterPlano.toLowerCase()) return false;
    }

    if (filterData) {
      const pedidoDate = new Date(pedido.data).toISOString().split('T')[0];
      if (pedidoDate !== filterData) return false;
    }
    return true;
  });

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedOrders);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedOrders(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === pedidosFiltrados.length && pedidosFiltrados.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(pedidosFiltrados.map(p => p.id)));
    }
  };

  const exportToCSV = () => {
    if (selectedOrders.size === 0) return;

    const ordersToExport = pedidos.filter(p => selectedOrders.has(p.id));
    
    // CSV Header
    let csvContent = "ID;Data;Nome;Email;Telefone;Endereco;Plano;Servico;Placas;Pagamento;Status\n";

    ordersToExport.forEach(p => {
      const row = [
        p.id,
        formatDate(new Date(p.data)),
        p.nome,
        p.email,
        p.telefone,
        `"${(p.endereco || "").replace(/"/g, '""')}"`,
        p.plano || p.servico || 'Essencial',
        p.servico,
        p.placas,
        p.pagamento.toUpperCase(),
        STATUS_OPTIONS.find(opt => opt.value === p.status)?.label || p.status
      ].join(";");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sunex_relatorio_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 max-w-[1500px] mx-auto w-full px-6 py-10 relative z-10">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 text-[10px] font-black tracking-[4px] uppercase text-sunex-accent bg-sunex-accent/10 px-3.5 py-1 rounded-full border border-sunex-accent/20">
            <Kanban className="w-3.5 h-3.5" /> Administração de Serviços
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight">
            Painel <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">Administrativo</span>
          </h1>
          <p className="text-sunex-muted mt-2 text-sm font-semibold">
            Gerenciamento de solicitações SUNEX ordenadas do mais recente ao mais antigo.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
          {selectedOrders.size > 0 && (
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-3 bg-[#111111] hover:bg-white/5 text-sunex-gold border border-sunex-gold/20 rounded-xl transition-all hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-wider shadow-lg"
            >
              <Download className="w-4 h-4" /> Exportar CSV ({selectedOrders.size})
            </button>
          )}
          <button 
            onClick={handleZerar}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-[#111111] hover:bg-red-500/10 text-red-400 border border-red-500/15 rounded-xl transition-all hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-wider shadow-lg"
          >
            <Trash2 className="w-4 h-4" /> Zerar Banco
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-5 py-3 bg-[#111111] hover:bg-white/5 text-white border border-white/5 rounded-xl transition-all hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-wider shadow-lg"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      {/* Auth Error Banner */}
      {authError ? (
        <div className="bg-red-500/10 border border-red-500/15 text-red-400 p-8 rounded-xl mb-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          <AlertCircle className="w-12 h-12 mb-4 animate-bounce" />
          <h3 className="text-lg font-black uppercase mb-2 text-white">Privilégios Insuficientes</h3>
          <p className="max-w-md font-semibold text-sm text-sunex-muted">{authError}</p>
          <button onClick={handleLogout} className="mt-6 btn-secondary !w-fit px-8 py-3 bg-red-500/20 text-white rounded-lg border-none font-bold">Voltar para Login</button>
        </div>
      ) : (
        <>
          {/* FILTERS PANEL: Custom 4-Column Grid */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-5 duration-500 shadow-xl shadow-black">
            
            {/* Filter 1: Name */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-sunex-muted mb-2 font-black flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /> Cliente
              </label>
              <input 
                type="text" 
                placeholder="Nome..." 
                value={filterNome}
                onChange={e => setFilterNome(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-xs text-white outline-none focus:border-sunex-accent transition-colors focus:bg-black/60 font-sans"
              />
            </div>

            {/* Filter 2: Plano (NEW REQUIRED FILTER) */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-sunex-muted mb-2 font-black flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Plano
              </label>
              <select 
                value={filterPlano}
                onChange={e => setFilterPlano(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-xs text-white outline-none focus:border-sunex-accent transition-colors cursor-pointer focus:bg-black/60 font-black uppercase tracking-wider"
              >
                <option value="all">TODOS OS PLANOS</option>
                <option value="Essencial">ESSENCIAL (R$18)</option>
                <option value="Performance">PERFORMANCE (R$15)</option>
                <option value="Elite">ELITE (R$13)</option>
              </select>
            </div>

            {/* Filter 3: Status */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-sunex-muted mb-2 font-black flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" /> Status
              </label>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-xs text-white outline-none focus:border-sunex-accent transition-colors cursor-pointer focus:bg-black/60 font-black uppercase tracking-wider"
              >
                <option value="all">TODOS OS STATUS</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Filter 4: Date */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-sunex-muted mb-2 font-black flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Data do Pedido
              </label>
              <input 
                type="date" 
                value={filterData}
                onChange={e => setFilterData(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-xs text-white outline-none focus:border-sunex-accent transition-colors [color-scheme:dark] focus:bg-black/60 font-sans cursor-pointer"
              />
            </div>
          </div>

          {/* TABLE CONTAINER: Dark Industrial Table */}
          <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-600">
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-transparent border-collapse">
                <thead className="bg-black/60 border-b border-white/5">
                  <tr>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted w-10 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-white/20 bg-black/40 accent-sunex-accent cursor-pointer"
                        checked={selectedOrders.size > 0 && selectedOrders.size === pedidosFiltrados.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted">ID / Data</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted">Cliente</th>
                    {/* NEW COLUMN: Plano (REQUIRED) */}
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted">Plano</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted">Dados Técnicos</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted">Acerto</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted">Anexos</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted">Status Operacional</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-sunex-muted text-right">Ação</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-white/[0.03]">
                  {pedidosFiltrados.map(pedido => {
                    const mappedPlano = pedido.plano || pedido.servico || 'Essencial';
                    return (
                      <tr key={pedido.id} className="hover:bg-white/[0.01] transition-colors group">
                        
                        {/* checkbox inline */}
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-white/10 bg-black/40 accent-sunex-accent cursor-pointer"
                            checked={selectedOrders.has(pedido.id)}
                            onChange={() => toggleSelection(pedido.id)}
                          />
                        </td>

                        {/* id date */}
                        <td className="p-4">
                          <div className="font-mono font-black text-sunex-accent text-sm tracking-widest uppercase">{pedido.id}</div>
                          <div className="text-[10px] text-sunex-muted mt-1 font-bold">{formatDate(new Date(pedido.data))}</div>
                        </td>

                        {/* client details */}
                        <td className="p-4 max-w-[280px]">
                          <div className="font-extrabold text-white text-xs uppercase tracking-wide">{pedido.nome}</div>
                          <div className="text-[10px] text-sunex-muted mt-0.5 break-all font-semibold">{pedido.email}</div>
                          <div className="text-[10px] text-sunex-muted mt-0.5 font-mono font-bold">{pedido.telefone}</div>
                          <div className="text-[10px] text-[#A8A8A8] mt-1.5 pt-1.5 border-t border-white/5 break-words font-medium">{pedido.endereco}</div>
                        </td>

                        {/* PLANO COLUMN (NEW REQUIRED FIELD) */}
                        <td className="p-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest inline-block px-2.5 py-1 rounded-md ${
                            mappedPlano.toLowerCase() === 'elite' 
                              ? 'text-sunex-gold bg-sunex-gold/15 border border-sunex-gold/25 shadow-sm' 
                              : mappedPlano.toLowerCase() === 'performance'
                              ? 'text-sunex-accent bg-sunex-accent/15 border border-sunex-accent/25'
                              : 'text-white bg-white/5 border border-white/10'
                          }`}>
                            {mappedPlano}
                          </span>
                        </td>

                        {/* plates and old service definition field */}
                        <td className="p-4">
                          <div className="font-bold text-xs text-white font-mono">{pedido.placas} Placas</div>
                          <div className="text-[9px] text-sunex-muted uppercase tracking-wider mt-1 font-semibold block">
                            Ref: {pedido.servico || 'Limpeza Técnica'}
                          </div>
                        </td>

                        {/* payment method */}
                        <td className="p-4">
                          <div className={`text-[9px] font-black uppercase tracking-widest inline-block px-2.5 py-1 rounded ${
                            pedido.pagamento === 'pix' 
                              ? 'text-emerald-400 bg-emerald-400/5 border border-emerald-400/10' 
                              : 'text-amber-400 bg-amber-400/5 border border-amber-400/10'
                          }`}>
                            {pedido.pagamento}
                          </div>
                        </td>

                        {/* attachment preview elements */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {/* client payment receipt */}
                            {pedido.comprovanteUrl ? (
                              <div className="relative group/preview inline-block">
                                <button 
                                  onClick={() => setViewImage({ url: pedido.comprovanteUrl!, title: 'Comprovante Escaneado PIX' })} 
                                  className="inline-flex items-center justify-center p-2 bg-sunex-accent/10 hover:bg-sunex-accent/20 border border-sunex-accent/20 rounded-lg text-sunex-accent transition-all hover:scale-105" 
                                  title="Ver Comprovante do Cliente"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-50 opacity-0 invisible group-hover/preview:opacity-100 group-hover/preview:visible transition-all duration-200 pointer-events-none">
                                  <div className="bg-[#111111] p-3 rounded-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                                    <div className="w-[180px] h-[220px] bg-black/60 rounded overflow-hidden flex items-center justify-center">
                                      <img src={pedido.comprovanteUrl} alt="Comprovante" className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="text-center mt-2.5 text-[8px] font-black text-sunex-gold uppercase tracking-widest">
                                      Comprovante PIX
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-white/10 text-xs">-</span>
                            )}

                            {/* technical inspected report image */}
                            {pedido.imagemAdminUrl ? (
                              <div className="relative group/preview inline-block">
                                <button 
                                  onClick={() => setViewImage({ url: pedido.imagemAdminUrl!, title: 'Relatório Técnico Fotográfico' })} 
                                  className="inline-flex items-center justify-center p-2 bg-sunex-gold/10 hover:bg-sunex-gold/20 border border-sunex-gold/20 rounded-lg text-sunex-gold transition-all hover:scale-105" 
                                  title="Ver Foto do Atendimento"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-50 opacity-0 invisible group-hover/preview:opacity-100 group-hover/preview:visible transition-all duration-200 pointer-events-none">
                                  <div className="bg-[#111111] p-3 rounded-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                                    <div className="w-[180px] h-[220px] bg-black/60 rounded overflow-hidden flex items-center justify-center">
                                      <img src={pedido.imagemAdminUrl} alt="Relatório Técnico" className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="text-center mt-2.5 text-[8px] font-black text-sunex-gold uppercase tracking-widest">
                                      Relatório de Atendimento
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <label className="inline-flex items-center justify-center p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-emerald-400 transition-all hover:scale-105 cursor-pointer" title="Anexar Foto de Inspeção">
                                {uploadingAdminImage === pedido.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <ImagePlus className="w-3.5 h-3.5" />
                                    <input type="file" accept="image/*" className="hidden" disabled={uploadingAdminImage === pedido.id} onChange={(e) => handleAnexarAdmin(pedido.id, e)} />
                                  </>
                                )}
                              </label>
                            )}
                          </div>
                        </td>

                        {/* order status selector */}
                        <td className="p-4">
                          <select 
                            value={pedido.status}
                            onChange={(e) => handleStatusChange(pedido.id, e.target.value as StatusPedido)}
                            className="bg-black/40 border border-white/10 rounded p-2.5 text-[9px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-sunex-accent outline-none cursor-pointer focus:ring-1 focus:ring-sunex-accent/20 transition-all inline-block truncate w-[170px]"
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                            ))}
                          </select>
                        </td>

                        {/* action items */}
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDelete(pedido.id)}
                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:text-red-400"
                            title="Excluir do Banco"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                  {pedidosFiltrados.length === 0 && !loading && (
                    <tr>
                      <td colSpan={9} className="p-16 text-center text-sunex-muted">
                        <div className="inline-flex flex-col items-center">
                          <div className="w-14 h-14 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                            <Search className="w-5 h-5 text-white/20" />
                          </div>
                          <p className="font-black text-sm uppercase tracking-wider text-white mb-1">Nenhum registro correspondente</p>
                          <p className="text-xs">Ajuste os filtros superiores ou aguarde o recebimento de novos leads.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-md font-black uppercase tracking-wider text-white mb-3">{confirmDialog.title}</h3>
            <p className="text-sunex-muted text-xs font-semibold mb-6 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">{confirmDialog.message}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-bold text-xs uppercase tracking-wider border border-white/5"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="flex-1 px-4 py-3 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all font-bold text-xs uppercase tracking-wider"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Full Modal */}
      {viewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setViewImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 left-4 bg-black/60 text-sunex-gold px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest z-10">
              {viewImage.title}
            </div>
            <button 
              onClick={() => setViewImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2.5 rounded-full hover:bg-white/20 transition-colors z-10 border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={viewImage.url} alt={viewImage.title} className="max-w-full max-h-full object-contain rounded-xl border border-white/10 shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}

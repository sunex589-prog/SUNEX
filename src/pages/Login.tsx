import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Sun, User, Key } from 'lucide-react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const adminUsername = 'SUNEX';
    const adminEmail = 'admin@sunex.com.br';
    
    if (username.toUpperCase() === adminUsername.toUpperCase()) {
      try {
        // Try logging of the official Firebase administration account
        await signInWithEmailAndPassword(auth, adminEmail, password);
        sessionStorage.setItem('sunex_admin_auth', 'true');
        navigate('/admin');
      } catch (err: any) {
        console.warn("Attempting on-demand admin account registration/verification...", err);
        
        // If the user does not exist in Firebase Auth yet, and they entered the correct password, create it!
        if ((err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && password === 'sunex2026') {
          try {
            await createUserWithEmailAndPassword(auth, adminEmail, password);
            sessionStorage.setItem('sunex_admin_auth', 'true');
            navigate('/admin');
            setLoading(false);
            return;
          } catch (signUpErr: any) {
            console.error("Erro ao criar usuário administrador no Firebase:", signUpErr);
            if (signUpErr.code === 'auth/operation-not-allowed') {
              setError('O login ou registro por E-mail/Senha está desativado no Firebase Console. Ative o método E-mail/Senha em Authentication.');
              setLoading(false);
              return;
            }
          }
        }
        
        // Handle normal errors
        console.error("Erro no login Firebase:", err);
        if (err.code === 'auth/unauthorized-domain') {
          setError('Domínio não autorizado. Adicione os domínios da Cloud Run na seção "Authentication > Settings > Authorized domains" do seu Firebase Console.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('O login por E-mail/Senha está desativado no Firebase Console. Por favor, ative-o em Authentication > Sign-in method.');
        } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
          setError('Credenciais administrativas incorretas ou usuário não criado no Firebase.');
        } else {
          setError('Erro de conexão com o Firebase Auth. Verifique sua rede.');
        }
      }
    } else {
      setError('Usuário não reconhecido pelo sistema.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.email === 'sunex589@gmail.com') {
        sessionStorage.setItem('sunex_admin_auth', 'true');
        navigate('/admin');
      } else {
        await auth.signOut();
        setError('Esta conta Google não tem permissão de administrador.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Este domínio não está autorizado no Firebase. Adicione os domínios da Cloud Run em "Authentication > Settings > Authorized domains".');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('O login via Google está desativado no Firebase Console. Ative o provedor Google em Authentication.');
      } else {
        setError('Erro ao autenticar com Google. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative w-full overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sunex-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="glass-panel text-center p-12 max-w-[420px] w-full animate-in fade-in zoom-in-95 duration-500 shadow-2xl shadow-black">
        <div className="mx-auto bg-gradient-to-br from-sunex-gold/20 to-sunex-accent/10 border border-sunex-gold/20 text-sunex-gold p-5 rounded-3xl inline-flex mb-8 shadow-[0_0_30px_rgba(255,195,0,0.15)] relative group">
          <Sun className="absolute w-full h-full inset-0 text-sunex-gold/20 blur-md group-hover:blur-xl transition-all" />
          <Lock className="h-10 w-10 relative z-10" />
        </div>
        
        <h2 className="text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">Painel Administrativo</h2>
        <p className="text-[#888] mb-10 font-medium">Selecione o método de autenticação para gerenciar o sistema.</p>
        
        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sunex-gold to-sunex-accent text-black py-4 px-6 rounded-xl font-black uppercase tracking-[2px] transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-sunex-gold/10 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#000"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000"/>
          </svg>
          Entrar com Google
        </button>

        <div className="relative mt-12 mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[4px]">
            <span className="bg-sunex-dark px-6 text-[#555] font-black">Ou use credenciais</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sunex-accent transition-colors">
              <User className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="USUÁRIO"
              className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-xl text-white outline-none focus:border-sunex-accent/50 focus:bg-white/[0.05] transition-all text-xs uppercase tracking-[3px] font-bold"
              required
            />
          </div>
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sunex-accent transition-colors">
              <Key className="w-4 h-4" />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="SENHA"
              className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-xl text-white outline-none focus:border-sunex-accent/50 focus:bg-white/[0.05] transition-all text-xs tracking-[5px] font-bold"
              required
            />
          </div>
          
          {error && (
            <div className="flex items-center justify-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <button type="submit" disabled={loading} className="btn-primary !py-5 mt-4">
            Acessar Sistema
          </button>
        </form>

      </div>
    </div>
  );
}

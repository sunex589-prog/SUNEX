import { db, auth } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, query, orderBy, serverTimestamp, onSnapshot, deleteDoc, getDocFromServer } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export type StatusPedido = 'aguardando_pagamento' | 'pagamento_enviado' | 'confirmado' | 'agendado' | 'em_execucao' | 'finalizado';

export interface Pedido {
  id: string; // ex: SUNEX-001
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  placas: number;
  servico: 'Essencial' | 'Performance' | 'Elite';
  pagamento: 'pix' | 'local';
  status: StatusPedido;
  comprovanteUrl: string;
  imagemAdminUrl?: string;
  data: string;
  createdAt?: any;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export function escutarPedidos(callback: (pedidos: Pedido[]) => void, onError?: (error: any) => void) {
  const path = 'pedidos';
  const q = query(collection(db, path), orderBy('data', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as Pedido));
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  });
}

export function escutarPedidoUnico(id: string, callback: (pedido: Pedido | null) => void) {
  const path = `pedidos/${id.toUpperCase()}`;
  const pedidoRef = doc(db, 'pedidos', id.toUpperCase());
  return onSnapshot(pedidoRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as Pedido);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export async function criarPedido(pedido: Omit<Pedido, 'createdAt'>) {
  const path = `pedidos/${pedido.id}`;
  try {
    const pedidoRef = doc(db, 'pedidos', pedido.id);
    await setDoc(pedidoRef, {
      ...pedido,
      createdAt: serverTimestamp()
    });
    return pedido.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function buscarPedido(id: string): Promise<Pedido | null> {
  const path = `pedidos/${id.toUpperCase()}`;
  try {
    const pedidoRef = doc(db, 'pedidos', id.toUpperCase());
    const pedidoSnap = await getDoc(pedidoRef);
    if (pedidoSnap.exists()) {
      return pedidoSnap.data() as Pedido;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function listarPedidos(): Promise<Pedido[]> {
  const path = 'pedidos';
  try {
    const q = query(collection(db, path), orderBy('data', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Pedido);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function atualizarStatus(id: string, status: StatusPedido) {
  const path = `pedidos/${id}`;
  try {
    const pedidoRef = doc(db, 'pedidos', id);
    const pedidoSnap = await getDoc(pedidoRef);
    
    await updateDoc(pedidoRef, { status });

    if (pedidoSnap.exists()) {
      const pedido = pedidoSnap.data() as Pedido;
      if (pedido.email) {
        const mailPath = 'mail';
        try {
          const mailRef = collection(db, mailPath);
          await setDoc(doc(mailRef), {
            to: pedido.email,
            message: {
              subject: `Atualização do seu pedido ${pedido.id} - SUNEX`,
              html: `Olá ${pedido.nome},<br><br>O status do seu pedido para limpeza de placas solares foi atualizado para: <strong>${status.replace('_', ' ')}</strong>.<br><br>Acompanhe em nosso site.`
            },
            createdAt: serverTimestamp()
          });
        } catch (mailError) {
           console.error("Erro ao registrar e-mail:", mailError);
           // Não interrompemos a atualização do status se o e-mail falhar, 
           // mas registramos o erro de acordo com as diretrizes se for permissão
           if (String(mailError).includes('permission')) {
             handleFirestoreError(mailError, OperationType.CREATE, mailPath);
           }
        }
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max = 800; // max resolution
        if (width > height) {
          if (width > max) { height *= max / width; width = max; }
        } else {
          if (height > max) { width *= max / height; height = max; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

export async function enviarComprovante(pedidoId: string, file: File): Promise<string> {
  const path = `pedidos/${pedidoId}`;
  try {
    const base64Image = await fileToBase64(file);
    
    // Atualiza o pedido com o comprovante e status
    const pedidoRef = doc(db, 'pedidos', pedidoId);
    await updateDoc(pedidoRef, {
      comprovanteUrl: base64Image,
      status: 'pagamento_enviado'
    });

    return base64Image;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return '';
  }
}

export async function anexarImagemAdmin(pedidoId: string, file: File): Promise<void> {
  const path = `pedidos/${pedidoId}`;
  try {
    const base64Image = await fileToBase64(file);
    const pedidoRef = doc(db, 'pedidos', pedidoId);
    await updateDoc(pedidoRef, {
      imagemAdminUrl: base64Image
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletarPedido(id: string) {
  const path = `pedidos/${id}`;
  try {
    await deleteDoc(doc(db, 'pedidos', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function zerarPedidos() {
  const path = 'pedidos';
  try {
    const q = query(collection(db, path));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(docSnap => deleteDoc(doc(db, path, docSnap.id)));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { DocumentData, QueryDocumentSnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { InvoiceDescriptor } from './invoice';


type StoredInvoice = InvoiceDescriptor;

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
}
interface FirebaseContextType {
  user: User | null;
  invoices: StoredInvoice[] | null;
  loadingState: boolean;
  fetchInvoices: () => Promise<void>;
  createInvoice: (newInvoiceData: Omit<InvoiceDescriptor, 'id'>) => Promise<string | null>;
  saveInvoice: (newInvoiceData: InvoiceDescriptor) => Promise<null>;
  deleteInvoice: (id: string) => Promise<null>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

type Props = {
  children?: React.ReactNode
};

interface LoadingState {
  user: boolean,
  invoices: boolean,
}
export const FirebaseProvider: React.FC<Props> = ({ children }) => {
  const [[userLoadingState, setUserLoadingState], [invoicesLoadingState, setInvoicesLoadingState]] = [useState(false), useState(false)];
  const [user, setUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<StoredInvoice[] | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUserLoadingState(true);
      if (authUser) {
        setUser({
          uid: authUser.uid,
          displayName: authUser.displayName,
          email: authUser.email,
        });
      } else {
        setUser(null);
        setInvoicesLoadingState(true);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    fetchInvoices().then(() => {
      setInvoicesLoadingState(true);
    });
  }, [user?.uid]);

  const fetchInvoices = async () => {
    const invoiceRef = collection(db, 'invoices');
    const snapshot = await getDocs(
      query(invoiceRef, where('uid', '==', user?.uid))
    );

    const invoicesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    setInvoices(invoicesData as StoredInvoice[]);
  };

  const createInvoice = async (newInvoiceData: Omit<InvoiceDescriptor, 'id'>) => {
    try {
      const invoiceRef = collection(db, 'invoices');
      const out = await addDoc(invoiceRef, {
        ...newInvoiceData,
        uid: user?.uid,
      });

      // Fetch the updated list of invoices
      await fetchInvoices();
      return out.id;
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
    return null;
  };

  const deleteInvoice = async (id: string) => {
    try {
      const document = doc(db, 'invoices', id);
      await deleteDoc(document);
      // Fetch the updated list of invoices
      await fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      return null;
    }
  };

  const saveInvoice = async (newInvoiceData: InvoiceDescriptor) => {
    try {
      const document = doc(db, 'invoices', newInvoiceData.id);
      await updateDoc(document, { ...newInvoiceData, uid: user?.uid, });

      // Fetch the updated list of invoices
      await fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      return null;
    }
  };

  const value: FirebaseContextType = {
    user,
    invoices,
    fetchInvoices,
    createInvoice,
    saveInvoice,
    deleteInvoice,
    loadingState: userLoadingState && invoicesLoadingState,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
import { FirebaseApp } from 'firebase/app';
import { limit, onSnapshot, startAt, Unsubscribe, getFirestore, addDoc, collection, getDocs, getDoc, Firestore, CollectionReference, doc, DocumentReference, setDoc, connectFirestoreEmulator, deleteDoc, query, orderBy, DocumentSnapshot, startAfter } from "firebase/firestore";
import { cleanUndefined } from './utils'
import FireFirebase from './firebase';

/**
 * Integración con el módulo de firestore de Firebase
 */
export class FireFirestore {
  private _db: Firestore;
  private static instance: FireFirestore;
  private constructor(app: FirebaseApp) {
    this._db = getFirestore(app);
    if (FireFirebase.emulatiorEnable) {
      connectFirestoreEmulator(this._db, 'localhost', 8080);
    }
  }
  public static getInstance(app: FirebaseApp): FireFirestore {
    if (!FireFirestore.instance) {
      FireFirestore.instance = new FireFirestore(app);
    }

    return FireFirestore.instance;
  }
  private _collection = (collectionPath: string): CollectionReference => collection(this._db, collectionPath);
  private _doc = (collectionPath: string, docId: string): DocumentReference => doc(this._db, collectionPath, docId);

  public getCollectionDocs = async (collectionPath: string, lastSnap?: DocumentSnapshot) => {
    let documentSnapshots;
    try {
      const collection = this._collection(collectionPath);

      if (!lastSnap) {
        const firstQuery = query(collection, orderBy("date"), limit(20));
        documentSnapshots = await getDocs(firstQuery);
      } else {
        const next = query(this._collection(collectionPath),
          orderBy("date"),
          startAfter(lastSnap),
          limit(25));
        documentSnapshots = await getDocs(next);
      }
      
      return documentSnapshots.docs;
    } catch (error) {
      console.error(error)
      alert('Internal error firebase')
    }

  }
  public getDoc = async (collectionPath: string, docId: string) => {
    try {
      const docRef = this._doc(collectionPath, docId);
      const snapshot = await getDoc(docRef);
      return snapshot
    } catch (error) {
      console.error(error)
      alert('Internal error firebase')
    }
  }
  /**
     * Implementación delete de Firestore
     * @param collectionPath Path de la colección o subcolección del documento a modificar
     * @param docId Id del documento
     */
  public deleteDoc = async (collectionPath: string, docId: string): Promise<void> => {
    try {
      const docRef = this._doc(collectionPath, docId);
      await deleteDoc(docRef)
    } catch (error) {
      console.error(error)
      alert('Internal error firebase')
    }
  }
  /**
   * Implementación del set de Firestore
   * @param collectionPath Path de la colección o subcolección del documento a modificar
   * @param docId Id del documento
   * @param data Data a modificar
   */
  public setDoc = async (collectionPath: string, docId: string, data: any) => {
    try {
      const docRef = this._doc(collectionPath, docId);
      await setDoc(docRef, cleanUndefined(data));
    } catch (error) {
      console.error(error)
      alert('Internal error firebase')
    }
  }
  /**
   * Implementación del crear documento de Firestore
   * @param collectionPath Path de la colección o subcolección del documento a modificar
   * @param data Data a modificar
   */
  public createDoc = async (collectionPath: string, data: any): Promise<any | undefined> => {
    try {
      const collection = this._collection(collectionPath);
      const snap = await addDoc(collection, cleanUndefined(data));
      return { ...data, docID: snap.id };
    } catch (error) {
      console.error(error);
      alert('Internal error firebase');
    }
  }

  public onChangeDoc = (path: string, callback: Function): Unsubscribe => {
    const unsub = onSnapshot(doc(this._db, path), (doc) => {
      if (doc.exists())
        callback({ ...doc.data, id: doc.id });
    });
    return unsub;
  }
}

export default FireFirestore.getInstance(FireFirebase.app)
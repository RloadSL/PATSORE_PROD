import { FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, Firestore, CollectionReference, doc, DocumentReference, setDoc } from 'firebase/firestore/lite';
import { usersDTO } from '../dto/users.dto';
import FireFirebase from './firebase';

class FireFirestore {
  private _db: Firestore;
  private static instance: FireFirestore;
  private constructor(app: FirebaseApp) {
    this._db = getFirestore(app);
  }
  public static getInstance(app: FirebaseApp): FireFirestore {
    if (!FireFirestore.instance) {
      FireFirestore.instance = new FireFirestore(app);
    }

    return FireFirestore.instance;
  }
  private _collection = (collectionPath: string): CollectionReference => collection(this._db, collectionPath);
  private _doc = (collectionPath: string, docId:string): DocumentReference => doc(this._db, collectionPath, docId);

  public getCollectionDocs = async (collectionPath: string) => {
    try {
      const collection = this._collection(collectionPath);
      const snapshot = await getDocs(collection);
      return snapshot
    } catch (error) {
      console.log(error)
      alert('Internal error firebase')
    }

  }
  public getDoc = async (collectionPath: string, docId: string) => {
    try {
      const docRef = this._doc(collectionPath, docId);
      const snapshot = await getDoc(docRef);
      return snapshot
    } catch (error) {
      console.log(error)
      alert('Internal error firebase')
    }
  }

  public setDoc = async (collectionPath: string, docId: string, data:usersDTO) => {
    try {
      const docRef = this._doc(collectionPath, docId);
      await setDoc(docRef, data);
    } catch (error) {
      console.log(error)
      alert('Internal error firebase')
    }
  }
}

export default FireFirestore.getInstance(FireFirebase.app)
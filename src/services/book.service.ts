import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docSnapshots, Firestore, getDoc, getDocs, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
import { IBook } from '../interfaces/book.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Inject the Firestore service
  firestore: Firestore = inject(Firestore);

  public books!: Observable<IBookWithId[]>;
  private booksCollectionRef: CollectionReference<IBook> = collection(this.firestore, 'books') as CollectionReference<IBook>;

  constructor() {
    this.getBooks();
  }

  private getBookRef(book: IBookWithId) {
    return doc(this.booksCollectionRef, book.id);
  }

  private getBooks() {
    this.books = collectionData<IBookWithId>(this.booksCollectionRef as CollectionReference<IBookWithId>, { idField: 'id' });
  }

  public async addBook(book: IBook) {
    return await addDoc(this.booksCollectionRef, book);
  }

  public async deleteBook(book: IBookWithId) {
    if (!(await this.ifExists(book))) {
      throw new Error('Book does not exist');
    }
    await deleteDoc(this.getBookRef(book));
    return;
  }

  public async updateBook(book: IBookWithId) {
    if (!(await this.ifExists(book))) {
      throw new Error('Book does not exist');
    }
    return await updateDoc(this.getBookRef(book), { ...book, id: undefined });
  }

  public async ifExists(book: IBookWithId) {
    return (await getDoc(doc(this.booksCollectionRef, book.id))).exists();
  }
}
type IBookWithId = IBook & { id: string };

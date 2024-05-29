import {
  computed,
  effect,
  inject,
  Injectable,
  Injector,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { IBook, IBookWithId, IBookList } from '../interfaces/book.interface';
import {
  GroupByAuthor,
  GroupByRating,
  GroupByYear,
  GroupingContext,
  GroupingStrategy,
} from '../interfaces/strategies/book.strategy';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  // Inject the Firestore service
  firestore: Firestore = inject(Firestore);
  // Inject the Router service
  private router: Router = inject(Router);

  private injector: Injector = inject(Injector);
  /**
   * A signal that resolves to an array of books
   */
  public books: Signal<IBookWithId[]> = signal([]);

  /**
   * A reference to the Firestore collection of books
   */
  private booksCollectionRef: CollectionReference<IBook> = collection(
    this.firestore,
    'books'
  ) as CollectionReference<IBook>;

  /**
   * A signal that resolves to the current grouping strategy
   */
  private groupingStrategy: WritableSignal<GroupingStrategy> = signal(
    new GroupByYear()
  );

  /**
   * A signal that resolves to a map of grouped books
   */
  public groupedBooks: Signal<Map<string, IBookList>> = computed(() => {
    const groupingContext = new GroupingContext(
      this.groupingStrategy(),
      this.books()
    );
    return groupingContext.group();
  });

  constructor() {}

  /**
   * Set the grouping strategy
   * @param strategy 'author' | 'year' | 'rating'
   * @returns void
   * @example
   * setGroupingStrategy('author')
   */
  public setGroupingStrategy(strategy: 'author' | 'year' | 'rating') {
    switch (strategy) {
      case 'author':
        this.groupingStrategy.set(new GroupByAuthor());
        break;
      case 'year':
        this.groupingStrategy.set(new GroupByYear());
        break;
      case 'rating':
        this.groupingStrategy.set(new GroupByRating());
        break;
      default:
        this.groupingStrategy.set(new GroupByAuthor());
        break;
    }
  }

  /**
   *
   * @param book the book to get the reference to
   * @returns {DocumentReference} the reference to the book document
   */
  private getBookRef(book: IBookWithId): DocumentReference {
    return doc(this.booksCollectionRef, book.id);
  }

  /**
   * Get all books from the Firestore collection
   */
  public getBooks() {
    this.books = toSignal(
      collectionData<IBookWithId>(
        this.booksCollectionRef as CollectionReference<IBookWithId>,
        { idField: 'id' }
      )
    , {
      injector: this.injector
    }) as Signal<IBookWithId[]>;
  }

  /**
   *
   * @param book the book to add to the collection
   * @returns {Promise<DocumentReference>} the reference to the added book document
   */
  public async addBook(book: IBook): Promise<DocumentReference> {
    return await addDoc(this.booksCollectionRef, book);
  }

  /**
   *
   * @param book the book to delete from the collection
   * @returns {Promise<void>} a promise that resolves when the book is deleted
   */
  public async deleteBook(book: IBookWithId) {
    if (!(await this.ifExists(book))) {
      throw new Error('Book does not exist');
    }
    await deleteDoc(this.getBookRef(book));
    return;
  }

  /**
   *
   * @param book the book to update in the collection
   * @returns {Promise<void>} a promise that resolves when the book is updated
   */
  public async updateBook(book: IBookWithId) {
    if (!(await this.ifExists(book))) {
      throw new Error('Book does not exist');
    }
    let _book = { ...book, id: undefined };
    delete _book.id;
    return await updateDoc(this.getBookRef(book), _book);
  }

  /**
   *
   * @param book the book to check if it exists in the collection
   * @returns {Promise<boolean>} a promise that resolves to true if the book exists, false otherwise
   */
  public async ifExists(book: IBookWithId) {
    return (await getDoc(doc(this.booksCollectionRef, book.id))).exists();
  }

  /**
   *
   * @param id the id of the book to get
   * @returns {Signal<IBookWithId | undefined>} a signal that resolves to the book with the given id, or undefined if it does not exist
   */
  public getBook(id: string): Signal<IBookWithId | undefined> {
    return toSignal(
      docData(doc(this.booksCollectionRef, id) , { idField: 'id' })
    ) as Signal<IBookWithId | undefined>;
  }

  /**
   *
   * @returns {IBook} a new book object
   */
  public provideNewBook(): IBook {
    return {
      title: '',
      authors: [],
      rating: 0,
    };
  }
}

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export type BookKeys = keyof IBook;

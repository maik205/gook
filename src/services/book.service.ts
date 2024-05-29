import {
  computed,
  effect,
  inject,
  Injectable,
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
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { IBook, IBookWithId, IBookList } from '../interfaces/book.interface';
import { Observable } from 'rxjs';
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
  private router: Router = inject(Router);
  public books: Signal<IBookWithId[]> = signal([]);
  private booksCollectionRef: CollectionReference<IBook> = collection(
    this.firestore,
    'books'
  ) as CollectionReference<IBook>;
  private groupingStrategy: WritableSignal<GroupingStrategy> = signal(
    new GroupByYear()
  );
  public groupedBooks: Signal<Map<string, IBookList>> = computed(() => {
    const groupingContext = new GroupingContext(
      this.groupingStrategy(),
      this.books()
    );
    return groupingContext.group();
  });

  constructor() {
    this.getBooks();
  }
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

  private getBookRef(book: IBookWithId) {
    return doc(this.booksCollectionRef, book.id);
  }

  private getBooks() {
    this.books = toSignal(
      collectionData<IBookWithId>(
        this.booksCollectionRef as CollectionReference<IBookWithId>,
        { idField: 'id' }
      )
    ) as Signal<IBookWithId[]>;
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
    let _book = { ...book, id: undefined };
    delete _book.id;
    return await updateDoc(this.getBookRef(book), _book);
  }

  public async ifExists(book: IBookWithId) {
    return (await getDoc(doc(this.booksCollectionRef, book.id))).exists();
  }

  public getBook(id: string): Signal<IBookWithId | undefined> {
    return computed(() => {
      const res = this.books().find((book) => book.id === id);
      if (res) {
        return res;
      } else {
        this.router.navigate(['/']);
        return undefined;
      }
    });
  }
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

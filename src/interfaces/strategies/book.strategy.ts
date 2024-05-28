import { IBook, IBookList } from '../book.interface';

export interface GroupingStrategy {
  group(books: IBookList): Map<string, IBookList>;
}
export class GroupingContext {
  constructor(private strategy: GroupingStrategy, private books: IBookList) {}
  public group() {
    return this.strategy.group(this.books);
  }
}

export class GroupByAuthor implements GroupingStrategy {
  group(books: IBookList): Map<string, IBookList> {
    const groupedBooks = new Map<string, IBookList>();
    books.forEach((book) => {
      book.authors.forEach((author) => {
        groupedBooks.set(author, [...(groupedBooks.get(author) || []), book]);
      });
    });
    return groupedBooks;
  }
}

export class GroupByYear implements GroupingStrategy {
  group(books: IBookList): Map<string, IBookList> {
    const groupedBooks = new Map<string, IBookList>();
    books.forEach((book) => {
      if (book.yearOfPublication) {
        groupedBooks.set(book.yearOfPublication.toString(), [
          ...(groupedBooks.get(book.yearOfPublication.toString()) || []),
          book,
        ]);
      } else {
        groupedBooks.set('Unknown', [
          ...(groupedBooks.get('Unknown') || []),
          book,
        ]);
      }
    });
    return groupedBooks;
  }
}

export class GroupByRating implements GroupingStrategy {
  group(books: IBookList): Map<string, IBookList> {
    const groupedBooks = new Map<string, IBookList>();
    books.forEach((book) => {
      groupedBooks.set(book.rating.toString(), [
        ...(groupedBooks.get(book.rating.toString()) || []),
        book,
      ]);
    });
    return groupedBooks;
  }
}


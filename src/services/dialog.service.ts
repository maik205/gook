import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IBookWithId, IBook } from '../interfaces/book.interface';
import { BookService } from './book.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);

  constructor() {}
  /**
   * Opens a dialog to add a new book
   * @returns void
   */
  public async addBook() {
    const dialogRef = this.dialog.open(
      (await import('../components/book-dialog/book-dialog.component'))
        .BookDialogComponent,
      {
        data: this.bookService.provideNewBook(),
        width: '80%',
        maxWidth: '600px',
      }
    );
    const result = await lastValueFrom<IBook | undefined>(
      dialogRef.afterClosed()
    );
    if (result) this.bookService.addBook(result);
  }
  /**
   * Opens a dialog to delete a book
   * @param book the book to be deleted
   * @param callbackFn a callback function to be called after the book is deleted
   */
  public async deleteBookDialog(book: IBookWithId, callbackFn = () => {}) {
    const dialogRef = this.dialog.open(
      (
        await import(
          '../components/confirmation-dialog/confirmation-dialog.component'
        )
      ).ConfirmationDialog,
      {
        data: {
          title: 'Delete Book',
          description: 'Are you sure you want to delete this book?',
        },
      }
    );
    const result = await lastValueFrom<boolean>(dialogRef.afterClosed());
    if (result) {
      await this.bookService.deleteBook(book);
      callbackFn();
    }
  }
  /**
   * Opens a dialog to edit a book
   * @param book the book to be edited
   * @returns void
   */
  public async editBookDialog(book: IBookWithId) {
    const dialogRef = this.dialog.open(
      (await import('../components/book-dialog/book-dialog.component'))
        .BookDialogComponent,
      {
        data: book,
        width: '80%',
        maxWidth: '600px',
      }
    );
    const result = await lastValueFrom<IBook | undefined>(
      dialogRef.afterClosed()
    );
    if (result) this.bookService.updateBook({ ...result, id: book.id });
  }
}

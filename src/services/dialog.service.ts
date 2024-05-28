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
  public async editBookDialog(book: IBookWithId) {
    const dialogRef = this.dialog.open(
      (await import('../components/book-dialog/book-dialog.component'))
        .BookDialogComponent,
      {
        data: book,
      }
    );
    const result = await lastValueFrom<IBook | undefined>(
      dialogRef.afterClosed()
    );
    if (result) this.bookService.updateBook({ ...result, id: book.id });
  }
}

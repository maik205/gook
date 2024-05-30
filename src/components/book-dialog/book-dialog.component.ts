import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GoogleAPIResponse, IBook } from '../../interfaces/book.interface';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { StarRatingModule } from 'angular-star-rating';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { lastValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatDialogContent,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    StarRatingModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],

  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
})
export class BookDialogComponent {
  public dialogData: IBook = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<BookDialogComponent>);
  public fb = inject(FormBuilder);
  private httpClient = inject(HttpClient);
  public queryFormControl = new FormControl('', [Validators.minLength(5)]);
  public queryStatus = 'idle';

  public formGroup = this.fb.group({
    title: [
      this.dialogData.title,
      [Validators.required, Validators.maxLength(100)],
    ],

    authors: [this.dialogData.authors, [Validators.minLength(1)]],

    rating: [this.dialogData.rating, [Validators.max(10), Validators.min(0)]],

    yearOfPublication: [
      this.dialogData.yearOfPublication,
      [Validators.max(new Date().getFullYear()), Validators.pattern(/[0-9]{04}/gm), Validators.min(1800)],
    ],

    isbn: [
      this.dialogData.isbn,
      [Validators.pattern(/^[0-9]{10}$|^[0-9]{13}$|(^[0-9]{3}-[0-9]{10}$)/)],
    ],

    coverUrl: [this.dialogData.coverUrl],
  });
  // The keys that are used to separate the authors
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  /**
   * Queries the Google Books API for a book with the given query
   */
  public async queryForBook() {
    if (this.queryFormControl.valid) {
      this.queryStatus = 'loading';
      const response = await lastValueFrom(
        this.httpClient.get<GoogleAPIResponse>(
          `${environment.googleBooksApiEndpoint}${this.queryFormControl.value}`
        )
      );
      if (response.totalItems > 0) {
        this.queryStatus = 'success';
        const book = response.items[0].volumeInfo;
        this.formGroup.patchValue({
          isbn: book.industryIdentifiers[0].identifier,
          title: book.title,
          authors: book.authors,
          yearOfPublication: +book.publishedDate.split('-')[0],
          coverUrl: book.imageLinks?.thumbnail,
        });
      } else {
        this.queryStatus = 'error';
      }
    }
  }
  constructor() {}
  /**
   * Closes the dialog and returns the form data if it is valid
   * If the form data is not valid, marks all controls as touched
   * and does not close the dialog
   */
  public close() {
    if (this.formGroup.valid && this.formGroup.value.authors!.length > 0) {
      this.dialogRef.close(this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  public stripFormattingISBN() {
    this.formGroup.controls.isbn.patchValue(
      this.formGroup.controls.isbn.value!.replace(/[^0-9]/gm, '')
    );
    console.log(this.formGroup.controls.isbn.value);
  }
}

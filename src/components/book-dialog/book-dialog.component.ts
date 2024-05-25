import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { IBook } from '../../interfaces/book.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatDialogContent
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss'
})
export class BookDialogComponent {
    public dialogData: IBook = inject(MAT_DIALOG_DATA);

    constructor(

    ) { }

}

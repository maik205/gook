import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { BookDialogComponent } from '../../components/book-dialog/book-dialog.component';
import { BookService } from '../../services/book.service';
import { lastValueFrom } from 'rxjs';
import { IBook } from '../../interfaces/book.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private dialog = inject(MatDialog);
  private bookService = inject(BookService);

  public async addBook() {
    const dialogRef = this.dialog.open(BookDialogComponent, {

    })

    this.bookService.addBook(await lastValueFrom<IBook>(dialogRef.afterClosed()));
  }
}

import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../services/book.service';
import { lastValueFrom } from 'rxjs';
import { IBook, IBookList, IBookWithId } from '../../interfaces/book.interface';
import { MatDialogModule } from '@angular/material/dialog';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DialogService } from '../../services/dialog.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    BookCardComponent,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public dialogService = inject(DialogService);
  public bookService = inject(BookService);
  public sortedBookGroups: Signal<[string, IBookList][]> = computed(() => {
    const sorted = Array.from(this.bookService.groupedBooks().entries()).sort(
      (a, b) => {
        return a[0] < b[0] ? 1 : -1;
      }
    );
    return sorted;
  });



}

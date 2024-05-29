import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookService, randomNumber } from '../../services/book.service';
import { IBookList, IBookWithId } from '../../interfaces/book.interface';
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
    MatSelectModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public dialogService = inject(DialogService);
  public bookService = inject(BookService);
  public sortedBookGroups: Signal<[string, IBookList][]> = computed(() => {
    const sorted = Array.from(this.bookService.groupedBooks().entries()).sort(
      (a, b) => {
        if (a[0] === 'Unknown') return 1;
        return a[0] < b[0] ? 1 : -1;
      }
    );
    sorted.forEach((book) => {
      book[1].sort((a, b) => a.title.localeCompare(b.title));
    });
    return sorted;
  });
  ngOnInit(): void {
    this.bookService.getBooks();
  }
  public recommendedBook: Signal<IBookWithId | undefined> = computed(() => {
    const books = this.bookService.books();
    let filtered = books.filter(
      (book) =>
        book &&
        book.yearOfPublication &&
        new Date().getFullYear() - book.yearOfPublication >= 3
    );
    filtered.sort((a, b) => b.rating - a.rating);

    if (filtered.length === 0) {
      return undefined;
    }
    const highestRating = filtered[0].rating;
    filtered = filtered.filter((book) => book.rating === highestRating);
    return filtered[randomNumber(0, filtered.length - 1)];
  });
}

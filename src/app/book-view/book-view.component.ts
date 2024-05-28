import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { RatingComponent } from '../../components/rating/rating.component';
import { BookService } from '../../services/book.service';
import { IBookWithId, Rating } from '../../interfaces/book.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../../services/dialog.service';
@Component({
  selector: 'app-book-view',
  standalone: true,
  imports: [
    MatChipsModule,
    MatSliderModule,
    FormsModule,
    MatIconModule,
    MatDividerModule,
    RatingComponent,
    MatButtonModule,
  ],
  templateUrl: './book-view.component.html',
  styleUrl: './book-view.component.scss',
})
export class BookViewComponent {
  private bookService = inject(BookService);
  private dialogService = inject(DialogService)
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  constructor() {}
  private debouncer: NodeJS.Timeout | undefined;
  public updateBookRating(rating: number) {
    if (this.debouncer) {
      clearTimeout(this.debouncer);
    }
    this.debouncer = setTimeout(() => {
      this.bookService.updateBook({
        ...(this.book() as IBookWithId),
        rating: rating as Rating,
      });
    }, 1000);
  }

  public book: Signal<IBookWithId | undefined> = this.bookService.getBook(
    this.activatedRoute.snapshot.queryParamMap.get('id') as string
  );

  public async deleteBook(){
    this.dialogService.deleteBookDialog(this.book() as IBookWithId, () => {
      this.router.navigate(['/']);
    })
  }
  public editBook(){
    this.dialogService.editBookDialog(this.book() as IBookWithId);
  }
}

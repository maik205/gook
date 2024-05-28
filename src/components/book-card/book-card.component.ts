import { Component, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { IBook, IBookWithId } from '../../interfaces/book.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'book-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  public book = input.required<IBookWithId | IBook>();
  public onEditEvent = output<IBookWithId>();
  public onDeleteEvent = output<IBookWithId>();
  private router: Router = inject(Router);
  public goToInfo(){
    this.router.navigate(['/book'], {
      queryParams: { id: (this.book() as IBookWithId).id },
    });
  }
  public deleteBook(){
    this.onDeleteEvent.emit(this.book() as IBookWithId);
  }
  public editBook(){
    this.onEditEvent.emit(this.book() as IBookWithId);
  }
}

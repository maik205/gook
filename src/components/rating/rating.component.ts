import { Component, effect, input, model, output, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'rating',
  standalone: true,
  imports: [
    MatIconModule,
    MatSliderModule,
    FormsModule
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent {
  public rating = model<number>(0);
  constructor(){

  }

}

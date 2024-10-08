import { Component, inject, Sanitizer, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BookCardComponent } from '../components/book-card/book-card.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSelectModule } from '@angular/material/select';
import { ThemingService } from '../services/theming.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BookCardComponent,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatTooltipModule,
    RouterModule,
    MatSelectModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  iconRegistry = inject(MatIconRegistry);
  themeService = inject(ThemingService);
  constructor() {
    this.iconRegistry.addSvgIcon('logo', ɵbypassSanitizationTrustResourceUrl('../assets/logo.svg'));
  }

}

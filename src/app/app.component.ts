import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwapiService } from './services/swapi.service';
import { Starship } from './models/starship.model';
import { StarshipGridComponent } from './components/starship-grid/starship-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StarshipGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  starships: Starship[] = [];
  isLoading = true;
  isLoadingMore = false;        // ← manquait
  errorMessage: string | null = null;

  constructor(public swapiService: SwapiService) {}  // ← public pas private

  ngOnInit(): void {
    this.swapiService.loadFirstPage().subscribe({
      next: (ships) => {
        this.starships = ships;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les vaisseaux.';
        this.isLoading = false;
      }
    });
  }

  onLoadMore(): void {          // ← manquait
    if (this.isLoadingMore || !this.swapiService.hasMorePages()) return;

    this.isLoadingMore = true;

    this.swapiService.loadNextPage().subscribe({
      next: (newShips) => {
        if (newShips.length > 0) {
          this.starships = [...this.starships, ...newShips];
        }
        this.isLoadingMore = false;
      },
      error: () => {
        this.isLoadingMore = false;
      }
    });
  }

  retry(): void {               // ← manquait
    this.errorMessage = null;
    this.isLoading = true;
    this.swapiService.reset();
    this.ngOnInit();
  }
}
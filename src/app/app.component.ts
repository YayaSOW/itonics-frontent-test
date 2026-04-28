import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
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
  isLoadingMore = false;
  errorMessage: string | null = null;

  constructor(public swapiService: SwapiService) {}

  ngOnInit(): void {
    this.swapiService.loadFirstPage().subscribe({
      next: (page1) => {
        this.starships = page1;

        if (this.swapiService.hasMorePages()) {
          this.swapiService.loadNextPage().subscribe({
            next: (page2) => {
              this.starships = [...this.starships, ...page2];
              this.isLoading = false;
            },
            error: () => { this.isLoading = false; }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les vaisseaux.';
        this.isLoading = false;
      }
    });
  }

  onLoadMore(): void {
    if (this.isLoadingMore || !this.swapiService.hasMorePages()) return;
    this.isLoadingMore = true;

    this.swapiService.loadNextPage().subscribe({
      next: (newShips) => {
        if (newShips.length > 0) {
          this.starships = [...this.starships, ...newShips];
        }
        this.isLoadingMore = false;
      },
      error: () => { this.isLoadingMore = false; }
    });
  }

  retry(): void {
    this.errorMessage = null;
    this.isLoading = true;
    this.swapiService.reset();
    this.ngOnInit();
  }
}
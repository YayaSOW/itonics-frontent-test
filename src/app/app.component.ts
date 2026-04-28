import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwapiService } from './services/swapi.service';
import { Starship } from './models/starship.model';
import { StarshipGridComponent } from './components/starship-grid/starship-grid.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StarshipGridComponent, SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  allStarships: Starship[] = [];

  starships: Starship[] = [];

  isLoading = true;
  isLoadingMore = false;
  errorMessage: string | null = null;
  searchTerm = '';

  constructor(public swapiService: SwapiService) { }

  ngOnInit(): void {
    this.swapiService.loadFirstPage().subscribe({
      next: (page1) => {
        this.allStarships = page1;
        this.starships = page1;

        if (this.swapiService.hasMorePages()) {
          this.swapiService.loadNextPage().subscribe({
            next: (page2) => {
              this.allStarships = [...this.allStarships, ...page2];
              this.applyFilter();
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

  onSearchChanged(term: string): void {
    this.searchTerm = term;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.searchTerm) {
      this.starships = [...this.allStarships];
      return;
    }
    this.starships = this.allStarships.filter(ship =>
      ship.name.toLowerCase().includes(this.searchTerm)
    );
  }

  onLoadMore(): void {
    if (this.isLoadingMore || !this.swapiService.hasMorePages()) return;
    this.isLoadingMore = true;

    this.swapiService.loadNextPage().subscribe({
      next: (newShips) => {
        if (newShips.length > 0) {
          this.allStarships = [...this.allStarships, ...newShips];
          this.applyFilter();
        }
        this.isLoadingMore = false;
      },
      error: () => { this.isLoadingMore = false; }
    });
  }

  retry(): void {
    this.errorMessage = null;
    this.isLoading = true;
    this.allStarships = [];
    this.starships = [];
    this.swapiService.reset();
    this.ngOnInit();
  }

  get allLoaded(): boolean {
    return !this.isLoading && !this.swapiService.hasMorePages() && this.allStarships.length > 0;
  }
}
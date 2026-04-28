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
  errorMessage: string | null = null;

  constructor(private swapiService: SwapiService) { }

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
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwapiService } from './services/swapi.service';
import { Starship } from './models/starship.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
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
        console.log('✅ Page 1 reçue :', ships.length, 'vaisseaux');
        this.starships = ships;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur :', err);
        this.errorMessage = 'Impossible de charger les vaisseaux.';
        this.isLoading = false;
      }
    });
  }
}
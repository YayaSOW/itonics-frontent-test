import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { SwapiService } from './services/swapi.service';
import { Starship } from './models/starship.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  starships: Starship[] = [];

  constructor(private swapiService: SwapiService) {}

  ngOnInit(): void {
    this.swapiService.getStarships(1).subscribe({
      next: (data) => {
        console.log('SWAPI DATA:', data);
        this.starships = data.results;
      },
      error: (err) => {
        console.error('Erreur API:', err);
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { SwapiService } from './services/swapi.service';
import { Starship } from './models/starship.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  starships: Starship[] = [];
  isLoading: boolean = true; // 
  errorMessage: string | null = null;

  constructor(private swapiService: SwapiService) { }

  ngOnInit(): void {
    this.swapiService.loadFirstPage().subscribe({
      next: (response) => {
        this.swapiService.setNextPageUrl(response.next);
        this.starships = response.results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.errorMessage = 'Failed to load starships. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
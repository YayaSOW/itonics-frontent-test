import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  searchTerm = '';

  @Output() searchChanged = new EventEmitter<string>();

  onInput(): void {
    this.searchChanged.emit(this.searchTerm.trim().toLowerCase());
  }

  clear(): void {
    this.searchTerm = '';
    this.searchChanged.emit('');
  }
}
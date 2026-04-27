import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SwapiResponse } from '../models/starship.model';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  // private baseUrl = 'https://swapi.dev/api/starships/';
  private baseUrl = "https://swapi.py4e.com/api/starships/";

  private nextPageUrl: string | null = null;

  constructor(private http: HttpClient) {}

  loadFirstPage(page: number = 1) : Observable<SwapiResponse> {
    return this.http.get<SwapiResponse>(`${this.baseUrl}?page=${page}`);
  }

  loadNextPage() : Observable<SwapiResponse> {
    if (!this.nextPageUrl) { // 
      throw new Error("No next page available");
    }
    console.log('Loading next page:', this.nextPageUrl);
    return this.http.get<SwapiResponse>(this.nextPageUrl);
  }

  setNextPageUrl(url: string | null) {
    this.nextPageUrl = url;
  }

  hasMorePages(): boolean {
    return this.nextPageUrl !== null;
  }

  reset(): void{
    this.nextPageUrl = null;
  }

}
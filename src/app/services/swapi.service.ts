import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SwapiResponse, Starship } from '../models/starship.model';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  // private baseUrl = 'https://swapi.dev/api/starships/';
  private baseUrl = 'https://swapi.py4e.com/api/starships/';

  private nextPageUrl: string | null = null;
  private currentPageNumber = 1;

  private cache = new Map<number, Starship[]>();

  constructor(private http: HttpClient) { }

  private loadPage(pageNumber: number): Observable<Starship[]> {

    if (this.cache.has(pageNumber)) {
      console.log(`CACHE: page ${pageNumber} déjà disponible`);
      return of(this.cache.get(pageNumber)!);
    }

    const url = `${this.baseUrl}?page=${pageNumber}`;
    console.log(`API: chargement page ${pageNumber}`);

    return this.http.get<SwapiResponse>(url).pipe(
      tap(response => {
        this.cache.set(pageNumber, response.results);
        this.nextPageUrl = response.next;
        this.currentPageNumber = pageNumber + 1;
      }),
      map(response => response.results)
    );
  }

  loadFirstPage(): Observable<Starship[]> {
    this.reset();
    return this.loadPage(1);
  }

  loadNextPage(): Observable<Starship[]> {
    if (!this.nextPageUrl) {
      return of([]);
    }
    return this.loadPage(this.currentPageNumber);
  }

  hasMorePages(): boolean {
    return this.nextPageUrl !== null;
  }

  getAllCachedStarships(): Starship[] {
    const sortedKeys = Array.from(this.cache.keys()).sort((a, b) => a - b);
    const result: Starship[] = [];
    for (const key of sortedKeys) {
      result.push(...this.cache.get(key)!);
    }
    return result;
  }

  reset(): void {
    this.cache.clear();
    this.nextPageUrl = null;
    this.currentPageNumber = 1;
  }
}
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

  constructor(private http: HttpClient) {}

  getStarships(page: number = 1) : Observable<SwapiResponse> {
    return this.http.get<SwapiResponse>(`${this.baseUrl}?page=${page}`);
  }
}
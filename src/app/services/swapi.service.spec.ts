/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SwapiService } from './swapi.service';
import { SwapiResponse } from '../models/starship.model';

const mockPage1: SwapiResponse = {
  count: 20,
  next: 'https://swapi.py4e.com/api/starships/?page=2',
  previous: null,
  results: [
    {
      name: 'Millennium Falcon', model: 'YT-1300', manufacturer: 'Corellian',
      cost_in_credits: '100000', length: '34', max_atmosphering_speed: '1050',
      crew: '4', passengers: '6', hyperdrive_rating: '0.5',
      starship_class: 'freighter', films: [],
      url: 'https://swapi.py4e.com/api/starships/10/'
    }
  ]
};

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SwapiService]
    });
    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load page 1 and detect next page exists', () => {
    service.loadFirstPage().subscribe(ships => {
      expect(ships.length).toBe(1);
      expect(ships[0].name).toBe('Millennium Falcon');
      expect(service.hasMorePages()).toBeTrue();
    });

    const req = httpMock.expectOne('https://swapi.py4e.com/api/starships/?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage1);
  });

  it('should cache page 1 data after first load', () => {
    service.loadFirstPage().subscribe();
    httpMock.expectOne('https://swapi.py4e.com/api/starships/?page=1').flush(mockPage1);

    const cached = service.getAllCachedStarships();
    expect(cached.length).toBe(1);
    expect(cached[0].name).toBe('Millennium Falcon');

    httpMock.expectNone('https://swapi.py4e.com/api/starships/?page=2');
  });
});
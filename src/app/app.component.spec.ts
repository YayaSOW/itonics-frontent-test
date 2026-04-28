import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should filter starships by name', () => {

    component.allStarships = [
      { name: 'Millennium Falcon', model: 'YT-1300', manufacturer: '',
        cost_in_credits: '', length: '', max_atmosphering_speed: '',
        crew: '', passengers: '', hyperdrive_rating: '',
        starship_class: '', films: [], url: '1' },
      { name: 'X-wing', model: 'T-65', manufacturer: '',
        cost_in_credits: '', length: '', max_atmosphering_speed: '',
        crew: '', passengers: '', hyperdrive_rating: '',
        starship_class: '', films: [], url: '2' },
    ];

    component.onSearchChanged('falcon');

    expect(component.starships.length).toBe(1);
    expect(component.starships[0].name).toBe('Millennium Falcon');
  });

  it('should return allLoaded true when no more pages', () => {

    component.allStarships = [
      { name: 'X-wing', model: '', manufacturer: '', cost_in_credits: '',
        length: '', max_atmosphering_speed: '', crew: '', passengers: '',
        hyperdrive_rating: '', starship_class: '', films: [], url: '1' }
    ];

    component.isLoading = false;
    spyOn(component.swapiService, 'hasMorePages').and.returnValue(false);

    expect(component.allLoaded).toBeTrue();
  });
});
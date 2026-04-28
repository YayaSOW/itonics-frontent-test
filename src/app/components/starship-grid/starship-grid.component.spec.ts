import { TestBed } from '@angular/core/testing';
import { StarshipGridComponent } from './starship-grid.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StarshipGridComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StarshipGridComponent,
        HttpClientTestingModule
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StarshipGridComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
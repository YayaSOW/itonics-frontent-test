import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  BodyScrollEndEvent,
  CellValueChangedEvent,
  themeQuartz
} from 'ag-grid-community';
import { Starship } from '../../models/starship.model';
import { SwapiService } from '../../services/swapi.service';

@Component({
  selector: 'app-starship-grid',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './starship-grid.component.html',
  styleUrl: './starship-grid.component.css'
})
export class StarshipGridComponent {

  @Input() starships: Starship[] = [];
  @Input() hasMore = true;
  @Output() loadMore = new EventEmitter<void>();

  theme = themeQuartz;

  constructor(private swapiService: SwapiService) { }

  colDefs: ColDef[] = [
    { field: 'name', headerName: 'Name', resizable: true, minWidth: 180 },
    { field: 'model', headerName: 'Model', resizable: true, minWidth: 180 },
    { field: 'manufacturer', headerName: 'Manufacturer', resizable: true, minWidth: 200 },
    { field: 'starship_class', headerName: 'Class', resizable: true, minWidth: 140 },
    {
      field: 'crew',
      headerName: 'Crew',
      resizable: true,
      minWidth: 100,
      editable: true,
      cellStyle: { backgroundColor: '#fffbeb' },
    },
    { field: 'passengers', headerName: 'Passengers', resizable: true, minWidth: 120 },
    { field: 'hyperdrive_rating', headerName: 'Hyperdrive', resizable: true, minWidth: 120 },
    { field: 'length', headerName: 'Length (m)', resizable: true, minWidth: 120 },
    { field: 'max_atmosphering_speed', headerName: 'Max Speed', resizable: true, minWidth: 120 },
    { field: 'cost_in_credits', headerName: 'Cost (credits)', resizable: true, minWidth: 140 },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    editable: false,
  };

  onCellValueChanged(event: CellValueChangedEvent): void {
    const starship = event.data as Starship;
    const field = event.colDef.field as keyof Starship;
    const newValue = event.newValue;

    this.swapiService.saveEdit(starship.url, field, newValue);
  }

  onBodyScrollEnd(event: BodyScrollEndEvent): void {
    if (event.direction !== 'vertical') return;
    if (!this.hasMore) return;
    this.loadMore.emit();
  }
}
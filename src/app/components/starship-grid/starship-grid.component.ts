import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, BodyScrollEndEvent, themeQuartz } from 'ag-grid-community';
import { Starship } from '../../models/starship.model';

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

  colDefs: ColDef[] = [
    { field: 'name',                   headerName: 'Name',           resizable: true, minWidth: 200, flex: 2 },
    { field: 'model',                  headerName: 'Model',          resizable: true, minWidth: 180, flex: 1 },
    { field: 'manufacturer',           headerName: 'Manufacturer',   resizable: true, minWidth: 200, flex: 1 },
    { field: 'starship_class',         headerName: 'Class',          resizable: true, minWidth: 150, flex: 1 },
    { field: 'crew',                   headerName: 'Crew',           resizable: true, minWidth: 120, flex: 1 },
    { field: 'passengers',             headerName: 'Passengers',     resizable: true, minWidth: 120, flex: 1 },
    { field: 'hyperdrive_rating',      headerName: 'Hyperdrive',     resizable: true, minWidth: 120, flex: 1 },
    { field: 'length',                 headerName: 'Length (m)',     resizable: true, minWidth: 130, flex: 1 },
    { field: 'max_atmosphering_speed', headerName: 'Max Speed',      resizable: true, minWidth: 130, flex: 1 },
    { field: 'cost_in_credits',        headerName: 'Cost (credits)', resizable: true, minWidth: 150, flex: 1 },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
  };

  onBodyScrollEnd(event: BodyScrollEndEvent): void {
    if (event.direction !== 'vertical') return;
    if (!this.hasMore) return;
    this.loadMore.emit();
  }
}
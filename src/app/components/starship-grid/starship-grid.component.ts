import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { Starship } from '../../models/starship.model';

@Component({
  selector: 'app-starship-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './starship-grid.component.html',
  styleUrl: './starship-grid.component.css'
})
export class StarshipGridComponent {

  @Input() starships: Starship[] = [];

  colDefs: ColDef[] = [
    { field: 'name',                  headerName: 'Nom',            resizable: true, minWidth: 200 },
    { field: 'model',                 headerName: 'Modèle',         resizable: true, minWidth: 200 },
    { field: 'manufacturer',          headerName: 'Fabricant',      resizable: true, minWidth: 200 },
    { field: 'starship_class',        headerName: 'Classe',         resizable: true, minWidth: 150 },
    { field: 'crew',                  headerName: 'Équipage',       resizable: true, minWidth: 120 },
    { field: 'passengers',            headerName: 'Passagers',      resizable: true, minWidth: 120 },
    { field: 'hyperdrive_rating',     headerName: 'Hyperdrive',     resizable: true, minWidth: 120 },
    { field: 'length',                headerName: 'Longueur (m)',   resizable: true, minWidth: 130 },
    { field: 'max_atmosphering_speed',headerName: 'Vitesse max',    resizable: true, minWidth: 130 },
    { field: 'cost_in_credits',       headerName: 'Coût (crédits)', resizable: true, minWidth: 150 },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
  };
}
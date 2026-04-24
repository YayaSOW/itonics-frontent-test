import { Component } from '@angular/core';
import {AgGridModule} from "ag-grid-angular";

@Component({
  selector: 'app-root',
  imports: [
    AgGridModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'itonics-test';
}

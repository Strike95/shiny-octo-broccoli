import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'currency';
}

@Component({
  selector: 'ds-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  imports: [DecimalPipe]
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title?: string;

  getValue(row: any, key: string): any {
    return row[key] ?? '-';
  }
}

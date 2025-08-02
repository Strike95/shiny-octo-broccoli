import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DataTableComponent, TableColumn } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data and columns', () => {
    expect(component.data).toEqual([]);
    expect(component.columns).toEqual([]);
  });

  it('should accept data input', () => {
    const testData = [{ id: 1, name: 'Test' }];
    component.data = testData;
    expect(component.data).toEqual(testData);
  });

  it('should accept columns input', () => {
    const testColumns: TableColumn[] = [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'name', label: 'Name', type: 'text' }
    ];
    component.columns = testColumns;
    expect(component.columns).toEqual(testColumns);
  });

  it('should set title when provided', () => {
    const title = 'Test Table';
    component.title = title;
    expect(component.title).toBe(title);
  });

  it('should return value from row when key exists', () => {
    const row = { id: 1, name: 'Test' };
    expect(component.getValue(row, 'id')).toBe(1);
    expect(component.getValue(row, 'name')).toBe('Test');
  });

  it('should return dash when key does not exist', () => {
    const row = { id: 1 };
    expect(component.getValue(row, 'nonexistent')).toBe('-');
  });

  it('should return dash for null or undefined values', () => {
    const row = { nullValue: null, undefinedValue: undefined };
    expect(component.getValue(row, 'nullValue')).toBe('-');
    expect(component.getValue(row, 'undefinedValue')).toBe('-');
  });
});

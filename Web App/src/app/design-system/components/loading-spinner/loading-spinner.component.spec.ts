import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default message', () => {
    expect(component.message).toBe('Loading...');
  });

  it('should have default height', () => {
    expect(component.height).toBe(200);
  });

  it('should have default spinner class', () => {
    expect(component.spinnerClass).toBe('text-primary');
  });

  it('should not show message by default', () => {
    expect(component.showMessage).toBe(false);
  });

  it('should allow setting custom message', () => {
    const customMessage = 'Custom loading message';
    component.message = customMessage;
    expect(component.message).toBe(customMessage);
  });

  it('should allow setting custom height', () => {
    const customHeight = 300;
    component.height = customHeight;
    expect(component.height).toBe(customHeight);
  });

  it('should allow setting custom spinner class', () => {
    const customClass = 'text-success';
    component.spinnerClass = customClass;
    expect(component.spinnerClass).toBe(customClass);
  });

  it('should allow showing message', () => {
    component.showMessage = true;
    expect(component.showMessage).toBe(true);
  });
});

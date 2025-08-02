import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default error message', () => {
    expect(component.message).toBe('An error occurred');
  });

  it('should not have details by default', () => {
    expect(component.details).toBeUndefined();
  });

  it('should allow setting custom message', () => {
    const customMessage = 'Custom error message';
    component.message = customMessage;
    expect(component.message).toBe(customMessage);
  });

  it('should allow setting details', () => {
    const details = 'Error details information';
    component.details = details;
    expect(component.details).toBe(details);
  });
});

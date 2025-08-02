import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title when provided', () => {
    const title = 'Test Card Title';
    component.title = title;
    expect(component.title).toBe(title);
  });

  it('should set cardClass when provided', () => {
    const cardClass = 'custom-card-class';
    component.cardClass = cardClass;
    expect(component.cardClass).toBe(cardClass);
  });

  it('should set hasFooter to false by default', () => {
    expect(component.hasFooter).toBe(false);
  });

  it('should allow setting hasFooter to true', () => {
    component.hasFooter = true;
    expect(component.hasFooter).toBe(true);
  });
});

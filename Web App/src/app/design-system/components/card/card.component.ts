import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ds-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  imports: [NgClass]
})
export class CardComponent {
  @Input() title?: string;
  @Input() cardClass?: string;
  @Input() hasFooter = false;
}

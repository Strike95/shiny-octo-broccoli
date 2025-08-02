import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ds-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  imports: [NgClass]
})
export class LoadingSpinnerComponent {
  @Input() message = 'Loading...';
  @Input() height = 200;
  @Input() spinnerClass = 'text-primary';
  @Input() showMessage = false;
}

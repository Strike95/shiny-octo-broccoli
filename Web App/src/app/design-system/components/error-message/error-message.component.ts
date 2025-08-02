import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-error-message',
  standalone: true,
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
  imports: []
})
export class ErrorMessageComponent {
  @Input() message = 'An error occurred';
  @Input() details?: string;
}

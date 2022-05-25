import { Component } from '@angular/core';
import { DataService } from './app-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  authToken = '';

  constructor(private dataService: DataService) {}

  updateAuthToken() {
    this.dataService.updateAuthToken(this.authToken);
  }
}

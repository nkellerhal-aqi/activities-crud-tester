import { Component } from '@angular/core';
import { DataService, Environment } from './app-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  authToken = '';
  environment = Environment.feature;

  constructor(private dataService: DataService) {}

  updateAuthToken() {
    this.dataService.updateAuthToken(this.authToken);
  }

  updateEnvironment() {
    this.dataService.updateEnvironment(this.environment);
  }
}

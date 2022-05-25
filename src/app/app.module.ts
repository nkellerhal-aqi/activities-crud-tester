import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GetManyComponent } from './components/get-many/get-many.component';
import { ReturnSummaryComponent } from './components/return-summary/return-summary.component';
import { ActivitySummaryComponent } from './components/activity-summary/activity-summary.component';
import { CreateComponent } from './components/create/create.component';
import { GetByIdComponent } from './components/get-by-id/get-by-id.component';

@NgModule({
  declarations: [AppComponent, GetManyComponent, ReturnSummaryComponent, ActivitySummaryComponent, CreateComponent, GetByIdComponent],
  imports: [AppRoutingModule, BrowserModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

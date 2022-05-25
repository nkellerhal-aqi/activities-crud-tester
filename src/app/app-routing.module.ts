import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetManyComponent } from './components/get-many/get-many.component';

const routes: Routes = [
  {
    path: 'get-many',
    component: GetManyComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'get-many',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'get-many',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

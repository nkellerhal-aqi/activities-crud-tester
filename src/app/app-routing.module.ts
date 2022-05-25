import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { DeleteComponent } from './components/delete/delete.component';
import { GetByIdComponent } from './components/get-by-id/get-by-id.component';
import { GetManyComponent } from './components/get-many/get-many.component';
import { UpdateComponent } from './components/update/update.component';

const routes: Routes = [
  {
    path: 'get-many',
    component: GetManyComponent,
  },
  {
    path: 'get',
    component: GetByIdComponent,
  },
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: 'update',
    component: UpdateComponent,
  },
  {
    path: 'delete',
    component: DeleteComponent,
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

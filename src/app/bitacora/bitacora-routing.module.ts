import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BitacoraPage } from './bitacora.page';

const routes: Routes = [
  {
    path: '',
    component: BitacoraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BitacoraPageRoutingModule {}

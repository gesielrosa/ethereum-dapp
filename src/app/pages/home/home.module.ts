import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { ContractInputModule } from '../../components/contract-input/contract-input.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    RouterModule.forChild([{
      path: '',
      component: HomeComponent
    }]),
    CommonModule,
    FormsModule,
    ContractInputModule
  ]
})
export class HomeModule {
}

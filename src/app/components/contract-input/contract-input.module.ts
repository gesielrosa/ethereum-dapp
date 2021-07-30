import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractInputComponent } from './contract-input.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ContractInputComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        PipesModule
    ],
  exports: [
    ContractInputComponent
  ]
})
export class ContractInputModule {
}

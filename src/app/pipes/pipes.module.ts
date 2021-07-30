import { NgModule } from '@angular/core';

import { PrettyJsonPipe } from './pretty-json.pipe';

@NgModule({
  declarations: [PrettyJsonPipe],
  imports: [],
  exports: [PrettyJsonPipe]
})
export class PipesModule {
}

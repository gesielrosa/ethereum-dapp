import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { IABI, SmartContract } from '../../models/smart-contract';

@Component({
  selector: 'app-contract-input',
  templateUrl: './contract-input.component.html',
  styleUrls: ['./contract-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractInputComponent {

  @Input() abi: IABI;

  @Input() contract: SmartContract<any>;

  @Input() account: string;

  public inputs: { [key: string]: any } = {};

  public result: any;

  public loading: boolean = false;

  public error: string;

  constructor(
    private _cdr: ChangeDetectorRef
  ) {
  }

  public async call(): Promise<void> {
    if (this.contract) {
      this.error = null;
      this._cdr.detectChanges();
      this.loading = true;
      const args = [];

      Object.keys(this.inputs).forEach(key => args.push(this.inputs[key]));

      await this.contract.instance[this.abi.name](...args, {from: this.account})
        .then(result => {
          this.result = result;
        })
        .catch(err => {
          this.error = err;
        });

      this.loading = false;
      this._cdr.detectChanges();
    }
  }

}

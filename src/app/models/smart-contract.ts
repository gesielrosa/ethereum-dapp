import { Injector } from '@angular/core';

import { SmartContractService } from '../services/smart-contract.service';
import { JsonObject } from './json';

export interface ITransactionParams {
  from?: string;
  to?: string;
  gas?
  gasPrice?
  value?
  data?
  nonce?
}

export interface ISmartContract {
  address: string;
  abi: IABI[];
}

export interface IABI {
  name: 'approve';
  inputs: {
    internalType: string;
    name: string;
    type: string;
  }[];
  outputs: {
    internalType: string;
    name: string;
    type: string;
  }[];
  type: 'function' | unknown;
  constant: boolean;
  payable: unknown;
  signature: string;
  stateMutability: string;
}

export class SmartContract<T extends ISmartContract> {

  private _smartContractService: SmartContractService;

  public instance: T;

  constructor(
    private _injector: Injector,
    private _contract_artifacts: JsonObject,
    private _address?: string
  ) {
    this._smartContractService = this._injector.get(SmartContractService);
  }

  public async init(): Promise<void> {
    await this._getInstance(this._contract_artifacts);
  }

  private async _getInstance(contract_artifacts: JsonObject): Promise<void> {
    this.instance = await this._smartContractService.getInstance<T>(contract_artifacts, this._address);
  }

}

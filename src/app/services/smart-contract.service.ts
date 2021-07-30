import { Injectable } from '@angular/core';

import { JsonObject } from '../models/json';

declare var Web3: any;

@Injectable({
  providedIn: 'root'
})
export class SmartContractService {

  private _web3: any;

  private _lib: any;

  constructor() {
    this._getLib();
  }

  public init(params: { provider: any }): void {
    this._setupWeb3(params.provider);
  }

  private _setupWeb3(provider: any): void {
    this._web3 = new Web3(provider);
  }

  private _getLib(): any {
    if ((window as any)?.TruffleContract) {
      this._lib = (window as any)?.TruffleContract;
    } else {
      throw new Error('Please install @truffle/contract package');
    }
  }

  async getInstance<T>(contract_artifacts: JsonObject, address: string): Promise<T> {
    const contract = this._lib(contract_artifacts);
    contract.setProvider(this._web3.eth.currentProvider);
    if (address) {
      return await contract.at(address);
    }
    return await contract.deployed();
  }

}

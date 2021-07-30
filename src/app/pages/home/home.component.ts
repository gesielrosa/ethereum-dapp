import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import RHZToken from '../../../assets/contracts/RHZToken.json';
import MCO2Token from '../../../assets/contracts/MCO2Token.json';

import { SmartContractService } from '../../services/smart-contract.service';
import { Chains, MetaMaskService } from '../../services/meta-mask.service';
import { IABI, SmartContract } from '../../models/smart-contract';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

  public infos: any = {};

  public contract: SmartContract<any>;

  public contractAbiCollapsed: boolean = false;

  private _onChainChanges: Subscription;

  private _onAccountsChanges: Subscription;

  constructor(
    private _smartContractService: SmartContractService,
    private _metaMaskService: MetaMaskService,
    private _cdr: ChangeDetectorRef,
    private _injector: Injector
  ) {
  }

  public async ngOnInit() {
    if (this._metaMaskService.isInstalled()) {
      await this.metamaskInfo();
      this._smartContractService.init({provider: this._metaMaskService.getProvider()});

      this._onChainChanges = this._metaMaskService.onChainChanged$.subscribe(() => {
        this.contract = null;
        this.metamaskInfo();
      });
      this._onAccountsChanges = this._metaMaskService.onAccountsChanged$.subscribe(() => {
        this.contract = null;
        this.metamaskInfo();
      });
    }
  }

  public ngOnDestroy(): void {
    this._onChainChanges?.unsubscribe();
    this._onAccountsChanges?.unsubscribe();
  }

  public isInstalled(): boolean {
    return this._metaMaskService.isInstalled();
  }

  public isConnected(): boolean {
    return this._metaMaskService.isConnected();
  }

  public installMetaMask(): void {
    window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
  }

  public async connectMetaMask(): Promise<void> {
    await this._metaMaskService.connect();
    await this.metamaskInfo();
  }

  public async metamaskInfo(): Promise<void> {
    this.infos.currentAccount = await this._metaMaskService.getCurrentAccount();
    this.infos.selectedAccount = await this._metaMaskService.getSelectedAddress();
    this.infos.chainInfo = await this._metaMaskService.getChainInfo();
    this._cdr.detectChanges();
  }

  public async initContract(): Promise<void> {
    const contract_artifacts = {abi: JSON.parse(this.infos.contractAbi)};
    const contract = new SmartContract<any>(this._injector, contract_artifacts, this.infos.contractAddress);
    await contract.init();
    this.contract = contract;
    this.contractAbiCollapsed = true;
    this._cdr.detectChanges();
  }

  get contractWriteFunctions(): IABI[] {
    if (this.contract?.instance) {
      return this.contract.instance?.abi?.filter(abi => abi?.type === 'function' && !abi?.constant);
    }
    return [];
  }

  get contractReadFunctions(): IABI[] {
    if (this.contract?.instance) {
      return this.contract.instance?.abi?.filter(abi => abi?.type === 'function' && abi?.constant);
    }
    return [];
  }

  public toggleContractAbiInput(): void {
    this.contractAbiCollapsed = !this.contractAbiCollapsed;
  }

  public preloadContract(contract: string): void {
    switch (contract) {
      case 'rhz': {
        this.infos.contractAbi = JSON.stringify(RHZToken.abi);
        this.infos.contractAddress = RHZToken.networks['3'].address;
        this.infos.contractChain = 3
        break;
      }
      case 'mco2': {
        this.infos.contractAbi = JSON.stringify(MCO2Token.abi);
        this.infos.contractAddress = MCO2Token.networks['1'].address;
        this.infos.contractChain = 1
        break;
      }
    }
  }

  public getChainName(id: number): string {
    return Chains[`0x${id}`].name;
  }

}

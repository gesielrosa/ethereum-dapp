import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface IRequestArguments {
  method: RPCMethods;
  params?: any[] | object;
}

interface IProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface IProviderMessage {
  type: string;
  data: unknown;
}

type RPCMethods =
  'eth_requestAccounts'
  | 'wallet_getPermissions'
  | 'wallet_requestPermissions'
  | 'eth_decrypt'
  | 'eth_getEncryptionPublicKey'
  | 'wallet_addEthereumChain'
  | 'wallet_switchEthereumChain'
  | 'wallet_registerOnboarding'
  | 'wallet_watchAsset'
  | 'eth_chainId';

interface IChainInfo {
  name: string,
  decimal: number,
  hex: string
}

export const Chains: { [key: string]: IChainInfo } = {
  '0x1': {name: 'Ethereum Main Network', decimal: 1, hex: '0x1'},
  '0x3': {name: 'Ropsten Test Network', decimal: 3, hex: '0x3'},
  '0x4': {name: 'Rinkeby Test Network', decimal: 4, hex: '0x4'},
  '0x5': {name: 'Goerli Test Network', decimal: 5, hex: '0x5'},
  '0x2a': {name: 'Kovan Test Network', decimal: 42, hex: '0x2a'}
}

@Injectable({
  providedIn: 'root'
})
export class MetaMaskService {

  public onAccountsChanged$: Subject<string[]> = new Subject<string[]>();

  public onChainChanged$: Subject<string> = new Subject<string>();

  public onConnect$: Subject<string> = new Subject<string>();

  public onDisconnect$: Subject<IProviderRpcError> = new Subject<IProviderRpcError>();

  public onMessage$: Subject<IProviderMessage> = new Subject<IProviderMessage>();

  private _ethereum: any;

  constructor() {
    this._setProvider();
    this._subscribeEvents();
  }

  private _setProvider(): void {
    this._ethereum = (window as any)?.ethereum;
  }

  private _subscribeEvents(): void {
    if (this.isInstalled()) {
      this._ethereum?.on('accountsChanged', (accounts: string[]) => {
        this.onAccountsChanged$.next(accounts);
      });

      this._ethereum?.on('chainChanged', (chainId: string) => {
        this.onChainChanged$.next(chainId);
      });

      this._ethereum?.on('connect', (info: { chainId: string }) => {
        this.onConnect$.next(info.chainId);
      });

      this._ethereum?.on('disconnect', (error: IProviderRpcError) => {
        this.onDisconnect$.next(error);
      });

      this._ethereum?.on('message', (message: IProviderMessage) => {
        this.onMessage$.next(message);
      });
    }
  }

  public isInstalled(): boolean {
    return !!this._ethereum?.isMetaMask;
  }

  public connect(): Promise<unknown> {
    return this.request({method: 'eth_requestAccounts'});
  }

  public isConnected(): boolean {
    return !!this._ethereum?.selectedAddress;
  }

  public getProvider(): any {
    return this._ethereum;
  }

  public getChainInfo(): Promise<IChainInfo> {
    return this.request({method: 'eth_chainId'})
      .then(chainID => {
        return Chains[chainID];
      });
  }

  public async getCurrentAccount(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (this.isInstalled()) {
        const accounts = await this.request({method: 'eth_requestAccounts'});
        if (accounts && accounts[0]) {
          resolve(accounts[0]);
        }
        resolve(null);
      }
      reject({message: 'MetaMask is not installed!', code: 0} as IProviderRpcError);
    });
  }

  public getSelectedAddress(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isInstalled()) {
        resolve(this._ethereum?.selectedAddress);
      }
      reject({message: 'MetaMask is not installed!', code: 0} as IProviderRpcError);
    });
  }

  public async request(args: IRequestArguments): Promise<any> {
    if (this.isInstalled()) {
      return this._ethereum.request(args);
    }
    return Promise.reject({message: 'MetaMask is not installed!', code: 0} as IProviderRpcError);
  }

}

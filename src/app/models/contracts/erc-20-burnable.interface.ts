export interface IERC20_burnable {
  burn: (amount: number) => Promise<void>;
  burnFrom: (account: string, amount: number) => Promise<void>;
}

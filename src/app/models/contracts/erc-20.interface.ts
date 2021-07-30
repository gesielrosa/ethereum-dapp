export interface IERC20 {
  totalSupply: () => Promise<number>;
  balanceOf: (account: string) => Promise<number>;
  transfer: (recipient: string, amount: number) => Promise<boolean>;
  allowance: (owner: string, spender: string) => Promise<number>;
  approve: (spender: string, amount: number) => Promise<boolean>;
  transferFrom: (sender: string, recipient: string, amount: number) => Promise<boolean>;
  increaseAllowance: (spender: string, addedValue: number) => Promise<boolean>;
  decreaseAllowance: (spender: string, subtractedValue: number) => Promise<boolean>;
}

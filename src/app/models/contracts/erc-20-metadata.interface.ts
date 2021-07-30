export interface IERC20_metadata {
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  decimals: () => Promise<number>;
}

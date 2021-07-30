import { IERC20 } from './erc-20.interface';
import { IERC20_burnable } from './erc-20-burnable.interface';
import { IERC20_metadata } from './erc-20-metadata.interface';
import { ISmartContract } from '../smart-contract';

export interface IRHZToken extends IERC20, IERC20_burnable, IERC20_metadata, ISmartContract {
}

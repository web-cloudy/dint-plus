export interface IWallet {
  data: IWalletBalance;
  code: number;
  message: string;
}

export interface IWalletBalance {
  wallet_balance?: number;
  wallet_address: string;
}

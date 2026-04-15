export type Crypto = {
  symbol: string;
  rate: number;
};

export const CRYPTO_MODES: Crypto[] = [
  { symbol: "btc", rate: 40000 },
  { symbol: "eth", rate: 2500 },
  { symbol: "sol", rate: 120 },
  { symbol: "trx", rate: 0.07 },
  { symbol: "bnb", rate: 350 },
  { symbol: "xrp", rate: 0.5 },
];

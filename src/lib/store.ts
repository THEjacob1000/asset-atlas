import { create } from "zustand";
import { Coin } from "./types";

export type Currency =
  | { symbol: "$"; currency: "USD" }
  | { symbol: "₹"; currency: "INR" }
  | { symbol: "€"; currency: "EUR" }
  | { symbol: "£"; currency: "GBP" }
  | { symbol: "¥"; currency: "JPY" }
  | { symbol: "$"; currency: "AUD" };
export type Currencies = Currency[];

interface CryptoState {
  currency: Currency;
  changeCurrency: (newCurr: Currency) => void;
  cryptoData: Coin[];
  changeCryptoData: (newData: Coin[]) => void;
  cryptoDataLoading: boolean;
  changeCryptoDataLoading: (loading: boolean) => void;
}

export const useCryptoStore = create<CryptoState>()((set) => ({
  currency: { symbol: "$", currency: "USD" },
  changeCurrency: (newCurr) => set(() => ({ currency: newCurr })),
  cryptoData: [],
  changeCryptoData: (newData) => set(() => ({ cryptoData: newData })),
  cryptoDataLoading: true,
  changeCryptoDataLoading: (loading) =>
    set(() => ({ cryptoDataLoading: loading })),
}));

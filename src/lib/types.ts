export type Currency =
  | { symbol: "$"; currency: "USD" }
  | { symbol: "₹"; currency: "INR" }
  | { symbol: "€"; currency: "EUR" }
  | { symbol: "£"; currency: "GBP" }
  | { symbol: "¥"; currency: "JPY" }
  | { symbol: "$"; currency: "AUD" };

export type Coin = {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_24h: number;
  price_change_percentage_24h_in_currency: number;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  sparkline_in_7d: {
    price: number[];
  };
  symbol: string;
  total_supply: number;
  total_volume: number;
};

export type CoinData = {
  _id: string;
  id: string;
  additional_notices: any[];
  asset_platform_id: null | string;
  block_time_in_minutes: number;
  categories: string[];
  community_data: {
    [key: string]: any;
  };
  country_origin: string;
  description: {
    [language: string]: string;
  };
  detail_platforms: {
    [key: string]: any;
  };
  genesis_date: string;
  hashing_algorithm: string;
  image: {
    [key: string]: string;
  };
  lastUpdate: Date | string;
  last_updated: string;
  links: {
    [key: string]: any;
  };
  market_cap_rank: number;
  market_data: {
    [key: string]: any;
  };
  name: string;
  platforms: {
    [key: string]: string | null;
  };
  preview_listing: boolean;
  public_notice: null | string;
  sentiment_votes_down_percentage: number;
  sentiment_votes_up_percentage: number;
  status_updates: any[];
  symbol: string;
  watchlist_portfolio_users: number;
  web_slug: string;
};

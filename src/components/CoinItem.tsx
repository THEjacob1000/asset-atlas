import { useCryptoStore } from "@/lib/store";
import { Coin } from "@/lib/types";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { compressNumber } from "@/lib/utils";
import Sparkline from "./Sparkline";

interface CoinItemProps {
  coin: Coin;
  timeframe: number;
}

const CoinItem = ({ coin, timeframe }: CoinItemProps) => {
  const currency = useCryptoStore((state) => state.currency);
  const currencies = {
    USD: 1,
    INR: 83.12,
    EUR: 0.93,
    GBP: 0.8,
    JPY: 148.66,
    AUD: 1.54,
  };
  const timeframeReference = [
    coin.price_change_percentage_1h_in_currency,
    coin.price_change_percentage_7d_in_currency,
    coin.price_change_percentage_24h_in_currency,
  ];

  return (
    <div className="w-full justify-between py-10 outline outline-1 outline-border px-4 lg:grid-cols-12 grid grid-cols-7 lg:gap-3">
      <div className="lg:block hidden">{coin.market_cap_rank}</div>
      <div className="inline-flex gap-4 justify-start items-center lg:col-span-2">
        <Image
          src={coin.image}
          alt={coin.name}
          width={30}
          height={30}
          className="w-12 h-12 lg:w-8 lg:h-8 rounded-full"
        />
        <div className="lg:block hidden">
          {coin.name + " (" + coin.symbol.toLocaleUpperCase() + ")"}
        </div>
      </div>

      <div className="lg:hidden flex flex-col justify-center items-center col-span-2">
        <div>{coin.symbol.toLocaleUpperCase()}</div>
        <div className="text-muted-foreground">{coin.name}</div>
      </div>
      <div className="lg:block hidden">
        {currency.symbol +
          (
            coin.current_price * currencies[currency.currency]
          ).toFixed(2)}
      </div>
      <div className="lg:flex items-center justify-start space-x-1 hidden">
        <div
          className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] ${
            coin.price_change_percentage_1h_in_currency
              ? "border-b-rose-500 rotate-180"
              : "border-b-cyan-400"
          } inline-block`}
        />
        <div
          className={
            coin.price_change_percentage_1h_in_currency
              ? "text-rose-500"
              : "text-cyan-400"
          }
        >
          {coin.price_change_percentage_1h_in_currency
            ? coin.price_change_percentage_1h_in_currency.toFixed(2)
            : 0}
          %
        </div>
      </div>
      <div className="lg:flex items-center justify-start space-x-1 hidden">
        <div
          className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] ${
            coin.price_change_percentage_24h_in_currency
              ? "border-b-rose-500 rotate-180"
              : "border-b-cyan-400"
          } inline-block`}
        />
        <div
          className={
            coin.price_change_percentage_24h_in_currency
              ? "text-rose-500"
              : "text-cyan-400"
          }
        >
          {coin.price_change_percentage_24h_in_currency
            ? coin.price_change_percentage_24h_in_currency.toFixed(2)
            : 0}
          %
        </div>
      </div>
      <div className="lg:flex items-center justify-start space-x-1 hidden">
        <div
          className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] ${
            coin.price_change_percentage_7d_in_currency
              ? "border-b-rose-500 rotate-180"
              : "border-b-cyan-400"
          } inline-block`}
        />
        <div
          className={
            coin.price_change_percentage_7d_in_currency
              ? "text-rose-500"
              : "text-cyan-400"
          }
        >
          {coin.price_change_percentage_7d_in_currency
            ? coin.price_change_percentage_7d_in_currency.toFixed(2)
            : 0}
          %
        </div>
      </div>
      <div className="col-span-2 px-4 lg:flex flex-col hidden">
        <div className="flex justify-between">
          <div>
            {currency.symbol +
              compressNumber(
                coin.total_volume * currencies[currency.currency]
              )}
          </div>
          <div>
            {currency.symbol +
              compressNumber(
                coin.market_cap * currencies[currency.currency]
              )}
          </div>
        </div>
        <Progress
          value={(coin.total_volume / coin.market_cap) * 100}
        />
      </div>
      <div className="col-span-2 px-6 lg:flex flex-col hidden">
        <div className="flex justify-between">
          <div>
            {currency.symbol +
              compressNumber(
                coin.circulating_supply *
                  currencies[currency.currency]
              )}
          </div>
          <div>
            {currency.symbol +
              compressNumber(
                coin.total_volume * currencies[currency.currency]
              )}
          </div>
        </div>
        <Progress
          value={(coin.circulating_supply / coin.total_supply) * 100}
        />
      </div>
      <div className="px-2 w-full col-span-2 lg:col-span-1">
        <Sparkline
          coinName={coin.name}
          lastWeekData={coin.sparkline_in_7d.price}
        />
      </div>
      <div className="flex lg:hidden flex-col text-2xl items-center justify-center col-span-2">
        <div>
          {currency.symbol +
            (
              coin.current_price * currencies[currency.currency]
            ).toLocaleString()}
        </div>
        <div className="flex gap-1">
          <div
            className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] mt-2 ${
              timeframeReference[timeframe]
                ? "border-b-rose-500 rotate-180"
                : "border-b-cyan-400"
            } inline-block`}
          />
          <div
            className={
              timeframeReference[timeframe]
                ? "text-rose-500"
                : "text-cyan-400"
            }
          >
            {timeframeReference[timeframe]
              ? timeframeReference[timeframe].toFixed(2)
              : 0}
            %
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinItem;

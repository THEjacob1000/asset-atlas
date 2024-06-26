import { useState } from "react";
import { useCryptoStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Coin, Currency } from "@/lib/types";

type CoinCardProps = {
  coin: Coin;
};
const CoinCard = ({ coin }: CoinCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const selectedCoins = useCryptoStore((state) => state.selectedCoin);
  const changeSelectedCoin = useCryptoStore(
    (state) => state.changeSelectedCoin
  );
  const currencies = {
    USD: 1,
    INR: 83.12,
    EUR: 0.93,
    GBP: 0.8,
    JPY: 148.66,
    AUD: 1.54,
  };
  const selectedCurrency = useCryptoStore(
    (state) => state.currency
  ) as Currency;
  const currency = currencies[selectedCurrency.currency];
  const isSelected = selectedCoins.includes(coin.id);

  const toggleSelected = () => {
    try {
      changeSelectedCoin(coin.id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };
  return (
    <Button
      variant={isSelected ? "default" : "secondary"}
      className={cn(
        "flex justify-center h-20 w-full p-4 rounded-md md:gap-4 gap-2 font-['Space Grotesk']",
        !isSelected && "bg-secondary/40"
      )}
      onClick={toggleSelected}
    >
      <Image
        src={coin.image}
        alt={coin.id}
        width={50}
        height={50}
        className="h-10 w-10"
      />
      <div className="md:flex flex-col hidden">
        <div className="flex items-center gap-2">
          <div className="truncate max-w-24 inline-block whitespace-nowrap">
            {coin.name}
          </div>
          <div>
            (<span className="uppercase">{coin.symbol}</span>)
          </div>
        </div>
        <div className="inline-flex">
          <div>
            {Math.floor(coin.current_price * currency * 1000) / 1000}{" "}
            {selectedCurrency.currency}
          </div>
          <div className="h-4 justify-start items-start gap-1 inline-flex ml-3 mt-1">
            <div
              className={cn(
                "w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-cyan-400 inline-block mt-1",
                coin.price_change_percentage_24h < 0
                  ? "rotate-180 border-b-rose-500"
                  : "border-b-cyan-400"
              )}
            />
            <div
              className={cn(
                "text-right text-sm font-normal font-['Space Grotesk'] leading-none",
                coin.price_change_percentage_24h < 0
                  ? "text-rose-500"
                  : "text-cyan-400"
              )}
            >
              {coin.price_change_percentage_24h
                ? coin.price_change_percentage_24h.toFixed(2)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>
      <div className="text-xl uppercase md:hidden">{coin.symbol}</div>
    </Button>
  );
};

export default CoinCard;

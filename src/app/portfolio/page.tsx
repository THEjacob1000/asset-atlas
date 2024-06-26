"use client";

import { useCryptoStore } from "@/lib/store";
import axios from "axios";

import { useEffect, useState } from "react";
import CoinForm from "@/components/CoinForm";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { Coin } from "@/lib/types";
import PortfolioCoin from "@/components/PortfolioCoin";
import PortfolioCoinMobile from "@/components/PortfolioCoinMobile";

export type ValueAtBuy = {
  usd: number;
  eur: number;
  aud: number;
  inr: number;
  gbp: number;
  jpy: number;
};

export type PortfolioData = {
  coin: Coin;
  amountOwned: number;
  dateAdded: string;
  valueAtBuy: ValueAtBuy;
};

const Page = () => {
  const [portfolioCoins, setPortfolioCoins] = useState<
    PortfolioData[]
  >([]);
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get("/api/getPortfolio");
        const data = response.data;
        setPortfolioCoins(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPortfolio();
  }, []);

  if (!cryptoData) return null;

  return (
    <div className="w-full flex flex-col px-12 md:px-24">
      <div className="flex justify-between items-center w-11/12 mx-auto">
        <div className="text-xl">Portfolio</div>
        <CoinForm cryptoData={cryptoData} />
      </div>
      <div className="flex flex-col justify-center items-center w-full mt-6 mb-32">
        {portfolioCoins &&
          portfolioCoins.map((coin, index) => {
            if (!coin) return null;
            return (
              <div key={index} className="m-4 w-11/12">
                <PortfolioCoin portData={coin} />
                <PortfolioCoinMobile portData={coin} />
              </div>
            );
          })}
      </div>
      {portfolioCoins.length > 2 && (
        <div className="w-full flex justify-center items-center mb-8">
          <Button
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex flex-col h-12"
            variant={"outline"}
          >
            <ChevronUp />
            Back to top
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;

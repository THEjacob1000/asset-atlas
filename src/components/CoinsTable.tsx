import { useState } from "react";
import { Coin } from "@/lib/types";
import axios from "axios";
import MaxWidthWrapper from "./MaxWidthWrapper";
import InfiniteScroll from "react-infinite-scroll-component";
import CoinItem from "./CoinItem";
import { useCryptoStore } from "@/lib/store";
import { Button } from "./ui/button";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import Image from "next/image";

type sortType =
  | "rank"
  | "name"
  | "price"
  | "1hr"
  | "24hr"
  | "7d"
  | "";

const CoinsTable = () => {
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const [coins, setCoins] = useState<Coin[]>(cryptoData.slice(0, 20));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(1000);
  const [page, setPage] = useState(1);
  const [mobileActive, setMobileActive] = useState(0);
  const [sortType, setSortType] = useState<sortType>("rank");
  const [toggle, setToggle] = useState(false);

  const fetchCoins = async () => {
    setLoading(true);
    const newCoins = [
      ...coins,
      ...cryptoData.slice(page * 20, page * 20 + 20),
    ] as Coin[];
    setPage(page + 1);
    if (newCoins.length >= count) {
      setHasMore(false);
    }
    setCoins(newCoins);
    setLoading(false);
  };
  const setSort = (sort: sortType) => {
    let sortedCoins = [...cryptoData];
    setToggle(sort === sortType);
    switch (sort) {
      case "rank":
        sortedCoins = sortedCoins.sort(
          (a, b) => a.market_cap_rank - b.market_cap_rank
        );
        break;
      case "name":
        sortedCoins = sortedCoins.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case "price":
        sortedCoins = sortedCoins.sort(
          (a, b) => a.current_price - b.current_price
        );
        break;
      case "1hr":
        sortedCoins = sortedCoins.sort(
          (a, b) =>
            a.price_change_percentage_1h_in_currency -
            b.price_change_percentage_1h_in_currency
        );
        break;
      case "24hr":
        sortedCoins = sortedCoins.sort(
          (a, b) =>
            a.price_change_percentage_24h_in_currency -
            b.price_change_percentage_24h_in_currency
        );
        break;
      case "7d":
        sortedCoins = sortedCoins.sort(
          (a, b) =>
            a.price_change_percentage_7d_in_currency -
            b.price_change_percentage_7d_in_currency
        );
        break;
      default:
        sortedCoins = sortedCoins.sort(
          (a, b) => a.market_cap_rank - b.market_cap_rank
        );
        break;
    }
    setSortType(sort);
    if (toggle) {
      sortedCoins.reverse();
    }
    setCoins([...sortedCoins.slice(0, page * 20 + 20)]);
  };

  const timeSliderPosition =
    mobileActive === 0
      ? "left-0"
      : `left-full translate-x-[-${(3 - mobileActive) * 100}%]`;
  const timeframes = ["1H", "1D", "7D"];
  if (!coins) return <h1>Loading...</h1>;
  return (
    <div className="flex flex-col justify-between min-w-full mt-8 items-center lg:px-8 px-1">
      <div className="w-full flex justify-between px-12 items-center lg:hidden">
        <h2 className="text-lg font-semibold mb-5">
          Market Overview
        </h2>
        <div className="relative w-1/2 h-16 p-1 bg-card/70 rounded-md gap-1 mb-8">
          <div className="relative w-11/12 h-10 m-2 bg-card rounded-md flex items-center gap-1 overflow-hidden">
            <div
              className={`absolute top-0 ${timeSliderPosition} h-full w-1/3 bg-primary transition-all duration-300 ease-in-out rounded-md`}
              aria-hidden="true"
            ></div>
            {timeframes.map((tf, index) => (
              <button
                key={tf}
                className={`relative w-full font-semibold z-10 ${
                  index === mobileActive
                    ? "text-primary-foreground"
                    : ""
                }`}
                onClick={() => setMobileActive(index)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full">
        <InfiniteScroll
          dataLength={coins.length}
          next={fetchCoins}
          hasMore={hasMore}
          loader={
            <Image
              src="/loading.svg"
              alt="loading"
              width={50}
              height={50}
              className="animate-spin"
            />
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          className="w-full p-0 outline outline-1 outline-border rounded-lg"
        >
          <div className="justify-between px-4 grid-cols-12 lg:grid hidden text-muted-foreground gap-3">
            <Button
              variant={"ghost"}
              className="lg:block text-start inline-flex justify-around"
              onClick={() => setSort("rank")}
            >
              #{" "}
              {sortType === "rank" ? (
                toggle ? (
                  <ArrowUpNarrowWide className="lg:inline h-4 w-4" />
                ) : (
                  <ArrowDownNarrowWide className="lg:inline h-4 w-4" />
                )
              ) : (
                ""
              )}
            </Button>
            <Button
              variant={"ghost"}
              className="lg:block col-span-2 text-start"
              onClick={() => setSort("name")}
            >
              Name
              {sortType === "name" ? (
                toggle ? (
                  <ArrowUpNarrowWide className="lg:inline h-4 w-4" />
                ) : (
                  <ArrowDownNarrowWide className="lg:inline h-4 w-4" />
                )
              ) : (
                ""
              )}
            </Button>
            <Button
              variant={"ghost"}
              className="lg:block text-start"
              onClick={() => setSort("price")}
            >
              Price
              {sortType === "price" ? (
                toggle ? (
                  <ArrowUpNarrowWide className="lg:inline h-4 w-4" />
                ) : (
                  <ArrowDownNarrowWide className="lg:inline h-4 w-4" />
                )
              ) : (
                ""
              )}
            </Button>
            <Button
              variant={"ghost"}
              className="lg:block text-start"
              onClick={() => setSort("1hr")}
            >
              1hr%
              {sortType === "1hr" ? (
                toggle ? (
                  <ArrowUpNarrowWide className="lg:inline h-4 w-4" />
                ) : (
                  <ArrowDownNarrowWide className="lg:inline h-4 w-4" />
                )
              ) : (
                ""
              )}
            </Button>
            <Button
              variant={"ghost"}
              className="lg:block text-start"
              onClick={() => setSort("24hr")}
            >
              24hr%
              {sortType === "24hr" ? (
                toggle ? (
                  <ArrowUpNarrowWide className="lg:inline h-4 w-4" />
                ) : (
                  <ArrowDownNarrowWide className="lg:inline h-4 w-4" />
                )
              ) : (
                ""
              )}
            </Button>
            <Button
              variant={"ghost"}
              className="lg:block text-start"
              onClick={() => setSort("7d")}
            >
              7d%
              {sortType === "7d" ? (
                toggle ? (
                  <ArrowUpNarrowWide className="lg:inline h-4 w-4" />
                ) : (
                  <ArrowDownNarrowWide className="lg:inline h-4 w-4" />
                )
              ) : (
                ""
              )}
            </Button>
            <div className="lg:flex items-center justify-center rounded-md text-sm font-medium py-2 col-span-2 text-start">
              24h Volume / Market Cap
            </div>
            <div className="lg:flex items-center justify-center rounded-md text-sm font-medium py-2 col-span-2 text-start">
              Circulating / Total Supply
            </div>
            <div className="lg:flex items-center justify-center rounded-md text-sm font-medium py-2 text-start">
              Last 7d
            </div>
          </div>
          {coins.map((coin: Coin) => (
            <CoinItem
              key={coin.id}
              coin={coin}
              timeframe={mobileActive}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default CoinsTable;

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import useClosePopover from "@/hooks/closePopover";
import useMediaQuery from "@/hooks/use-media-query";
import { Button } from "./ui/button";
import { useCryptoStore } from "@/lib/store";
import { Coin } from "@/lib/types";
import Image from "next/image";
import { capitalizeWords } from "@/lib/utils";
import Link from "next/link";

type Func = (...args: any[]) => any;

function throttle(func: Func, limit: number): Func {
  let lastFunc: number;
  let lastRan: number | null = null;
  return function (this: any, ...args: any[]): void {
    const context = this;
    if (lastRan === null) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(() => {
        if (Date.now() - (lastRan ?? 0) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - (lastRan ?? 0)));
    }
  };
}

const Searchbar = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const triggerRef = useRef(null);
  const coins: Coin[] = cryptoData;
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  useClosePopover(triggerRef, setOpen);

  const throttledScroll = useCallback((nextIndex: number) => {
    throttle(() => {
      itemRefs.current[nextIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100)();
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      let nextIndex = selectedIndex;
      const itemCount = value
        ? coins.filter((coin) =>
            coin.id.toLowerCase().includes(value.toLowerCase())
          ).length
        : coins.length;

      if (e.key === "ArrowDown") {
        // Prevent wrapping to the first item if at the last index
        if (selectedIndex < itemCount - 1) {
          nextIndex = selectedIndex + 1;
          setSelectedIndex(nextIndex);
        }
      } else if (e.key === "ArrowUp") {
        // Prevent wrapping to the last item if at the first index
        if (selectedIndex > 0) {
          nextIndex = selectedIndex - 1;
          setSelectedIndex(nextIndex);
        }
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        const filteredCoins = value
          ? coins.filter((coin) =>
              coin.id.toLowerCase().includes(value.toLowerCase())
            )
          : coins;
        const selectedCoin = filteredCoins[selectedIndex];
        if (selectedCoin) {
          window.location.href = `/coins/${selectedCoin.id}`;
        }
      }

      // Scroll the newly selected item into view if the index was changed
      if (
        nextIndex !== selectedIndex &&
        (e.key === "ArrowDown" || e.key === "ArrowUp")
      ) {
        itemRefs.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
      if (
        nextIndex !== selectedIndex &&
        (e.key === "ArrowDown" || e.key === "ArrowUp")
      ) {
        throttledScroll(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, selectedIndex, coins, value, throttledScroll]);

  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [open]);

  const content = (
    <ScrollArea className="h-[200px]">
      {value
        ? coins
            .filter((coin) =>
              coin.id.toLowerCase().includes(value.toLowerCase())
            )
            .map((coin, index) => (
              <Link
                key={index}
                href={`/coins/${coin.id}`}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`flex items-center justify-start p-2 hover:bg-background/60 cursor-pointer gap-2 ${
                  selectedIndex === index ? "bg-background/60" : ""
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() =>
                  (window.location.href = `/coins/${coin.id}`)
                }
              >
                <Image
                  src={coin.image}
                  width={24}
                  height={24}
                  alt={coin.id}
                />
                <div>({coin.symbol.toUpperCase()})</div>
                <div>{capitalizeWords(coin.id)}</div>
              </Link>
            ))
        : coins.map((coin, index) => (
            <Link
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              href={`/coins/${coin.id}`}
              className={`flex items-center justify-start p-2 hover:bg-background/60 cursor-pointer gap-2 ${
                selectedIndex === index ? "bg-background/60" : ""
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <Image
                src={coin.image}
                width={24}
                height={24}
                alt={coin.id}
              />
              <div>({coin.symbol.toUpperCase()})</div>
              <div>{capitalizeWords(coin.id)}</div>
            </Link>
          ))}
    </ScrollArea>
  );

  if (isDesktop) {
    return (
      <Popover open={open}>
        <PopoverTrigger asChild className="w-full">
          <div
            ref={triggerRef}
            className="flex items-center bg-card rounded-lg h-10 w-full"
          >
            <Search className="w-6 h-6 ml-2" />
            <Input
              type="text"
              placeholder="Search..."
              onChange={(e) => setValue(e.target.value)}
              value={value}
              onClick={() => setOpen(true)}
              className="w-full bg-transparent outline-none ring-0 border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-card">{content}</PopoverContent>
      </Popover>
    );
  } else {
    return (
      <Drawer open={open}>
        <DrawerTrigger asChild>
          <Button
            variant={"secondary"}
            className="bg-card"
            onClick={() => setOpen(true)}
          >
            <Search className="w-6 h-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-6">{content}</DrawerContent>
      </Drawer>
    );
  }
};

export default Searchbar;

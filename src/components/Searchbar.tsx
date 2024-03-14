"use client";
import { useEffect, useRef, useState } from "react";
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

const demoCoins = [
  { label: "Bitcoin", value: "BTC" },
  { label: "Ethereum", value: "ETH" },
  { label: "Cardano", value: "ADA" },
];

const Searchbar = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const triggerRef = useRef(null);
  type Coin = {
    label: string;
    value: string;
  };
  const coins: Coin[] = demoCoins;
  useClosePopover(triggerRef, setOpen);

  const content = (
    <ScrollArea className="h-[200px]">
      {value
        ? coins
            .filter((coin) =>
              coin.label.toLowerCase().includes(value.toLowerCase())
            )
            .map((coin, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-card/70 cursor-pointer"
              >
                <div>{coin.label}</div>
                <div>{coin.value}</div>
              </div>
            ))
        : coins.map((coin, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-card/50 cursor-pointer"
            >
              <div>{coin.label}</div>
              <div>{coin.value}</div>
            </div>
          ))}
    </ScrollArea>
  );

  if (isDesktop) {
    return (
      <Popover open={open} setOpen={setOpen} className="w-full">
        <PopoverTrigger asChild className="w-full">
          <div
            ref={triggerRef}
            className="flex items-center bg-card/40 rounded-lg h-10 w-full"
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
        <PopoverContent className="bg-transparent">
          {content}
        </PopoverContent>
      </Popover>
    );
  } else {
    return (
      <Drawer open={open}>
        <DrawerTrigger asChild>
          <Button
            variant={"secondary"}
            className="bg-card/40"
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

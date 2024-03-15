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
import { useCryptoStore } from "@/lib/store";
import { Coin } from "@/lib/types";
import Image from "next/image";

const Searchbar = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const cryptoData = useCryptoStore((state) => state.cryptoData);

  const triggerRef = useRef(null);
  const coins: Coin[] = cryptoData;
  useClosePopover(triggerRef, setOpen);

  const content = (
    <ScrollArea className="h-[200px]">
      {value
        ? coins
            .filter((coin) =>
              coin.id.toLowerCase().includes(value.toLowerCase())
            )
            .map((coin, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-card/70 cursor-pointer"
              >
                <Image
                  src={coin.image}
                  width={24}
                  height={24}
                  alt={coin.id}
                />
                <div>
                  ({coin.symbol}) {coin.id}
                </div>
              </div>
            ))
        : coins.map((coin, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-card/70 cursor-pointer"
            >
              <Image
                src={coin.image}
                width={24}
                height={24}
                alt={coin.id}
              />
              <div>
                ({coin.symbol}) {coin.id}
              </div>
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

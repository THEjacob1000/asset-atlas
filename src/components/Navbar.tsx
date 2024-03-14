"use client";
import { ChevronDown, Home, Layers } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import Searchbar from "./Searchbar";

type Currency = {
  symbol: string;
  currency: string;
};

const Navbar = () => {
  const [currency, setCurrency] = useState({
    symbol: "$",
    currency: "USD",
  });
  const currencies: Currency[] = [
    { symbol: "$", currency: "USD" },
    { symbol: "₹", currency: "INR" },
    { symbol: "€", currency: "EUR" },
    { symbol: "£", currency: "GBP" },
    { symbol: "¥", currency: "JPY" },
    { symbol: "$", currency: "AUD" },
  ];
  const pathname = usePathname();
  const { theme } = useTheme();
  const changeCurrency = (currency: Currency) => {
    setCurrency(currency);
  };
  const router = useRouter();
  return (
    <div className="flex flex-col w-full fixed top-0 z-10 h-36">
      <nav
        className={cn(
          "flex justify-around items-center py-6 min-w-full max-h-24 fixed md:top-12 z-10 h-24",
          theme === "light" ? "bg-white" : "bg-background"
        )}
      >
        <Link href="/" className="flex items-center justify-between">
          <Image src="/logo.svg" alt="Logo" width={72} height={40} />
          <div className="text-foreground text-xl font-bold ml-8 md:block hidden">
            CoinPulse
          </div>
        </Link>
        <div className="w-[265px] h-12 justify-start items-start gap-6 hidden md:inline-flex">
          <Button
            className="px-4 py-3 rounded-md justify-center items-center gap-2 flex hover:bg-background/40"
            variant={"ghost"}
            aria-label="home"
            onClick={() => router.push("/")}
          >
            <Home className="w-6 h-6" />
            <div
              className={cn(
                "text-base font-medium font-['Space Grotesk']",
                pathname === "/" &&
                  "font-bold underline-offset-4 underline"
              )}
            >
              Home
            </div>
          </Button>
          <Button
            className={cn(
              "px-4 py-3 rounded-md justify-center items-center gap-2 flex hover:bg-background/40",
              pathname === "/portfolio" &&
                "font-bold underline-offset-4 underline"
            )}
            variant={"ghost"}
            aria-label="home"
            onClick={() => router.push("/portfolio")}
          >
            <Layers className="w-6 h-6" />
            <div className="text-opacity-50 text-base font-normal font-['Space Grotesk']">
              Portfolio
            </div>
          </Button>
        </div>
        <div className="flex justify-between w-1/4 items-center gap-2">
          <Searchbar />
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex bg-card/40 px-3 py-2 rounded-lg h-10">
                <div className="text-background bg-foreground rounded-full h-6 w-6 mr-2 lg:block hidden">
                  {currency.symbol}
                </div>
                {currency.currency}
                <ChevronDown className="w-4 h-4 ml-2 mt-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card/50 border-input/5">
              {currencies
                .filter((c) => c.currency !== currency.currency)
                .map((c, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => changeCurrency(c)}
                    className="flex items-center justify-between hover:cursor-pointer"
                  >
                    ( {c.symbol} ){" "}
                    <span className="ml-2">{c.currency}</span>
                    <div aria-hidden="true" className="w-8" />
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

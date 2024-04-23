import clientPromise from "@/lib/mongodb";
import { Coin } from "@/lib/types";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("coins");
  const initialiseDataFetch = async () => {
    try {
      const response = axios.get<Coin[]>("/api/cryptoData");
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };
  initialiseDataFetch();
  const cryptoData = await db
    .collection("cryptoData")
    .find({})
    .toArray();
  return NextResponse.json(cryptoData);
}

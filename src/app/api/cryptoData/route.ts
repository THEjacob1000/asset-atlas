import clientPromise from "@/lib/mongodb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("coins");
  const lastUpdate = await db
    .collection("metadata")
    .findOne({ type: "lastUpdate" });

  const now = new Date();

  if (
    !lastUpdate ||
    now.getTime() - new Date(lastUpdate.date).getTime() > 3600000
  ) {
    try {
      const response1 = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );
      await new Promise((resolve) => setTimeout(resolve, 12000));
      const response2 = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );
      await new Promise((resolve) => setTimeout(resolve, 12000));
      const response3 = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=3&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );
      await new Promise((resolve) => setTimeout(resolve, 12000));
      const response4 = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=4&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );
      const data = [
        ...response1.data,
        ...response2.data,
        ...response3.data,
        ...response4.data,
      ];

      await db.collection("cryptoData").deleteMany({});
      await db.collection("cryptoData").insertMany(data);

      await db
        .collection("metadata")
        .updateOne(
          { type: "lastUpdate" },
          { $set: { date: now } },
          { upsert: true }
        );

      return NextResponse.json({ data });
    } catch (error: any) {
      if (error.response.data.status.error_code === 429) {
        const cryptoData = await db
          .collection("cryptoData")
          .find({})
          .toArray();
        return NextResponse.json(cryptoData);
      }
      return NextResponse.json({
        error: "Error fetching crypto data",
      });
    }
  } else {
    const cryptoData = await db
      .collection("cryptoData")
      .find({})
      .toArray();
    return NextResponse.json(cryptoData);
  }
}

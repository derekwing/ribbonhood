import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStockInfo, getUserShares, getWalletBalance } from "@/services/api";
import StockHeader from "@/components/StockHeader";
import PriceChart from "@/components/PriceChart";
import StockTradingPanel from "@/components/StockTradingPanel";
import { Stock as StockType } from "@/types";
import { toast } from "react-toastify";

const Stock: React.FC = () => {
  const [stock, setStock] = useState<StockType | null>(null);
  const [sharesAvailable, setSharesAvailable] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [tickerPrice, setTickerPrice] = useState<number>(0);
  const { ticker } = useParams<{ ticker: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!ticker) return;
    const fetchData = async () => {
      const stockInfo = await getStockInfo(ticker);
      if (!stockInfo) {
        // route to home page
        navigate("/");
        toast.error("Stock not found", { toastId: "stock-not-found" });
      }

      const [userShares, walletData] = await Promise.all([
        getUserShares(ticker),
        getWalletBalance(),
      ]);

      setStock(stockInfo);
      setTickerPrice(stockInfo.price);
      setSharesAvailable(userShares.shares);
      setWalletBalance(walletData.walletBalance);
    };
    fetchData();
  }, [ticker]);

  return (
    <div className="w-full flex justify-center gap-36">
      <section className="w-full flex flex-col">
        <StockHeader ticker={ticker} price={tickerPrice} />
        <PriceChart
          historicalData={stock?.historicalData ?? []}
          showTooltip={true}
        />
      </section>
      <section className="h-max max-w-[350px] w-full bg-primary flex flex-col">
        <StockTradingPanel
          ticker={ticker}
          tickerPrice={tickerPrice}
          sharesAvailable={sharesAvailable}
          walletBalance={walletBalance}
          onSharesUpdate={setSharesAvailable}
          onBalanceUpdate={setWalletBalance}
        />
      </section>
    </div>
  );
};

export default Stock;

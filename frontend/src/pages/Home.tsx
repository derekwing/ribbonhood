import React, { useEffect, useState } from "react";
import { getUserStocks, getWalletBalance } from "@/services/api";
import { Stock } from "@/types";
import PortfolioSummary from "@/components/PortfolioSummary";
import BuyingPowerAccordion from "@/components/BuyingPowerAccordion";
import StockList from "@/components/StockList";
import PriceChart from "@/components/PriceChart";
import { createDummyPortfolio } from "@/lib/utils";

const Home: React.FC = () => {
  const [userStocks, setUserStocks] = useState<Stock[]>([]);
  const [totalInvested, setTotalInvested] = useState<number>(-1);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const [userStocks, walletBalance] = await Promise.all([
        getUserStocks(),
        getWalletBalance(),
      ]);
      setUserStocks(userStocks.stockHoldings);
      setTotalInvested(userStocks.totalPortfolioValue);
      setWalletBalance(walletBalance.walletBalance);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full flex justify-center gap-36">
      <section className="min-w-[600px] max-w-[800px] w-full flex flex-col">
        <PortfolioSummary totalInvested={totalInvested} />
        {totalInvested >= 0 && (
          <PriceChart historicalData={createDummyPortfolio(totalInvested)} />
        )}
        <BuyingPowerAccordion
          walletBalance={walletBalance}
          onBalanceUpdate={setWalletBalance}
        />
      </section>
      <section className="h-max max-w-[350px] w-full flex flex-col">
        <StockList stocks={userStocks} />
      </section>
    </div>
  );
};

export default Home;

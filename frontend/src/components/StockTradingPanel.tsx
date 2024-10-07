import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { buyShares, sellShares, sellAllShares } from "@/services/api";
import { toast } from "react-toastify";
import DepositDialog from "./DepositDialog";

interface Props {
  ticker?: string;
  tickerPrice: number;
  sharesAvailable: number;
  walletBalance: number;
  onSharesUpdate: (shares: number) => void;
  onBalanceUpdate: (balance: number) => void;
}

const StockTradingPanel: React.FC<Props> = ({
  ticker,
  tickerPrice,
  sharesAvailable,
  walletBalance,
  onSharesUpdate,
  onBalanceUpdate,
}) => {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [sharesQuantity, setSharesQuantity] = useState<number>(0);

  const handleBuyShares = async () => {
    if (!ticker) return;
    if (sharesQuantity <= 0 || walletBalance < tickerPrice * sharesQuantity) {
      toast.error("Invalid purchase. Check your balance and share quantity.");
      return;
    }
    const data = await buyShares(ticker, sharesQuantity, tickerPrice);
    if (data) {
      onSharesUpdate(data.shares);
      onBalanceUpdate(data.new_balance);
      setSharesQuantity(0);
      toast.success("Shares purchased successfully!");
    } else {
      toast.error("Failed to purchase shares. Please try again later.");
    }
  };

  const handleSellShares = async () => {
    if (!ticker) return;
    if (sharesQuantity <= 0 || sharesAvailable < sharesQuantity) {
      toast.error("Invalid sale. Check your share quantity.");
      return;
    }
    const data = await sellShares(ticker, sharesQuantity, tickerPrice);
    if (data) {
      onSharesUpdate(data.shares);
      onBalanceUpdate(data.new_balance);
      setSharesQuantity(0);
      toast.success("Shares sold successfully!");
    } else {
      toast.error("Failed to sell shares. Please try again later.");
    }
  };

  const handleSellAll = async () => {
    if (!ticker) return;
    if (sharesAvailable <= 0) {
      toast.error("Invalid sale. Check your share quantity.");
      return;
    }
    const data = await sellAllShares(ticker, sharesAvailable, tickerPrice);
    if (data) {
      onSharesUpdate(data.shares);
      onBalanceUpdate(data.new_balance);
      setSharesQuantity(0);
      toast.success("All shares sold successfully!");
    } else {
      toast.error("Failed to sell all shares. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col border rounded-lg divide-y text-sm">
      <div className="flex gap-3 text-left px-6 py-2 font-bold">
        <Button
          variant="normal"
          className={`px-0 ${
            tab === "buy"
              ? "text-green border-b-2 border-green border-solid rounded-none"
              : ""
          }`}
          onClick={() => setTab("buy")}
        >
          Buy {ticker}
        </Button>
        <Button
          variant="normal"
          className={`px-0 ${
            tab === "sell"
              ? "text-green border-b-2 border-green border-solid rounded-none"
              : ""
          }`}
          onClick={() => setTab("sell")}
        >
          Sell {ticker}
        </Button>
      </div>
      <div className="divide-y">
        <div className="flex flex-col gap-4 px-6 py-4 font-semibold">
          <div className="flex justify-between items-center">
            <div>Shares</div>
            <Input
              type="search"
              placeholder="0"
              value={sharesQuantity}
              className="max-w-[100px] text-right"
              onChange={(e) => setSharesQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-green">Market Price</div>
            <div className="font-bold">{formatCurrency(tickerPrice)}</div>
          </div>
        </div>
        <div className="px-6 py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center font-bold">
            <div>Estimated Cost</div>
            <div>{formatCurrency(tickerPrice * sharesQuantity)}</div>
          </div>
          {tab === "buy" && (
            <Button
              variant="important"
              className="w-full"
              onClick={handleBuyShares}
              disabled={!tickerPrice}
            >
              Purchase Shares
            </Button>
          )}
          {tab === "sell" && (
            <Button
              variant="important"
              className="w-full"
              onClick={handleSellShares}
              disabled={!tickerPrice}
            >
              Sell Shares
            </Button>
          )}
        </div>
      </div>
      <div className="font-semibold py-4">
        {tab === "buy" && `You have ${sharesAvailable} ${ticker} shares`}
        {tab === "sell" && (
          <>
            {sharesAvailable} Shares Available -{" "}
            <span>
              <Button
                variant="normal"
                className="text-green px-0 py-0 h-max"
                onClick={handleSellAll}
              >
                Sell All
              </Button>
            </span>
          </>
        )}
      </div>
      <div className="font-semibold py-4">
        {formatCurrency(walletBalance)} buying power available
      </div>
      <div className="font-semibold py-4">
        <DepositDialog
          trigger={<Button variant="important">Deposit Funds</Button>}
          onBalanceUpdate={onBalanceUpdate}
        />
      </div>
    </div>
  );
};

export default StockTradingPanel;

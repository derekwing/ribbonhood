import React from "react";
import { Link } from "react-router-dom";
import { Stock } from "@/types";
import { formatCurrency } from "@/lib/utils";
import PriceChart from "./PriceChart";
interface Props {
  stocks: Stock[];
}

const StockList: React.FC<Props> = ({ stocks }) => {
  return (
    <div className="flex flex-col border rounded-lg divide-y text-sm">
      <div className="text-left p-4 font-semibold divide-y">My Stocks</div>
      <div>
        {stocks.map((stock, index) => (
          <Link
            to={`/stock/${stock.ticker.toUpperCase()}`}
            key={stock.ticker}
            className={`flex justify-between items-center px-4 py-2 hover:bg-zinc-700 border-zinc-700 ${
              index === stocks.length - 1 && "rounded-b-lg"
            }`}
          >
            <div className="flex-1 flex flex-col items-start">
              <div className="font-semibold">{stock.ticker}</div>
              <div className="font-normal">{stock.quantity} shares</div>
            </div>
            <div className="flex-1 w-32 h-16 p-4">
              <PriceChart
                historicalData={stock.historicalData ?? []}
                showTooltip={false}
                showAxes={false}
                miniChart={true}
              />
            </div>
            <div className="flex-1 text-right">
              {formatCurrency(stock.totalValue)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StockList;

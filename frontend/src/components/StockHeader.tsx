import React from "react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  ticker?: string;
  price: number;
}

const StockHeader: React.FC<Props> = ({ ticker, price }) => (
  <div className="flex flex-col items-start font-semibold text-3xl">
    <div>{ticker}</div>
    <div>{formatCurrency(price)}</div>
  </div>
);

export default StockHeader;

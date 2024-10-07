import React from "react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  totalInvested: number;
}

const PortfolioSummary: React.FC<Props> = ({ totalInvested }) => (
  <div className="flex flex-col items-start font-semibold text-3xl">
    <div>Investing</div>
    {totalInvested >= 0 && <div>{formatCurrency(totalInvested)}</div>}
  </div>
);

export default PortfolioSummary;

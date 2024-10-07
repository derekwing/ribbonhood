export interface Stock {
  ticker: string;
  price: number;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  historicalData?: { date: string; price: number }[];
}

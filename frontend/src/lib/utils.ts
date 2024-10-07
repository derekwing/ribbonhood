import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function createDummyPortfolio(currentPortfolioValue: number) {
  // Generate dates for the last 30 days
  const generateDates = () => {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Create portfolio history with fluctuating prices and current value
  const createPortfolioHistory = () => {
    const dates = generateDates();
    const fluctuatingPrices = [
      8750.25, 9200.5, 8900.75, 9500.0, 10100.25, 9800.5, 9300.75, 9700.0,
      10200.25, 10500.5, 11000.75, 10800.0, 10300.25, 9800.5, 9500.75, 9900.0,
      10400.25, 10700.5, 11200.75, 11500.0, 11200.25, 10700.5, 10200.75, 9800.0,
      9500.25, 9800.5, 10300.75, 10800.0, 11300.25,
    ];

    return dates.map((date, index) => ({
      date,
      price:
        index === dates.length - 1
          ? currentPortfolioValue
          : fluctuatingPrices[index],
    }));
  };

  return createPortfolioHistory();
}

const API_BASE_URL = "http://localhost:5000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    return null;
  }
  return response.json();
};

// Get info for a given stock
export const getStockInfo = async (ticker: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/stock/${ticker}`);
  return handleResponse(response);
};

// Get all stocks information for a user
export const getUserStocks = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/user-stocks`);
  return handleResponse(response);
};

// Get number of shares a user has of a given stock
export const getUserShares = async (ticker: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/user-shares/${ticker}`);
  return handleResponse(response);
};

// Get user's wallet balance
export const getWalletBalance = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/wallet`);
  return handleResponse(response);
};

// Deposit funds into user's wallet
export const depositFunds = async (amount: number): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/wallet/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deposit_amount: amount }),
  });
  return handleResponse(response);
};

// Buy a number of shares
export const buyShares = async (
  ticker: string,
  quantity: number,
  price: number
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/stock/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticker, quantity, price }),
  });
  return handleResponse(response);
};

// Sell a number of shares
export const sellShares = async (
  ticker: string,
  quantity: number,
  price: number
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/stock/sell`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticker, quantity, price }),
  });
  return handleResponse(response);
};

// Sell all shares
export const sellAllShares = async (
  ticker: string,
  sharesAvailable: number,
  tickerPrice: number
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/stock/sell`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticker,
      quantity: sharesAvailable,
      price: tickerPrice,
    }),
  });
  return handleResponse(response);
};

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

type Props = {};

const NavBar: React.FC<Props> = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      setSearchQuery("");
      navigate(`/stock/${searchQuery.toUpperCase()}`);
    }
  };

  return (
    <header className="w-full py-4 flex justify-center">
      <nav className="w-full flex justify-center items-center">
        <Link to="/" className="ml-8">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-center items-center"
        >
          <Input
            type="search"
            placeholder="AAPL, NVDA, TSLA, MSFT, etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[400px] mr-2"
          />
          <Button type="submit">Search</Button>
        </form>
        <Link to="/" className="mr-8 flex-shrink-0 font-bold hover:text-green">
          My Portfolio
        </Link>
      </nav>
    </header>
  );
};

export default NavBar;

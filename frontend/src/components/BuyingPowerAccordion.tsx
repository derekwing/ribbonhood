import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import DepositDialog from "./DepositDialog";

interface Props {
  walletBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const BuyingPowerAccordion: React.FC<Props> = ({
  walletBalance,
  onBalanceUpdate,
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-lg hover:bg-zinc-700"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="w-full flex justify-between font-bold text-sm mx-4">
            <div>Buying Power</div>
            <div>{formatCurrency(walletBalance)}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex mx-4">
            <div className="w-full h-full"></div>
            <div className="w-1/2 h-full flex flex-col gap-4 self-right">
              <DepositDialog
                trigger={<Button variant="important">Deposit Funds</Button>}
                onBalanceUpdate={onBalanceUpdate}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BuyingPowerAccordion;

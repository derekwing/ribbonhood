import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { depositFunds } from "@/services/api";
import { toast } from "react-toastify";
import { formatCurrency } from "@/lib/utils";

interface DepositDialogProps {
  trigger: React.ReactNode;
  onBalanceUpdate: (newBalance: number) => void;
}

const DepositDialog: React.FC<DepositDialogProps> = ({
  trigger,
  onBalanceUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("");

  const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!depositAmount) return;
    const data = await depositFunds(Number(depositAmount));
    if (data) {
      onBalanceUpdate(data.walletBalance);
      toast.success(
        `Successfully deposited ${formatCurrency(Number(depositAmount))}`
      );
      setIsOpen(false); // Close the dialog
    } else {
      toast.error("Failed to deposit funds. Please try again later.");
    }
    setDepositAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-black text-white">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to deposit.
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full h-full flex flex-col gap-4 items-center"
          onSubmit={handleDeposit}
        >
          <div className="flex gap-2 items-center">
            <div className="w-full h-full font-bold">Amount</div>
            <Input
              placeholder="0"
              value={depositAmount}
              className="text-right"
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </div>
          <Button
            variant="important"
            className="w-1/2"
            disabled={!depositAmount}
            type="submit"
          >
            Deposit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;

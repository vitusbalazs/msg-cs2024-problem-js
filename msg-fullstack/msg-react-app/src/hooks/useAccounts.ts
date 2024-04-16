import { useCallback, useEffect, useState } from "react";
import { SavingsAccount, CheckingAccount } from "../utils/types";
import { axiosInstance } from "../api/axiosInstance";
import toastr from "toastr";

export default function useAccounts() {
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accounts, setAccounts] = useState<
    [CheckingAccount[], SavingsAccount[]]
  >([[], []]);

  const [transferLoading, setTransferLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setAccountsLoading(true);
    const acc = await axiosInstance.get("/");
    setAccounts([acc.data[0], acc.data[1]]);
    setAccountsLoading(false);
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const transferAmount = useCallback(
    async (
      fromAccount: string,
      toAccount: string,
      amount: number,
      currency: "RON" | "EUR"
    ) => {
      console.log(fromAccount, toAccount, amount, currency);
      try {
        setTransferLoading(true);
        const resp = await axiosInstance.post("/transfer", {
          fromAccount,
          toAccount,
          amount,
          currency,
        });
        if (resp.status !== 200) {
          toastr.error("Transfer failed");
          console.log("Transfer failed");
        } else {
          toastr.success("Transfer successful");
        }
      } catch (e) {
        toastr.error("Transfer failed");
        console.log("Transfer failed", e);
      } finally {
        setTransferLoading(false);
      }
    },
    []
  );

  const withdrawAmount = useCallback(
    async (fromAccount: string, amount: number, currency: "RON" | "EUR") => {
      try {
        setWithdrawLoading(true);
        const resp = await axiosInstance.post("/withdraw", {
          fromAccount,
          amount,
          currency,
        });
        if (resp.status !== 200) {
          toastr.error("Withdraw failed");
          console.log("Withdraw failed");
        } else {
          toastr.success("Withdraw successful");
        }
      } catch (e) {
        toastr.error("Withdraw failed");
        console.log("Withdraw failed", e);
      } finally {
        setWithdrawLoading(false);
      }
    },
    []
  );

  const passTime = useCallback(async () => {
    try {
      const resp = await axiosInstance.post("/passtime");
      if (resp.status !== 200) {
        toastr.error("Pass time failed");
        console.log("Pass time failed");
      } else {
        toastr.success("Pass time successful");
        fetchAccounts();
      }
    } catch (e) {
      toastr.error("Pass time failed");
      console.log("Pass time failed", e);
    }
  }, []);

  return {
    accounts,
    accountsLoading,
    transferLoading,
    transferAmount,
    withdrawLoading,
    withdrawAmount,
    passTime,
    fetchAccounts,
  };
}

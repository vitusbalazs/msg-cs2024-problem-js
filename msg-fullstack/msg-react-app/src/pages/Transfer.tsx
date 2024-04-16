import { useState } from "react";
import HorizontalDivider from "../components/HorizontalDivider";
import useAccounts from "../hooks/useAccounts";
import styles from "../styles/Cards.module.css";

export default function Transfer() {
  const [fromAccount, setFromAccount] = useState<string>("");
  const [toAccount, setToAccount] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<"EUR" | "RON" | "">("");

  const [fromAccountValid, setFromAccountValid] = useState<boolean | undefined>(
    undefined
  );
  const [toAccountValid, setToAccountValid] = useState<boolean | undefined>(
    undefined
  );
  const [amountValid, setAmountValid] = useState<boolean | undefined>(
    undefined
  );
  const [currencyValid, setCurrencyValid] = useState<boolean | undefined>(
    undefined
  );

  const { accountsLoading, accounts, transferAmount, transferLoading } =
    useAccounts();

  const handleFromAccountChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFromAccount(event.target.value);
    setFromAccountValid(true);
  };

  const handleToAccountChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setToAccount(event.target.value);
    setToAccountValid(true);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(event.target.value));

    if (parseFloat(event.target.value) <= 0) {
      setAmountValid(false);
    } else {
      setAmountValid(true);
    }
  };

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrency(event.target.value as "EUR" | "RON");
    setCurrencyValid(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (transferLoading) return;

    if (fromAccount === toAccount)
      alert("Please select different accounts to transfer between.");
    else if (!fromAccountValid)
      alert("Please select a valid account to transfer from.");
    else if (!toAccountValid)
      alert("Please select a valid account to transfer to.");
    else if (!amountValid) alert("Please enter a valid amount to transfer.");
    else if (!currencyValid) alert("Please select a valid currency.");
    else {
      transferAmount(
        fromAccount,
        toAccount,
        amount!,
        currency as "EUR" | "RON"
      );
    }
  };

  return (
    <div>
      {accountsLoading ? (
        <div
          className="col-12 d-flex align-items-center justify-content-center"
          style={{ height: "100dvh" }}
        >
          <div className="d-flex flex-column align-items-center">
            <h3>Loading accounts...</h3>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="col-12 col-md-6 p-2">
            <form className={`card ${styles.card}`} onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="col-12 d-flex flex-column flex-xl-row">
                  <div className="col-12 col-xl-6 pb-2 pb-xl-0 pe-xl-1">
                    <h5 className="card-title">Select from account</h5>
                    <select
                      className={`form-select bg-dark text-light ${
                        fromAccountValid
                          ? "is-valid"
                          : fromAccountValid === false
                          ? "is-invalid"
                          : ""
                      }`}
                      value={fromAccount}
                      onChange={handleFromAccountChange}
                    >
                      <option value="" disabled>
                        Select account
                      </option>
                      {accounts[0].map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-xl-6 ps-xl-1">
                    <h5 className="card-title">Select to account</h5>
                    <select
                      className={`form-select bg-dark text-light ${
                        toAccountValid
                          ? "is-valid"
                          : toAccountValid === false
                          ? "is-invalid"
                          : ""
                      }`}
                      value={toAccount}
                      onChange={handleToAccountChange}
                    >
                      <option value="" disabled>
                        Select account
                      </option>
                      {accounts[0].map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.id}
                        </option>
                      ))}
                      {accounts[1].map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <HorizontalDivider />
                <h5>Select amount & currency</h5>
                <div className="col-12 d-flex flex-column flex-xl-row">
                  <div className="col-12 col-xl-6 pb-2 pb-xl-0 pe-xl-1">
                    <input
                      type="number"
                      className={`form-control bg-dark text-light ${
                        amountValid
                          ? "is-valid"
                          : amountValid === false
                          ? "is-invalid"
                          : ""
                      }`}
                      value={amount}
                      onChange={handleAmountChange}
                    />
                  </div>
                  <div className="col-12 col-xl-6 ps-xl-1">
                    <select
                      className={`form-select bg-dark text-light ${
                        currencyValid
                          ? "is-valid"
                          : currencyValid === false
                          ? "is-invalid"
                          : ""
                      }`}
                      value={currency}
                      onChange={handleCurrencyChange}
                    >
                      <option value="" disabled>
                        Select currency
                      </option>
                      <option value="RON">RON</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <HorizontalDivider />
                <button className="btn btn-secondary col-12">
                  {transferLoading ? (
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Transfer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

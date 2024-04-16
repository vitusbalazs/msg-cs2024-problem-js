import { SavingsAccount } from "../utils/types";
import styles from "../styles/Cards.module.css";
import TransactionCardItem from "./TransactionCardItem";

type SavingsAccountCardProps = {
  account: SavingsAccount;
};

export default function SavingsAccountCard({
  account,
}: SavingsAccountCardProps) {
  const formatDate = (date: Date) => {
    // return dd-mm-yyyy
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="col-12 col-md-6 col-xl-4 p-2">
      <div className={`card ${styles.card}`}>
        <div className="card-body">
          <h5 className="card-title">Account #{account.id}</h5>
          <h6 className={`card-subtitle mb-2 ${styles.cardSubtitle}`}>
            {account.accountType}
          </h6>
          <p className="card-text">
            Balance: {account.balance.amount.toLocaleString()}{" "}
            {account.balance.currency}
          </p>
          <div className="card-text">
            <h5>Interest</h5>
            {account.interestFrequency ? (
              <>
                <span>Interest frequency: {account.interestFrequency}</span>
                <br />
                <span>Interest rate: {account.interest}</span>
                <br />
                <span>
                  Last interest applied:{" "}
                  {formatDate(account.lastInterestAppliedDate)}
                </span>
              </>
            ) : (
              <span>No interest established</span>
            )}
          </div>
          <div className="card-text">
            <h5>Transactions</h5>
            {account.transactions.length > 0 ? (
              account.transactions.map((transaction) => (
                <TransactionCardItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            ) : (
              <span>No transactions</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

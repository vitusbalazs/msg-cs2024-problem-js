import { CheckingAccount } from "../utils/types";
import styles from "../styles/Cards.module.css";
import TransactionCardItem from "./TransactionCardItem";

type CheckingAccountCardProps = {
  account: CheckingAccount;
};

export default function CheckingAccountCard({
  account,
}: CheckingAccountCardProps) {
  const formatCardNumber = (cardNumber: string) => {
    return (
      cardNumber.toString().slice(0, 4) +
      " " +
      cardNumber.toString().slice(4, 8) +
      " " +
      cardNumber.toString().slice(8, 12) +
      " " +
      cardNumber.toString().slice(12, 16)
    );
  };

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
            <h5>Card</h5>
            {account.associatedCard ? (
              <>
                <span>
                  Associated Card:{" "}
                  <span className="badge text-bg-secondary">
                    {formatCardNumber(
                      account.associatedCard.cardNumber.toString()
                    )}
                  </span>
                </span>
                <br />
                <span>
                  Card expiration date:{" "}
                  {formatDate(account.associatedCard.expirationDate)}
                </span>
              </>
            ) : (
              <span>No associated card</span>
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

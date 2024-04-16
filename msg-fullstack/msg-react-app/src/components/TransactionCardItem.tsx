import { TransactionModel } from "../utils/types";
import styles from "../styles/Cards.module.css";

type TransactionCardItemProps = {
  transaction: TransactionModel;
};

export default function TransactionCardItem({
  transaction,
}: TransactionCardItemProps) {
  const formatDate = (date: Date) => {
    // return dd-mm-yyyy
    const d = new Date(date);
    return `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} ${d.getHours()}:${
      d.getMinutes() < 10 ? "0" + d.getMinutes().toString() : d.getMinutes()
    }:${
      d.getSeconds() < 10 ? "0" + d.getSeconds().toString() : d.getSeconds()
    }`;
  };

  return (
    <div className={`${styles.cardItem} p-2 rounded my-1`}>
      <h6>Transaction #{transaction.id}</h6>
      <span>{`#${transaction.from} -> #${transaction.to}`}</span>
      <br />
      <span>{`Amount: ${transaction.amount.amount.toLocaleString()} ${
        transaction.amount.currency
      }`}</span>
      <br />
      <span>{`Date: ${formatDate(transaction.timestamp)}`}</span>
    </div>
  );
}

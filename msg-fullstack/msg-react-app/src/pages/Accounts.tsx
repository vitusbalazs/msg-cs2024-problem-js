import CheckingAccountCard from "../components/CheckingAccountCard";
import SavingsAccountCard from "../components/SavingsAccountCard";
import useAccounts from "../hooks/useAccounts";

export default function Home() {
  const { accountsLoading, accounts, passTime } = useAccounts();

  const handlePassTime = () => {
    passTime();
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
        <div>
          <h1>Checking Accounts</h1>
          <div className="col-12 d-flex flex-wrap">
            {accounts[0].map((acc) => (
              <CheckingAccountCard key={acc.id} account={acc} />
            ))}
          </div>
          <h1>Savings Accounts</h1>
          <button className="btn btn-secondary" onClick={handlePassTime}>
            Pass time!
          </button>
          <div className="col-12 d-flex flex-wrap">
            {accounts[1].map((acc) => (
              <SavingsAccountCard key={acc.id} account={acc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

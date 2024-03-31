// test('adds 1 + 2 to equal 3', () => {
//   expect(1 + 2).toBe(3);
// });

import {
  checkingAccountA,
  checkingAccountB,
  checkingAccountC,
  savingsAccountA,
  savingsAccountB,
} from './seed/accounts.seed';
import { TransactionManagerServiceInstance } from './services/transaction-manager.service';
import { SavingsManagerServiceInstance } from './services/savings-manager.service';
import { seedInitializer } from './seed/seed-initializer';
import { MoneyModel } from './domain/money.model';
import { CurrencyType } from './domain/currency-type.enum';

seedInitializer();

describe('Checking account methods', () => {
  describe('Transfer money between accounts', () => {
    test('Balance of checkingAccountA should be 100 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountA.id).amount).toBe(100);
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountA.id).currency).toBe(CurrencyType.RON);
    });

    test('Balance of checkingAccountB should be 300 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountB.id).amount).toBe(300);
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountB.id).currency).toBe(CurrencyType.RON);
    });

    test('Transfer 50 RON from checkingAccountA to checkingAccountB', () => {
      const transaction = TransactionManagerServiceInstance.transfer(
        checkingAccountA.id,
        checkingAccountB.id,
        new MoneyModel({ amount: 50, currency: CurrencyType.RON })
      );

      expect(transaction.amount.amount).toBe(50);
      expect(transaction.amount.currency).toBe(CurrencyType.RON);
    });

    test('Balance of checkingAccountA should be 50 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountA.id).amount).toBe(50);
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountA.id).currency).toBe(CurrencyType.RON);
    });

    test('Balance of checkingAccountB should be 350 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountB.id).amount).toBe(350);
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountB.id).currency).toBe(CurrencyType.RON);
    });

    test("Transferring 5 EUR from checkingAccountA to checkingAccountB, the transaction should appear in RON, because checkAccountB's currency is in RON", () => {
      const transaction = TransactionManagerServiceInstance.transfer(
        checkingAccountA.id,
        checkingAccountB.id,
        new MoneyModel({ amount: 5, currency: CurrencyType.EUR })
      );

      expect(transaction.amount.amount).toBe(24.900000000000002);
      expect(transaction.amount.currency).toBe(CurrencyType.RON);
    });

    test('Balance of checkingAccountA should be 25.099999999999998 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountA.id).amount).toBe(25.099999999999998);
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountA.id).currency).toBe(CurrencyType.RON);
    });

    test('Balance of checkingAccountB should be 374.9 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountB.id).amount).toBe(374.9);
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountB.id).currency).toBe(CurrencyType.RON);
    });

    test('Transferring 800 RON from checkingAccountB to checkingAccountA, should throw an error (Insufficient funds)', () => {
      function throwError() {
        TransactionManagerServiceInstance.transfer(
          checkingAccountB.id,
          checkingAccountA.id,
          new MoneyModel({ amount: 800, currency: CurrencyType.RON })
        );
      }
      expect(throwError).toThrow(Error);
      expect(throwError).toThrow('Insufficient funds');
    });

    test('Transferring 500000 RON from checkingAccountB to checkingAccountA, should throw an error (Exceeded daily limit)', () => {
      function throwError() {
        TransactionManagerServiceInstance.transfer(
          checkingAccountB.id,
          checkingAccountA.id,
          new MoneyModel({ amount: 500000, currency: CurrencyType.RON })
        );
      }
      expect(throwError).toThrow(Error);
      expect(throwError).toThrow(
        'Daily transaction limit exceeded, the amount of this transfer should be less than or equal to 7000 RON (daily limit: 7000 RON)'
      );
    });
  });

  describe('Withdraw money from accounts', () => {
    test('Withdraw 5 RON from checkingAccountA', () => {
      const transaction = TransactionManagerServiceInstance.withdraw(
        checkingAccountA.id,
        new MoneyModel({ amount: 5, currency: CurrencyType.RON })
      );

      expect(transaction.amount.amount).toBe(5);
      expect(transaction.amount.currency).toBe(CurrencyType.RON);
    });

    test('Balance of checkingAccountA should be 20.099999999999998 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountA.id).amount).toBe(20.099999999999998);
      expect(TransactionManagerServiceInstance.checkFunds(checkingAccountA.id).currency).toBe(CurrencyType.RON);
    });

    test('Withdrawing 5 EUR from checkingAccountC, should throw an error (Card not active)', () => {
      function throwError() {
        TransactionManagerServiceInstance.withdraw(
          checkingAccountC.id,
          new MoneyModel({ amount: 5, currency: CurrencyType.EUR })
        );
      }
      expect(throwError).toThrow(Error);
      expect(throwError).toThrow('The associated bankcard is not active or has expired');
    });
  });
});

describe('Savings account methods', () => {
  describe('Check funds and pass time (CheckingAccountA has a monthly interest, CheckingAccountB has a quarterly interest)', () => {
    test('Balance of savingsAccountA should be 1000 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountA.id).amount).toBe(1000);
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountA.id).currency).toBe(CurrencyType.RON);
    });

    test('Balance of savingsAccountB should be 2000 EUR', () => {
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountB.id).amount).toBe(2000);
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountB.id).currency).toBe(CurrencyType.EUR);
    });

    test('Passing time: one month', () => {
      SavingsManagerServiceInstance.passTime();
    });

    test('Balance of savingsAccountA should be 1055 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountA.id).amount).toBe(1055);
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountA.id).currency).toBe(CurrencyType.RON);
    });

    test('Balance of savingsAccountB should be 2000 EUR', () => {
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountB.id).amount).toBe(2000);
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountB.id).currency).toBe(CurrencyType.EUR);
    });

    test('Passing time: one month', () => {
      SavingsManagerServiceInstance.passTime();
    });

    test('Balance of savingsAccountA should be 1113.025 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountA.id).amount).toBe(1113.025);
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountA.id).currency).toBe(CurrencyType.RON);
    });

    test('Balance of savingsAccountB should be 2000 EUR', () => {
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountB.id).amount).toBe(2000);
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountB.id).currency).toBe(CurrencyType.EUR);
    });

    test('Passing time: one month', () => {
      SavingsManagerServiceInstance.passTime();
    });

    test('Balance of savingsAccountA should be 1174.241375 RON', () => {
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountA.id).amount).toBe(1174.241375);
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountA.id).currency).toBe(CurrencyType.RON);
    });

    test('Balance of savingsAccountB should be 2113 EUR', () => {
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountB.id).amount).toBe(2113);
      expect(TransactionManagerServiceInstance.checkFunds(savingsAccountB.id).currency).toBe(CurrencyType.EUR);
    });
  });
});

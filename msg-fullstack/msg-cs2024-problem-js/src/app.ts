import {
  checkingAccountA,
  checkingAccountB,
  checkingAccountC,
  savingsAccountA,
  savingsAccountB,
} from './seed/accounts.seed';
import { TransactionManagerServiceInstance } from './services/transaction-manager.service';
import { SavingsManagerServiceInstance } from './services/savings-manager.service';
import { AccountsRepository } from './repository/accounts.repository';
import { seedInitializer } from './seed/seed-initializer';
import { MoneyModel } from './domain/money.model';
import { CurrencyType } from './domain/currency-type.enum';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

console.log('[SYSTEM]', 'Initialize Application \n');
seedInitializer();
console.log('[SYSTEM]', 'Running Application \n\n');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const accounts = AccountsRepository.getAll();
  const accs = [[], []] as [any[], any[]];
  accounts.forEach(acc => {
    if (acc.accountType === 'CHECKING') {
      accs[0].push(acc);
    } else {
      accs[1].push(acc);
    }
  });
  console.log(accounts);
  res.send(accs);
});

app.post('/transfer', (req, res) => {
  const { fromAccount, toAccount, amount, currency } = req.body;
  console.log(fromAccount, toAccount, amount, currency);
  const transaction = TransactionManagerServiceInstance.transfer(
    fromAccount,
    toAccount,
    new MoneyModel({ amount, currency })
  );
  res.send(transaction);
});

app.post('/withdraw', (req, res) => {
  const { fromAccount, amount, currency } = req.body;
  const transaction = TransactionManagerServiceInstance.withdraw(fromAccount, new MoneyModel({ amount, currency }));
  res.send(transaction);
});

app.post('/passtime', (req, res) => {
  SavingsManagerServiceInstance.passTime();
  res.send('Time passed');
});

app.listen(3001, () => {
  console.log('Server is running on port 3000');
});

// TRANSACTION MANAGER FUNCTIONALITY

// console.log('[Transaction Manager] 1.', TransactionManagerServiceInstance.checkFunds(checkingAccountA.id));
// console.log('[Transaction Manager] 2.', TransactionManagerServiceInstance.checkFunds(checkingAccountB.id));

const transaction1 = TransactionManagerServiceInstance.transfer(
  checkingAccountA.id,
  checkingAccountB.id,
  new MoneyModel({ amount: 50, currency: CurrencyType.RON })
);

// console.log('[Transaction Manager] 3.', transaction1);
// console.log('[Transaction Manager] 4.', TransactionManagerServiceInstance.checkFunds(checkingAccountA.id));
// console.log('[Transaction Manager] 5.', TransactionManagerServiceInstance.checkFunds(checkingAccountB.id));

// console.log(
//   '[Transaction Manager] 6.',
//   TransactionManagerServiceInstance.withdraw(
//     checkingAccountC.id,
//     new MoneyModel({ amount: 5, currency: CurrencyType.EUR })
//   )
// );

// console.log('\n------------------------------------\n');

// // SAVINGS MANAGER FUNCTIONALITY

// console.log('[Saving Manager] 1.', TransactionManagerServiceInstance.checkFunds(savingsAccountA.id));
SavingsManagerServiceInstance.passTime();
// console.log('[Saving Manager] 2.', TransactionManagerServiceInstance.checkFunds(savingsAccountA.id));
// SavingsManagerServiceInstance.passTime();
// console.log('[Saving Manager] 3.', TransactionManagerServiceInstance.checkFunds(savingsAccountA.id));
// console.log('[Saving Manager] 4.', TransactionManagerServiceInstance.checkFunds(savingsAccountB.id));
// console.log('[Saving Manager] 5.', TransactionManagerServiceInstance.checkFunds(checkingAccountA.id));

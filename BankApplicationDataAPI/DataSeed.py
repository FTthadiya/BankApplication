import sqlite3

conn = sqlite3.connect('BankData.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS Users (
    UserId INTEGER PRIMARY KEY,
    UserName TEXT NOT NULL,
    Password TEXT NOT NULL,
    Email TEXT NOT NULL,
    Phone INTEGER NOT NULL,
    Address TEXT NOT NULL,
    Picture TEXT,
    IsAdmin BOOLEAN NOT NULL DEFAULT 0,
    IsActive BOOLEAN NOT NULL DEFAULT 1
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Accounts (
    AccountId INTEGER PRIMARY KEY,
    AccountNo INTEGER NOT NULL,
    AccountName TEXT NOT NULL DEFAULT 'Account',
    Balance REAL NOT NULL,
    UserId INTEGER NOT NULL,
    FOREIGN KEY (UserId) REFERENCES User(UserId)
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Transactions (
    TransactionId INTEGER PRIMARY KEY,
    Type TEXT NOT NULL,
    Amount REAL NOT NULL,
    AccountId INTEGER NOT NULL,
    Description TEXT NOT NULL,
    DateTime DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Logs (
    LogId INTEGER PRIMARY KEY,
    TimeStamp DATETIME NOT NULL DEFAULT (datetime('now')),
    Action TEXT NOT NULL,
    LogMessage TEXT NOT NULL
)''')

users = []
accounts = []
transactions = []

admin_user = {
    'UserId': 6,
    'UserName': "TestAdmin",
    'Password': "123456",
    'Email': "admin@gmail.com",
    'Address': "Address",
    'Phone': 891231231,
    'IsAdmin': True,
    'IsActive': False
}
users.append(admin_user)

users_data = [
    {
        'UserId': 1,
        'UserName': "TestUser1",
        'Password': "123456",
        'Email': "user1@gmail.com",
        'Address': "Address",
        'Phone': 374928472,
        'IsAdmin': True,
        'IsActive': False
    },
    {
        'UserId': 2,
        'UserName': "TestUser2",
        'Password': "123456",
        'Email': "user2@gmail.com",
        'Address': "Address",
        'Phone': 473930233,
        'IsAdmin': True,
        'IsActive': False
    },
    {
        'UserId': 3,
        'UserName': "TestUser3",
        'Password': "123456",
        'Email': "user3@gmail.com",
        'Address': "Address",
        'Phone': 598302799,
        'IsAdmin': True,
        'IsActive': False
    },
    {
        'UserId': 4,
        'UserName': "TestUser4",
        'Password': "123456",
        'Email': "user4@gmail.com",
        'Address': "Address",
        'Phone': 473920284,
        'IsAdmin': True,
        'IsActive': False
    },
    {
        'UserId': 5,
        'UserName': "TestUser5",
        'Password': "123456",
        'Email': "user5@gmail.com",
        'Address': "Address",
        'Phone': 473947382,
        'IsAdmin': True,
        'IsActive': False
    }
]

for user in users_data:
    users.append(user)

accounts_data = [
    {
        'AccountId': 1,
        'AccountNo': 1,
        'AccountName': "Savings account",
        'Balance': 9998282,
        'UserId': 1
    },
    {
        'AccountId': 2,
        'AccountNo': 2,
        'AccountName': "Current account",
        'Balance': 999882.72,
        'UserId': 1
    },
    {
        'AccountId': 3,
        'AccountNo': 3,
        'AccountName': "Savings account",
        'Balance': 7498565,
        'UserId': 2
    },
    {
        'AccountId': 4,
        'AccountNo': 4,
        'AccountName': "Current account",
        'Balance': 672329.34,
        'UserId': 2
    },
    {
        'AccountId': 5,
        'AccountNo': 5,
        'AccountName': "Savings account",
        'Balance': 9812077,
        'UserId': 3
    },
    {
        'AccountId': 6,
        'AccountNo': 6,
        'AccountName': "Current account",
        'Balance': 438902.77,
        'UserId': 3
    },
    {
        'AccountId': 7,
        'AccountNo': 7,
        'AccountName': "Savings account",
        'Balance': 9371037,
        'UserId': 4
    },
    {
        'AccountId': 8,
        'AccountNo': 8,
        'AccountName': "Current account",
        'Balance': 892399.23,
        'UserId': 4
    },
    {
        'AccountId': 9,
        'AccountNo': 9,
        'AccountName': "Savings account",
        'Balance': 8893337,
        'UserId': 5
    },
    {
        'AccountId': 10,
        'AccountNo': 10,
        'AccountName': "Current account",
        'Balance': 992299.47,
        'UserId': 5
    }
]

for account in accounts_data:
    accounts.append(account)

transactions_data = [
    {'TransactionId': 1,'Type': "Withdrawal",'Amount': 8000.00,'Description': "Funds",'AccountId': 1},
    {'TransactionId': 2,'Type': "Withdrawal",'Amount': 5000.00, 'Description': "Funds",'AccountId': 1},
    {'TransactionId': 3,'Type': "Deposit",'Amount': 10000.00,'Description': "Interest",'AccountId': 1},
    {'TransactionId': 4,'Type': "Deposit",'Amount': 9000.00,'Description': "Cash",'AccountId': 1},
    {'TransactionId': 5,'Type': "Withdrawal",'Amount': 3500.00,'Description': "Funds",'AccountId': 1},
    {'TransactionId': 6,'Type': "Withdrawal",'Amount': 12000.00,'Description': "Loan",'AccountId': 2},
    {'TransactionId': 7, 'Type': "Deposit",'Amount': 12000.00,'Description': "Check",'AccountId': 2},
    {'TransactionId': 8,'Type': "Withdrawal",'Amount': 5000.00,'Description': "Funds",'AccountId': 2},
    {'TransactionId': 9,'Type': "Withdrawal",'Amount': 2900.00,'Description': "Bill Payments",'AccountId': 2},
    {'TransactionId': 10,'Type': "Withdrawal",'Amount': 725.00,'Description': "Service Charge",'AccountId': 2},
    {'TransactionId': 11,'Type': "Withdrawal",'Amount': 7799.00,'Description': "Fees",'AccountId': 2},
    {'TransactionId': 12,'Type': "Withdrawal",'Amount': 5000.00,'Description': "Funds",'AccountId': 2},
    {'TransactionId': 13,'Type': "Withdrawal",'Amount': 11000.00,'Description': "Loan",'AccountId': 2},
    {'TransactionId': 14,'Type': "Withdrawal",'Amount': 700.00,'Description': "ATM withdrawal",'AccountId': 2},
    {'TransactionId': 15,'Type': "Deposit",'Amount': 10000.00,'Description': "Investment",'AccountId': 2},
    {'TransactionId': 16,'Type': "Withdrawal",'Amount': 8000.00,'Description': "Funds",'AccountId': 3},
    {'TransactionId': 17,'Type': "Withdrawal",'Amount': 5000.00,'Description': "Funds",'AccountId': 3},
    {'TransactionId': 18,'Type': "Deposit",'Amount': 10000.00,'Description': "Interest",'AccountId': 3},
    {'TransactionId': 19,'Type': "Deposit",'Amount': 9000.00,'Description': "Cash",'AccountId': 3},
    {'TransactionId': 20,'Type': "Withdrawal",'Amount': 3500.00,'Description': "Funds",'AccountId': 3},
    {'TransactionId': 21,'Type': "Deposit",'Amount': 3500.00,'Description': "Refund",'AccountId': 4},
    {'TransactionId': 22,'Type': "Withdrawal",'Amount': 12000.00,'Description': "Loan",'AccountId': 4},
    {'TransactionId': 23,'Type': "Deposit",'Amount': 4590.00,'Description': "Cash",'AccountId': 4},
    {'TransactionId': 24,'Type': "Deposit",'Amount': 10000.00,'Description': "Interest",'AccountId': 4},
    {'TransactionId': 25,'Type': "Withdrawal",'Amount': 2900.00,'Description': "Funds",'AccountId': 4},
    {'TransactionId': 26, 'Type': "Withdrawal", 'Amount': 79.00, 'Description': "Fees", 'AccountId': 4},
    {'TransactionId': 27, 'Type': "Withdrawal", 'Amount': 8000.00, 'Description': "Funds", 'AccountId': 4},
    {'TransactionId': 28, 'Type': "Withdrawal", 'Amount': 5790.00, 'Description': "Fees", 'AccountId': 4},
    {'TransactionId': 29, 'Type': "Withdrawal", 'Amount': 700.00, 'Description': "Service Charge", 'AccountId': 4},
    {'TransactionId': 30, 'Type': "Deposit", 'Amount': 10000.00, 'Description': "Investment", 'AccountId': 4},
    {'TransactionId': 31, 'Type': "Withdrawal", 'Amount': 8000.00, 'Description': "Funds", 'AccountId': 5},
    {'TransactionId': 32, 'Type': "Withdrawal", 'Amount': 5000.00, 'Description': "Funds", 'AccountId': 5},
    {'TransactionId': 33, 'Type': "Deposit", 'Amount': 10000.00, 'Description': "Interest", 'AccountId': 5},
    {'TransactionId': 34, 'Type': "Deposit", 'Amount': 9000.00, 'Description': "Cash", 'AccountId': 5},
    {'TransactionId': 35, 'Type': "Withdrawal", 'Amount': 3500.00, 'Description': "Funds", 'AccountId': 5},
    {'TransactionId': 36, 'Type': "Deposit", 'Amount': 3500.00, 'Description': "Refund", 'AccountId': 6},
    {'TransactionId': 37, 'Type': "Withdrawal", 'Amount': 12000.00, 'Description': "Loan", 'AccountId': 6},
    {'TransactionId': 38, 'Type': "Deposit", 'Amount': 4590.00, 'Description': "Cash", 'AccountId': 6},
    {'TransactionId': 39, 'Type': "Deposit", 'Amount': 10000.00, 'Description': "Electronic", 'AccountId': 6},
    {'TransactionId': 40, 'Type': "Withdrawal", 'Amount': 2900.00, 'Description': "Funds", 'AccountId': 6},
    {'TransactionId': 41, 'Type': "Withdrawal", 'Amount': 330.00, 'Description': "Fees", 'AccountId': 6},
    {'TransactionId': 42, 'Type': "Deposit", 'Amount': 12000.00, 'Description': "Check", 'AccountId': 6},
    {'TransactionId': 43, 'Type': "Withdrawal", 'Amount': 2900.00, 'Description': "Bill Payments", 'AccountId': 6},
    {'TransactionId': 44, 'Type': "Withdrawal", 'Amount': 725.00, 'Description': "Service Charge", 'AccountId': 6},
    {'TransactionId': 45, 'Type': "Withdrawal", 'Amount': 700.00, 'Description': "ATM withdrawal", 'AccountId': 6},
    {'TransactionId': 46, 'Type': "Withdrawal", 'Amount': 8000.00, 'Description': "Funds", 'AccountId': 7},
    {'TransactionId': 47, 'Type': "Withdrawal", 'Amount': 5000.00, 'Description': "Funds", 'AccountId': 7},
    {'TransactionId': 48, 'Type': "Deposit", 'Amount': 10000.00, 'Description': "Interest", 'AccountId': 7},
    {'TransactionId': 49, 'Type': "Deposit", 'Amount': 9000.00, 'Description': "Cash", 'AccountId': 7},
    {'TransactionId': 50, 'Type': "Withdrawal", 'Amount': 3500.00, 'Description': "Funds", 'AccountId': 7},
    {'TransactionId': 51, 'Type': "Withdrawal", 'Amount': 12000.00, 'Description': "Loan", 'AccountId': 8},
    {'TransactionId': 52, 'Type': "Deposit", 'Amount': 12000.00, 'Description': "Check", 'AccountId': 8},
    {'TransactionId': 53, 'Type': "Withdrawal", 'Amount': 5000.00, 'Description': "Funds", 'AccountId': 8},
    {'TransactionId': 54, 'Type': "Withdrawal", 'Amount': 2900.00, 'Description': "Bill Payments", 'AccountId': 8},
    {'TransactionId': 55, 'Type': "Withdrawal", 'Amount': 725.00, 'Description': "Service Charge", 'AccountId': 8},
    {'TransactionId': 56, 'Type': "Withdrawal", 'Amount': 7799.00, 'Description': "Fees", 'AccountId': 8},
    {'TransactionId': 57, 'Type': "Withdrawal", 'Amount': 5000.00, 'Description': "Funds", 'AccountId': 8},
    {'TransactionId': 58, 'Type': "Withdrawal", 'Amount': 11000.00, 'Description': "Loan", 'AccountId': 8},
    {'TransactionId': 59, 'Type': "Withdrawal", 'Amount': 700.00, 'Description': "ATM withdrawal", 'AccountId': 8},
    {'TransactionId': 60, 'Type': "Deposit", 'Amount': 10000.00, 'Description': "Investment", 'AccountId': 8},
    {'TransactionId': 61, 'Type': "Withdrawal", 'Amount': 8000.00, 'Description': "Funds", 'AccountId': 9},
    {'TransactionId': 62, 'Type': "Withdrawal", 'Amount': 5000.00, 'Description': "Funds", 'AccountId': 9},
    {'TransactionId': 63, 'Type': "Deposit", 'Amount': 10000.00, 'Description': "Interest", 'AccountId': 9},
    {'TransactionId': 64, 'Type': "Deposit", 'Amount': 9000.00, 'Description': "Cash", 'AccountId': 9},
    {'TransactionId': 65, 'Type': "Withdrawal", 'Amount': 3500.00, 'Description': "Funds", 'AccountId': 9},
    {'TransactionId': 66, 'Type': "Withdrawal", 'Amount': 12000.00, 'Description': "Loan", 'AccountId': 10},
    {'TransactionId': 67, 'Type': "Deposit", 'Amount': 12000.00, 'Description': "Check", 'AccountId': 10},
    {'TransactionId': 68, 'Type': "Withdrawal", 'Amount': 5000.00, 'Description': "Funds", 'AccountId': 10},
    {'TransactionId': 69, 'Type': "Withdrawal", 'Amount': 2900.00, 'Description': "Bill Payments", 'AccountId': 10},
    {'TransactionId': 70, 'Type': "Withdrawal", 'Amount': 725.00, 'Description': "Service Charge", 'AccountId': 10},
    {'TransactionId': 71, 'Type': "Withdrawal", 'Amount': 7799.00, 'Description': "Fees", 'AccountId': 10},
    {'TransactionId': 72, 'Type': "Withdrawal", 'Amount': 5000.00, 'Description': "Funds", 'AccountId': 10},
    {'TransactionId': 73, 'Type': "Withdrawal", 'Amount': 11000.00, 'Description': "Loan", 'AccountId': 10},
    {'TransactionId': 74, 'Type': "Withdrawal", 'Amount': 700.00, 'Description': "ATM withdrawal", 'AccountId': 10},
    {'TransactionId': 75, 'Type': "Deposit", 'Amount': 10000.00, 'Description': "Investment", 'AccountId': 10}
]

for transaction in transactions_data:
    transactions.append(transaction)

for user in users:
    cursor.execute('''
    INSERT INTO Users (UserId, UserName, Password, Email, Address, Phone, IsAdmin, IsActive) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', 
    (user['UserId'], user['UserName'], user['Password'], user['Email'], 
     user['Address'], user['Phone'], user['IsAdmin'], user['IsActive']))
    
for account in accounts:
    cursor.execute('''
    INSERT INTO Accounts (AccountId, AccountNo, AccountName, Balance, UserId) 
    VALUES (?, ?, ?, ?, ?)''', 
    (account['AccountId'], account['AccountNo'], account['AccountName'], 
     account['Balance'], account['UserId']))
    
for transaction in transactions:
    cursor.execute('''
    INSERT INTO Transactions (TransactionId, Type, Amount, Description, AccountId) 
    VALUES (?, ?, ?, ?, ?)''', 
    (transaction['TransactionId'], transaction['Type'], transaction['Amount'], 
     transaction['Description'], transaction['AccountId']))
    
conn.commit()
conn.close()
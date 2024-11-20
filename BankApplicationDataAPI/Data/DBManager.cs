using BankApplicationDataAPI.Models;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using System.IO;
using System.Reflection.Emit;
using System.Xml.Linq;

namespace BankApplicationDataAPI.Data
{
    public class DBManager : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; } 
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Log> Logs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(@"Data Source = BankData.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            List<User> users = new List<User>();
            List<Account> accounts = new List<Account>();
            List<Transaction> transactions = new List<Transaction>();
            List<Log> logs = new List<Log>();

            String[] fNames = { "Jhon", "Kate" , "Olivia", "Adam", "Peter", "Taylor", "Alice", "Jane", "Bob", "Emma", "Tina", "Hannah"};
            String[] lNames = { "Parker", "Potts", "Brown", "Williams", "White", "Garcia", "Smith", "Jackson", "Wilson", "Doe", "Lee" };
            String[] streets = { "Beech Street", "Derby Street", "Peel Street", "Church Street", "Milton Street", "Broad Street", "West Street", "High Street", "Brunswick Street", "Oak Street" };
            String[] state = { "Melbourne", "Sydney", "Perth", "Cairns", "Darwin", "Bendigo", "Mackay", "Ballina", "Albany" };
            String[] country = { "Victoria", "Queensland", "Tasmania", "South Australia", "Western Australia" };

            Random random = new Random();
            users.Add(new User
            {
                UserId = 9999999,
                UserName = "Admin",
                Password = "123456",
                Email = "admin@gmail.com",
                Address = $"{random.Next(100, 999)},{streets[random.Next(0, streets.Length)]},{state[random.Next(0, state.Length)]},{country[random.Next(0, country.Length)]}",
                Phone = 01239898 + random.Next(0, 10000),
                IsAdmin = true,
                IsActive = true
            });

            for (int i = 1; i <= 10; i++)
            {
                String fName = fNames[random.Next(0, fNames.Length)];
                String lName = lNames[random.Next(0, lNames.Length)];
                users.Add(new User
                {
                    UserId = i,
                    UserName = $"{fName} {lName}",
                    Password = "123456",
                    Email = $"{fName}{lName}{i}@gmail.com",
                    Address = $"{random.Next(100, 999)},{streets[random.Next(0, streets.Length)]},{state[random.Next(0, state.Length)]},{country[random.Next(0, country.Length)]}",
                    Phone = 01239898 + random.Next(0, 10000),
                    IsAdmin = false,
                    IsActive = true
                });
            }

            foreach (var user in users)
            {
                for (int j = 1; j <= 5; j++)
                {
                    long ticks = DateTime.Now.Ticks;
                    int accountNo = (int)(ticks % 1000000);

                    accounts.Add(new Account
                    {
                        AccountId = accounts.Count + 1,
                        AccountNo = accountNo,
                        AccountName = (j % 2 == 0) ? "Saving Account" : "Current Account",
                        Balance = random.Next(1000, 100000),
                        UserId = user.UserId
                    });

                    System.Threading.Thread.Sleep(1);
                }
            }

            foreach (var account in accounts)
            {
                for (int k = 1; k <= 10; k++)
                {
                    transactions.Add(new Transaction
                    {
                        TransactionId = transactions.Count + 1,
                        Type = (k % 2 == 0 ? "Deposit" : "Withdraw"),
                        Amount = random.Next(100, 5000),
                        Description = $"Transaction {k} for {account.AccountName}",
                        AccountId = account.AccountId,
                        DateTime = new DateTime(2000, 1, 1).AddDays(new Random().Next((new DateTime(2023, 12, 31) - new DateTime(2000, 1, 1)).Days))
                    });
                }
            }

            modelBuilder.Entity<User>().HasData(users);
            modelBuilder.Entity<Account>().HasData(accounts);
            modelBuilder.Entity<Transaction>().HasData(transactions);
            modelBuilder.Entity<Log>().HasData(logs);

        }

        private void seedDatabase() {
            List<User> users = new List<User>();
            List<Account> accounts = new List<Account>();
            List<Transaction> transactions = new List<Transaction>();
            List<Log> logs = new List<Log>();

            String[] fNames = { "Jhon", "Kate", "Olivia", "Adam", "Peter", "Taylor", "Alice", "Jane", "Bob", "Emma", "Tina", "Hannah" };
            String[] lNames = { "Parker", "Potts", "Brown", "Williams", "White", "Garcia", "Smith", "Jackson", "Wilson", "Doe", "Lee" };
            String[] streets = { "Beech Street", "Derby Street", "Peel Street", "Church Street", "Milton Street", "Broad Street", "West Street", "High Street", "Brunswick Street", "Oak Street" };
            String[] state = { "Melbourne", "Sydney", "Perth", "Cairns", "Darwin", "Bendigo", "Mackay", "Ballina", "Albany" };
            String[] country = { "Victoria", "Queensland", "Tasmania", "South Australia", "Western Australia" };

            Random random = new Random();

            users.Add(new User
            {
                UserId = 9999999,
                UserName = "Admin",
                Password = "123456",
                Email = "admin@gmail.com",
                Address = $"{random.Next(100, 999)},{streets[random.Next(0, streets.Length)]},{state[random.Next(0, state.Length)]},{country[random.Next(0, country.Length)]}",
                Phone = 01239898 + random.Next(0, 10000),
                IsAdmin = true,
                IsActive = true
            });

            users.Add(new User
            {
                UserId = 9999998,
                UserName = "User",
                Password = "123456",
                Email = "user@gmail.com",
                Address = $"{random.Next(100, 999)},{streets[random.Next(0, streets.Length)]},{state[random.Next(0, state.Length)]},{country[random.Next(0, country.Length)]}",
                Phone = 01239898 + random.Next(0, 10000),
                IsAdmin = false,
                IsActive = true
            });


            for (int i = 1; i <= 10; i++)
            {
                String fName = fNames[random.Next(0, fNames.Length)];
                String lName = lNames[random.Next(0, lNames.Length)];

                users.Add(new User
                {
                    UserId = i,
                    UserName = $"{fName} {lName}",
                    Password = "123456",
                    Email = $"{fName}{lName}{i}@gmail.com",
                    Address = $"{random.Next(100, 999)},{streets[random.Next(0, streets.Length)]},{state[random.Next(0, state.Length)]},{country[random.Next(0, country.Length)]}",
                    Phone = 01239898 + random.Next(0, 10000),
                    IsAdmin = false,
                    IsActive = true
                });
            }

            foreach (var user in users)
            {
                for (int j = 1; j <= 5; j++)
                {
                    long ticks = DateTime.Now.Ticks;
                    int accountNo = (int)(ticks % 1000000); 

                    accounts.Add(new Account
                    {
                        AccountId = accounts.Count + 1,
                        AccountNo = accountNo,
                        AccountName = (j % 2 == 0) ? "Saving Account" : "Current Account",
                        Balance = random.Next(1000, 100000),
                        UserId = user.UserId
                    });

                    System.Threading.Thread.Sleep(1);
                }
            }

            foreach (var account in accounts)
            {
                for (int k = 1; k <= 10; k++)
                {
                    transactions.Add(new Transaction
                    {
                        TransactionId = transactions.Count + 1,
                        Type = (k % 2 == 0 ? "Deposit" : "Withdraw"),
                        Amount = random.Next(100, 5000),
                        Description = $"Transaction {k} for {account.AccountNo} - {account.AccountName}",
                        AccountId = account.AccountId,
                        DateTime = new DateTime(2000, 1, 1).AddDays(new Random().Next((new DateTime(2023, 12, 31) - new DateTime(2000, 1, 1)).Days))
                    });
                }
            }

            SaveChanges();
        }

        public void resetDatabase() {
            this.Database.EnsureDeleted();
            this.Database.EnsureCreated();
            seedDatabase();
        }

    }
}

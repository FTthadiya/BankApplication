using BankApplicationDataAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApplicationDataAPI.Data
{
    public class DBManager : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; } 
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(@"Data Source = BankData.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            List<User> users = new List<User>();
            List<Account> accounts = new List<Account>();
            List<Transaction> transactions = new List<Transaction>();

            User user1 = new User();
            user1.UserId = 1;
            user1.UserName = "Test";
            user1.Password = "123456";
            user1.Email = "user@gmail.com";
            user1.Address = "Address";
            user1.Phone = 0891231231;
            user1.IsAdmin = true;
            users.Add(user1);

            Account account1 = new Account();
            account1.AccountId = 1;
            account1.AccountNo = 0001;
            account1.Balance = 9998282;
            account1.UserId = 1;
            accounts.Add(account1);

            Account account2 = new Account();
            account2.AccountId = 2;
            account2.AccountNo = 0002;
            account2.Balance = 999882.72;
            account2.UserId = 1;
            accounts.Add(account2);

            Transaction transaction1 = new Transaction();
            transaction1.TransactionId = 1;
            transaction1.Type = "Widthdraw";
            transaction1.Amount = 8000.00;
            transaction1.AccountId = 1;
            transactions.Add(transaction1);

            modelBuilder.Entity<User>().HasData(users);
            modelBuilder.Entity<Account>().HasData(accounts);
            modelBuilder.Entity<Transaction>().HasData(transactions);

        }
    }
}

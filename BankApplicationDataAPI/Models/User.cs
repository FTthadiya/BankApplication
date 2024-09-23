namespace BankApplicationDataAPI.Models
{
    public class User
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public long Phone { get; set; }

        public string Address { get; set; }

        public string? Picture { get; set; }

        public string Role { get; set; }

        public ICollection<Account>? Accounts { get; set; } 

    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BankApplicationDataAPI.Models
{
    public class Account
    {
        public int AccountId { get; set; }

        public int AccountNo { get; set; }

        public string AccountName { get; set; } = "Account";

        public double Balance { get; set; }

        public bool IsActive { get; set; }

        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        public ICollection<Transaction>? Transactions { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BankWebApplication.Models
{
    public class Account
    {
        public int AccountId { get; set; }

        public int AccountNo { get; set; }

        public string AccountName { get; set; }

        public double Balance { get; set; }

        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        public ICollection<Transaction>? Transactions { get; set; }
    }
}

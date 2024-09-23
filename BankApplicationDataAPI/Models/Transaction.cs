﻿using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BankApplicationDataAPI.Models
{
    public class Transaction
    {
        public int TransactionId { get; set; }
        public string Type { get; set; }

        public double Amount { get; set; }

        public int AccountId { get; set; }

        [JsonIgnore]
        public Account? Account { get; set; }

        public DateTime DateTime { get; set; } = DateTime.UtcNow;
    }
}

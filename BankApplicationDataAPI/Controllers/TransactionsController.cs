using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankApplicationDataAPI.Data;
using BankApplicationDataAPI.Models;

namespace BankApplicationDataAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly DBManager _context;

        public TransactionsController(DBManager context)
        {
            _context = context;
        }

        // GET: api/Transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            try {
                if (_context.Transactions == null)
                {
                    return NotFound();
                }
                return await _context.Transactions.ToListAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing transactions in data server");
            }
        }

        // GET: api/Transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            try {
                if (_context.Transactions == null)
                {
                    return NotFound();
                }
                var transaction = await _context.Transactions.FindAsync(id);

                if (transaction == null)
                {
                    return NotFound();
                }

                return transaction;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing transactions in data server");
            }
        }

        [HttpGet("account/{acctId}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByAccount(int acctId)
        {
            try {
                if (_context.Transactions == null)
                {
                    return NotFound();
                }
                var transactions = await _context.Transactions.Where(t => t.AccountId == acctId).ToListAsync();

                if (transactions == null)
                {
                    return NotFound();
                }

                return transactions;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing transactions in data server");
            }
        }

        // PUT: api/Transactions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            try {
                if (id != transaction.TransactionId)
                {
                    return BadRequest();
                }

                _context.Entry(transaction).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TransactionExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing transactions in data server");
            }
        }

        // POST: api/Transactions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            try {
                if (_context.Transactions == null)
                {
                    return Problem("Entity set 'DBManager.Transactions'  is null.");
                }

                var account = await _context.Accounts.FindAsync(transaction.AccountId);

                if (account == null)
                {
                    return NotFound("Account " + transaction.AccountId + " does not exist");
                }

                if (transaction.Type == "Withdraw")
                {
                    if (account.Balance > transaction.Amount)
                    {
                        account.Balance = account.Balance - transaction.Amount;
                    }
                    else
                    {
                        return Problem("Insufficient funds");
                    }

                }
                else
                {
                    account.Balance += transaction.Amount;
                }


                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetTransaction", new { id = transaction.TransactionId }, transaction);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing transactions in data server");
            }
        }

        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            try {
                if (_context.Transactions == null)
                {
                    return NotFound();
                }
                var transaction = await _context.Transactions.FindAsync(id);
                if (transaction == null)
                {
                    return NotFound();
                }

                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing transactions in data server");
            }
           
        }

        private bool TransactionExists(int id)
        {
            return (_context.Transactions?.Any(e => e.TransactionId == id)).GetValueOrDefault();
        }
    }
}

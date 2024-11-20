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
    public class AccountsController : ControllerBase
    {
        private readonly DBManager _context;

        public AccountsController(DBManager context)
        {
            _context = context;
        }

        // GET: api/Accounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
        {
            try {
                if (_context.Accounts == null)
                {
                    return NotFound();
                }
                return await _context.Accounts.Include(a => a.Transactions).ToListAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing accounts in data server");
            }
            
        }

        // GET: api/Accounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id)
        {
            try
            {
                if (_context.Accounts == null)
                {
                    return NotFound();
                }
                var account = await _context.Accounts.Include(a => a.Transactions).FirstOrDefaultAsync(a => a.AccountId == id);

                if (account == null)
                {
                    return NotFound();
                }

                return account;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing accounts in data server");
            }
        }

        [HttpGet("acctNo/{acctNo}")]
        public async Task<ActionResult<Account>> GetAccountByAcctNo(int acctNo)
        {
            try {

                if (_context.Accounts == null)
                {
                    return NotFound();
                }
                var account = await _context.Accounts.Include(a => a.Transactions).FirstOrDefaultAsync(a => a.AccountNo == acctNo);

                if (account == null)
                {
                    return NotFound();
                }

                return account;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing accounts in data server");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccountByUserId(int userId)
        {
            try
            {
                if (_context.Accounts == null)
                {
                    return NotFound();
                }
                var accounts = await _context.Accounts.Include(a => a.Transactions).Where(a => a.UserId == userId).ToListAsync();

                if (accounts == null)
                {
                    return NotFound();
                }

                return accounts;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing accounts in data server");
            }

        }

        // PUT: api/Accounts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount(int id, Account account)
        {
            try
            {
                if (id != account.AccountId)
                {
                    return BadRequest();
                }

                _context.Entry(account).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AccountExists(id))
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
                return Problem("Error occurred while processing accounts in data server");
            }

        }

        // POST: api/Accounts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Account>> PostAccount(Account account)
        {
            try {
                if (_context.Accounts == null)
                {
                    return Problem("Entity set 'DBManager.Accounts'  is null.");
                }
                _context.Accounts.Add(account);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAccount", new { id = account.AccountId }, account);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing accounts in data server");
            }
            
        }

        // DELETE: api/Accounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            try {
                if (_context.Accounts == null)
                {
                    return NotFound();
                }
                var account = await _context.Accounts.FindAsync(id);
                if (account == null)
                {
                    return NotFound();
                }

                _context.Accounts.Remove(account);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occurred while processing accounts in data server");
            }
        }

        private bool AccountExists(int id)
        {
            return (_context.Accounts?.Any(e => e.AccountId == id)).GetValueOrDefault();
        }
    }
}

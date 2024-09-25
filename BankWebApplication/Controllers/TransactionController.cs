using BankWebApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace BankWebApplication.Controllers
{
    [Route("api/[controller]")]
    public class TransactionController : Controller
    {
        private RestClient client = new RestClient("http://localhost:5104");

        [HttpGet("account/{acctId}")]
        public ActionResult<IEnumerable<Transaction>> GetUser(int acctId)
        {
            RestRequest request = new RestRequest($"/api/transactions/account/{acctId}", Method.Get);
            RestResponse response = client.Execute(request);
            var transactions = JsonConvert.DeserializeObject<IEnumerable<Transaction>>(response.Content);

            if (response.IsSuccessful)
            {
                return Ok(transactions);
            }
            else { 
                return NotFound("Transactions not found");
            }

        }

        [HttpGet]
        public ActionResult Transfer([FromQuery] int fromAcct ,[FromQuery] int toAcct, [FromQuery] int amount, [FromQuery] string description)
        {
            if(fromAcct == toAcct)
            {
                return BadRequest("Can not transfer to same account");
            }

            RestRequest checkFromAcctReq = new RestRequest($"/api/accounts/{fromAcct}", Method.Get);
            RestResponse checkFromAcctRes = client.Execute(checkFromAcctReq);

            RestRequest checkToAcctReq = new RestRequest($"/api/accounts/{toAcct}", Method.Get);
            RestResponse checkToAcctRes = client.Execute(checkToAcctReq);

            if (!checkFromAcctRes.IsSuccessful || !checkToAcctRes.IsSuccessful)
            {
                return NotFound("Account not found");
            }
            else
            {
                RestRequest withdrawReq = new RestRequest($"/api/transactions", Method.Post);
                Transaction withTransaction = new Transaction();
                withTransaction.AccountId = fromAcct;
                withTransaction.Description = description;
                withTransaction.Amount = amount;
                withTransaction.Type = "Withdraw";
                withdrawReq.AddBody(withTransaction);
                RestResponse withdrawRes = client.Execute(withdrawReq);

                if (!withdrawRes.IsSuccessful)
                {
                    return Problem("Transaction 1 failed: " + withdrawRes.StatusDescription);
                }

                RestRequest depositReq = new RestRequest($"/api/transactions", Method.Post);
                Transaction depoTransaction = new Transaction();
                depoTransaction.AccountId = toAcct;
                depoTransaction.Description = description;
                depoTransaction.Amount = amount;
                depoTransaction.Type = "Deposit";
                depositReq.AddBody(depoTransaction);
                RestResponse depositRes = client.Execute(depositReq);

                if (!depositRes.IsSuccessful)
                {
                    return Problem("Transaction failed: " + depositRes.StatusDescription);
                }

                return Ok("Transaction successful");
            }

        }
    }
}

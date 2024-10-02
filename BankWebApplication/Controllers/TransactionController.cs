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
        public ActionResult<IEnumerable<Transaction>> GetTransactionsByAccount(int acctId)
        {
            RestRequest checkAcctReq = new RestRequest($"/api/accounts/{acctId}", Method.Get);
            RestResponse checkAcctRes = client.Execute(checkAcctReq);
            Account account = JsonConvert.DeserializeObject<Account>(checkAcctRes.Content);

            if (Request.Cookies["UserId"] == null)
            {
                return Unauthorized();
            }

            if (int.Parse(Request.Cookies["UserId"]) != account.UserId)
            {
                return Unauthorized();

            }

            RestRequest request = new RestRequest($"/api/transactions/account/{acctId}", Method.Get);
            RestResponse response = client.Execute(request);

            if (response.IsSuccessful)
            {
                var transactions = JsonConvert.DeserializeObject<IEnumerable<Transaction>>(response.Content);
                return Ok(transactions);
            }
            else { 
                return NotFound("Transactions not found");
            }

        }


        [HttpGet]
        public ActionResult Transfer([FromQuery] int fromAcct ,[FromQuery] int toAcct, [FromQuery] int amount, [FromQuery] string description)
        {

            try
            {

                if (fromAcct == toAcct)
                {
                    return Problem("Can not transfer to same account");
                }

                RestRequest checkFromAcctReq = new RestRequest($"/api/accounts/acctNo/{fromAcct}", Method.Get);
                RestResponse checkFromAcctRes = client.Execute(checkFromAcctReq);

                RestRequest checkToAcctReq = new RestRequest($"/api/accounts/acctNo/{toAcct}", Method.Get);
                RestResponse checkToAcctRes = client.Execute(checkToAcctReq);

                if (!checkFromAcctRes.IsSuccessful || !checkToAcctRes.IsSuccessful)
                {
                    return Problem("Account not found");
                }
                else
                {
                    Account fromAccount = JsonConvert.DeserializeObject<Account>(checkFromAcctRes.Content);
                    Account toAccount = JsonConvert.DeserializeObject<Account>(checkToAcctRes.Content);

                    if (Request.Cookies["UserId"] == null)
                    {
                        return Unauthorized();
                    }

                    if (int.Parse(Request.Cookies["UserId"]) != fromAccount.UserId)
                    {
                        return Unauthorized();

                    }

                    RestRequest withdrawReq = new RestRequest($"/api/transactions", Method.Post);
                    Transaction withTransaction = new Transaction();
                    withTransaction.AccountId = fromAccount.AccountId;
                    withTransaction.Description = description;
                    withTransaction.Amount = amount;
                    withTransaction.Type = "Withdraw";
                    withdrawReq.AddBody(withTransaction);
                    RestResponse withdrawRes = client.Execute(withdrawReq);

                    if (!withdrawRes.IsSuccessful)
                    {
                        return Problem("Transaction failed: " + withdrawRes.StatusDescription);
                    }

                    RestRequest depositReq = new RestRequest($"/api/transactions", Method.Post);
                    Transaction depoTransaction = new Transaction();
                    depoTransaction.AccountId = toAccount.AccountId;
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
            catch {

                return Problem("An unexpected error occured");
            }

        }
    }
}

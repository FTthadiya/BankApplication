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

        public IActionResult Index(int id)
        {

            if (Request.Cookies.ContainsKey("UserID"))
            {
                return PartialView();
            }

            return PartialView("TransactionError");
        }

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

        
    }
}

using BankWebApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace BankWebApplication.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private RestClient client = new RestClient("http://localhost:5104");

        [HttpGet("{id}")]
        public ActionResult<IEnumerable<Account>> GetAccountsByUser(int id)
        {
            if (int.Parse(Request.Cookies["UserId"]) != id)
            {
                return Problem("Unauthorized");
            }

            try
            {
                RestRequest request = new RestRequest($"/api/accounts/user/{id}", Method.Get);
                RestResponse response = client.Execute(request);
                IEnumerable<Account> accounts = JsonConvert.DeserializeObject<IEnumerable<Account>>(response.Content);

                if (response.IsSuccessful)
                {
                    return Ok(accounts);
                }
                else
                {
                    return NotFound("No accounts found");

                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Error occured while processing accounts in server");
            }
        }
    }
}

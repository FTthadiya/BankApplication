using BankWebApplication.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BankWebApplication.Controllers
{

    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private RestClient client = new RestClient("http://localhost:5104");

        public IActionResult Index()
        {
           return PartialView();
        }

        [HttpPost]
        public ActionResult Login([FromBody] User user)
        {
            try
            {
                RestRequest checkRequest = new RestRequest($"/api/users/email/{user.Email}", Method.Get);
                RestResponse checkResponse = client.Execute(checkRequest);
                User existingUser = JsonConvert.DeserializeObject<User>(checkResponse.Content);

                if (checkResponse.StatusCode == System.Net.HttpStatusCode.NotFound || existingUser == null)
                {
                    return Unauthorized("Email or password is invalid");
                }
                else
                {
                    if (existingUser.IsActive == false)
                    {
                        return Problem("User account inactive");
                    }

                    if (existingUser.Password.Equals(user.Password))
                    {
                        Response.Cookies.Append("userId", existingUser.UserId.ToString());
                        Response.Cookies.Append("isAdmin", existingUser.IsAdmin.ToString());
                        return Ok("Authenticated");
                    }
                    else 
                    { 
                        return Unauthorized("Email or password is invalid");
                    }
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Problem("Unexpected error occured in server");
            }
        }
    }
}

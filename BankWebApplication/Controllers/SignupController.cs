using BankWebApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace BankWebApplication.Controllers
{
    [Route("api/[controller]")]
    public class SignupController : Controller
    {
        private RestClient client = new RestClient("http://localhost:5104");
        // POST: SignupController/Create
        [HttpPost]
        public ActionResult Signup([FromBody] User user)
        {
            try
            {
                RestRequest checkRequest = new RestRequest($"/api/users/email/{user.Email}", Method.Get);
                RestResponse checkResponse = client.Execute(checkRequest);
                User existingUser = JsonConvert.DeserializeObject<User>(checkResponse.Content);

                if (checkResponse.IsSuccessful)
                {
                    return BadRequest("User already exists");
                }
                else
                {
                    RestRequest signupRequest = new RestRequest("/api/users", Method.Post);
                    signupRequest.AddBody(user);
                    RestResponse signupResponse = client.Execute(signupRequest);
                    User createdUser = JsonConvert.DeserializeObject<User>(signupResponse.Content);
                    return Created("User", createdUser);
                }

            }
            catch
            {
                return Problem("Problem");
            }
        }
        // View request handlers
        [HttpGet]
        public ActionResult SignupView()
        {
            return PartialView("SignupView");
        }

        [HttpGet("error")]
        public IActionResult ErrorView()
        {
            // Return the partial view as HTML
            return PartialView("SignupErrorView");
        }

    }
}

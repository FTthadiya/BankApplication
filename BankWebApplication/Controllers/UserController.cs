using BankWebApplication.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace BankWebApplication.Controllers
{

    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private RestClient client = new RestClient("http://localhost:5104");

        public IActionResult Index()
        {
            if (Request.Cookies.ContainsKey("UserID"))
            {
                return PartialView();
            }
            return PartialView("UserError");
        }

        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            if (int.Parse(Request.Cookies["UserId"]) != id)
            {
                return Problem("Unauthorized");
            }

            try
            {
                RestRequest request = new RestRequest($"/api/users/{id}", Method.Get);
                RestResponse response = client.Execute(request);
                User user = JsonConvert.DeserializeObject<User>(response.Content);

                if (response.StatusCode == System.Net.HttpStatusCode.NotFound || user == null)
                {
                    return NotFound("User not found");
                }

                return Ok(user);
            }
            catch(Exception e) {
                return Problem("Unexpected error occured");
            
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser([FromBody] User user)
        {
            if (int.Parse(Request.Cookies["UserId"]) != user.UserId)
            {
                return Problem("Unauthorized");
            }

            try {
                RestRequest request = new RestRequest($"/api/users/{user.UserId}", Method.Put);
                request.AddBody(user);
                RestResponse response = client.Execute(request);

                if (response.IsSuccessful)
                {
                    RestRequest getRequest = new RestRequest($"/api/users/{user.UserId}", Method.Get);
                    RestResponse getResponse = client.Execute(getRequest);
                    User newUser = JsonConvert.DeserializeObject<User>(getResponse.Content);
                    return Ok(newUser);
                }
                else
                {
                    return Problem("Update process failed");
                }
            }
            catch (Exception e)
            {
                return Problem("Unexpected error occured");

            }
            
        }
    }
}

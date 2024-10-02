using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BankWebApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace BankApplicationDataAPI.Controllers
{
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private String DataService = "http://localhost:5104/";
        private RestClient client;

        [HttpPost("user")]
        public IActionResult CreateUser([FromBody] User newUser)
        {
            try
            {
                client = new RestClient(DataService);
                RestRequest request = new RestRequest("api/users", Method.Post);
                request.AddJsonBody(newUser);
                RestResponse response = client.Execute(request);

                if (!response.IsSuccessful)
                {
                    return BadRequest("Could not create user.");
                }

                Log log = new Log
                {
                    TimeStamp = DateTime.Now,
                    Action = "Create",
                    LogMessage = "User account created: " + newUser.UserId
                };
                CreateLog(log);

                return CreatedAtAction(nameof(GetUserById), new { id = newUser.UserId }, newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("user")]
        public IActionResult UpdateUser([FromBody] User user)
        {
            try
            {
                client = new RestClient(DataService);
                RestRequest request = new RestRequest("api/users/{id}", Method.Put);
                request.AddUrlSegment("id", user.UserId);
                request.AddJsonBody(user);
                RestResponse response = client.Execute(request);

                if (!response.IsSuccessful)
                {
                    return BadRequest("Could not update user.");
                }

                Log log = new Log
                {
                    TimeStamp = DateTime.Now,
                    Action = "Update",
                    LogMessage = "User account updated: " + user.UserId
                };
                CreateLog(log);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]
        public IActionResult ResetPassword([FromQuery] int userId, [FromBody] string newPassword)
        {
            try
            {
                client = new RestClient(DataService);
                RestRequest request = new RestRequest("api/users/reset-password/{id}", Method.Put);
                request.AddUrlSegment("id", userId);
                request.AddJsonBody(new { Password = newPassword });
                RestResponse response = client.Execute(request);

                if (!response.IsSuccessful)
                {
                    return BadRequest("Could not reset password.");
                }

                Log log = new Log
                {
                    TimeStamp = DateTime.Now,
                    Action = "Reset Password",
                    LogMessage = "Password reset for user: " + userId
                };
                CreateLog(log);

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        /*[HttpPut]
        public IActionResult ToggleAccount([FromQuery] int accId)
        {
            var logMsg = "";

            client = new RestClient(DataService);
            RestRequest request = new RestRequest("api/accounts/{id}", Method.Get);
            request.AddUrlSegment("id", accId);
            RestResponse response = client.Execute(request);

            Account account = JsonConvert.DeserializeObject<Account>(response.Content);

            if (account != null)
            {
                request = new RestRequest("api/accounts/{id}", Method.Put);
                request.AddUrlSegment("id", account.AccountId);

                if (!account.IsActive)
                {
                    account.IsActive = true;
                    logMsg = "User account activated: ";
                }
                else
                {
                    account.IsActive = false;
                    logMsg = "User account deactivated: ";
                }

                request.AddJsonBody(account);
                response = client.Execute(request);

                Log log = new Log
                {
                    TimeStamp = DateTime.Now,
                    Action = "Toggle Account",
                    LogMessage = logMsg + account.UserId
                };
                CreateLog(log);

                return NoContent();
            }

            return NotFound();
        }
*/
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string term)
        {
            client = new RestClient(DataService);
            RestRequest request = new RestRequest("api/users", Method.Get);
            RestResponse response = client.Execute(request);

            if (string.IsNullOrWhiteSpace(term))
            {
                IEnumerable<User> users = JsonConvert.DeserializeObject<IEnumerable<User>>(response.Content);
                return new ObjectResult(users) { StatusCode = 200 };
            }

            User user = JsonConvert.DeserializeObject<IEnumerable<User>>(response.Content).FirstOrDefault(u => u.UserName.Equals(term));

            if (user == null)
            {
                request = new RestRequest("api/accounts/acctNo/{accNo}", Method.Get);
                request.AddUrlSegment("accNo", Int32.Parse(term));
                response = client.Execute(request);

                int id = JsonConvert.DeserializeObject<Account>(response.Content).UserId;

                request = new RestRequest("api/users/{id}", Method.Get);
                request.AddUrlSegment("id", id);
                response = client.Execute(request);

                user = JsonConvert.DeserializeObject<User>(response.Content);


            }

            if (user == null)
            {
                return NotFound();
            }


            return new ObjectResult(user) { StatusCode = 200 };
        }


        [HttpGet("transactions")]
        public IActionResult SearchTransactions([FromQuery] string filter, [FromQuery] string sortOrder)
        {
            client = new RestClient(DataService);
            RestRequest request = new RestRequest("api/transactions", Method.Get);
            request.AddQueryParameter("filter", filter);
            request.AddQueryParameter("sortOrder", sortOrder);
            RestResponse response = client.Execute(request);

            if (!response.IsSuccessful)
            {
                return NotFound();
            }

            IEnumerable<Transaction> transactions = JsonConvert.DeserializeObject<IEnumerable<Transaction>>(response.Content);
            return Ok(transactions);
        }

        [HttpGet("logs")]
        public IActionResult GetAllLogs()
        {
            client = new RestClient(DataService);
            RestRequest request = new RestRequest("api/logs", Method.Get);
            RestResponse response = client.Execute(request);
            IEnumerable<Log> logs = JsonConvert.DeserializeObject<IEnumerable<Log>>(response.Content);
            return Ok(logs);
        }

        [HttpPost("logs")]
        private void CreateLog(Log log)
        {
            client = new RestClient(DataService);
            RestRequest request = new RestRequest("api/logs", Method.Post);
            request.AddJsonBody(log);
            client.Execute(request);
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserById(int id)
        {
            client = new RestClient(DataService);
            RestRequest request = new RestRequest("api/users/{id}", Method.Get);
            request.AddUrlSegment("id", id);

            RestResponse response = client.Execute(request);
            if (!response.IsSuccessful)
            {
                return NotFound();
            }

            User user = JsonConvert.DeserializeObject<User>(response.Content);
            return Ok(user);
        }
    }
}

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

        [HttpGet]
        public IActionResult Index()
        {

            if (Request.Cookies.ContainsKey("UserID"))
            {
                return PartialView();
            }
            return PartialView("Welcome");
        }

        [HttpPost("user")]
		public IActionResult CreateUser([FromBody] User newUser)
		{
			try
			{
				client = new RestClient(DataService);

				RestRequest checkRequest = new RestRequest("api/users", Method.Get);
				RestResponse checkResponse = client.Execute(checkRequest);

				IEnumerable<User> users = JsonConvert.DeserializeObject<IEnumerable<User>>(checkResponse.Content);

				if (users.Any(u => u.Email.Equals(newUser.Email, StringComparison.OrdinalIgnoreCase)))
				{
					return BadRequest("Email already exists. Cannot create new user.");
				}

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
					LogMessage = "User account created"
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

        [HttpDelete("user/{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                client = new RestClient(DataService);
                RestRequest request = new RestRequest($"api/users/{id}", Method.Delete);
                RestResponse response = client.Execute(request);

                if (!response.IsSuccessful)
                {
                    return BadRequest("Could not delete user.");
                }

                Log log = new Log
                {
                    TimeStamp = DateTime.Now,
                    Action = "Delete",
                    LogMessage = "User account deleted: " + id
                };
                CreateLog(log);

                return Ok();
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

		[HttpPut("toggle/{userId}")]
		public IActionResult ToggleUser([FromRoute] int userId)
		{
			client = new RestClient(DataService);
			RestRequest request = new RestRequest($"api/users/{userId}", Method.Get);
			RestResponse response = client.Execute(request);

			if (!response.IsSuccessful)
			{
				return NotFound("User not found.");
			}

			User user = JsonConvert.DeserializeObject<User>(response.Content);

			if (user != null)
			{
				request = new RestRequest($"api/users/{userId}", Method.Put);
				user.IsActive = !user.IsActive; 
				request.AddJsonBody(user);
				response = client.Execute(request);

				if (!response.IsSuccessful)
				{
					return BadRequest("Could not update user status.");
				}

				string logMsg = user.IsActive ? "User account activated: " : "User account deactivated: ";

				Log log = new Log
				{
					TimeStamp = DateTime.Now,
					Action = "Toggle User",
					LogMessage = logMsg + user.UserName
				};
				CreateLog(log);

				return NoContent();
			}

			return NotFound("User not found.");
		}



        [HttpGet("search")]
        public IActionResult Search([FromQuery] string term)
        {
            client = new RestClient(DataService);
            RestRequest request = new RestRequest("api/users", Method.Get);
            RestResponse response = client.Execute(request);

            if (!response.IsSuccessful)
            {
                return NotFound("Failed to retrieve users.");
            }

            IEnumerable<User> allUsers = JsonConvert.DeserializeObject<IEnumerable<User>>(response.Content);

            if (string.IsNullOrWhiteSpace(term))
            {
                
                var userList = allUsers.Select(u => new {
                    u.UserId,
                    u.UserName,
                    u.IsActive,
                    u.Email,
                    u.Phone,
                    u.Address,
                    u.IsAdmin,
                    u.Password,
                    Accounts = u.Accounts.Select(a => new { a.AccountId, a.AccountName }) 
                }).ToArray();

                return Ok(userList);
            }

            var matchingUsers = allUsers.Where(u => u.UserName.Contains(term, StringComparison.OrdinalIgnoreCase)).ToList();

            if (matchingUsers.Any())
            {
                var result = matchingUsers.Select(u => new {
                    u.UserId,
                    u.UserName,
                    u.IsActive,
                    u.Email,
                    u.Phone,
                    u.Address,
                    u.IsAdmin,
                    u.Password,
                    Accounts = u.Accounts.Select(a => new { a.AccountId, a.AccountName })
                }).ToArray();

                return Ok(result);
            }

            if (int.TryParse(term, out int accountNo))
            {
                request = new RestRequest("api/accounts/acctNo/{accNo}", Method.Get);
                request.AddUrlSegment("accNo", accountNo);
                response = client.Execute(request);

                if (!response.IsSuccessful)
                {
                    return NotFound("Account not found.");
                }

                var account = JsonConvert.DeserializeObject<Account>(response.Content);
                if (account != null)
                {
                    int id = account.UserId;
                    request = new RestRequest("api/users/{id}", Method.Get);
                    request.AddUrlSegment("id", id);
                    response = client.Execute(request);

                    if (!response.IsSuccessful)
                    {
                        return NotFound("User not found.");
                    }

                    var user = JsonConvert.DeserializeObject<User>(response.Content);

                    var result = new[] {
                new {
                    user.UserId,
                    user.UserName,
                    user.IsActive,
                    user.Email,
                    user.Phone,
                    user.Address,
                    user.IsAdmin,
                    Accounts = user.Accounts.Select(a => new { a.AccountId, a.AccountName }) 
				}
            };

                    return Ok(result); 
                }
            }

            return NotFound("User not found.");
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

		[HttpGet("transactions/{transactionId}")]
		public IActionResult SearchTransactionById([FromRoute] int transactionId)
		{
			try
			{
				client = new RestClient(DataService);
				RestRequest request = new RestRequest("api/transactions/{transactionId}", Method.Get);
				request.AddUrlSegment("transactionId", transactionId);
				RestResponse response = client.Execute(request);

				if (!response.IsSuccessful)
				{
					return NotFound("Transaction not found.");
				}

				Transaction transaction = JsonConvert.DeserializeObject<Transaction>(response.Content);
				if (transaction == null)
				{
					return NotFound("Transaction not found.");
				}

				return Ok(transaction);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
        }

		// transactions/sortByAmount?sortOrder = asc
		// transactions/sortByAmount?sortOrder = desc
        [HttpGet("transactions/sortByAmount")]
        public IActionResult SortTransactionsByAmount([FromQuery] string sortOrder)
        {
            client = new RestClient(DataService);
            RestRequest request = new RestRequest("api/transactions", Method.Get);
            RestResponse response = client.Execute(request);

            if (!response.IsSuccessful)
            {
                return NotFound("Failed to retrieve transactions.");
            }

            if (string.IsNullOrEmpty(response.Content))
            {
                return Ok(new List<Transaction>()); 
            }

            IEnumerable<Transaction> transactions = JsonConvert.DeserializeObject<IEnumerable<Transaction>>(response.Content);

            transactions = string.IsNullOrEmpty(sortOrder) || sortOrder.ToLower() != "asc"
                ? transactions.OrderBy(t => t.Amount)
                : transactions.OrderByDescending(t => t.Amount);

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

        [HttpGet("account")]
        public ActionResult<IEnumerable<Account>> GetAccounts()
        {

            try
            {
                client = new RestClient(DataService);
                RestRequest request = new RestRequest($"/api/accounts/", Method.Get);
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

        [HttpPost("account")]
        public IActionResult CreateAccount([FromBody] Account account)
        {
            try
            {
                int acctNo = 0;
                bool generate = true;

                while (generate)
                {
                    Random random = new Random();
                    acctNo = random.Next();

                    client = new RestClient(DataService);
                    RestRequest checkRequest = new RestRequest("api/accounts/acctNo/"+acctNo, Method.Get);
                    RestResponse checkResponse = client.Execute(checkRequest);
                    Console.WriteLine(acctNo);
                    if (checkResponse.StatusCode == System.Net.HttpStatusCode.NotFound)
                    { 
                        generate = false;
                        break;
                    }
                    
                }

                if (acctNo == 0)
                {
                    return Problem("An error occured while generating ID");
                }

                account.AccountNo = acctNo;

                RestRequest request = new RestRequest("api/accounts", Method.Post);
                request.AddJsonBody(account);
                RestResponse response = client.Execute(request);

                if (!response.IsSuccessful)
                {
                    return BadRequest("Could not create user.");
                }

                Log log = new Log
                {
                    TimeStamp = DateTime.Now,
                    Action = "Create",
                    LogMessage = "Bank account created: " + acctNo
                };
                CreateLog(log);

                return Created("Account created", account);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }

}

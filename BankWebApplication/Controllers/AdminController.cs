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

				// Check if email already exists
				RestRequest checkRequest = new RestRequest("api/users", Method.Get);
				RestResponse checkResponse = client.Execute(checkRequest);

				// Deserialize the list of users
				IEnumerable<User> users = JsonConvert.DeserializeObject<IEnumerable<User>>(checkResponse.Content);

				// Check if a user with the same email exists
				if (users.Any(u => u.Email.Equals(newUser.Email, StringComparison.OrdinalIgnoreCase)))
				{
					return BadRequest("Email already exists. Cannot create new user.");
				}

				// If email doesn't exist, create the user
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
				user.IsActive = !user.IsActive; // Toggle the active status
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

			// Return all users if no search term is provided
			if (string.IsNullOrWhiteSpace(term))
			{
				// Map the users to the desired format and return as an array
				var userList = allUsers.Select(u => new {
					u.UserId,
					u.UserName,
					u.IsActive,
					u.Email,
					u.Phone,
					u.Address,
					u.IsAdmin,
					Accounts = u.Accounts.Select(a => new { a.AccountId, a.AccountName }) // Adjust based on actual account properties
				}).ToArray(); // Ensure it is an array

				return Ok(userList);
			}

			// Search for the user by username
			User user = allUsers.FirstOrDefault(u => u.UserName.Equals(term, StringComparison.OrdinalIgnoreCase));

			if (user == null)
			{
				// Try to parse the term as an account number
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

						user = JsonConvert.DeserializeObject<User>(response.Content);
					}
				}
			}

			// If a user is found, return as an array
			if (user != null)
			{
				// Map the found user to the desired format and return as an array
				var result = new[] {
			new {
				user.UserId,
				user.UserName,
				user.IsActive,
				user.Email,
				user.Phone,
				user.Address,
				user.IsAdmin,
				Accounts = user.Accounts.Select(a => new { a.AccountId, a.AccountName }) // Adjust based on actual account properties
            }
		};

				return Ok(result); // Return the user in an array
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

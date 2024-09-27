using BankWebApplication.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BankWebApplication.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            if (Request.Cookies.ContainsKey("UserID"))
            {
                return View();
            }

            return View("Welcome");
        }

        [HttpGet("login")]
        public IActionResult Login() { 
            return View("LoginView"); 
        }

        [HttpGet("accounts")]
        public IActionResult Accounts()
        {
            return View("AccountsView");
        }

        [HttpGet("transactions/{id}")]
        public IActionResult Transactions(int id)
        {
            ViewBag.acctId = id;
            return View("Transactions");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

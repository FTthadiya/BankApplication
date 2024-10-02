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
        [HttpGet]
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
            return View(); 
        }

        [HttpGet("accounts")]
        public IActionResult Accounts()
        {
            if (Request.Cookies.ContainsKey("UserID"))
            {
                return View();
            }

            return View("Welcome");
        }

        [HttpGet("transactions/{id}")]
        public IActionResult Transactions(int id)
        {

            if (Request.Cookies.ContainsKey("UserID"))
            {
                ViewBag.acctId = id;
                return View();
            }

            return View("Welcome");
        }

        [HttpGet("transfer")]
        public IActionResult Transfer(int id)
        {
            if (Request.Cookies.ContainsKey("UserID"))
            {
                return View();
            }

            return View("Welcome");
        }

        [HttpGet("profile")]
        public IActionResult Profile()
        {
            if (Request.Cookies.ContainsKey("UserID"))
            {
                return View();
            }

            return View("Welcome");
        }

        [HttpGet("admin")]
        public IActionResult Admin()
        {
            if (Request.Cookies.ContainsKey("isAdmin"))
            {
                if (Request.Cookies["isAdmin"].Equals("True"))
                {
                    return View();
                }
            }

            return View("Welcome");
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

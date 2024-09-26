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
            return PartialView();
        }

        public IActionResult Welcome()
        {
            if (Request.Cookies.ContainsKey("UserID"))
            {
                return PartialView("Overview");
            }

            return PartialView("Welcome");
        }

        public IActionResult Overview()
        {
            Request.Cookies.ContainsKey("UserID");
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

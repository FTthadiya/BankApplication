// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var test = "test";

function getCookieByName(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}


function loadView(view) {
    var apiUrl = '/home/welcome';
    if (view === "login")
        apiUrl = '/api/login/';
    if (view === "signup")
        apiUrl = '/api/signup/';

    const userId = getCookieByName("userId")
    if (userId != null)
    {
        document.getElementById('logoutBtn').style.display = "block";
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Handle the data from the API
            document.getElementById('main').innerHTML = data;
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });

}

const logout = () => {
    document.getElementById('logoutBtn').style.display = "none";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    loadView();
}

const login = async () => {


    var email = document.getElementById('emailInput').value;
    var password = document.getElementById('passwordInput').value;

    if (email == null || email == "" || password == "" || password == null) {
        console.log(email + " " + password)
        alert("Please enter email and password")
        return;
    }

    var data = {
        email: email,
        password: password
    };

    const apiUrl = '/api/login/';
    const headers = {
        'Content-Type': 'application/json',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    };

    const res = await fetch(apiUrl, requestOptions);

    if (res.ok) {

        loadView("Welcome")
    }
    else {

        alert("Username or password invalid")
    }

}

//function performAuth() {

//    var name = document.getElementById('SName').value;
//    var password = document.getElementById('SPass').value;
//    var data = {
//        UserName: name,
//        PassWord: password
//    };
//    console.error(data);
//    const apiUrl = '/api/login/auth';

//    const headers = {
//        'Content-Type': 'application/json', // Specify the content type as JSON if you're sending JSON data
//        // Add any other headers you need here
//    };

//    const requestOptions = {
//        method: 'POST',
//        headers: headers,
//        body: JSON.stringify(data) // Convert the data object to a JSON string
//    };

//    fetch(apiUrl, requestOptions)
//        .then(response => {
//            if (!response.ok) {
//                throw new Error('Network response was not ok');
//            }
//            return response.json();
//        })
//        .then(data => {
//            // Handle the data from the API
//            const jsonObject = data;
//            if (jsonObject.login) {
//                loadView("authview");
//                document.getElementById('LogoutButton').style.display = "block";
//            }
//            else {
//                loadView("error");
//            }

//        })
//        .catch(error => {
//            // Handle any errors that occurred during the fetch
//            console.error('Fetch error:', error);
//        });

//}




document.addEventListener("DOMContentLoaded", loadView);
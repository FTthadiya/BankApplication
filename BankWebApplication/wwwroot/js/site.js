// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var test = "test";


function loadView(status) {
    var apiUrl = '/api/signup/';
    if (status === "authview")
        apiUrl = '/api/login/authview';
    if (status === "SignupError")
        apiUrl = '/api/signup/error';
    if (status === "about")
        apiUrl = '/api/about/view';
    if (status === "logout")
        apiUrl = '/api/logout';

    console.log("Hello " + apiUrl);

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
            if (status === "logout") {
                document.getElementById('LogoutButton').style.display = "none";
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });

}


function performAuth() {

    var name = document.getElementById('SName').value;
    var password = document.getElementById('SPass').value;
    var data = {
        UserName: name,
        PassWord: password
    };
    console.error(data);
    const apiUrl = '/api/login/auth';

    const headers = {
        'Content-Type': 'application/json', // Specify the content type as JSON if you're sending JSON data
        // Add any other headers you need here
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data) // Convert the data object to a JSON string
    };

    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the data from the API
            const jsonObject = data;
            if (jsonObject.login) {
                loadView("authview");
                document.getElementById('LogoutButton').style.display = "block";
            }
            else {
                loadView("error");
            }

        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });

}


const signup = () => {


}


document.addEventListener("DOMContentLoaded", loadView);
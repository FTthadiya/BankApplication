// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


//var test = "test";
const getCookieByName = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

const userId = getCookieByName("userId");

const verifyLogin = async () => {
    const user = getCookieByName("userId");
    if (user == null) {
        Toastify({
            text: "Please login to continue",
            duration: 3000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            className: "btn-danger",
            style: {
                background: "#dc3545"
            },
            onClick: function () { } // Callback after click
        }).showToast();
        await new Promise(r => setTimeout(r, 1000));
        loadUserView("login");
    }
    else {

        await getCurUser();

        const isAdmin = getCookieByName("isAdmin");

        if (isAdmin == "True") {
            loadUserView("admin");
        }

    }

};

const getCurUser = async () => {
    try {

        const userId = getCookieByName("userId");

        const apiUrl = '/api/user/' + userId;

        const res = await fetch(apiUrl);


        if (res.ok) {

            const data = await res.json();
            if (data.picture != null) {
                document.getElementById('navProfileIcon').src = data.picture;
                document.getElementById('navProfileIcon').style.display = "Block";
            }
            else {

                document.getElementById('navProfileIcon').src = data.picture;
                document.getElementById('navProfileIcon').style.display = "None";
            }
            

            return data;
        }
        else {

            const data = await res.json();

            Toastify({
                text: `${data.detail}`,
                duration: 2000,
                newWindow: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                className: "btn-danger",
                style: {
                    background: "#dc3545"
                },
                onClick: function () { } // Callback after click
            }).showToast();
        }

    }
    catch (error) {
        Toastify({
            text: `${error}`,
            duration: 3000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            className: "btn-danger",
            style: {
                background: "#dc3545"
            },
            onClick: function () { } // Callback after click
        }).showToast();
    }

};

const loadUserView = (status, id) => {
    apiUrl = '/home/dashboard';

    if (status == "login")
        apiUrl = '/api/login';
    else if (status == "profile")
        apiUrl = '/api/user';
    else if (status == "accounts")
        apiUrl = '/api/account';
    else if (status == "transactions")
        apiUrl = '/api/transaction/';
    else if (status == "transfer")
        apiUrl = '/api/transfer/';
    else if (status == "admin")
        apiUrl = '/api/admin/';
    else
        status = "index"

    if (status != "index" && status != "login" && status != "admin") {
        verifyLogin();
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
            loadScripts(status, id);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}
document.addEventListener("DOMContentLoaded", loadUserView);

const loadScripts = (view, id) => {
    document.getElementById('userNavLinks').style.display = "flex";
    document.getElementById('adminNavLinks').style.display = "none";

    var user = getCookieByName("userId");
    if (view == "index" && user != null) {
        const isAdmin = getCookieByName("isAdmin");

        if (isAdmin == "True") {
            loadUserView("admin");
        } else {
            loadUserData();
        }
    }
    else if (view == "profile" && user != null) {
        displayUser();
    }
    else if (view == "accounts" && user != null) {
        loadAccounts();
    }
    else if (view == "transactions" && user != null) {
        loadTransactionsData(id);
    }
    else if (view == "transfer" && user != null) {
        loadTransferAccounts();
    }
    else if (view == "admin") {
        document.getElementById('userNavLinks').style.display = "none";
        document.getElementById('adminNavLinks').style.display = "flex";
        adminLoadUsers();
    }
    
}


if (userId != null) {
    document.getElementById('logoutBtn').style.display = "block";
}
else {
    document.getElementById('navProfileIcon').style.display = "none";
    document.getElementById('logoutBtn').style.display = "none";
}

const logout = () => {
    document.getElementById('logoutBtn').style.display = "none";
    document.getElementById('navProfileIcon').style.display = "none";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    loadUserView("index");
}


const showMessageBox = (data) => {
    document.getElementById('messageBoxOverlay').style.visibility = "visible";
    document.getElementById('messageBoxTitle').innerText = data.title;
    document.getElementById('messageBoxBody').innerText = data.desc;
}

const closeMessageBox = () => {
    document.getElementById('messageBoxOverlay').style.visibility = "collapse";
}


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

const verifyLogin = async() => {
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
        window.location.href = '/login';

    }

}

const getCurUser = async () => {
    try {

        const userId = getCookieByName("userId");

        const apiUrl = '/api/user/' + userId;

        const res = await fetch(apiUrl);


        if (res.ok) {

            const data = await res.json();
            document.getElementById('navProfileIcon').src = data.picture;
            document.getElementById('navProfileIcon').style.display = "Block";

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
    window.location.href = '/';
}


const showMessageBox = (data) => {
    document.getElementById('messageBoxOverlay').style.visibility = "visible";
    document.getElementById('messageBoxTitle').innerText = data.title;
    document.getElementById('messageBoxBody').innerText = data.desc;
}

const closeMessageBox = () => {
    document.getElementById('messageBoxOverlay').style.visibility = "collapse";
}
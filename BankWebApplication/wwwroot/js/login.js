const login = async () => {

    var email = document.getElementById('emailInput').value;
    var password = document.getElementById('passwordInput').value;

    if (email == null || email == "" || password == "" || password == null) {
        Toastify({
            text: "Please enter a email and password",
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
        return;
    }

    document.getElementById('loginBtn').style.display = "none";
    document.getElementById('loginLoadingBtn').style.display = "block";


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
    try {


        const res = await fetch(apiUrl, requestOptions);
        if (res.ok) {
            Toastify({
                text: "Successfully logged in",
                duration: 3000,
                newWindow: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                className: "success",
                style: {
                    background: "#198754"
                },
                onClick: function () { } // Callback after click
            }).showToast();
            await new Promise(r => setTimeout(r, 1000));
            document.getElementById('logoutBtn').style.display = "block";

            loadUserView("index");
        }
        else {

            Toastify({
                text: "Login Failed",
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

    document.getElementById('loginBtn').style.display = "block";
    document.getElementById('loginLoadingBtn').style.display = "none";
}
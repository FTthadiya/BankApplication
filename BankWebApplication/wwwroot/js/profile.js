var userDetails;

const displayUser = async () => {

    verifyLogin();


    userDetails = await getCurUser();
    if (userDetails != null) {
        if (userDetails.picture != null) {
            setPictureFromString(userDetails.picture);
        }
        document.getElementById('profileName').value = userDetails.userName;
        document.getElementById('profileEmail').value = userDetails.email;
        document.getElementById('profilePhone').value = userDetails.phone;
        document.getElementById('profileAddress').value = userDetails.address;
    }
    else {
        alert("Error profile")
    }
}

const showEdit = () => {
    if (userDetails != null) {
        document.getElementById('pInputsCard').style.display = "block";

        document.getElementById('pUsernameInput').value = userDetails.userName;
        document.getElementById('pEmailInput').value = userDetails.email;
        document.getElementById('pPhoneInput').value = userDetails.phone;
        document.getElementById('pAddressInput').value = userDetails.address;
        document.getElementById('pPasswordInput').value = userDetails.password;
        document.getElementById('pPasswordConfInput').value = userDetails.password;
    }
}

const hideEdit = () => {
    document.getElementById('pInputsCard').style.display = "none";
}

const updateUser = async () => {

    try {
        var picture = await getPictureAsString();
        var username = document.getElementById('pUsernameInput').value;
        var email = document.getElementById('pEmailInput').value;
        var phone = document.getElementById('pPhoneInput').value;
        var address = document.getElementById('pAddressInput').value;
        var password = document.getElementById('pPasswordInput').value;
        var confPassword = document.getElementById('pPasswordConfInput').value;

        if (password != confPassword) {
            Toastify({
                text: "Passwords should match",
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

        document.getElementById('pUpdateBtn').style.display = "none";
        document.getElementById('pUpdateLoadingBtn').style.display = "block";

        var data;

        if (picture == null) {
            data = {
                UserId: userDetails.userId,
                UserName: username,
                Password: password,
                Phone: phone,
                Email: email,
                Address: address,
                isAdmin: userDetails.isAdmin,
                isActive: userDetails.isActive,
                Picture: userDetails.picture
            };
        }
        else {
            data = {
                UserId: userDetails.userId,
                UserName: username,
                Password: password,
                Phone: phone,
                Email: email,
                Address: address,
                isAdmin: userDetails.isAdmin,
                isActive: userDetails.isActive,
                Picture: picture

            };
        }



        const apiUrl = '/api/user/' + userDetails.UserId;
        const headers = {
            'Content-Type': 'application/json',
        };

        const requestOptions = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        };

        const res = await fetch(apiUrl, requestOptions);
        if (res.ok) {
            Toastify({
                text: "User profile updated",
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

            displayUser();
        }
        else {
            const data = await res.json();

            Toastify({
                text: `${data.detail}`,
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

    document.getElementById('pUpdateBtn').style.display = "block";
    document.getElementById('pUpdateLoadingBtn').style.display = "none";
}

const getPictureAsString = async () => {
    const fileInput = document.getElementById('pPictureInput');

    const file = fileInput.files[0];

    if (file == null) {
        return null;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            resolve(event.target.result); // This is the base64-encoded string
        };

        reader.onerror = function () {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
}

const setPictureFromString = (base64String) => {
    const imgElement = document.getElementById('profileImage');
    imgElement.src = base64String;
}

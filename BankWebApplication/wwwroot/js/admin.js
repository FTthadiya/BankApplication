document.getElementById('userNavLinks').style.display = "None";
document.getElementById('adminNavLinks').style.display = "Flex";

const showView = (view) => {
    if (view == "USERS") {
        document.getElementById('usersView').style.display = "Flex";
        document.getElementById('logsView').style.display = "None";
        document.getElementById('transactionsView').style.display = "None";

    }
    else if (view == "TRANSACTIONS") {
        document.getElementById('usersView').style.display = "None";
        document.getElementById('logsView').style.display = "None";
        document.getElementById('transactionsView').style.display = "Flex";
    }
    else if (view == "LOGS") {
        document.getElementById('usersView').style.display = "None";
        document.getElementById('transactionsView').style.display = "None";
        document.getElementById('logsView').style.display = "Flex";
    }
}

var users;
var selectedUser;

const loadUsers = async (term) => {

    try {

        var apiUrl = null;

        if (term == undefined || term == null) {
            apiUrl = `/api/admin/search`;
        }
        else {
            apiUrl = `/api/admin/search?term=${term}`;
        }

        

        const res = await fetch(apiUrl);

        if (res.ok) {

            const data = await res.json();
            users = data;

            console.log(data);


            if (data.length == 0) {
                document.getElementById("usersList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-4 justify-content-center text-center">No users found</div>`;

            }
            else {
                const elements = data.map(u =>

                    `<div class="card d-flex flex-row gap-4 mt-4 p-3 w-100 justify-content-between align-items-center">
                    <h4 class="my-auto">${u.userName}</h4>
                    <p class="my-auto">Id: ${u.userId}</p>
                    <p class="my-auto">No of accounts: ${u.accounts.length}</p>
                    <button class="btn btn-warning" onclick="toggleAccount(${u.userId})">${u.isActive ? "Deactivate" : "Activate"}</button>
                    <button class="btn btn-warning" onclick="openUserEdit(${u.userId})">Edit</button>
            </div>`

                ).join('')

                document.getElementById("usersList").innerHTML = elements;
            }
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


}

loadUsers();

const onUserSearchBtnClick = () => {
    const fileInput = document.getElementById('userSearchInput').value;

    loadUsers(fileInput);
}


const openUserEdit = (userId) => {
    const userDetails = users.find(item => {
        return item.userId == userId
    })
    selectedUser = userDetails;
    if (userDetails != null) {

        document.getElementById('pUsernameInput').value = userDetails.userName;
        document.getElementById('pEmailInput').value = userDetails.email;
        document.getElementById('pPhoneInput').value = userDetails.phone;
        document.getElementById('pAddressInput').value = userDetails.address;
        document.getElementById('pPasswordInput').value = userDetails.password;
        document.getElementById('pPasswordConfInput').value = userDetails.password;
    }
}

const updateOrCreateUser = async (isCreate) => {

    var userDetails = selectedUser;

    try {
        var picture = await getPictureAsString();
        console.log(picture);
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

        if (isCreate) {
            document.getElementById('pCreateUserBtn').style.display = "none";
            document.getElementById('pCreateUserLoadingBtn').style.display = "block";
        }
        else {
            document.getElementById('pUpdateUserBtn').style.display = "none";
            document.getElementById('pUpdateUserLoadingBtn').style.display = "block";
        }

        


        var data;

        if (userDetails == null) {
            data = {
                UserName: username,
                Password: password,
                Phone: phone,
                Email: email,
                Address: address,
                Picture: picture
            };
        }
        else if (picture == null) {
            data = {
                UserId: userDetails.userId,
                UserName: username,
                Password: password,
                Phone: phone,
                Email: email,
                Address: address,
                IsAdmin: userDetails.isAdmin,
                IsActive: userDetails.isActive,
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
                IsAdmin: userDetails.isAdmin,
                IsActive: userDetails.isActive,
                Picture: picture

            };
        }

        const headers = {
            'Content-Type': 'application/json',
        };


        var apiUrl;
        var requestOptions;

        if (isCreate) {
            apiUrl = '/api/admin/' + userDetails.UserId;
            requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            };

        }
        else {
            apiUrl = '/api/admin/user';
            requestOptions = {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(data)
            };

        }


        const res = await fetch(apiUrl, requestOptions);
        if (res.ok) {
            Toastify({
                text: `User profile ${isCreate ? "Create" : "Update"}`,
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

    document.getElementById('pUpdateUserBtn').style.display = "block";
    document.getElementById('pUpdateUserLoadingBtn').style.display = "none";
    document.getElementById('pCreateUserBtn').style.display = "block";
    document.getElementById('pCreateUserLoadingBtn').style.display = "none";

    loadUsers();

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

const toggleAccount = () => {
    loadUsers();
};

/////////////////////// Transactions //////////////////////////////////////
var transactions;

const loadTransactionsData = async () => {
    try {

        const apiUrl = '/api/admin/transactions';

        console.log("Transcations CALLED");

        const res = await fetch(apiUrl);

        if (res.ok) {
            const data = await res.json();

            transactions = data;

            console.log(data);
            renderTransactions(data);
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

}

loadTransactionsData();

const renderTransactions = (data) => {

    if (data.length == 0) {
        document.getElementById("transactionsList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No transactions found</div>`;
    }
    else {
        const elements = data.slice(0).reverse().map(a =>

            `<div class="card d-flex flex-row gap-4 m-4 p-3 justify-content-between">
                    <p>${new Date(a.dateTime).toLocaleString()}</p>
                    <p>${a.type}</p>
                    <p>Amount: ${a.amount}</p>
                    <button class="btn btn-warning" onclick="showMessageBox({title: 'Transaction - ${a.amount} ${a.type}', desc: '${a.description}' })">Description</button>
            </div>`

        ).join('')

        document.getElementById("transactionsList").innerHTML = elements;
    }

}

const onTransactionFilterChange = () => {
    const fromDate = document.getElementById("transactionFromDate").value;
    const toDate = document.getElementById("transactionToDate").value;

    if (fromDate != "" && toDate != "") {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.dateTime);
            return transactionDate >= from && transactionDate <= to;
        });

        renderTransactions(filteredTransactions);
    }

};

const resetTransactionFilter = () => {
    renderTransactions(transactions);
    document.getElementById("transactionFromDate").value = "";
    document.getElementById("transactionToDate").value = "";
}

const searchTransactions = () => {

};

////////////////////////////////////// Logs //////////////////////////////////////////

const loadLogs = async () => {

    try {


        const apiUrl = '/api/admin/logs'

        const res = await fetch(apiUrl);

        if (res.ok) {

            const data = await res.json();

            if (data.length == 0) {
                document.getElementById("logsList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No logs found</div>`;

            }
            else {
                const elements = data.map(l =>

                    `<div class="card d-flex flex-row gap-4 m-4 p-3 justify-content-between align-items-center">
                    <h4 class="my-auto">${l.logId}</h4>
                    <p class="my-auto">${l.timeStamp}</p>
                    <p class="my-auto">Action: ${l.action}</p>
                    <button class="btn btn-warning" onclick="showMessageBox({title: 'Log - ${l.logId}', desc: '${l.logMessage}' })">Log Message</button>
                    </div>`

                ).join('')

                document.getElementById("logsList").innerHTML = elements;
            }
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


}

loadLogs();
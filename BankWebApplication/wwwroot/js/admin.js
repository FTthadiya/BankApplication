document.getElementById('userNavLinks').style.display = "None";
document.getElementById('adminNavLinks').style.display = "Flex";

const showView = (view) => {
    if (view == "USERS") {
        document.getElementById('usersView').style.display = "Flex";
        document.getElementById('accountsView').style.display = "None";
        document.getElementById('logsView').style.display = "None";
        document.getElementById('transactionsView').style.display = "None";

        adminLoadUsers();
    }
    else if (view == "TRANSACTIONS") {
        document.getElementById('usersView').style.display = "None";
        document.getElementById('logsView').style.display = "None";
        document.getElementById('accountsView').style.display = "None";
        document.getElementById('transactionsView').style.display = "Flex";

        adminLoadTransactionsData();
    }
    else if (view == "LOGS") {
        document.getElementById('usersView').style.display = "None";
        document.getElementById('transactionsView').style.display = "None";
        document.getElementById('accountsView').style.display = "None";
        document.getElementById('logsView').style.display = "Flex";

        adminLoadLogs();

    }
    else if (view == "ACCOUNTS") {
        document.getElementById('usersView').style.display = "None";
        document.getElementById('transactionsView').style.display = "None";
        document.getElementById('logsView').style.display = "None";
        document.getElementById('accountsView').style.display = "Block";

        adminLoadAccounts();
    }
}

var users;
var selectedUser;

const adminLoadUsers = async (term) => {

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
                    <h4 class="my-auto w-25">${u.userName}</h4>
                    <p class="my-auto w-25">Id: ${u.userId}</p>
                    <button class="btn btn-warning w-25" onclick="adminOpenUserEdit(${u.userId})">Edit</button>
                    <button class="btn btn-warning w-25" onclick="adminToggleAccount(${u.userId})">${u.isActive ? "Deactivate" : "Activate"}</button>
                    <button class="btn btn-danger w-25" onclick="adminDeleteAccount(${u.userId})">Delete</button>
            </div>`

                ).join('')

                document.getElementById("usersList").innerHTML = elements;
            }
        }
        else {

            try {
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
            catch {
                Toastify({
                    text: `Server replied with a error: ${res.status}`,
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


const adminOnUserSearchBtnClick = () => {
    const fileInput = document.getElementById('userSearchInput').value;

    adminLoadUsers(fileInput);
}


const adminOpenUserEdit = (userId) => {
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

const adminUpdateOrCreateUser = async (isCreate) => {

    var userDetails = selectedUser;

    try {
        var picture = await adminGetPictureAsString();
        console.log(picture);
        var username = document.getElementById('pUsernameInput').value;
        var email = document.getElementById('pEmailInput').value;
        var phone = document.getElementById('pPhoneInput').value;
        var address = document.getElementById('pAddressInput').value;
        var password = document.getElementById('pPasswordInput').value;
        var confPassword = document.getElementById('pPasswordConfInput').value;

        if (username == "" || email == "" || phone == "" || address == "") {
            Toastify({
                text: "Please fill all fields",
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

        if (password == "") {
            Toastify({
                text: "Password is required for updating",
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
        var newUserData = {
            UserName: username,
            Password: password,
            Phone: phone,
            Email: email,
            Address: address,
            Picture: picture
        };

        if (userDetails == null) {
            data = null;
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

            newUserData = {
                UserName: username,
                Password: password,
                Phone: phone,
                Email: email,
                Address: address,
                Picture: picture
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

            newUserData = {
                UserName: username,
                Password: password,
                Phone: phone,
                Email: email,
                Address: address,
                Picture: picture
            };
        }

        const headers = {
            'Content-Type': 'application/json',
        };


        var apiUrl;
        var requestOptions;

        if (isCreate) {
            // Ensure userDetails is not used to create a user
            document.getElementById('pCreateUserBtn').style.display = "none";
            document.getElementById('pCreateUserLoadingBtn').style.display = "block";

            // The API URL should not include userId for creating a new user
            apiUrl = '/api/admin/user'; // Updated for creating a new user
            requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(newUserData)
            };
        } else {
            // Ensure userDetails is defined before accessing properties
            if (!userDetails) {
                Toastify({
                    text: `No User Selected`,
                    duration: 3000,
                    newWindow: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    className: "btn-danger",
                    style: {
                        background: "#dc3545"
                    },
                    onClick: function () { }
                }).showToast();
                document.getElementById('pUpdateUserBtn').style.display = "block";
                document.getElementById('pUpdateUserLoadingBtn').style.display = "none";
                document.getElementById('pCreateUserBtn').style.display = "block";
                document.getElementById('pCreateUserLoadingBtn').style.display = "none";
                return;
            }

            // For updating, we should use userDetails.userId
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
            try {
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
            catch {
                Toastify({
                    text: `Server replied with a error: ${res.status}`,
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

    adminLoadUsers();

} 

const adminGetPictureAsString = async () => {
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

const adminSetPictureFromString = (base64String) => {
    const imgElement = document.getElementById('profileImage');
    imgElement.src = base64String;
}

const adminToggleAccount = async (userId) => {
    try {
        const res = await fetch(`/api/admin/toggle/${userId}`, {
            method: 'PUT'
        });
        if (res.ok) {
            // Reload users after successful toggle
            adminLoadUsers();
        } else {
            try {
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
            catch {
                Toastify({
                    text: `Server replied with a error: ${res.status}`,
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
    } catch (error) {
        Toastify({
            text: `${error}`,
            duration: 3000,
            gravity: "top",
            position: "right",
            className: "btn-danger",
            style: { background: "#dc3545" }
        }).showToast();
    }
};

const adminDeleteAccount = async (userId) => {
    try {
        const res = await fetch(`/api/admin/user/${userId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            // Reload users after successful toggle
            adminLoadUsers();
            Toastify({
                text: `User Deleted`,
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
        } else {
            try {
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
            catch {
                Toastify({
                    text: `Server replied with a error: ${res.status}`,
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
    } catch (error) {

        Toastify({
            text: `${error}`,
            duration: 3000,
            gravity: "top",
            position: "right",
            className: "btn-danger",
            style: { background: "#dc3545" }
        }).showToast();
    }
};


/////////////////////// Transactions //////////////////////////////////////
var transactions;
var filteredTransactions;

const adminLoadTransactionsData = async () => {
    try {

        const apiUrl = '/api/admin/transactions';

        console.log("Transcations CALLED");

        const res = await fetch(apiUrl);

        if (res.ok) {
            const data = await res.json();

            transactions = data;
            filteredTransactions = data;

            console.log(data);
            adminRenderTransactions(data);
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


const adminRenderTransactions = (data) => {

    if (data.length == 0) {
        document.getElementById("transactionsList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No transactions found</div>`;
    }
    else {
        const elements = data.slice(0).reverse().map(a =>

            `<div class="card d-flex flex-row gap-4 m-4 p-3 justify-content-between">
                    <p>ID: ${a.transactionId}</p>
                    <p>${new Date(a.dateTime).toLocaleString()}</p>
                    <p>${a.type}</p>
                    <p>Amount: ${a.amount}</p>
                    <button class="btn btn-warning" onclick="showMessageBox({title: 'Transaction - ${a.amount} ${a.type}', desc: '${a.description}' })">Description</button>
            </div>`

        ).join('')

        document.getElementById("transactionsList").innerHTML = elements;
    }

}

const adminOnTransactionFilterChange = async () => {
    const fromDate = document.getElementById("transactionFromDate").value;
    const toDate = document.getElementById("transactionToDate").value;
    const sort = document.getElementById("transactionSort").value;

    filteredTransactions = transactions;


    if (sort == "asc" || sort == "desc") {
        try {

            const apiUrl = '/api/admin/transactions/sortByAmount?sortOrder='+sort;

            const res = await fetch(apiUrl);

            if (res.ok) {
                const data = await res.json()

                filteredTransactions = data;
            }
            else {

                 try {
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
            catch {
                Toastify({
                    text: `Server replied with a error: ${res.status}`,
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

    if (fromDate != "" && toDate != "") {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        filteredTransactions = filteredTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.dateTime);
            return transactionDate >= from && transactionDate <= to;
        });

    }

    adminRenderTransactions(filteredTransactions);
};


const adminResetTransactionFilter = () => {
    adminRenderTransactions(transactions);
    document.getElementById("transactionFromDate").value = "";
    document.getElementById("transactionToDate").value = "";
}

const adminSearchTransactions = async () => {
    // Get the transaction ID from the input field
    const transactionIdInput = document.getElementById('transactionSearchInput').value;

    // Check if the input is valid
    if (!transactionIdInput) {
        Toastify({
            text: "Please enter a transaction ID.",
            duration: 3000,
            gravity: "top",
            position: "right",
            className: "btn-danger",
            style: {
                background: "#dc3545"
            }
        }).showToast();
        return;
    }

    const transactionId = parseInt(transactionIdInput);

    // Make the API call
    try {
        const res = await fetch(`/api/admin/transactions/${transactionId}`);

        if (!res.ok) {
            const errorData = await res.json();
            Toastify({
                text: errorData.detail || "Transaction not found.",
                duration: 3000,
                gravity: "top",
                position: "right",
                className: "btn-danger",
                style: {
                    background: "#dc3545"
                }
            }).showToast();
            return;
        }

        const transaction = await res.json();

    
        // Display the transaction details in the transactions list
        const transactionsList = document.getElementById('transactionsList');

        // Check if the transaction has valid data
        if (!transaction || Object.keys(transaction).length === 0) {
            transactionsList.innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No transaction details found</div>`;
        } else {
           

            const transactionHTML = `
                <div class="card d-flex flex-row gap-4 m-4 p-3 justify-content-between">
                    <p>ID: ${transaction.transactionId}</p>
                    <p>${new Date(transaction.dateTime).toLocaleString()}</p>                    
                    <p>${transaction.type}</p>
                    <p>Amount: ${transaction.amount}</p>
                    <button class="btn btn-warning" onclick="showMessageBox({title: 'Transaction - ${transaction.amount} ${transaction.type}', desc: '${transaction.description}' })">Description</button>
                </div>
            `;
            transactionsList.innerHTML = transactionHTML;

        }


    } catch (error) {
        Toastify({
            text: `Error fetching transaction: ${error.message}`,
            duration: 3000,
            gravity: "top",
            position: "right",
            className: "btn-danger",
            style: {
                background: "#dc3545"
            }
        }).showToast();
    }
};




////////////////////////////////////// Logs //////////////////////////////////////////

const adminLoadLogs = async () => {

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
                    <p class="my-auto">${Date(l.timeStampnew).toString()}</p>
                    <p class="my-auto">Action: ${l.action}</p>
                    <button class="btn btn-warning" onclick="showMessageBox({title: 'Log - ${l.logId}', desc: '${l.logMessage}' })">Log Message</button>
                    </div>`

                ).join('')

                document.getElementById("logsList").innerHTML = elements;
            }
        }
        else {

            try {
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
            catch {
                Toastify({
                    text: `Server replied with a error: ${res.status}`,
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


///////////////////////////// Account /////////////////////////////////////////


const adminLoadAccounts = async () => {

    try {


        const apiUrl = '/api/admin/account/';

        const res = await fetch(apiUrl);

        if (res.ok) {

            const data = await res.json();


            if (data.length == 0) {
                document.getElementById("accountsList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No accounts found</div>`;

            }
            else {
                const elements = data.map(a =>

                    `<div class="card d-flex flex-row gap-4 m-4 p-3 justify-content-between align-items-center">
                    <h4 class="my-auto w-25">${a.accountName}</h4>
                    <p class="my-auto w-25">Account No: ${a.accountNo}</p>
                    <p class="my-auto w-25">Owner: ${a.userId}</p>
                    <p class="my-auto w-25">Balance: ${a.balance}</p>
            </div>`

                ).join('')

                document.getElementById("accountsList").innerHTML = elements;
            }
        }
        else {

            try {
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
            catch {
                Toastify({
                    text: `Server replied with a error: ${res.status}`,
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


const adminCreateAccount = async () => {

    document.getElementById('aCreateAccountBtn').style.display = "none";
    document.getElementById('aCreateAccountLoadingBtn').style.display = "block";

    try {

    const userId = document.getElementById("aUserIdInput").value;
    const name = document.getElementById("aAcctNameInput").value;

    const data = {
        accountName: name,
        UserId: userId
    }


    const headers = {
        'Content-Type': 'application/json',
    };

        // The API URL should not include userId for creating a new user
       apiUrl = '/api/admin/account'; // Updated for creating a new user
       const requestOptions = {
       method: 'POST',
       headers: headers,
       body: JSON.stringify(data)
        };


        const res = await fetch(apiUrl, requestOptions);
        if (res.ok) {
            Toastify({
                text: `Account created`,
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

            adminLoadAccounts();

        }
        else {
            try {
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
            catch {
                Toastify({
                    text: `Server replied with a error: ${res.status}`,
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

    document.getElementById('aCreateAccountBtn').style.display = "block";
    document.getElementById('aCreateAccountLoadingBtn').style.display = "none";
}
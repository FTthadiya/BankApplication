
const loadTransferAccounts = async () => {
    verifyLogin();

    try {

        const userId = getCookieByName("userId");

        const apiUrl = '/api/account/' + userId;

        const res = await fetch(apiUrl);

        if (res.ok) {

            const data = await res.json();


            if (data.length == 0) {
                document.getElementById("accountsList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No accounts found</div>`;

            }
            else {
                const elements = data.map(a =>

                    `<option value="${a.accountNo}">${a.accountName} - ${a.accountNo}</option>`

                ).join('')

                document.getElementById("tFromAccSelector").innerHTML = elements;
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



const transferMoney = async () => {

    try {

        var fromAcc = document.getElementById("tFromAccSelector").value;
        var toAcc = document.getElementById('tToAccInput').value;
        var amount = document.getElementById('tAmountInput').value;
        var description = document.getElementById('tDescriptionInput').value;

        


        if (fromAcc == "" || toAcc == "" || amount == "" || description == "") {
            Toastify({
                text: "Please check the inputs and try again",
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

        document.getElementById('transferBtn').style.display = "none";
        document.getElementById('transferLoadingBtn').style.display = "block";

        const apiUrl = `/api/transfer/transferMoney?fromAcct=${fromAcc}&toAcct=${toAcc}&amount=${amount}&description=${description}`;

        const res = await fetch(apiUrl);

        if (res.ok) {
            Toastify({
                text: "Transfer successful",
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

            document.getElementById('tToAccInput').value = "";
            document.getElementById('tAmountInput').value = "";
            document.getElementById('tDescriptionInput').value = "";
        }
        else {
            Toastify({
                text: `Transaction process failed: ${res.status}`,
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

        document.getElementById('transferBtn').style.display = "block";
        document.getElementById('transferLoadingBtn').style.display = "none";

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
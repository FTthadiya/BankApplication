
verifyLogin();

const loadAccounts = async () => {

    try {

        const userId = getCookieByName("userId");

        const apiUrl = '/api/account/' + userId;

        const res = await fetch(apiUrl);

        if (res.ok) {

            const data = await res.json();

            console.log(data);
            console.log("Accounts CALLED");


            if (data.length == 0) {
                document.getElementById("accountsList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No accounts found</div>`;

            }
            else {
                const elements = data.map(a =>

                    `<div class="card d-flex flex-row gap-4 m-4 p-3 justify-content-between align-items-center">
                    <h4 class="my-auto">${a.accountName}</h4>
                    <p class="my-auto">Account No: ${a.accountNo}</p>
                    <p class="my-auto">Balance: ${a.balance}</p>
                    <button class="btn btn-warning" onclick="loadTransactions(${a.accountId})">Transactions</button>
            </div>`

                ).join('')

                document.getElementById("accountsList").innerHTML = elements;
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

loadAccounts();


const loadTransactions = (id) => {

    window.location.href = "/transactions/" + id;
}
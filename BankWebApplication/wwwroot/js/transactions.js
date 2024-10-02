var transactions;
document.getElementById('navProfileIcon').style.display = "None";

const loadTransactionsData = async (id) => {

    try {

        const apiUrl = '/api/transaction/account/' + id;

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

    if (fromDate != "" && toDate != "")
    {
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
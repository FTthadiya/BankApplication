var transactions;

const loadData = async (id) => {

    const apiUrl = '/api/transaction/account/' + id;

    const res = await fetch(apiUrl);

    const data = await res.json();

    transactions = data;

    console.log(data);

    if (data.length == 0) {
        document.getElementById("accountsList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No accounts found</div>`;

    }
    else {
        renderTransactions(data);
    }

}

const renderTransactions = (data) => {
    const elements = data.map(a =>

        `<div class="card d-flex flex-row gap-4 m-4 p-3 justify-content-between">
                <h4>${a.transactionId}</h4>
                <p>${a.type}</p>
                <p>Amount: ${a.amount}</p>
                <button class="btn btn-warning" onclick="test()">Description</button>
        </div>`

    ).join('')

    document.getElementById("accountsList").innerHTML = elements;
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
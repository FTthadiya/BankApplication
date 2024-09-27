

const loadData = async() => {

    const userId = getCookieByName("userId");

    const apiUrl = '/api/account/' + userId;

    const res = await fetch(apiUrl);

    const data = await res.json();

    console.log(data);

    if (data.length == 0) {
        document.getElementById("accountsList").innerHTML = `<div class="card d-flex flex-row gap-4 m-4 p-5 justify-content-center text-center">No accounts found</div>`;

    }
    else {
        const elements = data.map(a =>

            `<div class="card d-flex flex-row gap-4 m-4 p-3 justify-content-between">
                <h4>${a.accountName}</h4>
                <p>${a.accountNo}</p>
                <p>Balance: ${a.balance}1</p>
                <button class="btn btn-warning" onclick="loadTransactions(${a.accountId})">Transactions</button>
        </div>`

        ).join('')

        document.getElementById("accountsList").innerHTML = elements;
    }

}

loadData();


const loadTransactions = (id) => {

    window.location.href = "/transactions/" + id;
}
verifyLogin();

const welcomePrompt = async () => {
    const user = await getCurUser();

    Toastify({
        text: `Logged in as ${user.userName}`,
        duration: 1000,
        newWindow: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "success",
        style: {
            background: "#ffc107",
            color: "#111111"
        },
        onClick: function () { } // Callback after click
    }).showToast();
};

welcomePrompt();

const loadUserData = async () => {

    const curUser = await getCurUser();

    document.getElementById("dashUsername").innerText = curUser.userName;
    document.getElementById("dashEmail").innerText = curUser.email;
    document.getElementById("dashAccounts").innerText = "Accounts: " + curUser.accounts.length;
    if (curUser.picture != null) {
        document.getElementById("dashProfilePicture").src = curUser.picture;
    }



    const data = curUser.accounts;


            if (data.length == 0) {
                document.getElementById("dashAccountsList").innerHTML = `<div class="card d-flex my-auto flex-row p-5 justify-content-center">No accounts found</div>`;

            }
            else {
                const elements = data.map(a =>

                    `<div class="card d-flex flex-row gap-4 mt-2 p-4 align-items-center" onclick="navigateToAccounts()">
                    <h5 class="card-title text-muted w-50">${a.accountName}</h5>
                    <p class="bg-warning rounded p-2 my-auto w-50">Balance: ${a.balance}</p>
                    </div>
                    `

                ).join('')

                document.getElementById("dashAccountsList").innerHTML = elements;
            }

}

loadUserData();

const navigateToAccounts = () => {
    window.location.href = "/accounts"
}

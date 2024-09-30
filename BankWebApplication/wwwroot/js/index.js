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
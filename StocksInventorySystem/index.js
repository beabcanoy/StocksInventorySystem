let loginAttempts = 0;

const setEventListeners = () => {
    document.getElementById("btnLogin").addEventListener("click", (e) => {
        e.preventDefault();
        login();
    });
}

const login = () => {

    let validateForm = false;

    const url = 'http://localhost/StocksInventorySystem/api/login.php';

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    let uname_feedback = document.getElementById("username_validation");
    let pword_feedback = document.getElementById("password_validation");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "") {
        usernameInput.classList.add("is-invalid");
        uname_feedback.innerHTML = "&#42;username is required";
    } else {
        usernameInput.classList.remove("is-invalid");
        uname_feedback.innerHTML = "";
    }

    if (password === "") {
        passwordInput.classList.add("is-invalid");
        pword_feedback.innerHTML = "&#42;password is required";
    } else {
        passwordInput.classList.remove("is-invalid");
        pword_feedback.innerHTML = "";
    }

    if (username !== "" && password !== "") {
        validateForm = true;
    }


    if(validateForm){
        const json = {
            username: username,
            password: password
        }

        loginAttempts++;

        if (loginAttempts >= 3) {
            disableLoginForm();
            startCountdown(60);
        }

        const formData = new FormData();
        formData.append("json", JSON.stringify(json));
        formData.append("operation", "login");

        axios({
            url: url,
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
            if (response.data.user) {

            let user_type= response.data.user.type;

            if (user_type == 1) {
                user_type = "Administrator";
            } else {
                user_type = "Employee";
            }

            if(user_type == "Administrator" || user_type == "Employee"){
                const user_details = response.data.user;
                sessionStorage.setItem("acc_firstname", user_details.first_name);
                sessionStorage.setItem("acc_lastname", user_details.last_name);
                sessionStorage.setItem("acc_avatar", user_details.avatar);
                sessionStorage.setItem("acc_gender", user_details.gender);
                sessionStorage.setItem("acc_contact", user_details.contact);
                sessionStorage.setItem("acc_address", user_details.address);
                sessionStorage.setItem("acc_email", user_details.email);
                sessionStorage.setItem("acc_username", user_details.username);
                sessionStorage.setItem("acc_type", user_type);
                sessionStorage.setItem("acc__id", user_details.user_id);
            }

            if(user_type == "Administrator"){
                window.location = 'admin/dashboard.html';
            } else {
                window.location = 'employee/dashboard.html';
            }

            } else {
                let message = "Invalid username or password";
                showNotificationModal(message);

                document.getElementById('username').value = "";
                document.getElementById('password').value = "";
                uname_feedback.innerHTML = "";
                pword_feedback.innerHTML = "";
            }
        }).catch(error => {
            showNotificationModal(error);
        })
    }
}

const disableLoginForm = () => {
    document.getElementById('username').disabled = true;
    document.getElementById('password').disabled = true;
}

const enableLoginForm = () => {
    document.getElementById('username').disabled = false;
    document.getElementById('password').disabled = false;
}

const startCountdown = (seconds) => {
    let remainingTime = seconds;

    const countdownInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            updateCountdownDisplay(remainingTime);
            sessionStorage.setItem('remainingTime', remainingTime);
        } else {
            clearInterval(countdownInterval);
            enableLoginForm();
            updateCountdownDisplay(0);
            sessionStorage.removeItem('remainingTime');
        }
    }, 1000);
}

const updateCountdownDisplay = (seconds) => {
    const countdownDisplay = document.getElementById('countdown');
    
    if (seconds > 0) {
        countdownDisplay.innerHTML = `Login again in ${seconds} seconds`;
    } else {
        countdownDisplay.innerHTML = "";
    }
}

window.onload = () => {
    const remainingTime = sessionStorage.getItem('remainingTime');
    if (remainingTime) {
        startCountdown(parseInt(remainingTime));
        disableLoginForm();
    }
}

const showNotificationModal = (message) =>{
document.getElementById("responseModalMainDiv").innerHTML = message;

const closeBtn = document.createElement("button");
closeBtn.innerText = "Close";
closeBtn.classList.add("btn", "text-primary", "border-0", "w-25");
closeBtn.setAttribute("data-bs-dismiss", "modal");

document.getElementById("responseModalMainDiv2").innerHTML = "";
document.getElementById("responseModalMainDiv2").append(closeBtn);

const responseNotifModal = new bootstrap.Modal(document.getElementById("responseModal"), {
    keyboard: true,
    backdrop: "static"
});
responseNotifModal.show();

}

setEventListeners();
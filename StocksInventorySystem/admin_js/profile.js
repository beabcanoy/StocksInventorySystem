const displayUserInfo = () => {
    document.getElementById("user_info").innerText = "";

    var userInfoList = document.createElement("ul");
    userInfoList.classList.add("list-group", "list-group-flush");

    var userFields = [
        { label: "First name", value: sessionStorage.acc_firstname },
        { label: "Last name", value: sessionStorage.acc_lastname },
        { label: "Gender", value: sessionStorage.acc_gender },
        { label: "Contact", value: sessionStorage.acc_contact },
        { label: "Address", value: sessionStorage.acc_address },
        { label: "Email", value: sessionStorage.acc_email },
        { label: "Username", value: sessionStorage.acc_username }
    ];

    userFields.forEach(field => {
        var listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.innerHTML = `<strong>${field.label}:</strong> ${field.value}`;
        listItem.style.fontSize = "16px";
        userInfoList.appendChild(listItem);
    });

    var avatarDiv = document.createElement("div");
    avatarDiv.classList.add("text-center", "mt-3");
    var avatarImage = document.createElement("img");
    avatarImage.src = `../api/${sessionStorage.acc_avatar}`;
    avatarImage.classList.add("avatar", "img-fluid", "rounded-circle");
    avatarImage.style.width = "80px";
    avatarImage.style.height = "80px";
    avatarImage.alt = "Avatar";
    avatarDiv.appendChild(avatarImage);

    document.getElementById("user_info").appendChild(userInfoList);
    document.getElementById("user_info").appendChild(avatarDiv);
}

const showNotificationToast = (status, message) => {
    const responseToastDiv = document.getElementById("responseToastDiv");
    const toast = new bootstrap.Toast(document.querySelector(".toast"));

    responseToastDiv.innerHTML = '';

    const toastIcon = document.createElement("i");

    if (status === 1) {
        toast._element.classList.add("text-white", "bg-success");
        toastIcon.classList.add("fa-solid", "fa-circle-check", "pe-2");
    } else {
        toast._element.classList.add("text-white", "bg-danger");
        toastIcon.classList.add("fa-solid", "fa-circle-xmark", "pe-2");
    }

    responseToastDiv.appendChild(toastIcon);

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;

    responseToastDiv.appendChild(messageSpan);

    toast.show();
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

displayUserInfo();

// const displayUserInfo = () => {
//     document.getElementById("user_info").innerText = "";

//     var userForm = `
//         <div class="row">
//             <div class="col">
//                 <label for="user_fname" class="form-label mt-2">First name</label>
//                 <input type="text" id="user_fname" class="form-control form-control-sm" value=${sessionStorage.acc_firstname}>
//             </div>
//             <div class="col">
//                 <label for="user_lname" class="form-label mt-2">Last name</label>
//                 <input type="text" id="user_lname" class="form-control form-control-sm" value=${sessionStorage.acc_lastname}>
//             </div>
//         </div>

//         <label for="user_gender" class="form-label mt-2">Gender</label>
//             <select id="user_gender_select" class="form-select form-select-sm">
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//             </select>
//         <input type="hidden" id="user_gender" class="form-control form-control-sm" value=${sessionStorage.acc_gender}>


//         <label for="user_contact" class="form-label mt-2">Contact</label>
//         <input type="text" id="user_contact" class="form-control form-control-sm" value=${sessionStorage.acc_contact}>

//         <label for="user_address" class="form-label mt-2">Address</label>
//         <input type="text" id="user_address" class="form-control form-control-sm" value=${sessionStorage.acc_address}>

//         <label for="user_email" class="form-label mt-2">Email</label>
//         <input type="text" id="user_email" class="form-control form-control-sm" value=${sessionStorage.acc_email}>

//         <label for="user_usrname" class="form-label mt-2">Username</label>
//         <input type="text" id="user_usrname" class="form-control form-control-sm" value=${sessionStorage.acc_username}>

//         <label for="user_pword" class="form-label mt-2">Change password</label>
//         <input type="password" id="user_pword" class="form-control form-control-sm">
//         <p class="text-dark fst-italic"><small>Leave this blank if you dont want to change the password.</small></p>


//         <label for="avatar" class="form-label mt-2">Avatar</label>
//         <input type="file" id="avatar" class="form-control form-control-sm">

//         <div class="text-center">
//         <img src="../api/${sessionStorage.acc_avatar}" class="avatar img-fluid rounded-circle mt-2" style="width: 80px; height: 80px" alt="avatar">
//         </div>
//     `;
//     document.getElementById("user_info").innerHTML = userForm;

//     document.getElementById("user_gender").value = sessionStorage.acc_gender;

//     const btnSave = document.createElement("button");
//     btnSave.innerText = "Save";
//     btnSave.classList.add("btn", "btn-cust-citrus", "btn-sm", "mt-3", "w-0");
//     btnSave.addEventListener("click", () => saveUpdatedUser(sessionStorage.acc_user_id));

//     document.getElementById("saveBtn").append(btnSave);
// }

// const saveUpdatedUser = (user_id) => {
//     const fName = document.getElementById("user_fname").value;
//     const lName = document.getElementById("user_lname").value;
//     const Gender = document.getElementById("user_gender").value;
//     const Contact = document.getElementById("user_contact").value;
//     const Address = document.getElementById("user_address").value;
//     const Email = document.getElementById("user_email").value;
//     const Username = document.getElementById("user_usrname").value;
//     const Password = document.getElementById("user_pword").value;
//     const Avatar = document.getElementById("avatar").files[0]; // Corrected access
    
//     const json = {
//         user_id: user_id,
//         first_name: fName,
//         last_name: lName,
//         gender: Gender,
//         contact: Contact,
//         address: Address,
//         email: Email,
//         username: Username,
//         avatar: Avatar
//     };

//     if (Password.trim() !== "") {
//         json.password = Password; // Include password only if it's provided
//     }

//     const formData = new FormData();
//     formData.append("json", JSON.stringify(json));
//     formData.append("operation", "updateProfile");

//     axios({
//         url: "http://localhost/StocksInventorySystem/api/user.php",
//         method: "post",
//         data: formData
//     })
//     .then(response => {
//         if (response.data.status === 1) {
//             const status = response.data.status;
//             const message = response.data.message;
//             showNotificationToast(status, message);
//             displayUserInfo();
//         } else {
//             showNotificationModal(response.data.message);
//         }
//     })
//     .catch(error => {
//         alert(error);
//     });
//     const myModal = new bootstrap.Modal(document.getElementById('editModal'));
//     myModal.hide();
// }
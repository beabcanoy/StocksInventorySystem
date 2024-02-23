const setEventListeners = () =>{
    document.getElementById("btnAdd").addEventListener("click", (e)=>{
        e.preventDefault();
        registerUser();});
}

    const strongRegex = /^(?=.*[a-zA-Z])(?=.*\d)([A-Za-z\d@$!%*?&]|[^ ]){8,}$/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d)([A-Za-z\d@$!%*?&]|[^ ]){8,}$/;

const registerUser = () => {
    document.getElementById("blankModalTitle").innerText = "Add New User";
    document.getElementById("blankModalMainDiv").innerText = "";
    document.getElementById("blankModalMainDiv2").innerText = "";

    var userForm = `
        <div class="row">
            <div class="col">
                <label for="user_fname" class="form-label mt-2">First name</label>
                <input type="text" id="user_fname" class="form-control form-control-sm" autocomplete="off">
                <div id="user_fname_feedback" class="invalid-feedback"></div>
            </div>
            <div class="col">
                <label for="user_lname" class="form-label mt-2">Last name</label>
                <input type="text" id="user_lname" class="form-control form-control-sm" autocomplete="off">
                <div id="user_lname_feedback" class="invalid-feedback"></div>
            </div>
        </div>

        <label for="user_gender" class="form-label mt-3">Gender</label>
        <select class="form-select form-select-sm" id="user_gender" aria-label="Default select example">
            <option value="Female">Female</option>
            <option value="Male">Male</option>
        </select>

        <label for="user_contact" class="form-label mt-2">Contact #</label>
        <input type="text" id="user_contact" class="form-control form-control-sm" autocomplete="off">
        <div id="user_contact_feedback" class="invalid-feedback"></div>

        <label for="user_address" class="form-label mt-2">Address</label>
        <input type="text" id="user_address" class="form-control form-control-sm" autocomplete="off">
        <div id="user_address_feedback" class="invalid-feedback"></div>

        <label for="user_email" class="form-label mt-2">Email</label>
        <input type="text" id="user_email" class="form-control form-control-sm" autocomplete="off">
        <div id="user_email_feedback" class="invalid-feedback"></div>

        <label for="user_usrname" class="form-label mt-2">Username</label>
        <input type="text" id="user_usrname" class="form-control form-control-sm" autocomplete="off">

        <div class="row">
            <div class="col">
                <label for="user_pword" class="form-label mt-2">Password</label>
                <input type="password" id="user_pword" class="form-control form-control-sm">
                <div id="passwordStrengthIndicator" class="mt-2"></div>
            </div>
            <div class="col">
                <label for="confirm_pword" class="form-label mt-2">Confirm password</label>
                <input type="password" id="confirm_pword" class="form-control form-control-sm">
                <div id="confirmPasswordMessage" class="mt-2"></div>
            </div>
        </div>

        <label for="usertype" class="form-label mt-3">User type</label>
        <select class="form-select form-select-sm" id="usertype" aria-label="Default select example">
            <option value="1">Administrator</option>
            <option value="2">Employee</option>
        </select>

        <label for="avatar" class="form-label mt-2">Avatar</label>
        <input type="file" id="avatar" class="form-control form-control-sm">

        <label for="status" class="form-label mt-3">Status</label>
        <select class="form-select form-select-sm" id="status" aria-label="Default select example">
            <option value="1">Active</option>
            <option value="0">Inactive</option>
        </select>
    `;

    document.getElementById("blankModalMainDiv").innerHTML = userForm;

    const user_fnameInput = document.getElementById("user_fname");
    const user_usrnameInput = document.getElementById("user_usrname");

    user_fnameInput.addEventListener("input", updateUsername);

    updateUsername();

    const btnRegister = document.createElement("button");
    btnRegister.innerText = "Register";
    btnRegister.classList.add("btn", "btn-cust-citrus", "mt-3", "w-100");
    btnRegister.onclick = () => {
        const password = document.getElementById("user_pword").value;
        checkPasswordStrength(password);
        saveSystemUser(); };
    document.getElementById("blankModalMainDiv2").append(btnRegister);

    const myModal = new bootstrap.Modal(document.getElementById('blankModal'), {
        keyboard: true,
        backdrop: "static"
    });
    myModal.show();

    const passwordInput = document.getElementById("user_pword");
    passwordInput.addEventListener("input", () => checkPasswordStrength(passwordInput.value));

    const confirmPasswordInput = document.getElementById("confirm_pword");
    confirmPasswordInput.addEventListener("input", () => checkPasswordMatch(confirmPasswordInput.value));
}

const updateUsername = () => {
    const user_fnameInput = document.getElementById("user_fname");
    const user_usrnameInput = document.getElementById("user_usrname");

    const user_fname = user_fnameInput.value.trim();

    // Check if user_fname contains special characters
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const containsSpecialChars = specialChars.test(user_fname);

    if (user_fname !== "" && !containsSpecialChars) {
        const currentDate = new Date();
        
        const generatedUsername =
            user_fname.slice(0, 10).toLowerCase() +
            currentDate.getDate().toString().padStart(2, '0') +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') +
            currentDate.getFullYear().toString().slice(-2);

        user_usrnameInput.value = generatedUsername;
    } else {
        user_usrnameInput.value = "";
    }
}

const checkPasswordStrength = (password) => {
    const passwordInput = document.getElementById("user_pword");
    const strengthIndicator = document.getElementById("passwordStrengthIndicator");

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d)([A-Za-z\d@$!%*?&]|[^ ]){8,}$/;

    const strongSpan = '<span style="color: green; font-weight: bold;">Strong</span>';
    const mediumSpan = '<span style="color: yellow; font-weight: bold;">Medium</span>';
    const weakSpan = '<span style="color: red; font-weight: bold;">Weak password</span>';

    if (strongRegex.test(password)) {
        strengthIndicator.innerHTML = strongSpan;
        passwordInput.classList.remove("red-border", "yellow-border");
        passwordInput.classList.add("green-border");
    } else if (mediumRegex.test(password)) {
        strengthIndicator.innerHTML = mediumSpan;
        passwordInput.classList.remove("red-border", "green-border");
        passwordInput.classList.add("yellow-border");
    } else {
        strengthIndicator.innerHTML = weakSpan;
        passwordInput.classList.remove("green-border", "yellow-border");
        passwordInput.classList.add("red-border");
    }
}

const checkPasswordMatch = (confirmPassword) => {
    const passwordInput = document.getElementById("user_pword");
    const confirmPasswordInput = document.getElementById("confirm_pword");
    const confirmPasswordMessage = document.getElementById("confirmPasswordMessage");

    if (passwordInput.value === confirmPassword) {
        confirmPasswordMessage.innerHTML = '<span style="color: green; font-weight: bold;">Password match</span>';
        confirmPasswordInput.classList.remove("red-border");
        confirmPasswordInput.classList.add("green-border");
    } else {
        confirmPasswordMessage.innerHTML = '<span style="color: red; font-weight: bold;">Password does not match</span>';
        confirmPasswordInput.classList.remove("green-border");
        confirmPasswordInput.classList.add("red-border");
    }
}

const saveSystemUser = () => {
    const user_fname = document.getElementById("user_fname").value.trim();
    const user_lname = document.getElementById("user_lname").value.trim();
    const user_gender = document.getElementById("user_gender").value;
    const user_contact = document.getElementById("user_contact").value.trim();
    const user_address = document.getElementById("user_address").value.trim();
    const user_email = document.getElementById("user_email").value.trim();
    const user_usrname = document.getElementById("user_usrname").value;
    const user_pword = document.getElementById("user_pword").value;
    const user_type = parseInt(document.getElementById("usertype").value);
    const avatar = document.getElementById("avatar").files[0];
    const status = parseInt(document.getElementById("status").value);
    
    var specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (!user_fname) {
        document.getElementById('user_fname').classList.add("is-invalid");
        document.getElementById('user_fname_feedback').innerHTML = "&#42;First name is required";
    } else if (specialChars.test(user_fname)) {
        document.getElementById('user_fname').classList.add("is-invalid");
        document.getElementById('user_fname_feedback').innerHTML = "&#42;First name should not contain special characters";
    } else {
        document.getElementById('user_fname').classList.remove("is-invalid");
        document.getElementById('user_fname_feedback').innerHTML = "";
    }

    if (!user_lname) {
        document.getElementById('user_lname').classList.add("is-invalid");
        document.getElementById('user_lname_feedback').innerHTML = "&#42;Last name is required";
    } else if (specialChars.test(user_lname)) {
        document.getElementById('user_lname').classList.add("is-invalid");
        document.getElementById('user_lname_feedback').innerHTML = "&#42;Last name should not contain special characters";
    } else {
        document.getElementById('user_lname').classList.remove("is-invalid");
        document.getElementById('user_lname_feedback').innerHTML = "";
    }

    if (!user_contact) {
        document.getElementById('user_contact').classList.add("is-invalid");
        document.getElementById('user_contact_feedback').innerHTML = "&#42;Contact number is required";
    } else if (specialChars.test(user_contact)) {
        document.getElementById('user_contact').classList.add("is-invalid");
        document.getElementById('user_contact_feedback').innerHTML = "&#42;Contact number should not contain special characters";
    } else {
        document.getElementById('user_contact').classList.remove("is-invalid");
        document.getElementById('user_contact_feedback').innerHTML = "";
    }

    if (!user_address) {
        document.getElementById('user_address').classList.add("is-invalid");
        document.getElementById('user_address_feedback').innerHTML = "&#42;Address is required";
    } else if (specialChars.test(user_address)) {
        document.getElementById('user_address').classList.add("is-invalid");
        document.getElementById('user_address_feedback').innerHTML = "&#42;Address should not contain special characters";
    } else {
        document.getElementById('user_address').classList.remove("is-invalid");
        document.getElementById('user_address_feedback').innerHTML = "";
    }

    if (!user_email) {
        document.getElementById('user_email').classList.add("is-invalid");
        document.getElementById('user_email_feedback').innerHTML = "&#42;Email is required";
    } else if (specialChars.test(user_email)) {
        document.getElementById('user_email').classList.add("is-invalid");
        document.getElementById('user_email_feedback').innerHTML = "&#42;Email should not contain special characters";
    } else {
        document.getElementById('user_email').classList.remove("is-invalid");
        document.getElementById('user_email_feedback').innerHTML = "";
    }


    let uploadIsOk = "";

    if (avatar) {
        // Validate file type
        const allowedFormats = ["jpg", "jpeg", "png"];
        const imageFileType = avatar.name.split('.').pop().toLowerCase();
        if (!allowedFormats.includes(imageFileType)) {
            uploadIsOk += `<p>Invalid file type. Please upload a JPG, JPEG, or PNG image.</p>`;
        }

        // Validate file size
        const maxSize = 500000;
        if (avatar.size > maxSize) {
            uploadIsOk += `<p>File size exceeds the allowed limit. Please upload a smaller image.</p>`;
        }
    } else {
        uploadIsOk += `<p>No image selected. Please select an image.</p>`;
    }

    const strengthIndicator = document.getElementById("passwordStrengthIndicator");
    const confirmPasswordMessage = document.getElementById("confirmPasswordMessage");

    const isMediumPassword = mediumRegex.test(user_pword);
    const doPasswordsMatch = user_pword === document.getElementById("confirm_pword").value;

    if (isMediumPassword && doPasswordsMatch) {
        validatePassword = "";
    } else {
        if (!isMediumPassword) {
            strengthIndicator.innerHTML = '<span style="color: red; font-weight: bold;">weak password</span>';
        }
        if (!doPasswordsMatch) {
            confirmPasswordMessage.innerHTML = '<span style="color: red; font-weight: bold;">Password does not match</span>';
        }

        showNotificationModal("Please correct the password issues.");
        return;
    }
    
        if(uploadIsOk === ""){
            const timestamp = new Date().getTime();
            const uniqueFileName = `${timestamp}_${avatar.name}`;

            const url = 'http://localhost/StocksInventorySystem/api/user.php';

            const formData = new FormData();
            formData.append('user_fname', user_fname);
            formData.append('user_lname', user_lname);
            formData.append('user_gender', user_gender);
            formData.append('user_contact', user_contact);
            formData.append('user_address', user_address);
            formData.append('user_email', user_email);
            formData.append('avatar', avatar, uniqueFileName);
            formData.append('user_usrname', user_usrname);
            formData.append('user_pword', user_pword);
            formData.append('user_type', user_type);
            formData.append('status', status);
            formData.append('operation', 'addUser');

            axios({
                url: url,
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                console.log("Response received:", response.data);
                const status = response.data.status;
                const message = response.data.message;
            
                if (status === 1 || status === 2) {
                    console.log("Status is 1 or 2. Showing toast modal.");
                    showNotificationToast(status, message);
                } else {
                    showNotificationModal(message);
                }
            }).catch(error => {
                console.error("Error in Axios request:", error);
                showNotificationModal(error.message || "An error occurred during the request.");
            });
        } else {
            showNotificationModal(uploadIsOk);
        }
    
        const myModal = bootstrap.Modal.getInstance(document.getElementById('blankModal'));
        myModal.hide(); 
}

const getSystemUser = () => {

    let message = "";
    const url = 'http://localhost/StocksInventorySystem/api/user.php';

    const formData = new FormData();
    formData.append("operation", "getSystemUser");

    axios({
        url:url,
        method: "post",
        data: formData
    }).then(response =>{
        if(response.data.length === 0){
            message = "There are no records retrieved.";
            showNotificationModal(message);
        } else {
            displaySystemUsers(response.data);
        }
    }).catch( error =>{
        showNotificationModal(error);
    });
}

const displaySystemUsers = (rsSystemUsers) =>{
    const table_records = document.getElementById("table_records");

    var systemUsersTable = `
    <div class="table-responsive rounded-2">
    <table class="table table-bordered table-striped align-middle">
    <thead class="table-secondary align-middle">
        <tr>
            <th>Date Created</th>
            <th class="w-25">Avatar</th>
            <th class="w-25">Name</th>
            <th>Username</th>
            <th>User type</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
    `;

    rsSystemUsers.forEach(systemUser => {

        if (systemUser.type == 1) {
            systemUser.type = "Administrator";
        } else {
            systemUser.type = "Employee";
        }

        let status = '';
        const user_status = document.createElement("span");
    
        if (systemUser.status == 1) {
            status = `<span class="badge bg-success rounded-pill">Active</span>`;
        } else {
            status = `<span class="badge bg-danger rounded-pill">Inactive</span>`;
        }
    
        user_status.innerHTML = status;

        if(systemUser.avatar == null){
            systemUser.avatar = 'avatar/noimage.jpg';
        }

        systemUsersTable += `
            <tr>
                <td>${systemUser.date_created}</td>
                <td class="text-center"><img src="../api/${systemUser.avatar}" alt="avatar" width="72px" height="72px"></td>
                <td>${systemUser.first_name} ${systemUser.last_name}</td>
                <td>${systemUser.username}</td>
                <td class="text-center">${systemUser.type}</td>
                <td class="text-center">${user_status.innerHTML}</td>
                <td class="text-center">
                    <button data-supplier-id="${systemUser.user_id}" id="btnView" class="btn border-0 text-info p-1"><i class="fa-solid fa-eye"></i></button>
                    <button data-supplier-id="${systemUser.user_id}" id="btnEdit" class="btn border-0 text-success p-1"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
            </tr>
        `;
    });
    
    systemUsersTable += `</tbody></table></div>`;
    table_records.innerHTML = systemUsersTable;

    table_records.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-supplier-id');
            openEditModal(userId);
        });
    });    

    table_records.querySelectorAll('#btnView').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-supplier-id');
            openViewModal(userId);
        });
    }); 
}

const openEditModal = (user_id) => {
    document.getElementById("editModalTitle").innerText = "Edit User";
    document.getElementById("editModalMainDiv").innerHTML = '';
    document.getElementById("editModalMainDiv2").innerHTML = '';

    const formData = new FormData();
    formData.append("operation", "getUsers");
    formData.append("user_id", user_id);

    axios({
        url: "http://localhost/StocksInventorySystem/api/user.php",
        method: "post",
        data: formData,
    })
        .then((response) => {
                const user = response.data;
            if (user) {
                let editForm = `
                    <div class="row">
                    <div class="col">
                        <label for="edit_user_fname" class="form-label mt-2">First name</label>
                        <input type="text" id="edit_user_fname" class="form-control form-control-sm" value="${user.first_name}">
                    </div>
                    <div class="col">
                        <label for="edit_user_lname" class="form-label mt-2">Last name</label>
                        <input type="text" id="edit_user_lname" class="form-control form-control-sm" value="${user.last_name}">
                    </div>
                </div>

                <label for="edit_user_gender" class="form-label mt-3">Gender</label>
                <select class="form-select form-select-sm" id="edit_user_gender" aria-label="Default select example">
                    <option value="Female" ${user.gender === "Female" ? "selected" : ""}>Female</option>
                    <option value="Male" ${user.gender === "Male" ? "selected" : ""}>Male</option>
                </select>

                <label for="edit_user_contact" class="form-label mt-2">Contact #</label>
                <input type="text" id="edit_user_contact" class="form-control form-control-sm" value="${user.contact}">

                <label for="edit_user_address" class="form-label mt-2">Address</label>
                <input type="text" id="edit_user_address" class="form-control form-control-sm" value="${user.address}">

                <label for="edit_user_email" class="form-label mt-2">Email</label>
                <input type="text" id="edit_user_email" class="form-control form-control-sm" value="${user.email}">
        
                <label for="edit_user_usrname" class="form-label mt-2">Username</label>
                <input type="text" id="edit_user_usrname" class="form-control form-control-sm" value="${user.username}" readonly>

                <div class="col">
                    <label for="edit_user_password" class="form-label mt-2">Password</label>
                    <input type="password" id="edit_user_password" class="form-control form-control-sm" ${user.id ? '' : 'value=""'}>
                    ${user.id ? `<small class="text-info mt-1"><i>Leave this blank if you don't want to change the password.</i></small>` : ''}
                </div>
                <br/>

                <label for="edit_usertype" class="form-label mt-3">User type</label>
                    <select class="form-select form-select-sm" id="edit_usertype" aria-label="Default select example">
                        <option value="1" ${user.type === 1 ? "selected" : ""}>Administrator</option>
                        <option value="0" ${user.type === 0 ? "selected" : ""}>Employee</option>
                    </select>
        
                <label for="edit_status" class="form-label mt-3">Status</label>
                    <select class="form-select form-select-sm" id="edit_status" aria-label="Default select example">
                        <option value="1" ${user.status === 1 ? "selected" : ""}>Active</option>
                        <option value="0" ${user.status === 0 ? "selected" : ""}>Inactive</option>
                    </select>   
            `;
                document.getElementById("editModalMainDiv").innerHTML = editForm;

                const btnSave = document.createElement("button");
                btnSave.innerText = "Update";
                btnSave.classList.add("btn", "btn-primary", "mt-3", "w-100");

                btnSave.addEventListener("click", () => {
                    saveUpdatedUser(user_id);
                    myModal.hide();
                });

                document.getElementById("editModalMainDiv2").append(btnSave);

                const myModal = new bootstrap.Modal(document.getElementById('editModal'), {
                    keyboard: true,
                    backdrop: "static",
                });
                myModal.show();
            } else {
                alert("User data not found or is incomplete!");
            }
        })
        .catch((error) => {
            alert("Error fetching data: " + error);
        });
};

const saveUpdatedUser = (user_id) => {
    
    const fName = document.getElementById("edit_user_fname").value;
    const lName = document.getElementById("edit_user_lname").value;
    const Gender = document.getElementById("edit_user_gender").value;
    const Contact = document.getElementById("edit_user_contact").value;
    const Address = document.getElementById("edit_user_address").value;
    const Email = document.getElementById("edit_user_email").value;
    const Username = document.getElementById("edit_user_usrname").value;
    const Password = document.getElementById("edit_user_password").value;
    const Type = document.getElementById("edit_usertype").value;
    const Status = document.getElementById("edit_status").value;

    const json = {
        user_id: user_id,
        first_name: fName,
        last_name: lName,
        gender: Gender,
        contact: Contact,
        address: Address,
        email: Email,
        username: Username,
        password: Password,
        type: Type,
        status: Status
    };

    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation", "updateUsers");

    axios({
        url: "http://localhost/StocksInventorySystem/api/user.php",
        method: "post",
        data: formData
    })
    .then(response => {
        if (response.data.status === 1) {
            const status = response.data.status;
            const message = response.data.message;

            if (status === 1) {
                showNotificationToast(status, message);
                getSystemUser();
            } else {
                showNotificationModal(message);
            }
        }
    })
    .catch(error => {
        alert(error);
    });
    const myModal = new bootstrap.Modal(document.getElementById('editModal'));
    myModal.hide();
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

function openViewModal(user_id) {
    const url = 'http://localhost/StocksInventorySystem/api/user.php';
    const formData = new FormData();
    formData.append("operation", "getUsers");
    formData.append("user_id", user_id);

    axios({
        url: url,
        method: "post",
        data: formData,
    })
    .then(response => {
        const user = response.data;
        if (user) {
            const viewModalTitle = document.getElementById('viewModalTitle');
            const viewModalBody = document.getElementById('viewModalBody');

            var userFullName = user.first_name + " " + user.last_name;
            var userType = user.type === 1 ? "Admin" : "Employee";

            viewModalTitle.innerText = "User Details";
            viewModalBody.innerHTML = `
                <strong style="font-size: 1.2em;">Name:</strong> <br>
                <dd id="userFullName" class="pl-3" style="font-size: 1.2em;">${userFullName}</dd>
                <strong style="font-size: 1.2em;">Gender:</strong> <br>
                <dd class="pl-3" style="font-size: 1.2em;">${user.gender}</dd>
                <strong style="font-size: 1.2em;">Contact #:</strong> <br>
                <dd class="pl-3" style="font-size: 1.2em;">${user.contact}</dd>
                <strong style="font-size: 1.2em;">Address:</strong> <br>
                <dd class="pl-3" style="font-size: 1.2em;">${user.address}</dd>
                <strong style="font-size: 1.2em;">Emailss:</strong> <br>
                <dd class="pl-3" style="font-size: 1.2em;">${user.email}</dd>
                <strong style="font-size: 1.2em;">User Type:</strong> <br>
                <dd class="pl-3" style="font-size: 1.2em;">${userType}</dd>
                <strong style="font-size: 1.2em;">Status:</strong> <br>
                <span style="display: inline-block; border-radius: 999px; font-size: 0.9em; background-color: ${user.status == 1 ? 'green' : 'red'}; padding: 0.3em 0.8em; color: white;">${user.status == 1 ? 'Active' : 'Inactive'}</span><br>
            `;

            const viewSupplierModal = new bootstrap.Modal(document.getElementById('viewSupplierModal'));
            viewSupplierModal.show();
        } else {
            alert("Employee data not found or is incomplete!");
        }
    })
    .catch(error => {
        alert("Error fetching data: " + error);
    });
}

setEventListeners();
getSystemUser();
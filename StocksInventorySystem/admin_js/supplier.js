const setEventListeners = () =>{
    document.getElementById("btnAdd").addEventListener("click", (e)=>{
        e.preventDefault();
        registerSupplier();});
}

const registerSupplier = () => {
    document.getElementById("blankModalTitle").innerText = "Add New Supplier";
    document.getElementById("blankModalMainDiv").innerText = "";
    document.getElementById("blankModalMainDiv2").innerText = "";

    var supplierForm = `
    <label for="supplier_name" class="form-label mt-2">Name</label>
    <input type="text" id="supplier_name" class="form-control form-control-sm" autocomplete="off">
    <div id="user_sname_feedback" class="invalid-feedback"></div>

    <label for="supplier_address" class="form-label mt-3">Address</label>
    <input type="text" id="supplier_address" class="form-control form-control-sm" autocomplete="off">
    <div id="user_saddress_feedback" class="invalid-feedback"></div>

    <label for="contact_person" class="form-label mt-3">Contact person</label>
    <input type="text" id="contact_person" class="form-control form-control-sm" autocomplete="off">
    <div id="user_cperson_feedback" class="invalid-feedback"></div>

    <label for="contact_number" class="form-label mt-3">Contact#</label>
    <input type="number" id="contact_number" class="form-control form-control-sm" autocomplete="off">
    <div id="user_cnumber_feedback" class="invalid-feedback"></div>

    <label for="status" class="form-label mt-3">Status</label>
    <select class="form-select form-select-sm" id="status" aria-label="Default select example">
        <option value="1">Active</option>
        <option value="0">Inactive</option>
    </select>
    `;

    document.getElementById("blankModalMainDiv").innerHTML = supplierForm;

    const btnRegister = document.createElement("button");
    btnRegister.innerText = "Register";
    btnRegister.classList.add("btn", "btn-cust-citrus", "mt-3", "w-100");
    btnRegister.onclick = ()=>{saveSupplier();};

    document.getElementById("blankModalMainDiv2").append(btnRegister);

    const myModal = new bootstrap.Modal(document.getElementById('blankModal'), {
        keyboard: true,
        backdrop: "static"
    });
    myModal.show();
}

const saveSupplier = () => {

    const url = 'http://localhost/StocksInventorySystem/api/supplier.php';

    const json = {
        supplier_name: document.getElementById("supplier_name").value,
        supplier_address: document.getElementById("supplier_address").value,
        contact_person: document.getElementById("contact_person").value,
        contact_number: document.getElementById("contact_number").value,
        status: parseInt(document.getElementById("status").value),
    }

    var specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (!json.supplier_name) {
        document.getElementById('supplier_name').classList.add("is-invalid");
        document.getElementById('user_sname_feedback').innerHTML = "&#42; name is required";
    } else if (specialChars.test(json.supplier_name)) {
        document.getElementById('supplier_name').classList.add("is-invalid");
        document.getElementById('user_sname_feedback').innerHTML = "&#42; name should not contain special characters";
    } else {
        document.getElementById('supplier_name').classList.remove("is-invalid");
        document.getElementById('user_sname_feedback').innerHTML = "";
    }

    if (!json.supplier_address) {
        document.getElementById('supplier_address').classList.add("is-invalid");
        document.getElementById('user_saddress_feedback').innerHTML = "&#42; address is required";
    } else if (specialChars.test(json.supplier_address)) {
        document.getElementById('supplier_address').classList.add("is-invalid");
        document.getElementById('user_saddress_feedback').innerHTML = "&#42; address should not contain special characters";
    } else {
        document.getElementById('supplier_address').classList.remove("is-invalid");
        document.getElementById('user_saddress_feedback').innerHTML = "";
    }

    if (!json.contact_person) {
        document.getElementById('contact_person').classList.add("is-invalid");
        document.getElementById('user_cperson_feedback').innerHTML = "&#42; contact person is required";
    } else if (specialChars.test(json.contact_person)) {
        document.getElementById('contact_person').classList.add("is-invalid");
        document.getElementById('user_cperson_feedback').innerHTML = "&#42; contact person should not contain special characters";
    } else {
        document.getElementById('contact_person').classList.remove("is-invalid");
        document.getElementById('user_cperson_feedback').innerHTML = "";
    }

    if (!json.contact_number) {
        document.getElementById('contact_number').classList.add("is-invalid");
        document.getElementById('user_cnumber_feedback').innerHTML = "&#42; contact number is required";
    } else if (specialChars.test(json.contact_number)) {
        document.getElementById('contact_number').classList.add("is-invalid");
        document.getElementById('user_cnumber_feedback').innerHTML = "&#42; contact number should not contain special characters";
    } else {
        document.getElementById('contact_number').classList.remove("is-invalid");
        document.getElementById('user_cnumber_feedback').innerHTML = "";
    }

    if (document.querySelectorAll('.is-invalid').length > 0) {
        return;
    }

    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation", "addSupplier");

    axios({
        url: url,
        method: 'post',
        data: formData
    }).then(response => {
        const status = response.data.status;
        const message = response.data.message;
        showNotificationToast(status, message);
        getSupplier();

    }).catch(error => {
        showNotificationModal(error);
    });
    const myModal = bootstrap.Modal.getInstance(document.getElementById('blankModal'));
    myModal.hide();
}

const getSupplier = () => {

    let message = "";
    const url = 'http://localhost/StocksInventorySystem/api/supplier.php';

    const formData = new FormData();
    formData.append("operation", "getSupplier");

    axios({
        url:url,
        method: "post",
        data: formData
    }).then(response =>{
        if(response.data.length === 0){
            message = "There are no records retrieved.";
            showNotificationModal(message);
        } else {
            displaySuppliers(response.data);
        }
    }).catch( error =>{
        showNotificationModal(error);
    });
}

const displaySuppliers = (rsSuppliers) =>{
    const table_records = document.getElementById("table_records");

    var supplierTable = `
    <div class="table-responsive rounded-2">
    <table class="table table-bordered table-striped align-middle">
    <thead class="table-secondary align-middle">
        <tr>
            <th class="w-25">Date Created</th>
            <th class="w-25">Supplier</th>
            <th class="w-25">Contact Person</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
    `;

    rsSuppliers.forEach(supplier => {
        let status = '';
        const supplier_status = document.createElement("span");
    
        if (supplier.status == 1) {
            status = `<span class="badge bg-success rounded-pill">Active</span>`;
        } else {
            status = `<span class="badge bg-danger rounded-pill">Inactive</span>`;
        }
    
        supplier_status.innerHTML = status;
    
        supplierTable += `
            <tr>
                <td>${supplier.date_created}</td>
                <td>${supplier.name}</td>
                <td>${supplier.contact_person}</td>
                <td class="text-center">${supplier_status.innerHTML}</td>
                <td class="text-center">
                    <button data-supplier-id="${supplier.supplier_id}" id="btnView" class="btn border-0 text-info p-1"><i class="fa-solid fa-eye"></i></button>
                    <button data-supplier-id="${supplier.supplier_id}" id="btnEdit" class="btn border-0 text-success p-1"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
            </tr>
        `;
    });
    
    supplierTable += `</tbody></table></div>`;
    table_records.innerHTML = supplierTable;

    table_records.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function() {
            const supplierId = this.getAttribute('data-supplier-id');
            openEditModal(supplierId);
        });
    });   
    
    table_records.querySelectorAll('#btnView').forEach(button => {
        button.addEventListener('click', function() {
            const supplierId = this.getAttribute('data-supplier-id');
            openViewModal(supplierId);
        });
    }); 
}

    const openEditModal = (supplier_id) => {
        document.getElementById("editModalTitle").innerText = "Edit Supplier";
        document.getElementById("editModalMainDiv").innerHTML = '';
        document.getElementById("editModalMainDiv2").innerHTML = '';
    
        const formData = new FormData();
        formData.append("operation", "getSupplierById");
        formData.append("supplier_id", supplier_id);
    
        axios({
            url: "http://localhost/StocksInventorySystem/api/supplier.php",
            method: "post",
            data: formData,
        })
            .then((response) => {
                    const supplier = response.data;
                if (supplier) {
                    let editForm = `
                        <label for="edit_supplier_name" class="form-label mt-2">Name</label>
                        <input type="text" id="edit_supplier_name" class="form-control form-control-sm" value="${supplier.name}">
                
                        <label for="edit_supplier_address" class="form-label mt-3">Address</label>
                        <input type="text" id="edit_supplier_address" class="form-control form-control-sm" value="${supplier.address}">
                
                        <label for="edit_contact_person" class="form-label mt-3">Contact person</label>
                        <input type="text" id="edit_contact_person" class="form-control form-control-sm" value="${supplier.contact_person}">
                
                        <label for="edit_contact_number" class="form-label mt-3">Contact#</label>
                        <input type="text" id="edit_contact_number" class="form-control form-control-sm" value="${supplier.contact}">
                
                        <label for="edit_status" class="form-label mt-3">Status</label>
                        <select class="form-select form-select-sm" id="edit_status" aria-label="Default select example">
                            <option value="1" ${supplier.status === 1 ? "selected" : ""}>Active</option>
                            <option value="0" ${supplier.status === 0 ? "selected" : ""}>Inactive</option>
                        </select>

                    `;
    
                    document.getElementById("editModalMainDiv").innerHTML = editForm;
    
                    const btnSave = document.createElement("button");
                    btnSave.innerText = "Update";
                    btnSave.classList.add("btn", "btn-primary", "mt-3", "w-100");
    
                    btnSave.addEventListener("click", () => {
                        saveUpdatedSupplier(supplier_id);
                        myModal.hide();
                    });
    
                    document.getElementById("editModalMainDiv2").append(btnSave);
    
                    const myModal = new bootstrap.Modal(document.getElementById('editModal'), {
                        keyboard: true,
                        backdrop: "static",
                    });
                    myModal.show();
                } else {
                    alert("Supplier data not found or is incomplete!");
                }
            })
            .catch((error) => {
                alert("Error fetching data: " + error);
            });
    };
    
    const saveUpdatedSupplier = (supplier_id) => {
        const Name = document.getElementById("edit_supplier_name").value;
        const Address = document.getElementById("edit_supplier_address").value;
        const contactPerson = document.getElementById("edit_contact_person").value;
        const Contact = document.getElementById("edit_contact_number").value;
        const Status = document.getElementById("edit_status").value;
    
        const json = {
            supplier_id: supplier_id,
            name: Name,
            address: Address,
            contact_person: contactPerson,
            contact: Contact,
            status: Status
        };
    
        const formData = new FormData();
        formData.append("json", JSON.stringify(json));
        formData.append("operation", "updateSupplier");
    
        axios({
            url: "http://localhost/StocksInventorySystem/api/supplier.php",
            method: "post",
            data: formData
        })
        .then(response => {
            if (response.data.status === 1) {
                const status = response.data.status;
                const message = response.data.message;
    
                if (status === 1) {
                    showNotificationToast(status, message);
                    getSupplier();
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

function openViewModal(supplier_id) {
    const url = 'http://localhost/StocksInventorySystem/api/supplier.php';
    const formData = new FormData();
    formData.append("operation", "getSupplierById");
    formData.append("supplier_id", supplier_id);

    axios({
        url: url,
        method: "post",
        data: formData,
    })
    .then(response => {
        const supplier = response.data;
        if (supplier) {
            const viewModalTitle = document.getElementById('viewModalTitle');
            const viewModalBody = document.getElementById('viewModalBody');

            viewModalTitle.innerText = "Supplier Details";
            viewModalBody.innerHTML = `
                <strong style="font-size: 1.2em;">Name:</strong> <br>
                <dd class="pl-3" style="font-size: 1.2em;">${supplier.name}</dd>
                <strong style="font-size: 1.2em;">Address:</strong> <br>
                <dd class="pl-3" style="font-size: 1.2em;">${supplier.address}</dd>
                <strong style="font-size: 1.2em;">Contact Person:</strong> <br>
                <dd class="pl-3" style="font-size: 1.2em;">${supplier.contact_person}</dd>
                <strong style="font-size: 1.2em;">Contact #:</strong> <br>         
                <dd class="pl-3" style="font-size: 1.2em;">${supplier.contact}</dd>
                <strong style="font-size: 1.2em;">Status:</strong> <br>
                <span style="display: inline-block; border-radius: 999px; font-size: 0.9em; background-color: ${supplier.status == 1 ? 'green' : 'red'}; padding: 0.3em 0.8em; color: white;">${supplier.status == 1 ? 'Active' : 'Inactive'}</span><br>
            `;

            const viewSupplierModal = new bootstrap.Modal(document.getElementById('viewSupplierModal'));
            viewSupplierModal.show();
        } else {
            alert("Supplier data not found or is incomplete!");
        }
    })
    .catch(error => {
        alert("Error fetching data: " + error);
    });
}

setEventListeners();
getSupplier();
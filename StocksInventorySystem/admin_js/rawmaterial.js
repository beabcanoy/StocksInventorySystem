const setEventListeners = () =>{
    document.getElementById("btnAdd").addEventListener("click", (e)=>{
        e.preventDefault();
        registerRawMaterial();});
}

const registerRawMaterial = () => {
    document.getElementById("blankModalTitle").innerText = "Add New Raw material";
    document.getElementById("blankModalMainDiv").innerText = "";
    document.getElementById("blankModalMainDiv2").innerText = "";

        var rawMaterialForm = `

        <p>Instructions:</p>
        <ol class="list-group list-group-numbered">
            <li class="list-group-item">Raw material name</li>
            <li class="list-group-item">Variation(Sizes & Colour)</li>
            <li class="list-group-item">Thickness</li>
            <li class="list-group-item">Unit(mm, inch, cm)</li>
        </ol>

        <label for="category_example" class="form-label mt-2">Example:</label>
        <input type="text" id="category_example" value="Colored Coil White 0.35mm" class="form-control form-control-sm text-success fst-italic border-0" readonly>

        <div class="row mt-4">
            <div class="col">
                <label for="rawmat_name" class="form-label mt-2">Name</label>
                <input type="text" id="rawmat_name" class="form-control form-control-sm" autocomplete="off" required>
                <div id="rawmat_name_feedback" class="invalid-feedback"></div>
            </div>
            <div class="col">
                <label for="rawmat_variation" class="form-label mt-2">Variation</label>
                <input type="text" id="rawmat_variation" class="form-control form-control-sm" placeholder="(optional)" autocomplete="off">
                <div id="rawmat_variation_feedback" class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <label for="rawmat_thickness" class="form-label mt-2">Thickness</label>
                <input type="text" id="rawmat_thickness" class="form-control form-control-sm" autocomplete="off" required>
                <div id="rawmat_thickness_feedback" class="invalid-feedback"></div>
            </div>
            <div class="col">
                <label for="thickness_unit" class="form-label mt-2">Unit</label>
                <input type="text" id="thickness_unit" class="form-control form-control-sm" autocomplete="off" required>
                <div id="thickness_unit_feedback" class="invalid-feedback"></div>
            </div>
        </div>

        <label for="status" class="form-label mt-3">Status</label>
        <select class="form-select form-select-sm" id="status" aria-label="Default select example">
            <option value="1">Active</option>
            <option value="0">Inactive</option>
        </select>
    `;

    document.getElementById("blankModalMainDiv").innerHTML = rawMaterialForm;

    const btnRegister = document.createElement("button");
    btnRegister.innerText = "Register";
    btnRegister.classList.add("btn", "btn-cust-citrus", "mt-3", "w-100");
    btnRegister.onclick = ()=>{saveRawMaterial();};

    document.getElementById("blankModalMainDiv2").append(btnRegister);

    const myModal = new bootstrap.Modal(document.getElementById('blankModal'), {
        keyboard: true,
        backdrop: "static"
    });
    myModal.show();

}

const saveRawMaterial = () => {
    const rawmat_name = document.getElementById('rawmat_name').value.trim();
    const rawmat_variation = document.getElementById('rawmat_variation').value.trim();
    let rawmat_thickness = document.getElementById('rawmat_thickness').value.trim();
    const thickness_unit = document.getElementById('thickness_unit').value.trim();
    const status = parseInt(document.getElementById('status').value);

    rawmat_thickness = parseFloat(rawmat_thickness).toFixed(2);

    const existingRawMaterials = [];
    const isDuplicate = existingRawMaterials.some(rawMaterial => {
        const standardizedThickness = parseFloat(rawMaterial.thickness).toFixed(2);
        return rawMaterial.name === rawmat_name &&
            rawMaterial.variation === rawmat_variation &&
            standardizedThickness === rawmat_thickness &&
            rawMaterial.unit === thickness_unit;
    });

    if (isDuplicate) {
        alert("This raw material already exists!");
        return;
    }

    // Validation
    let validateForm = true;

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (rawmat_name === "") {
        document.getElementById('rawmat_name').classList.add("is-invalid");
        document.getElementById('rawmat_name_feedback').innerHTML = "&#42;name is required";
        validateForm = false;
    } else if (!nameRegex.test(rawmat_name)) {
        document.getElementById('rawmat_name').classList.add("is-invalid");
        document.getElementById('rawmat_name_feedback').innerHTML = "&#42;name should not contain special characters";
        validateForm = false;
    } else {
        document.getElementById('rawmat_name').classList.remove("is-invalid");
        document.getElementById('rawmat_name_feedback').innerHTML = "";
    }

    if (rawmat_variation.trim() !== "" && /\d/.test(rawmat_variation)) {
        document.getElementById('rawmat_variation').classList.add("is-invalid");
        document.getElementById('rawmat_variation_feedback').innerHTML = "&#42; Variation should not contain numbers";
        validateForm = false;
    } else {
        document.getElementById('rawmat_variation').classList.remove("is-invalid");
        document.getElementById('rawmat_variation_feedback').innerHTML = "";
    }

    if (rawmat_thickness === "") {
        document.getElementById('rawmat_thickness').classList.add("is-invalid");
        document.getElementById('rawmat_thickness_feedback').innerHTML = "&#42;thickness is required";
        validateForm = false;
    } else {
        const thicknessValue = parseFloat(rawmat_thickness);
        if (isNaN(thicknessValue) || Number.isInteger(thicknessValue) || thicknessValue <= 0) {
            document.getElementById('rawmat_thickness').classList.add("is-invalid");
            document.getElementById('rawmat_thickness_feedback').innerHTML = "&#42;Invalid thickness format. Please use positive decimal numbers";
            validateForm = false;
        } else {
            document.getElementById('rawmat_thickness').classList.remove("is-invalid");
            document.getElementById('rawmat_thickness_feedback').innerHTML = "";
        }
    }

    const allowedUnits = ['mm', 'cm', 'inch'];

    if (thickness_unit === "") {
        document.getElementById('thickness_unit').classList.add("is-invalid");
        document.getElementById('thickness_unit_feedback').innerHTML = "&#42;unit is required";
        validateForm = false;
    } else if (specialCharRegex.test(thickness_unit)) {
        document.getElementById('thickness_unit').classList.add("is-invalid");
        document.getElementById('thickness_unit_feedback').innerHTML = "&#42;unit should not contain special characters";
        validateForm = false;
    } else if (!allowedUnits.includes(thickness_unit.toLowerCase())) {
        document.getElementById('thickness_unit').classList.add("is-invalid");
        document.getElementById('thickness_unit_feedback').innerHTML = "&#42;Invalid unit. Allowed units are 'mm', 'cm', 'inch'";
        validateForm = false;
    } else {
        document.getElementById('thickness_unit').classList.remove("is-invalid");
        document.getElementById('thickness_unit_feedback').innerHTML = "";
    }

    if (!validateForm) {
        return;
    }

    let rawmat_description = "";

    if (rawmat_variation !== '') {
        rawmat_description = rawmat_name + ' ' + rawmat_variation + ' ' + rawmat_thickness + ' ' + thickness_unit;
    } else {
        rawmat_description = rawmat_name + ' ' + rawmat_thickness + ' ' + thickness_unit;
    }

    const url = 'http://localhost/StocksInventorySystem/api/rawmaterial.php';

    const json = {
        rawmat_description: rawmat_description,
        status: status
    }

    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation", "addRawMaterial");

    axios({
        url: url,
        method: 'post',
        data: formData
    }).then(response => {
        const status = response.data.status;
        const message = response.data.message;
        showNotificationToast(status, message);
        getRawMaterial();
    }).catch(error => {
        showNotificationModal(error);
    });

    const myModal = bootstrap.Modal.getInstance(document.getElementById('blankModal'));
    myModal.hide();
}


const getRawMaterial = () => {

    let message = "";
    const url = 'http://localhost/StocksInventorySystem/api/rawmaterial.php';

    const formData = new FormData();
    formData.append("operation", "getRawMaterial");

    axios({
        url:url,
        method: "post",
        data: formData
    }).then(response =>{
        if(response.data.length === 0){
            message = "There are no records retrieved.";
            showNotificationModal(message);
        } else {
            displayRawMaterials(response.data);
        }
    }).catch( error =>{
        alert(error);
    });
}

const displayRawMaterials = (rsRawMaterials) =>{
    const table_records = document.getElementById("table_records");

    var rawmatTable = `
    <div class="table-responsive rounded-2">
    <table class="table table-bordered table-striped align-middle">
    <thead class="table-secondary align-middle">
        <tr>
            <th class="w-25">Date Created</th>
            <th class="w-25">Raw Material name</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
    `;

    rsRawMaterials.forEach(rawMaterial => {
        let status = '';
        const rawmat_status = document.createElement("span");
    
        if (rawMaterial.status == 1) {
            status = `<span class="badge bg-success rounded-pill">Active</span>`;
        } else {
            status = `<span class="badge bg-danger rounded-pill">Inactive</span>`;
        }
    
        rawmat_status.innerHTML = status;
    
        rawmatTable += `
            <tr>
                <td>${rawMaterial.date_created}</td>
                <td>${rawMaterial.name}</td>
                <td class="text-center">${rawmat_status.innerHTML}</td>
                <td class="text-center">
                    <button data-rawmat-id="${rawMaterial.rawmat_id}" class="btnEdit btn border-0 text-success p-1"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
            </tr>
        `;
    });
    
    rawmatTable += `</tbody></table></div>`;
    table_records.innerHTML = rawmatTable;

    table_records.querySelectorAll('.btnEdit').forEach(button => {
        button.addEventListener('click', function() {
            const rawmatId = this.getAttribute('data-rawmat-id');
            updateMaterialForm(rawmatId);
        });
    });
    
}

const updateMaterialForm = (rawmat_id) => {
    document.getElementById("blankModalTitle").innerText = "Update Raw Material";
    document.getElementById("blankModalMainDiv").innerText = "";
    document.getElementById("blankModalMainDiv2").innerText = "";

    const formData = new FormData();
    formData.append("operation", "getRawMaterialId");
    formData.append("rawmat_id", rawmat_id);

    axios({
        url: "http://localhost/StocksInventorySystem/api/rawmaterial.php",
        method: "post",
        data: formData,
    })
    .then((response) => {
        const raw = response.data;
        if (raw) {
            let rawMaterialForm = `
                <p>Instructions:</p>
                <ol class="list-group list-group-numbered">
                    <li class="list-group-item">Raw material name</li>
                    <li class="list-group-item">Variation(Sizes & Colour)</li>
                    <li class="list-group-item">Thickness</li>
                    <li class="list-group-item">Unit(mm, inch, cm)</li>
                </ol>

                <label for="category_example" class="form-label mt-2">Example:</label>
                <input type="text" id="category_example" value="Colored Coil White 0.35mm" class="form-control form-control-sm text-success fst-italic border-0" readonly>

                <div class="row">
                    <div class="col">
                        <label for="rawmat_name" class="form-label mt-2">Name</label>
                        <input type="text" id="rawmat_name" class="form-control form-control-sm" autocomplete="off" value="${raw.name}" required>
                        <div id="rawmat_name_feedback" class="invalid-feedback"></div>
                    </div>
                </div>

                <label for="status" class="form-label mt-3">Status</label>
                <select class="form-select form-select-sm" id="status" aria-label="Default select example">
                    <option value="1" ${raw.status === 1 ? 'selected' : ''}>Active</option>
                    <option value="0" ${raw.status === 0 ? 'selected' : ''}>Inactive</option>
                </select>
            `;

            document.getElementById("blankModalMainDiv").innerHTML = rawMaterialForm;

            const btnUpdate = document.createElement("button");
            btnUpdate.innerText = "Update";
            btnUpdate.classList.add("btn", "btn-cust-citrus", "mt-3", "w-100");
            btnUpdate.onclick = () => { saveUpdatedMaterial(rawmat_id); };

            document.getElementById("blankModalMainDiv2").append(btnUpdate);
        }
    })
    .catch(error => {
        showNotificationModal(error);
    });

    const myModal = new bootstrap.Modal(document.getElementById('blankModal'), {
        keyboard: true,
        backdrop: "static"
    });
    myModal.show();
}

const saveUpdatedMaterial = (rawmat_id) => {
    const rawmat_name = document.getElementById('rawmat_name').value.trim();
    const status = parseInt(document.getElementById('status').value);

    const json = {
        rawmat_id: rawmat_id,
        name: rawmat_name,
        status: status
    }

    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation", "updateMaterial");

    axios({
        url: "http://localhost/StocksInventorySystem/api/rawmaterial.php",
        method: "post",
        data: formData
    }).then(response => {
        const status = response.data.status;
        const message = response.data.message;
        showNotificationToast(status, message);
        getRawMaterial();
        const myModal = bootstrap.Modal.getInstance(document.getElementById('blankModal'));
        myModal.hide();
    }).catch(error => {
        showNotificationModal(error);
    });
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

setEventListeners();
getRawMaterial();
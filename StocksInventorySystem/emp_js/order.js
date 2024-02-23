const setEventListeners = () =>{
    document.getElementById("btnAdd").addEventListener("click", (event) => {
        event.preventDefault(); // prevent default behavior
        registerOrder();
    });
}

const addOrder = (button) => {

    var item_description = document.getElementById("item_description").value;
    var pcs = document.getElementById("pcs").value; 
    var weight = document.getElementById("weight_result").value; 

    var table = document.querySelector(".table_content");

    if (client_name && item_description && pcs && !isNaN(weight)) {
        var newRow = document.createElement("tr");


        var itemDescriptionCell = document.createElement("td");
        itemDescriptionCell.textContent = item_description;

        var itemPcsCell = document.createElement("td");
        itemPcsCell.textContent = pcs;

        var itemWeightCell = document.createElement("td");
        itemWeightCell.textContent = weight;

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Remove";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.onclick = function () {
            deleteRow(newRow);
        };

        var deleteCell = document.createElement("td");
        deleteCell.appendChild(deleteButton);

        newRow.appendChild(itemDescriptionCell);
        newRow.appendChild(itemPcsCell);
        newRow.appendChild(itemWeightCell);
        newRow.appendChild(deleteCell);

        table.appendChild(newRow);

        document.getElementById('item_description').value = "";
        document.getElementById('pcs').value = "";
        document.getElementById('weight_result').value = "";

    updateTotal();
    } else {
        alert("Error");
        console.log(response.data);
    }
};

function updateTotal() {
var tableBody = document.querySelector(".table_content");
var rows = tableBody.getElementsByTagName("tr");
var totalWeight = 0;

for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    if (cells.length >= 4) {
        totalWeight += parseFloat(cells[2].textContent);
    }
}

document.getElementById("sumOfItems").textContent = totalWeight.toFixed(2);
}

function deleteRow(row) {
    var table = document.getElementById("order_list_table");
table.deleteRow(row.rowIndex);

updateTotal();
}

function calculateColored(button) {
    const thicknessValue = parseFloat(document.getElementById("thickness").value);
    const lengthValue = parseFloat(document.getElementById("length").value);
    const pieceValue = parseFloat(document.getElementById("pcs").value);

    let totalWeight = thicknessValue * 7.85 * 1.219 * lengthValue * pieceValue;
    document.getElementById('weight_result').value = totalWeight.toFixed(2);
}

function calculateSteelDeck(button) {
    const thicknessValue = parseFloat(document.getElementById("thickness").value);
    const lengthValue = parseFloat(document.getElementById("length").value);
    const pieceValue = parseFloat(document.getElementById("pcs").value);

    let totalWeight = thicknessValue * 7.85 * 1.219 * lengthValue * pieceValue;
    document.getElementById('weight_result').value = totalWeight.toFixed(2);
}

function calculateSpandrell(button) {
    const thicknessValue = parseFloat(document.getElementById("thickness").value);
    const specWidth = parseFloat(document.getElementById("specWidth").value);
    const lengthValue = parseFloat(document.getElementById("length").value);
    const pieceValue = parseFloat(document.getElementById("pcs").value);

    let totalWeight = thicknessValue * 7.85 * 1.219 / specWidth* lengthValue * pieceValue;
    document.getElementById('weight_result').value = totalWeight.toFixed(2);
}

function calculateCPurlins(button) {
    const thicknessValue = parseFloat(document.getElementById("thickness").value);
    const specWidth = parseFloat(document.getElementById("specWidth").value);
    const lengthValue = parseFloat(document.getElementById("length").value);
    const pieceValue = parseFloat(document.getElementById("pcs").value);

    let totalWeight = thicknessValue * 7.85 * specWidth* lengthValue * pieceValue;
    document.getElementById('weight_result').value = totalWeight.toFixed(2);
}

function calculateBendedColored(button) {
    const thicknessValue = parseFloat(document.getElementById("thickness").value);
    const inchesValue = parseFloat(document.getElementById("itmInches").value);
    const pieceValue = parseFloat(document.getElementById("pcs").value);

    let totalWeight =  thicknessValue * 7.85 * 1.219 * (2.44 / 48) * inchesValue * pieceValue;
    document.getElementById('weight_result').value = totalWeight.toFixed(2);
}

function calculatePlainsheet(button) {
    const thicknessValue = parseFloat(document.getElementById("thickness").value);
    const pieceValue = parseFloat(document.getElementById("pcs").value);

    let totalWeight =  thicknessValue * 7.85 * 1.219 * 2.44 * pieceValue;
    document.getElementById('weight_result').value = totalWeight.toFixed(2);
}

function calculateAluminumZinc(button) {
    const thicknessValue = parseFloat(document.getElementById("thickness").value);
    const specWidth = parseFloat(document.getElementById("specWidth").value);
    const lengthValue = parseFloat(document.getElementById("length").value);
    const pieceValue = parseFloat(document.getElementById("pcs").value);

    let totalWeight = thicknessValue * 7.85 * 1.219 * specWidth* lengthValue * pieceValue;
    document.getElementById('weight_result').value = totalWeight.toFixed(2);
}

function updateFormula(selectElement) {
    const formulaExpressionDiv = document.getElementById("formula_expression");

    // Clear the existing content
    formulaExpressionDiv.innerHTML = "";

    // Get the selected value
    const selectedOption = selectElement.value;

    // Check the selected option and add corresponding input tags
    if (selectedOption === "colored") {
        const inputsRow = `
            <div class="row mt-3">
                <div class="col">
                    <label for="thickness">Actual Thickness:</label>
                    <input type="text" id="thickness" class="form-control form-control-sm" autocomplete="off">
                </div>
                <div class="col">
                    <label for="density">Density of Metal:</label>
                    <input type="text" id="density" class="form-control form-control-sm" value="7.85" autocomplete="off" disabled>
                </div>
                <div class="col">
                    <label for="widthRawMat">Width of raw material:</label>
                    <input type="text" id="widthRawMat" class="form-control form-control-sm" value="1.219" autocomplete="off" disabled>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <label for="length">Length:</label>
                    <input type="text" id="length" class="form-control form-control-sm" autocomplete="off">
                </div>
                <div class="col">
                    <label for="pcs">Pieces:</label>
                    <input type="text" id="pcs" class="form-control form-control-sm" autocomplete="off">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col">
                    <input class="btn btn-secondary btn-sm" id="calculateBtn" type="button" value="Calculate">
                </div>
            </div>
            
            <label for="weight_result" class="form-label mt-2">Result:</label>
            <input type="text" id="weight_result" class="form-control form-control-sm w-50" disabled>
        `;
        formulaExpressionDiv.innerHTML = inputsRow;
    
        document.getElementById("calculateBtn").addEventListener("click", function() {
            calculateColored(this);
        });
    
    } else if (selectedOption === "steelDeck"){
        const inputsSteelDeck = `
        <div class="row mt-3">
            <div class="col">
                <label for="thickness">Actual Thickness:</label>
                <input type="text" id="thickness" class="form-control form-control-sm" autocomplete="off">
            </div>
            <div class="col">
                <label for="density">Density of Metal:</label>
                <input type="text" id="density" class="form-control form-control-sm" value="7.85" autocomplete="off" disabled>
            </div>
            <div class="col">
                <label for="widthRawMat">Width of raw material:</label>
                <input type="text" id="widthRawMat" class="form-control form-control-sm" value="1.219" autocomplete="off" disabled>
            </div>
        </div>
        <div class="row mt-3">
        <div class="col">
        <label for="length">Length:</label>
        <input type="text" id="length" class="form-control form-control-sm" autocomplete="off">
    </div>
    <div class="col">
        <label for="pcs">Pieces:</label>
        <input type="text" id="pcs" class="form-control form-control-sm" autocomplete="off">
    </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input class="btn btn-secondary btn-sm" id="calculateSteelDeck" type="button" value="Calculate">
            </div>
        </div>

        <label for="weight_result" class="form-label mt-2">Total Weight:</label>
        <input type="text" id="weight_result" class="form-control form-control-sm w-50" disabled>
    `;
    formulaExpressionDiv.innerHTML = inputsSteelDeck;

    document.getElementById("calculateSteelDeck").addEventListener("click", function() {
        calculateSteelDeck(this);
    });
    } else if (selectedOption === "spandrell"){
        const inputsSpandrell = `
        <div class="row mt-3">
            <div class="col">
                <label for="thickness">Actual Thickness:</label>
                <input type="text" id="thickness" class="form-control form-control-sm" autocomplete="off">
            </div>
            <div class="col">
                <label for="density">Density of Metal:</label>
                <input type="text" id="density" class="form-control form-control-sm" value="7.85" autocomplete="off" disabled>
            </div>
            <div class="col">
                <label for="widthRawMat">Width of raw material:</label>
                <input type="text" id="widthRawMat" class="form-control form-control-sm" value="1.219" autocomplete="off" disabled>
            </div>
        </div>
        <div class="row mt-3">
        <div class="col">
        <label for="specWidth">Specified width:</label>
        <input type="text" id="specWidth" class="form-control form-control-sm" autocomplete="off">
    </div>
        <div class="col">
        <label for="length">Length:</label>
        <input type="text" id="length" class="form-control form-control-sm" autocomplete="off">
    </div>
    <div class="col">
        <label for="pcs">Pieces:</label>
        <input type="text" id="pcs" class="form-control form-control-sm" autocomplete="off">
    </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input class="btn btn-secondary btn-sm" id="calculateSpandrell" type="button" value="Calculate">
            </div>
        </div>

        <label for="weight_result" class="form-label mt-2">Total Weight:</label>
        <input type="text" id="weight_result" class="form-control form-control-sm w-50" disabled>
    `;
    formulaExpressionDiv.innerHTML = inputsSpandrell;

    document.getElementById("calculateSpandrell").addEventListener("click", function() {
        calculateSpandrell(this);
    });
    } else if (selectedOption === "c-purlins"){
        const inputsCpurlins = `
        <div class="row mt-3">
            <div class="col">
                <label for="thickness">Actual Thickness:</label>
                <input type="text" id="thickness" class="form-control form-control-sm" autocomplete="off">
            </div>
            <div class="col">
                <label for="density">Density of Metal:</label>
                <input type="text" id="density" class="form-control form-control-sm" value="7.85" autocomplete="off" disabled>
            </div>
            <div class="col">
                <label for="specWidth">Specified width:</label>
                <input type="text" id="specWidth" class="form-control form-control-sm" autocomplete="off">
            </div>
        </div>
        <div class="row mt-3">
        <div class="col">
        <label for="length">Length:</label>
        <input type="text" id="length" class="form-control form-control-sm" autocomplete="off">
    </div>
    <div class="col">
        <label for="pcs">Pieces:</label>
        <input type="text" id="pcs" class="form-control form-control-sm" autocomplete="off">
    </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input class="btn btn-secondary btn-sm" id="calculateCpurlins" type="button" value="Calculate">
            </div>
        </div>

        <label for="weight_result" class="form-label mt-2">Total Weight:</label>
        <input type="text" id="weight_result" class="form-control form-control-sm w-50" disabled>
    `;
    formulaExpressionDiv.innerHTML = inputsCpurlins;

    document.getElementById("calculateCpurlins").addEventListener("click", function() {
        calculateCPurlins(this);
    });
    } else if (selectedOption === "bendedColored"){
        const inputsBendedColored = `
        <div class="row mt-3">
            <div class="col">
                <label for="thickness">Actual Thickness:</label>
                <input type="text" id="thickness" class="form-control form-control-sm" autocomplete="off">
            </div>
            <div class="col">
                <label for="density">Density of Metal:</label>
                <input type="text" id="density" class="form-control form-control-sm" value="7.85" autocomplete="off" disabled>
            </div>
            <div class="col">
            <label for="widthRawMat">Width of raw material:</label>
            <input type="text" id="widthRawMat" class="form-control form-control-sm" value="1.219" autocomplete="off" disabled>
        </div>
        </div>
        <div class="row mt-3">
        <div class="col">
        <input type="text" id="" class="form-control form-control-sm" value="2.44" autocomplete="off" disabled>
    </div>
    <div class="col">
        <input type="text" id="" class="form-control form-control-sm" value="48" autocomplete="off" disabled>
    </div>
        </div>
        <div class="row mt-3">
        <div class="col">
        <label for="itmInches">Inches:</label>
        <input type="text" id="itmInches" class="form-control form-control-sm" autocomplete="off">
    </div>
    <div class="col">
        <label for="pcs">Pieces:</label>
        <input type="text" id="pcs" class="form-control form-control-sm" autocomplete="off">
    </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input class="btn btn-secondary btn-sm" id="calculateBendedColored" type="button" value="Calculate">
            </div>
        </div>

        <label for="weight_result" class="form-label mt-2">Total Weight:</label>
        <input type="text" id="weight_result" class="form-control form-control-sm w-50" disabled>
    `;
    formulaExpressionDiv.innerHTML = inputsBendedColored;

    document.getElementById("calculateBendedColored").addEventListener("click", function() {
        calculateBendedColored(this);
    });
    } else if (selectedOption === "plainsheet"){
        const inputsPlainsheet = `
        <div class="row mt-3">
            <div class="col">
                <label for="thickness">Actual Thickness:</label>
                <input type="text" id="thickness" class="form-control form-control-sm" autocomplete="off">
            </div>
            <div class="col">
                <label for="density">Density of Metal:</label>
                <input type="text" id="density" class="form-control form-control-sm" value="7.85" autocomplete="off" disabled>
            </div>
            <div class="col">
                <label for="widthRawMat">Width of raw material:</label>
                <input type="text" id="widthRawMat" class="form-control form-control-sm" value="1.219" autocomplete="off" disabled>
            </div>
        </div>
        <div class="row mt-3">
        <div class="col">
        <label for="pcs"></label>
        <input type="text" id="" class="form-control form-control-sm" value="2.44" autocomplete="off" disabled>
    </div>
    <div class="col">
        <label for="pcs">Pieces:</label>
        <input type="text" id="pcs" class="form-control form-control-sm" autocomplete="off">
    </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input class="btn btn-secondary btn-sm" id="calculatePlainsheet" type="button" value="Calculate">
            </div>
        </div>

        <label for="weight_result" class="form-label mt-2">Total Weight:</label>
        <input type="text" id="weight_result" class="form-control form-control-sm w-50" disabled>
    `;
    formulaExpressionDiv.innerHTML = inputsPlainsheet;

    document.getElementById("calculatePlainsheet").addEventListener("click", function() {
        calculatePlainsheet(this);
    });
    } else if (selectedOption === "aluminumZinc"){
        const inputsAluminumZinc = `
        <div class="row mt-3">
            <div class="col">
                <label for="thickness">Actual Thickness:</label>
                <input type="text" id="thickness" class="form-control form-control-sm" autocomplete="off">
            </div>
            <div class="col">
                <label for="density">Density of Metal:</label>
                <input type="text" id="density" class="form-control form-control-sm" value="7.85" autocomplete="off" disabled>
            </div>
            <div class="col">
                <label for="widthRawMat">Width of raw material:</label>
                <input type="text" id="widthRawMat" class="form-control form-control-sm" value="1.219" autocomplete="off" disabled>
            </div>
        </div>
        <div class="row mt-3">
        <div class="col">
        <label for="specWidth">Specified Width:</label>
        <input type="text" id="specWidth" class="form-control form-control-sm" autocomplete="off">
    </div>
    <div class="col">
        <label for="length">Length:</label>
        <input type="text" id="length" class="form-control form-control-sm" autocomplete="off">
    </div>
    <div class="col">
        <label for="pcs">Pieces:</label>
        <input type="text" id="pcs" class="form-control form-control-sm" autocomplete="off">
    </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input class="btn btn-secondary btn-sm" id="calculateAluminumZinc" type="button" value="Calculate">
            </div>
        </div>

        <label for="weight_result" class="form-label mt-2">Total Weight:</label>
        <input type="text" id="weight_result" class="form-control form-control-sm w-50" disabled>
    `;
    formulaExpressionDiv.innerHTML = inputsAluminumZinc;

    document.getElementById("calculateAluminumZinc").addEventListener("click", function() {
        calculateAluminumZinc(this);
    });
    }
    
}

const registerOrder = () =>{

    document.getElementById("blankModalTitle").innerText = "Order Information";
    document.getElementById("blankModalMainDiv").innerText = "";
    document.getElementById("blankModalMainDiv2").innerText = "";
    

    const formData = new FormData();
    formData.append("operation", "getRawmats");

    axios({
        url: "http://localhost/StocksInventorySystem/api/order.php",
        method: "post",
        data: formData
    })
        .then(response => {
        if (response.data.length === 0) {
            alert("There are no records retrieved.");
        } else {
            const raws = response.data;
            const rawmatOptions = raws.map(raw =>
            `<option value="${raw.rawmat_id}">${raw.name}</option>`
            ).join('');
            
            var orderDetailsForm = `
    <div class="row">
        <div class="col">
            <label for="purchase_order" class="form-label mt-2">Order Code:</label>
            <input type="text" id="purchase_order" class="form-control form-control-sm" disabled>
            <p class="text-dark fst-italic"><small>(Order Code# is autogenerated).</small></p>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <label for="client_name" class="form-label mt-1">Client Name</label>
            <input type="text" id="client_name" class="form-control form-control-sm" autocomplete="off">
        </div>
        <div class="col">
            <label for="item_description" class="form-label mt-1">Item Description</label>
            <input type="text" id="item_description" class="form-control form-control-sm" autocomplete="off">
        </div>
    </div>
    <div class="row">
        <div class="col">
            <label for="product_formula" class="form-label mt-2">Product formulas:</label>
            <select class="form-select form-select-sm" id="product_formula" aria-label="Default select example">
                <option selected>--Choose formula here--</option>
                <option value="colored">Colored</option>
                <option value="steelDeck">Steel Deck</option>
                <option value="spandrell">Spandrell</option>
                <option value="c-purlins">C-Purlins</option>
                <option value="bendedColored">Bended Colored</option>
                <option value="plainsheet">Plainsheet (Colored)</option>
                <option value="aluminumZinc">Aluminum Zinc Corrugated</option>
            </select>
        </div>
        <div class="col">
            <label for="roll_categ_option" class="form-label mt-2">Roll raw material category:</label>
            <select class="form-select form-select-sm" id="roll_categ_option" aria-label="Default select example">
                ${rawmatOptions}
            </select>
        </div>
    </div>
    <div id="formula_expression"></div>
`;

    document.getElementById("blankModalMainDiv").innerHTML = orderDetailsForm;      
    
    document.getElementById("product_formula").addEventListener("change", function() {
        updateFormula(this);
    });

    const btnAddOrder = document.createElement("button");
    btnAddOrder.innerText = "+ new order";
    btnAddOrder.classList.add("btn", "btn-primary", "mt-5", "btn-sm");
    btnAddOrder.onclick = ()=>{addOrder();};

    document.getElementById("blankModalMainDiv2").append(btnAddOrder);

    const table = document.createElement("table");
    table.classList.add("table", "table-bordered" ,"table-striped", "align-middle", "mt-3");
    table.id = "order_list_table";

    const tableHeader = `
        <thead class = "table-secondary align-middle" >
            <tr>
                <th scope="col">Item Description</th>
                <th scope="col">Pieces</th>
                <th scope="col">Weight</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
    `;
    table.innerHTML = tableHeader;

    const tableBody = document.createElement("tbody");
    tableBody.classList.add("table_content");
    
    table.appendChild(tableBody);
    
    const tableFooter = `
        <tfoot>
            <tr>
                <td colspan="2">Total</td>
                <td id="sumOfItems">0</td>
            </tr>
        </tfoot>
    `;
    
    table.innerHTML += tableFooter;

    document.getElementById("blankModalMainDiv2").appendChild(table);

    const btnRegister = document.createElement("button");
    btnRegister.innerText = "Register";
    btnRegister.classList.add("btn", "btn-cust-citrus", "mt-3","w-100");
    btnRegister.onclick = () => {
        saveRegistration();
        deductRoll();
        // updateTotal();
    };    
    
    document.getElementById("blankModalMainDiv2").append(btnRegister);

    const myModal = new bootstrap.Modal(document.getElementById('blankModal'), {
        keyboard: true,
        backdrop: "static"
    });
    myModal.show();
}
    })
    .catch(error =>{
        alert(error);
        console.log(response.data);
    })
}

function saveRegistration() {
    return new Promise((resolve, reject) => {
    var table = document.getElementById("order_list_table");
    var rows = table.getElementsByTagName("tr");

    const client_name = document.getElementById('client_name').value;
    const rawmat_name = document.getElementById('roll_categ_option').value;

    var headerTableArray = [];

    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");

        if (cells.length >= 3) {
            var itemDescriptionValue= cells[0].textContent;
            var pcsValue= cells[1].textContent;
            var itemWeightValue = cells[2].textContent;


            var headerItem = {
                detail_item_description: itemDescriptionValue,
                detail_item_pcs: pcsValue,
                detail_item_weight: itemWeightValue,
            };
            headerTableArray.push(headerItem);
        }
    }

    const json = {
    headerTable: headerTableArray,
    };

    const formData = new FormData();
    formData.append('client_name', client_name);
    formData.append('rawmat_name', rawmat_name);
    formData.append("operation", "addOrder");
    formData.append("json", JSON.stringify(json));


    axios({
    url: "http://localhost/StocksInventorySystem/api/order.php",
    method: "post",
    data: formData,
    }).then(response => {
        document.getElementById("alertModalMainDiv").innerText = "";
        document.getElementById("alertModalMainDiv2").innerText = "";
    
        const closeBtn = document.createElement("button");
        closeBtn.innerText = "OK";
        closeBtn.classList.add("btn", "text-primary", "border-0", "w-25");
        closeBtn.setAttribute("data-bs-dismiss", "modal");
    
        document.getElementById("alertModalMainDiv2").append(closeBtn);
    
        const myAlertModal = new bootstrap.Modal(document.getElementById('alertModal'), {
            keyboard: true,
            backdrop: "static"
        });

        setTimeout(() => {
            myAlertModal.show();
        }, 500);
    
        let alerts;
        if (response.data === 0) {
            alerts = `<p>Order registration failed!</p>`;
            console.log(response.data);
        } else {
            getRecords();
            alerts = `<p>Order registration successful!</p>`;
            console.log(response.data);
        }
        document.getElementById("alertModalMainDiv").innerHTML = alerts;

        
    }).catch(error => {
        alert(error);
    });
    const myModal = bootstrap.Modal.getInstance(document.getElementById('blankModal'));
    myModal.hide();
    const isSuccess = true;
        if (isSuccess) {
            resolve("Registration saved successfully.");
            console.log(response.data);
        } else {
            reject("Failed to save registration.");
            console.log(response.data);
        }
});
}

const rawmatOptions = () => {

    const formData = new FormData();
    formData.append("operation","getRawmats");

    return axios({
        url: "http://localhost/StocksInventorySystem/api/order.php",
        method: "post",
        data: formData
    })
    .then(response => {
        const raws = response.data;
        return raws.map(raw => 
            `<option value="${raw.rawmat_id}">${raw.name}</option>`
        ).join('');
    });
}

const deductRoll = () => {
    return new Promise((resolve, reject) => {
    const name = document.getElementById("roll_categ_option").value;
    const totalNetWeightInput = document.querySelector("#sumOfItems").textContent;

    
    const totalNetWeight = parseFloat(totalNetWeightInput);
        if (isNaN(totalNetWeight)) {
        alert("Please enter a valid numeric value for net weight.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("totalNetWeight", totalNetWeight);
    formData.append("operation", "deductRoll");

    axios({
        url: "http://localhost/StocksInventorySystem/api/order.php",
        method: "post",
        data: formData
    })
    .then(response => {
        console.log(response);
        showNotificationModal(response.data.message);
        resolve(response.data);
    })    
    .catch(error => {
        alert(error);
        reject(response.data);
    });
});
}

const showNotificationModal = (message) => {
    const responseModalMainDiv = document.getElementById("responseModalMainDiv");

    if (responseModalMainDiv) {
        responseModalMainDiv.innerHTML = message;

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "OK";
        closeBtn.classList.add("btn", "text-primary", "border-0", "w-25");
        closeBtn.setAttribute("data-bs-dismiss", "modal");

        const responseModalMainDiv2 = document.getElementById("responseModalMainDiv2");
        responseModalMainDiv2.innerHTML = "";
        responseModalMainDiv2.append(closeBtn);

        const responseNotifModal = new bootstrap.Modal(document.getElementById("responseModal"), {
            keyboard: true,
            backdrop: "static"
        });
        responseNotifModal.show();
    } else {
        console.error("Element with ID 'responseModalMainDiv' not found in the DOM.");
    }
};

const getRecords = () => {
    const formData = new FormData();
    formData.append("operation", "getRecords");

    axios({
        url: "http://localhost/StocksInventorySystem/api/order.php",
        method: "post",
        data: formData
    })
        .then(response => {
            console.log(response.data);
            if (response.data.length === 0) {
                alert("There are no records retrieved.")
            } else {
                displayRecords(response.data);
            }
        })
        .catch(error => {
            alert(error);
        })
}

const displayRecords = (rsSales) => {
    const tableRecords = document.getElementById("table_records");

    var dataTable = `
    <div class="table-responsive rounded-2">
    <table class="table table-bordered table-striped align-middle">
    <thead class="table-secondary align-middle">
            <tr>
                <th scope="col">Date Created</th>
                <th scope="col">Order Code</th>
                <th scope="col">Client Name</th>
                <th scope="col">Raw Material</th>
                <th scope="col">Pieces</th>
                <th scope="col">Total Weight</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
    <tbody>
    `;
    
    // Group orders by order code
    const groupedOrders = {};
    rsSales.forEach(order => {
        if (!groupedOrders[order.order_code]) {
            groupedOrders[order.order_code] = {
                ...order,
                raw_materials: [{ name: order.name, pieces: order.pieces, weight: order.weight, count: 1 }]
            };
        } else {
            const existingMaterial = groupedOrders[order.order_code].raw_materials.find(material => material.name === order.name);
            if (existingMaterial) {
                existingMaterial.pieces += order.pieces;
                existingMaterial.count++;
            } else {
                groupedOrders[order.order_code].raw_materials.push({ name: order.name, pieces: order.pieces, weight: order.weight, count: 1 });
            }
        }
    });
    
    // Iterate over grouped orders to create table rows
    Object.values(groupedOrders).forEach(order => {
        const rawMaterialsHtml = order.raw_materials.map(material => {
            if (material.count >= 2) {
                return `${material.count}`;
            } else {
                return `${material.name}`;
            }
        }).join(', ');
        
        dataTable += `
            <tr>
                <td>${order.date_created}</td>
                <td>${order.order_code}</td>
                <td>${order.client_name}</td>
                <td>${rawMaterialsHtml}</td>
                <td>${order.pieces}</td>
                <td>${order.weight}</td>
                <td class="text-center">
                <button data-order-id="${order.order_code}" class="btnView btn border-0 text-info p-1"><i class="fa-solid fa-eye"></i></button>
                </td>
            </tr>
        `;
    });

    dataTable += `</tbody></table></div>`;
    tableRecords.innerHTML = dataTable;

    tableRecords.querySelectorAll('.btnView').forEach(button => {
        button.addEventListener('click', function () {
            let orderId = this.getAttribute('data-order-id');
            viewOrderModal(orderId);
        });
    });
}

const viewOrderModal = (order_id) => {
    const formData = new FormData();
    formData.append("operation", "getOrderId");
    formData.append("order_id", order_id); // Corrected parameter name

    axios({
        url: "http://localhost/StocksInventorySystem/api/order.php",
        method: "post",
        data: formData
    })
    .then(response => {
        console.log('Server Response:', response.data);

        const { orderData, otherOrderData } = response.data;

        if (orderData && orderData.order_code) {
            viewOrderDetails(orderData, otherOrderData);
        } else {
            console.error('Invalid order data:', response.data); // Output response data for debugging
        }
    })
    .catch(error => {
        console.error('Error fetching order details:', error);
    });
}

function viewOrderDetails(orderData, otherOrderData) {
    document.getElementById("viewModalMainDiv").innerText = "";
    document.getElementById("viewModalMainDiv2").innerText = "";

    document.getElementById('viewModalTitle').innerText = `Order from ${orderData.order_code}`;

    const orderDetailsHtml = `
        <div class="row">
            <div class="col">
                <label for="" class="form-label mt-2">Order Code</label>
                <input type="text" id="" class="form-control form-control-sm" value="${orderData.order_code}" disabled>
            </div>
            <div class="col">
                <label for="" class="form-label mt-2">Client Name</label>
                <input type="text" id="" class="form-control form-control-sm" value="${orderData.client_name}" disabled>
            </div>
        </div>
    `;
    document.getElementById('viewModalMainDiv').innerHTML = orderDetailsHtml;

    const orderItemsTable = document.createElement('table');
    orderItemsTable.classList.add('table', 'table-bordered', 'table-striped', 'align-middle', 'mt-5');
    orderItemsTable.id = "order_list_table";

    const orderItemsTableHeader = `
        <thead class="table-secondary align-middle">
            <tr>
                <th scope="col">Item description</th>
                <th scope="col">Pieces</th>
                <th scope="col">Weight</th>
            </tr>
        </thead>
    `;
    orderItemsTable.innerHTML = orderItemsTableHeader;

    const orderItemsTableBody = document.createElement('tbody');
    orderItemsTableBody.classList.add('order_table_content');

    let totalWeight = 0; 

    otherOrderData.forEach((OrderData) => {
        const orderItemRow = `
            <tr>
                <td>${OrderData.item_description}</td>
                <td>${OrderData.pieces}</td>
                <td>${OrderData.weight}</td>
            </tr>
        `;
        orderItemsTableBody.innerHTML += orderItemRow;

        totalWeight += parseFloat(OrderData.weight);
    });

    const orderItemsTableFooter = `
        <tfoot>
            <tr>
                <td colspan="2" style="text-align:end">Total Weight:</td>
                <td>${totalWeight.toFixed(2)}</td>
            </tr>
        </tfoot>
    `;
    orderItemsTable.innerHTML += orderItemsTableFooter;

    orderItemsTable.appendChild(orderItemsTableBody);

    document.getElementById('viewModalMainDiv').appendChild(orderItemsTable);

    const myModal = new bootstrap.Modal(document.getElementById('viewModal'), {
        keyboard: true,
        backdrop: "static"
    });
    myModal.show();
}

setEventListeners();
getRecords();
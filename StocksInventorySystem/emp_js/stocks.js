const getRecords = () => {
    const formData = new FormData();
    formData.append("operation", "getStocks");

    axios({
        url: "http://localhost/StocksInventorySystem/api/stocks.php",
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

// const displayRecords = (rsStocks) => {
//     const tableRecords = document.getElementById("table-records");

//     var dataTable = `
//         <div class="table-responsive rounded-2">
//             <table class="table table-bordered table-striped align-middle">
//                 <thead class="table-secondary align-middle">
//                     <tr>
//                         <th scope="col">Raw Name</th>
//                         <th scope="col">Netweight</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//     `;

//     rsStocks.forEach(stock => {
//         const isLowStock = stock.is_low_stock;
//         const netweightColor = isLowStock ? 'text-danger' : '';
    
//         let netweightText = stock.total_netweight.toFixed(2);
//         if (isLowStock) {
//             netweightText += " (stock is low)";
//         }

//         dataTable += `
//             <tr>
//                 <td>${stock.name}</td>
//                 <td class="${netweightColor}">${netweightText}</td>
//             </tr>
//         `;
//     });    

//     dataTable += `</tbody></table></div>`;
//     tableRecords.innerHTML = dataTable;
// }


const displayRecords = (rsStocks) => {
    const tableRecords = document.getElementById("table-records");
    const lowStockMaterials = [];
    const fullStockMaterials = [];

    var dataTable = `
        <div class="table-responsive rounded-2">
            <table class="table table-bordered table-striped align-middle">
                <thead class="table-secondary align-middle">
                    <tr>
                        <th scope="col">Raw Name</th>
                        <th scope="col">Netweight</th>
                    </tr>
                </thead>
                <tbody>
    `;

    rsStocks.forEach(stocks => {
        const isLowStock = stocks.total_netweight < 7000 || stocks.total_netweight > 50000;
        const netweightColor = isLowStock ? 'text-danger' : '';
    
        let netweightText = stocks.total_netweight.toFixed(2);
        if (isLowStock) {
            netweightText += " (stock is low)";
        }
    
        if (isLowStock) {
            if (stocks.total_netweight < 7000) {
                // showNotificationToast(`Stock is low for ${stocks.name}`, 'danger', () => {
                //     setTimeout(() => {
                //         window.location.href = '/admin/purchaseorder.html';
                //     }, 400000);
                // });
                lowStockMaterials.push(stocks.name);
            } else {
                // showNotificationToast(`Stock is full for ${stocks.name}`, 'success');
                // fullStockMaterials.push(stocks.name);
            }
        }
    
        dataTable += `
            <tr>
                <td>${stocks.name}</td>
                <td class="${netweightColor}">${netweightText}</td>
            </tr>
        `;
    });    

    dataTable += `</tbody></table></div>`;
    tableRecords.innerHTML = dataTable;
}

const showNotificationToast = (message, type, onCloseCallback) => {
    const responseToastDiv = document.getElementById("responseToastDiv");

    responseToastDiv.innerHTML = '';

    const toastIcon = document.createElement("i");
    toastIcon.classList.add("fas", type === 'danger' ? "fa-exclamation-circle" : "fa-check-circle", type === 'danger' ? "text-danger" : "text-success", "me-2");

    responseToastDiv.appendChild(toastIcon);

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;

    responseToastDiv.appendChild(messageSpan);

    const toastElement = document.querySelector(".toast");
    const toast = new bootstrap.Toast(toastElement);

    toastElement.addEventListener('hidden.bs.toast', () => {
        if (onCloseCallback && typeof onCloseCallback === 'function') {
            onCloseCallback();
        }
    });

    toast.show();
};

getRecords();

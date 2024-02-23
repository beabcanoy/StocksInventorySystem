const getSystemUser = () => {

    let message = "";
    const url = 'http://localhost/StocksInventorySystem/api/login.php';

    const formData = new FormData();
    formData.append("operation", "getLoginHistory");

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
            <th class="w-25">Name</th>
            <th>Avatar</th>
            <th class="w-25">Username</th>
            <th class="w-25">Last Login Date/Time</th>
            <th>User type</th>
        </tr>
    </thead>
    <tbody>
    `;

    rsSystemUsers.forEach(systemUser => {

        if(systemUser.avatar == ''){
            systemUser.avatar = './api/avatar/noimage.jpg';
        }

        if (systemUser.type == 1) {
            systemUser.type = "Administrator";
        } else {
            systemUser.type = "Employee";
        }

        if(systemUser.last_login ==  null){
            systemUser.last_login = '--';
        }

        systemUsersTable += `
            <tr>
                
                <td>${systemUser.first_name} ${systemUser.last_name}</td>
                <td class="text-center"><img src="../api/${systemUser.avatar}" alt="avatar" width="72px" height="72px"></td>
                <td>${systemUser.username}</td>
                <td class="text-center">${systemUser.last_login}</td>
                <td class="text-center">${systemUser.type}</td>
            </tr>
        `;
    });
    
    systemUsersTable += `</tbody></table></div>`;
    table_records.innerHTML = systemUsersTable;
}

getSystemUser();

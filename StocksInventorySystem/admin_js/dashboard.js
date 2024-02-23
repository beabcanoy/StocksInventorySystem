const getTotalMaterial =()=>{
    const formData = new FormData();
    formData.append("operation","getTotalCount");

    axios({
        url: "http://localhost/StocksInventorySystem/api/rawmaterial.php",
        method: "post",
        data: formData
    })

    .then(response =>{
        if(response.data.length == 0){
            alert("There are no records retrieved.")
        } else {
            const totalMaterialCount = response.data;

            const raw = document.getElementById('rawCount');
            var count = `<h3>${totalMaterialCount}</h3>`;
            raw.innerHTML = count;

        }
    })
    .catch(error =>{
        alert(error);
    })
}

const getTotalRaw =()=>{
    const formData = new FormData();
    formData.append("operation","getTotalCount");

    axios({
        url: "http://localhost/StocksInventorySystem/api/supplier.php",
        method: "post",
        data: formData
    })

    .then(response =>{
        if(response.data.length == 0){
            alert("There are no records retrieved.")
        } else {
            const totalRawCount = response.data;

            const supplier = document.getElementById('supplierCount');
            var count = `<h3>${totalRawCount}</h3>`;
            supplier.innerHTML = count;

        }
    })
    .catch(error =>{
        alert(error);
    })
}

const getTotalUsers =()=>{
    const formData = new FormData();
    formData.append("operation","getTotalCount");

    axios({
        url: "http://localhost/StocksInventorySystem/api/user.php",
        method: "post",
        data: formData
    })

    .then(response =>{
        if(response.data.length == 0){
            alert("There are no records retrieved.")
        } else {
            const totalUsersCount = response.data;

            const userCount = document.getElementById('userCount');
            var count = `<h3>${totalUsersCount}</h3>`;
            userCount.innerHTML = count;

        }
    })
    .catch(error =>{
        alert(error);
    })
}
getTotalRaw();
getTotalMaterial();
getTotalUsers();
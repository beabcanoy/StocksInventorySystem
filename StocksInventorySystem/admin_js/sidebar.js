const sidebarToggle = document.querySelector("#sidebar-toggle");

sidebarToggle.addEventListener("click", function (){
    document.querySelector("#sidebar").classList.toggle("expand");
});

const displayUserDetails = () => {
    document.querySelector('#user_avatar').innerHTML = `<img src="../api/${sessionStorage.acc_avatar}" class="avatar img-fluid rounded-circle" alt="avatar">`;
    document.querySelector('#user_type').innerHTML = `<small class="text-dark fw-bold m-0">${sessionStorage.acc_type}</small>`;
    document.querySelector('#user_username').innerHTML = `<small class="text-dark m-0">${sessionStorage.acc_username}</small>`;
}

displayUserDetails();



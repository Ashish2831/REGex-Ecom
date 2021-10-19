"use strict";

const loginFunc = async (event) => {
    event.preventDefault();
    const email = event.target[0];
    const password = event.target[1];

    const response = await fetch(`/api/v1/login/`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email.value,
            "password": password.value
        }),
    });
    const data = await response.json();
    console.log(data);

    email.value = "";
    password.value = "";

    if (data.success) {
        fetch(`/login/${data.success}/${JSON.stringify(data.token)}/`);
        window.location.href = "/";
    } else {
        const loginError = document.getElementById('login_error');
        loginError.innerHTML = data.message;
    }
}

const registerFunc = async (event) => {
    event.preventDefault();
    const name = event.target[0];
    const email = event.target[1];
    const password = event.target[2];
    
    const response = await fetch(`/api/v1/register/`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": name.value,
            "email": email.value,
            "password": password.value
        }),
    });
    const data = await response.json();
    name.value = "";
    email.value = "";
    password.value = "";

    const register_success = document.getElementById('register_success');
    register_success.innerHTML = "Registered Successfully!!";
}

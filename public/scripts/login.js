localStorage.removeItem('accessToken');

const username = document.getElementById('username');
const password = document.getElementById('password');
const errMsg = document.getElementById('err-msg');



async function loginUser(){


    const res = await fetch('/auth/login', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({
            username : username.value,
            password : password.value
        })
    })

    const data = await res.json();

    if (!res.ok){
        errMsg.style.display = 'block';
        errMsg.textContent = data.err || 'Error Occured';
        return;
    }else{ 
        localStorage.setItem('accessToken', data.accessToken);
        console.log(data);
        window.location.href = '/dashboard.html';
    }
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await loginUser();
})
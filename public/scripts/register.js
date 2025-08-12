const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errMsg = document.getElementById('err-msg');



async function registerUser(){
    const res = await fetch('https://viora-backend.onrender.com/auth/register', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({
            username : username.value,
            email : email.value,
            password : password.value,
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

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (password.value !== confirmPassword.value){
        errMsg.style.display = 'block';
        errMsg.textContent = 'Password does not match.';
        return;
    }
    await registerUser();
})
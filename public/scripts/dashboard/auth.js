async function loadContent(retry = true){
  const accessToken = localStorage.getItem('accessToken');
  
  const res  = await fetch('/auth/protected', {
    headers : {'authorization' : 'Bearer ' + accessToken}
  })
  if (!res.ok && retry){
    const refreshRes = await fetch('/auth/refresh', {
        'method' : 'GET',
        'credentials' : 'include'
      })
    if (refreshRes.ok){
        const {accessToken} = await refreshRes.json();
        localStorage.setItem('accessToken', accessToken);
        return await loadContent(false);
    }else{
        alert('Session Expired. Re-login.');
        window.location.href = '/login.html';
        return;
    }
    }else if(!res.ok){
        alert('Session Expired. Re-login.');
        window.location.href = '/login.html';
        return;
    }

  return res.json();
}
loadContent();

async function logout(){
  const res = await fetch('/auth/logout', {
    method : 'POST',
    credentials : 'include'
  })
  const data = await res.json();
  alert(data.msg + ' | You have been logged out.');
  window.location.href = '/login.html';
}

document.getElementById('logout').addEventListener('click', () => {
  logout();
})


const deleteUser = async () => {
  
  const confirmDelete = confirm('Do you want this account deleted?');
  if (!confirmDelete) return;
  
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;
  
  const res = await fetch('/auth/delete', {
    method : 'DELETE',
    headers : {
      'Content-Type' : 'application/json',
      'authorization' : 'Bearer ' + accessToken
    }
  })
  
  if (res.ok){
    localStorage.clear();
    alert('This account is deleted.');
    window.location.href = '/login.html'
  }else{
    const data = await res.json();
    alert(data.err || 'Failed to delete user.');
  }
  
}

document.getElementById('delete-user').addEventListener('click', () => {
  deleteUser();
})
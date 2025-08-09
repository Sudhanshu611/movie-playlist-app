(function protectPage() {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    alert('You must be logged in to view this page.');
    window.location.href = '/dashboard.html';
    return;
  }

})();

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


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movieId = urlParams.get('id');
console.log(movieId);

const html = ``


async function getMovieInfo(){
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return alert('Token not found.');

    const res = await fetch('/movie/details/' + movieId, {
        headers : {
            'Content-Type' : 'application/json',
            'authorization' : 'Bearer ' + accessToken
        }
    })
    const data = await res.json();

    if (!res.ok) return alert(data.err);

    return data;
}


async function displayInfo(){
    const {movieInfo, userInfo} = await getMovieInfo();
    console.log(movieInfo);
    console.log(userInfo);
    document.getElementById("poster").src = movieInfo.poster;
    document.getElementById("title").innerText = movieInfo.title;
    document.getElementById("year").innerText = movieInfo.year;
    document.getElementById("rated").innerText = movieInfo.rated;
    document.getElementById("runtime").innerText = movieInfo.runtime;
    document.getElementById("released").innerText = movieInfo.released;
    document.getElementById("genre").innerText = movieInfo.genre;
    document.getElementById("director").innerText = movieInfo.director;
    document.getElementById("writer").innerText = movieInfo.writer;
    document.getElementById("actors").innerText = movieInfo.actors;
    document.getElementById("language").innerText = movieInfo.language;
    document.getElementById("country").innerText = movieInfo.country;
    document.getElementById("awards").innerText = movieInfo.awards;
    document.getElementById("box_office").innerText = movieInfo.box_office;
    document.getElementById("plot").innerText = movieInfo.plot;
    document.getElementById("imdb_rating").innerText = movieInfo.imdb_rating;
    document.getElementById("imdb_votes").innerText = movieInfo.imdb_votes;

    document.getElementById('status').value = userInfo.status;
    document.getElementById('personal-rating').value = userInfo.personal_rating;

    return;
}
displayInfo();

document.getElementById('save-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken'); 
    const status = document.getElementById('status');
    const personalRating = document.getElementById('personal-rating');

    const res = await fetch('/movie/update/'+movieId, {
        method : 'PUT',
        headers : {
            'Content-Type' : 'application/json',
            'authorization' : 'Bearer ' + accessToken
        },
        body : JSON.stringify({
            status : status.value,
            personalRating : Number(personalRating.value)
        })
    })

    const data = await res.json();

    if (!res.ok) return alert(data.err);
    console.log(data.updatedData)
    status.value = data.updatedData.status;
    personalRating.value = data.updatedData.personal_rating;

})
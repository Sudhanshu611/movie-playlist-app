const movieCardsHTML = document.getElementById('movie-list');
async function renderHTML(){
  try{
    const accessToken = localStorage.getItem('accessToken');
    const res = await fetch('https://viora-backend.onrender.com/movie/userMovies',{
      headers : {'Content-Type' : 'application/json',
        'authorization' : 'Bearer ' + accessToken
      }
    }
    );
    const data = await res.json();

    if (!res.ok) return alert(data.err);

    const movies = data.movies;
    console.log(movies || []);
    let html = '';
    movies.forEach((movie) => {

      const poster = movie.poster && movie.poster !== 'N/A'
        ? movie.poster
        : '';
      const genre = movie.genre.split(', ')[0];
      console.log(genre)
      const language = movie.language.split(', ')[0];

      html += `<div class="movie-card">
          <img class="movie-poster" src="${poster}" alt="${movie.title}">
          <div class="movie-details">
              <h3 class="movie-title">${movie.title}</h3>
              <div class="movie-meta">
                  <span>${movie.rated}</span>
                  <span>${movie.runtime}</span>
                  <span>${genre}</span>
                  <span>${language}</span>
              </div>
              <div class="movie-ratings">
                  <div class="rating-badge">
                      IMDb: ${movie.imdb_rating}
                  </div>
              </div>
              <p class="movie-plot">${movie.plot}</p>
              <div class="movie-actions">
                  <button class="open-btn" data-movie-id="${movie.id}">
                      Open
                  </button>
                  <button class="delete-btn" id="delete-btn" data-movie-id="${movie.id}">
                      Remove
                  </button>
              </div>
          </div>
      </div>`
    })
    movieCardsHTML.innerHTML = html;
    document.querySelectorAll('.open-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const id  = btn.dataset.movieId;
            window.location.href = '/movieDetails.html?id=' + id;
        })
    })
    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const id  = btn.dataset.movieId;
            console.log(id);
            await deleteMovie(id);
            await renderHTML();
        })
    })

  }catch(err){
    alert(err.message);
    return;
  }
}

renderHTML();


async function deleteMovie(id){
    const accessToken = localStorage.getItem('accessToken');
    try{
    const res = await fetch('https://viora-backend.onrender.com/movie/delete/' + id, {
        method : 'DELETE',
        headers : {
            'authorization' : 'Bearer ' + accessToken,
            'Content-Type' : 'application/json'
        }
    })
    const data = await res.json();
    console.log(data)
    if (!res.ok) alert(data.err);
    }catch(err){
        console.log(err.message);
    }
    return;

}

const API = '890b662a';
const URL = `http://www.omdbapi.com/?apikey=${API}&`;


const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions');

async function movieBySearch(input){
  try{
    const res = await fetch(URL + 's=' + input);
    if (!res.ok) alert('Error in search');
  
    const moviesResult = await res.json();

    if (res.Error){
      console.log('API Error:', data.Error);
      return []; // Return empty array instead of undefined
    }
  
    const movies = moviesResult["Search"] || [];
    return movies;
  }catch(err){
    alert(err.message);
    return;
  }
}

  async function addMovie(movieId){
    try{
      const movie = await fetch(URL + 'i=' + movieId);
      
      const accessToken = localStorage.getItem('accessToken')

    const movieData = await movie.json();
    console.log(movieData)
    const res = await fetch('https://viora-backend.onrender.com/movie/insert',{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'authorization' : 'Bearer ' + accessToken
      },
      body : JSON.stringify({
        movie: movieData,
        status : 'Planned',
        personalRating : 0
      })
    }) 
    const data = await res.json();
    if (!res.ok){
      alert(data.err)
    }
    return;
  }catch(err){
    console.log(err.message);
    return;
  }
}

let debounceTimeout;
searchInput.addEventListener('input', async () => {

  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
    const query = searchInput.value.toLowerCase();
    suggestionsList.innerHTML = '';
    
    if (query === '') {
      suggestionsList.style.display = 'none';
      return;
    }
  
    const movies = await movieBySearch(query);
    
    if (movies.length > 0) {
      movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `<div class="poster"><img src="${movie['Poster']}" alt=""></div>
                      <div class="movie-content">
                          ${movie['Title']} 
                          <br>
                          Year: ${movie['Year']}
                      </div>`;
        li.addEventListener('click', async () => {
          // console.log(`Selected: ${movie}`);
          await addMovie(movie.imdbID);
          suggestionsList.innerHTML = '';
          searchInput.value = movie.Title;
          suggestionsList.style.display = 'none';
          await renderHTML();
        });
        suggestionsList.appendChild(li);
      });
      suggestionsList.style.display = 'block';
    } else {
      suggestionsList.style.display = 'none';
    }
  }, 250);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    suggestionsList.style.display = 'none';
  }
});
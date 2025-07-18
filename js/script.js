const globalState = {
	currentPage: window.location.pathname,
};

// popular movies
async function displayPopularMovies() {
	const { results } = await fetchData('movie/popular');

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
							movie.poster_path
								? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
								: `								<img
									src="images/no-image.jpg"
									class="card-img-top"
									alt="Movie Title"
								/>`
						}
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date} </small>
            </p>
          </div>`;

		document.querySelector('#popular-movies').appendChild(div);
	});
}

// Fetch data from TMDB API

async function fetchData(endpoint) {
	const API_KEY = '35aed5321566551dccd40f8656471bde';
	const API_URL = 'http://api.themoviedb.org/3/';

	const res = await fetch(
		`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
	);
	const data = await res.json();

	return data;
}

// high light active link

function highLightActiveLink() {
	const links = document.querySelectorAll('.nav-link');
	links.forEach((link) => {
		if (link.getAttribute('href') === globalState.currentPage) {
			link.classList.add('active');
		}
	});
}

// init app

function init() {
	switch (globalState.currentPage) {
		case '/':
		case '/index.html':
			displayPopularMovies();
			break;
		case '/shows.html':
			console.log('Shows');
			break;
		case '/movie-details.html':
			console.log('Movie Details');
			break;
		case '/tv-details.html':
			console.log('TV Details');
			break;
		case '/search.html':
			console.log('Search');
	}
	highLightActiveLink();
}

document, addEventListener('DOMContentLoaded', init);

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

// popular Tv shows
async function displayPopularShows() {
	const { results } = await fetchData('tv/popular');

	results.forEach((show) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            ${
							show.poster_path
								? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
								: `								<img
									src="images/no-image.jpg"
									class="card-img-top"
									alt="${show.name}"
								/>`
						}
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${
								show.first_air_date
							} </small>
            </p>
          </div>`;

		document.querySelector('#popular-shows').appendChild(div);
	});
}

// Fetch data from TMDB API

async function fetchData(endpoint) {
	//register your personal key at https:www.themoviedb.org/setting/api and enter here
	// only use for study development and small projects you should store your  personal key and make request on the server
	const API_KEY = '35aed5321566551dccd40f8656471bde';
	const API_URL = 'http://api.themoviedb.org/3/';

	showSpinner();

	const res = await fetch(
		`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
	);
	const data = await res.json();

	hideSpinner();

	return data;
}

function showSpinner() {
	document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
	document.querySelector('.spinner').classList.remove('show');
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
			displayPopularShows();
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

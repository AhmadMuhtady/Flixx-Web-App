const globalState = {
	currentPage: window.location.pathname,
	search: {
		term: '',
		type: '',
		page: 1,
		totalPages: 1,
	},
	api: {
		apiKey: '35aed5321566551dccd40f8656471bde',
		apiUrl: 'http://api.themoviedb.org/3/',
	},
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

// display movies details

async function displayMoviesDetails() {
	const movieId = window.location.search.split('=')[1];

	const movie = await fetchData(`movie/${movieId}`);
	console.log(movieId);

	//overlay for background image
	displayBackGroundImage('movie', movie.backdrop_path);

	const div = document.createElement('div');
	div.innerHTML = `
  <div class="details-top">
          <div>
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
									alt="${movie.title}"
								/>`
							}
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>${movie.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
							movie.homepage
						}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
							movie.budget
						)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
							movie.revenue
						)}</li>
            <li><span class="text-secondary">Runtime:</span> ${
							movie.runtime
						} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies
						.map((company) => `<span>${company.name}</span>`)
						.join(', ')}
        </div>
  `;

	document.querySelector('#movie-details').appendChild(div);
}

// display shows details

async function displayShowDetails() {
	const showId = window.location.search.split('=')[1];

	const show = await fetchData(`tv/${showId}`);

	//overlay for background image
	displayBackGroundImage('tv', show.backdrop_path);

	const div = document.createElement('div');
	div.innerHTML = `
  <div class="details-top">
          <div>
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
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
            <p>${show.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
							show.homepage
						}" target="_blank" class="btn">Visit show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of Episodes:</span> ${
							show.number_of_episodes
						}</li>
            <li><span class="text-secondary">Last Episode to Air:</span> ${
							show.last_episode_to_air.name
						}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies
						.map((company) => `<span>${company.name}</span>`)
						.join(', ')}
        </div>
  `;

	document.querySelector('#show-details').appendChild(div);
}

// Fetch data from TMDB API

async function fetchData(endpoint) {
	//register your personal key at https:www.themoviedb.org/setting/api and enter here
	// only use for study development and small projects you should store your  personal key and make request on the server
	const API_KEY = globalState.api.apiKey;
	const API_URL = globalState.api.apiUrl;

	showSpinner();

	const res = await fetch(
		`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
	);
	const data = await res.json();

	hideSpinner();

	return data;
}

// make request to search
async function searchAPIData() {
	//register your personal key at https:www.themoviedb.org/setting/api and enter here
	// only use for study development and small projects you should store your  personal key and make request on the server
	const API_KEY = globalState.api.apiKey;
	const API_URL = globalState.api.apiUrl;

	showSpinner();

	const res = await fetch(
		`${API_URL}search/${globalState.search.type}?api_key=${API_KEY}&language=en-US&query=${globalState.search.term}`
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

//add Commas To Number
function addCommasToNumber(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//display backdrop on details pages
function displayBackGroundImage(type, backgroundPath) {
	const overlayDiv = document.createElement('div');
	overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
	overlayDiv.style.backgroundSize = 'cover';
	overlayDiv.style.backgroundPosition = 'center';
	overlayDiv.style.backgroundRepeat = 'no-repeat';
	overlayDiv.style.height = '100vh';
	overlayDiv.style.width = '100vw';
	overlayDiv.style.position = 'absolute';
	overlayDiv.style.top = '0';
	overlayDiv.style.left = '0';
	overlayDiv.style.zIndex = '-1';
	overlayDiv.style.opacity = '0.1';

	if (type === 'movie') {
		document.querySelector('#movie-details').appendChild(overlayDiv);
	} else {
		document.querySelector('#show-details').appendChild(overlayDiv);
	}
}

// search movie / tv shows

async function search(results) {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	globalState.search.type = urlParams.get('type');
	globalState.search.term = urlParams.get('search-term');

	if (globalState.search.term !== '' && globalState.search.term !== null) {
		// todo make request and display results
		const { results, total_pages, page } = await searchAPIData();
		if (results.length === 0) {
			showAlert('No results found');
			return;
		}

		displaySearchResult(results);
		document.querySelector('#search-term').value = '';
	} else {
		showAlert('Please enter a search term');
	}
}

// display results in search
function displaySearchResult(results) {
	results.forEach((result) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
          <a href="${globalState.search.type}-details.html?id=${result.id}">
            ${
							result.poster_path
								? `<img
              src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
              class="card-img-top"
              alt="${
								globalState.search.type === 'movie' ? result.title : result.name
							}"
            />`
								: `								<img
									src="images/no-image.jpg"
									class="card-img-top"
									alt=""${globalState.search.type === 'movie' ? result.title : result.name}"
								/>`
						}
          </a>
          <div class="card-body">
            <h5 class="card-title">"${
							globalState.search.type === 'movie' ? result.title : result.name
						}"</h5>
            <p class="card-text">
              <small class="text-muted">Release: "${
								globalState.search.type === 'movie'
									? result.release_date
									: result.first_air_date
							}" </small>
            </p>
          </div>`;

		document.querySelector('#search-results').appendChild(div);
	});
}
// show alert design

function showAlert(message, className = 'error') {
	const alertEl = document.createElement('div');
	alertEl.classList.add('alert', className);
	alertEl.appendChild(document.createTextNode(message));
	document.querySelector('#alert').appendChild(alertEl);

	setTimeout(() => {
		alertEl.remove();
	}, 2000);
}
// display slider movies

async function displaySlider() {
	const { results } = await fetchData('movie/now_playing');

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide');
		div.innerHTML = `
			<a href="movie-details.html?id=${movie.id}">
				<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
			movie.title
		}" />
			</a>
			<h4 class="swiper-rating">
				<i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
			</h4>
		`;

		document.querySelector('.swiper-wrapper').appendChild(div);
	});

	initSwiper(); // ✅ Only call once after all slides are added
}

function initSwiper() {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1, // ✅ fixed typo
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			// ✅ fixed typo (autoPlay → autoplay)
			delay: 4000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4, // or change as needed
			},
		},
	});
}

// init app

function init() {
	switch (globalState.currentPage) {
		case '/':
		case '/index.html':
			displayPopularMovies();
			displaySlider();
			break;
		case '/shows.html':
			displayPopularShows();
			break;
		case '/movie-details.html':
			displayMoviesDetails();
			break;
		case '/tv-details.html':
			displayShowDetails();
			break;
		case '/search.html':
			search();
	}
	highLightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);

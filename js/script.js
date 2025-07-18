const globalState = {
	currentPage: window.location.pathname,
};

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
			console.log('Home');
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

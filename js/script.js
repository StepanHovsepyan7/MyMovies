const API_KEY = "api_key=9b702a6b89b0278738dab62417267c49";
let root = document.getElementById("root");
let popularParent = document.getElementsByClassName("popularParent")[0];
let upcomingParent = document.getElementsByClassName("upcomingParent")[0];
let searchInp = document.getElementsByClassName("searchInp")[0];
let title = document.getElementById("title");
let title2 = document.getElementById("title2");
let form = document.getElementById("form");
let selectedGenres = document.getElementById("selectedGenres");
let genresParent = document.getElementById("genresParent");
let upcomingmovies = document.getElementById("upcoming-Movies");
let awards = document.getElementById("awards");
let awardsHtml = awards.innerHTML;

let img_url_original = "https://image.tmdb.org/t/p/original";
let img_url = "https://image.tmdb.org/t/p/w500";

console.log("https://api.themoviedb.org/3/movie/popular?" + API_KEY);

function loadPopular(type = "movie") {
	popularParent.innerHTML = "";
	title.innerHTML = "Popular Films";
	awards.innerHTML = awardsHtml;

	fetch(`https://api.themoviedb.org/3/${type}/popular?${API_KEY}`)
		.then((response) => response.json())
		.then((response) =>
			response.results.forEach((elm) => {
				popularParent.innerHTML += `
				<a href="single.html?id=${
					elm.id
				}&type=${type}" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
					<div class="parentCard">
						<img src=${img_url + elm.poster_path}/>
						<div class="contentCard">
							<span class="spans spansTitle">${elm.title}</span>
							<span class="spans">Rating: ${elm.vote_average}</span>
							<span class="spans">${elm.release_date}</span>
						</div>
					</div>
				</a>`;
			})
		)
		.catch((err) => console.error(err));
}

loadPopular();

// Genres
let chosenMovie = [];
let allGneres = [];

function showSelectedGenres() {
	selectedGenres.innerHTML = "";
	chosenMovie.forEach((id) => {
		let foundGenre = allGneres.find((genre) => genre.id === id);
		if (foundGenre) {
			let btn = document.createElement("button");
			btn.innerHTML = `${foundGenre.name} <i class="fa-solid fa-xmark"></i>`;
			btn.addEventListener("click", () => {
				chosenMovie = chosenMovie.filter((e) => e !== id);
				document.querySelectorAll(".genreBtn").forEach((e) => {
					if (e.innerHTML === foundGenre.name) {
						e.classList.remove("activeBtn");
					}
				});
				showSelectedGenres();
				loadedGenre();
			});
			selectedGenres.append(btn);
		}
	});
}

function loadedGenre(type) {
	popularParent.innerHTML = "";
	if (chosenMovie.length === 0) {
		loadPopular();
		upcomingMovies();
		title.innerHTML = "Popular Movies";
	} else {
		const selected = chosenMovie.join(",");
		fetch(
			`https://api.themoviedb.org/3/discover/${type}?${API_KEY}&with_genres=${selected}`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.results.length === 0) {
					popularParent.innerHTML = `<p>No movies found for the selected genres.</p>`;
				} else {
					data.results.forEach((e) => {
						popularParent.innerHTML += `
							<a  href="single.html?id=${
								e.id
							}&type=${type}" data-aos="flip-up" data-aos-duration="1000" data-aos-delay="500">
								<div class="parentCard">
									<img src=${img_url + e.poster_path}/>
									<div class="contentCard">
										<span class="spans spansTitle">${e.title || e.name}</span>
										<span class="spans">Rating: ${e.vote_average}</span>
										<span class="spans">${e.release_date || e.first_air_date}</span>
									</div>
								</div>
							</a>`;
					});
				}
			})
			.catch((err) => console.error("Error fetching genre movies:", err));
	}
}

function genres(type = "movie") {
	genresParent.innerHTML = "";
	fetch(`https://api.themoviedb.org/3/genre/${type}/list?` + API_KEY)
		.then((response) => response.json())
		.then((genersData) => {
			allGneres = genersData.genres;
			genersData.genres.forEach((e) => {
				let genreBtn = document.createElement("button");
				genreBtn.classList.add("genreBtn");
				genreBtn.innerHTML = e.name;
				genresParent.append(genreBtn);

				genreBtn.addEventListener("click", () => {
					if (!chosenMovie.includes(e.id)) {
						genreBtn.classList.add("activeBtn");
						chosenMovie.push(e.id);
						showSelectedGenres();
						loadedGenre(type);

						title.innerHTML = "Filtered by Genres";
						awards.innerHTML = "";
						popularParent.innerHTML = "";
						upcomingParent.innerHTML = "";
						title2.innerHTML = "";
						upcomingmovies.style.marginTop = "0px";
					}
				});
			});
		})
		.catch((err) => console.error("Error fetching genre Movies:", err));
}

genres();

// Movies Search
form.addEventListener("submit", (e) => {
	e.preventDefault();
});

function search() {
	let timer = "";
	searchInp.addEventListener("input", (e) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const query = e.target.value.trim();
			if (query !== "") {
				title.innerHTML = "Results";
				title2.innerHTML = "";
				fetch(
					`https://api.themoviedb.org/3/search/multi?${API_KEY}&query=${query}`
				)
					.then((data) => data.json())
					.then((data) => {
						popularParent.innerHTML = "";
						upcomingParent.innerHTML = "";
						upcomingmovies.style.marginTop = "0";
						awards.innerHTML = "";

						data.results.forEach((e) => {
							if (
								e.media_type === "movie" ||
								e.media_type === "tv"
							) {
								popularParent.innerHTML += `
								<a href="single.html?id=${e.id}&type=${
									e.media_type
								}" data-aos="flip-down" data-aos-duration="1000" data-aos-delay="500">
									<div class="parentCard">
										<img src=${img_url + e.poster_path}/>
										<div class="contentCard">
											<span class="spans spansTitle">${e.title || e.name}</span>
											<span class="spans">Rating: ${e.vote_average}</span>
											<span class="spans">${e.release_date || e.first_air_date}</span>
										</div>
									</div>
								</a>`;
							}
						});
					});
			} else {
				title.innerHTML = "Popular Films";
				awards.innerHTML = awardsHtml;
				upcomingmovies.style.marginTop = "150px";
				loadPopular();
				upcomingMovies();
			}
		}, 1000);
	});
}

search();

function upcomingMovies(type = "movie") {
	upcomingParent.innerHTML = "";
	upcomingmovies.style.marginTop = "150px";
	title2.innerHTML = "Upcoming Movies";

	fetch(`https://api.themoviedb.org/3/movie/upcoming?${API_KEY}`)
		.then((res) => res.json())
		.then((data) => {
			data.results.forEach((e) => {
				upcomingParent.innerHTML += `
				<a href="single.html?id=${
					e.id
				}&type=${type}" data-aos="flip-up" data-aos-duration="1000" data-aos-delay="500">
					<div class="parentCard">
						<img src=${img_url + e.poster_path}/>
						<div class="contentCard">
							<span class="spans spansTitle">${e.title}</span>
							<span class="spans">Rating: ${e.vote_average}</span>
							<span class="spans">${e.release_date}</span>
						</div>
					</div>
				</a>`;
			});
		});
}

upcomingMovies();

function loadPopularTV() {
	popularParent.innerHTML = "";
	title.innerHTML = "Popular TV Shows";
	awards.innerHTML = "";

	fetch(`https://api.themoviedb.org/3/tv/popular?${API_KEY}`)
		.then((res) => res.json())
		.then((data) => {
			data.results.forEach((e) => {
				popularParent.innerHTML += `
				<a href="single.html?id=${
					e.id
				}&type=tv" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
					<div class="parentCard">
						<img src=${img_url + e.poster_path}/>
						<div class="contentCard">
							<span class="spans spansTitle">${e.name || e.title}</span>
							<span class="spans">Rating: ${e.vote_average}</span>
							<span class="spans">${e.release_date || e.first_air_date}</span>
						</div>
					</div>
				</a>`;
			});
		});
}

function loadUpcomingTV() {
	upcomingParent.innerHTML = "";
	title2.innerHTML = "Currently Airing TV Shows";
	upcomingmovies.style.marginTop = "150px";

	fetch(`https://api.themoviedb.org/3/tv/on_the_air?${API_KEY}`)
		.then((res) => res.json())
		.then((data) => {
			data.results.forEach((e) => {
				upcomingParent.innerHTML += `
				<a href="single.html?id=${
					e.id
				}&type=tv" data-aos="flip-up" data-aos-duration="1000" data-aos-delay="500">
					<div class="parentCard">
						<img src=${img_url + e.poster_path}/>
						<div class="contentCard">
							<span class="spans spansTitle">${e.name || e.title}</span>
							<span class="spans">Rating: ${e.vote_average}</span>
							<span class="spans">${e.release_date || e.first_air_date}</span>
						</div>
					</div>
				</a>`;
			});
		});
}

AOS.init();

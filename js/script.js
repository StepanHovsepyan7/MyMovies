const API_KEY = "api_key=9b702a6b89b0278738dab62417267c49";
let root = document.getElementById("root");
let popularParent = document.getElementsByClassName("popularParent")[0];
let upcomingParent = document.getElementsByClassName("upcomingParent")[0];
let searchInp = document.getElementsByClassName("searchInp")[0];
let title = document.getElementById("title");
let title2 = document.getElementById("title2");
let form = document.getElementById("form");
let genresParent = document.getElementById("genresParent");
let upcomingmovies = document.getElementById("upcoming-Movies");
let awards = document.getElementById("awards");
let awardsHtml = awards.innerHTML;

let img_url_original = "https://image.tmdb.org/t/p/original";
let img_url = "https://image.tmdb.org/t/p/w500";

console.log("https://api.themoviedb.org/3/movie/popular?" + API_KEY);

function loadPopular() {
	popularParent.innerHTML = "";
	title.innerHTML = "Popular Films";
	awards.innerHTML = awardsHtml;

	fetch("https://api.themoviedb.org/3/movie/popular?" + API_KEY)
		.then((response) => response.json())
		.then((response) =>
			response.results.forEach((elm) => {
				// root.innerHTML+=`<img src=${img_url+elm.backdrop_path} />`

				popularParent.innerHTML += `
          <div class="parentCard" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
                <img src=${img_url + elm.poster_path}/>
                <div class = "contentCard">
                    <span class = "spans spansTitle">${elm.title}</span>
                    <span class = "spans">Rating: ${elm.vote_average}</span>
                    <span class = "spans">${elm.release_date}</span>
                </div>
            </div>
        `;
			})
		)

		.catch((err) => console.error(err));
}

loadPopular();

// Genres

function genres() {
	fetch("https://api.themoviedb.org/3/genre/movie/list?" + API_KEY)
		.then((response) => response.json())
		.then((genersData) => {
			genersData.genres.forEach((e) => {
				let genreBtn = document.createElement("button");
				genreBtn.classList.add("genreBtn");
				genreBtn.innerHTML = e.name;
				genresParent.append(genreBtn);

				genreBtn.addEventListener("click", () => {
					title.innerHTML = `${e.name}`;
					awards.innerHTML = "";
					popularParent.innerHTML = "";
					upcomingParent.innerHTML = "";
					title2.innerHTML = "";
					upcomingmovies.style.marginTop = "0px";

					fetch(
						`https://api.themoviedb.org/3/discover/movie?${API_KEY}&with_genres=${e.id}`
					)
						.then((res) => res.json())
						.then((data) => {
							data.results.forEach((e) => {
								popularParent.innerHTML += `
							<div class="parentCard" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
								  <img src=${img_url + e.poster_path}/>
								  <div class = "contentCard">
									  <span class = "spans spansTitle">${e.title}</span>
									  <span class = "spans">Rating: ${e.vote_average}</span>
									  <span class = "spans">${e.release_date}</span>
								  </div>
							  </div>
						  `;
							});
						});
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
			if (e.target.value.trim() !== "") {
				title.innerHTML = "Results";
				title2.innerHTML = "";
				fetch(
					`https://api.themoviedb.org/3/search/movie?${API_KEY}&query=${e.target.value.trim()}`
				)
					.then((data) => data.json())
					.then((data) => {
						popularParent.innerHTML = "";
						upcomingParent.innerHTML = "";
						upcomingmovies.style.marginTop = "0";
						awards.innerHTML = "";

						data.results.forEach((e) => {
							popularParent.innerHTML += `
          <div class="parentCard"  data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
                <img src=${img_url + e.poster_path}/>
                <div class = "contentCard">
                    <span class = "spans spansTitle">${e.title}</span>
                    <span class = "spans">Rating: ${e.vote_average}</span>
                    <span class = "spans">${e.release_date}</span>
                </div>
            </div>
        `;
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

function upcomingMovies() {
	upcomingParent.innerHTML = "";
	upcomingmovies.style.marginTop = "150px";
	title2.innerHTML = "Upcoming Movies";
	fetch(`https://api.themoviedb.org/3/movie/upcoming?` + API_KEY)
		.then((res) => res.json())
		.then((data) => {
			data.results.forEach((e) => {
				upcomingParent.innerHTML += `
			          <div class="parentCard"  data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
                <img src=${img_url + e.poster_path}/>
                <div class = "contentCard">
                    <span class = "spans spansTitle">${e.title}</span>
                    <span class = "spans">Rating: ${e.vote_average}</span>
                    <span class = "spans">${e.release_date}</span>
                </div>
            </div>
			
			`;
			});
		});
}

upcomingMovies();

AOS.init();

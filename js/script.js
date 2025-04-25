const API_KEY = "api_key=9b702a6b89b0278738dab62417267c49";
let root = document.getElementById("root");
let popularParent = document.getElementsByClassName("popularParent")[0];
let searchInp = document.getElementsByClassName("searchInp")[0];
let title = document.getElementById("title");
let form = document.getElementById("form");
let genresParent = document.getElementById("genresParent");
let sliderParent = document.getElementById("slider");
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
				fetch(
					`https://api.themoviedb.org/3/search/movie?${API_KEY}&query=${e.target.value.trim()}`
				)
					.then((data) => data.json())
					.then((data) => {
						popularParent.innerHTML = "";
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
				loadPopular();
			}
		}, 1000);
	});
}

search();

AOS.init();

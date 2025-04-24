const API_KEY = "api_key=9b702a6b89b0278738dab62417267c49";
let root = document.getElementById("root");
let popularParent = document.getElementsByClassName("popularParent")[0];
let searchInp = document.getElementsByClassName("searchInp")[0];
let title = document.getElementById("title");

let img_url_original = "https://image.tmdb.org/t/p/original";
let img_url = "https://image.tmdb.org/t/p/w500";

console.log("https://api.themoviedb.org/3/movie/popular?" + API_KEY);

// https://api.themoviedb.org/3/search/movie?api_key=ՁերՔեյը&query
// =ինպուտիցՎերցվածԱրժեքը

function loadPopular() {
	popularParent.innerHTML = "";
	title.innerHTML = "Popular Films";

	fetch("https://api.themoviedb.org/3/movie/popular?" + API_KEY)
		.then((response) => response.json())
		.then((response) =>
			response.results.forEach((elm) => {
				// root.innerHTML+=`<img src=${img_url+elm.backdrop_path} />`

				popularParent.innerHTML += `
          <div class="parentCard">
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

// Movies Search

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

						data.results.forEach((e) => {
							popularParent.innerHTML += `
          <div class="parentCard">
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
				loadPopular();
			}
		}, 1000);
	});
}

search();

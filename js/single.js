let root = document.getElementById("root");
let body = document.querySelector("body");
let actorsParent = document.getElementById("actorsParent");
let iframeContainer = document.getElementsByClassName("iframe__container")[0];
let popup = document.getElementById("popup");
let overlay = document.getElementById("overlay");
let faXmark = document.getElementsByClassName("fa-xmark")[0];
let img_url_original = "https://image.tmdb.org/t/p/original";
let img_url = "https://image.tmdb.org/t/p/w500";

// root.innerHTML+=`<img src=${img_url+elm.backdrop_path} />`

const dataLocation = new URLSearchParams(window.location.search);
const movieId = dataLocation.get("id");
const type = dataLocation.get("type") || "movie";
const API_KEY = "api_key=9b702a6b89b0278738dab62417267c49";

if (movieId) {
	fetch(`https://api.themoviedb.org/3/${type}/${movieId}?${API_KEY}`)
		.then((res) => res.json())
		.then((res) => printCards(res));

	fetch(`https://api.themoviedb.org/3/${type}/${movieId}/credits?${API_KEY}`)
		.then((res) => res.json())
		.then((res) => actors(res));

	fetch(`https://api.themoviedb.org/3/${type}/${movieId}/videos?${API_KEY}`)
		.then((res) => res.json())
		.then((res) => iframes(res));
}
function printCards(cards) {
	root.innerHTML = `

	  <div class="single__container" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
	  	<div class = "contentSingle">
		   <div class="contentChild"> 
				  <span class="title">${cards.title || cards.name}</span>
				  <p class = "overview">${cards.overview}</p>  
				  <span class="titleOfSpan">Popularity: <span class="secondarySpan">${
						cards.popularity
					}</span></span>
				  <span class="titleOfSpan">Vote Count: <span class="secondarySpan">${
						cards.vote_count
					}</span></span>
			</div>
	</div>
        <div class="bgImage">
           
        </div>
		
    	
    </div>


   `;
	let background = document.querySelector(".bgImage");
	background.style.backgroundImage = `url(${
		img_url_original + cards.backdrop_path
	})`;
}

function actors(actor) {
	actor.cast.forEach((e) => {
		actorsParent.innerHTML += `
			<div class="actorCard">
				<img src="${img_url + e.profile_path}">
				<div class="actorsDesc">
					<span>${e.name}</span><br>
					<span id="character">${e.known_for_department}</span>
				</div>
			</div>
		`;
	});
}

function iframes(video) {
	iframeContainer.innerHTML = "";
	video.results.slice(0, 3).forEach((e) => {
		iframeContainer.innerHTML += `
			<div class = "iframeParent ">
				<div class = "ytBtn" onclick = "videoBtn('${e.key}')">
					<i class="fa-brands fa-youtube"></i>
				</div>
				<div>
					<img  class="iframeIMG" src="https://img.youtube.com/vi/${e.key}/hqdefault.jpg"  width="100%" height="500px" />
				</div>
			</div>
		`;
	});
}

function videoBtn(key) {
	popup.innerHTML = `
		<iframe src="https://www.youtube.com/embed/${key}" frameborder="0" allowfullscreen></iframe>
	`;
	overlay.style.display = "flex";
	popup.style.display = "flex";
}

overlay.addEventListener("click", () => {
	overlay.style.display = "none";
	popup.style.display = "none";
});

faXmark.addEventListener("click", () => {
	overlay.style.display = "none";
	popup.style.display = "none";
});
AOS.init();

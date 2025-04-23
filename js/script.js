const API_KEY="api_key=9b702a6b89b0278738dab62417267c49"

let img_url_original = "https://image.tmdb.org/t/p/original"
let img_url = "https://image.tmdb.org/t/p/w500"

// https://api.themoviedb.org/3/search/movie?api_key=ՁերՔեյը&query
// =ինպուտիցՎերցվածԱրժեքը

  fetch('https://api.themoviedb.org/3/movie/popular?'+API_KEY)
    .then(response => response.json())
    .then(response =>response.results.forEach((elm)=>{
        root.innerHTML+=`<img src=${img_url+elm.backdrop_path} />`
        root.innerHTML+=`<img src=${img_url+elm.poster_path  } />`
    }))
    .catch(err => console.error(err));

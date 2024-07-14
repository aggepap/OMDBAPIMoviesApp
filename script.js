//Enter OMDB API Key. You can get one from https://www.omdbapi.com/apikey.aspx
let APIKEY = "";
if (!APIKEY) {
  const addedKey = prompt("Please enter your OMDB API key");
  APIKEY = addedKey;
}

window.addEventListener("load", () => {
  const inputField = document.querySelector("#search");
  let timeout = null;
  document.querySelector("#search").value = "";
  reset();

  // listens for keyup on search input field
  //   and sets the value of input in no keys
  //   are pressed after 1.5 second

  inputField.addEventListener("keyup", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      loadMovie(inputField.value);
      console.log(inputField.value);
    }, 1500);
  });
});
//Animates trailer icon
function hoverPlay() {
  let button = document.querySelector(".watch-trailer-btn");

  button.addEventListener("mouseover", () => {
    document.querySelector(".fa-circle-play").classList.add("fa-spin");
  });
  button.addEventListener("mouseleave", () => {
    document.querySelector(".fa-circle-play").classList.remove("fa-spin");
  });
}

//Reset viewport if needed
function reset() {
  document.querySelector(".movie-wrapper").innerHTML = " ";
  document.getElementById("errorBox").classList.add("hidden");
}

//loads movie data to viewport
async function loadMovie(title) {
  reset();
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?t=${title}&apikey=${APIKEY}`
    );

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    console.log(data);
    if (data.Response === "True") {
      createMoviecard(data);
      generateData(data);
      expandElement(".movie-wrapper");
      hoverPlay();
    } else {
      document.querySelector("#errorBox").classList.remove("hidden");
    }
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// expands wrapper after loading data
function expandElement(element) {
  document.querySelector(element).classList.add("visible");
  document.querySelector(".container").classList.add("expand");
}

// Transforms data from API Fetch to match the ui
function generateData(data) {
  let genres = data.Genre.split(", ");
  let actors = data.Actors.split(", ");
  let screenWriters = data.Writer.split(", ");
  let directors = data.Director.split(", ");

  if (data.Ratings.length !== 0) {
    let rating = data.Ratings[0].Value.split("/");
    const ratingHtml = `<p><span>${rating[0]}</span>/${rating[1]}</p>`;
    document
      .querySelector(".rating")
      .insertAdjacentHTML("afterbegin", ratingHtml);
  }

  if (data.Poster !== "N/A") {
    document.querySelector(".poster-img").src = `${data.Poster}`;
  } else {
    document.querySelector(".poster-img").src = "./img/no-poster-available.jpg";
  }
  //addind genre tags
  genres.forEach((genre) => {
    const html = `<a role="button" class="genre-tag" href="https://www.imdb.com/search/title/?genres=${genre}" target="_blank">${genre}</a>`;
    document.querySelector(".genres").innerHTML += html;
  });

  // Adding actors, screenwriters and directors
  actors.forEach((actor) => {
    const html = `<li><a href="https://www.imdb.com/find/?q=${actor}" target="_blank">${actor}</a></li>`;
    document.querySelector("#actorsList").innerHTML += html;
  });
  screenWriters.forEach((screenwriter) => {
    const html = `<li><a href="https://www.imdb.com/find/?q=${screenwriter}" target="_blank">${screenwriter}</a></li>`;
    document.querySelector("#screenWritersList").innerHTML += html;
  });
  directors.forEach((director) => {
    const html = `<li><a href="https://www.imdb.com/find/?q=${director}" target="_blank">${director}</a></li>`;
    document.querySelector("#directorsList").innerHTML += html;
  });

  //checking if type exists, and adds it to info part
  //If type is series, it also adds total season count
  if (data.Type) {
    const type = data.Type;
    const upperType = type[0].toUpperCase() + type.slice(1);
    const html = `<li><strong>Type</strong>:  ${upperType} </li>`;
    document.querySelector("#infoList").innerHTML += html;
  }

  if (data.totalSeasons) {
    const html = `<li><strong>Number of Seasons</strong>:  ${data.totalSeasons} </li>`;
    document.querySelector("#infoList").innerHTML += html;
  }
}

//Generates movie card with transformed data and diplays it to the view port
function createMoviecard(data) {
  let html = `
        <div class="titlebar">
          <div class="movie-title">
            <h1 class="title">${data.Title}</h1>
            </div>
          <div class="rating"></div>
          
        </div>
       
        <div class="genres">
            </div>
         
      
        <div class="main">
          <div class="movie-poster">
            <img class="poster-img"
              src=""
              class="movie-poster-image"
              alt="${data.Title} poster"
            />
          </div>
          <div class="movie-info">
            <h2 class="about-title">About the Movie</h2>
            <p class="movie-summary">
              ${data.Plot}
            </p>
            <div class="cast-crew">
              <div class="actors">
                <div>
                  <h2>Actors</h2>
                  <ul id="actorsList">
                  
                  </ul>
                </div>
                <a href="https://www.imdb.com/title/${
                  data.imdbID
                }/fullcredits" target="_blank" class="more-link">More</a>
              </div>
              <div class="crew">
                <div class="director">
                  <h2>Director</h2>
                  <ul id="directorsList">
                   
                  </ul>
                </div>
                <div class="screenwriter">
                  <h2>Screenwriters</h2>
                  <ul id="screenWritersList">
                  
                  </ul>
                </div>
              </div>
              <div class="producers">
                <h2>More Info</h2>
                <ul id="infoList">
                  <li><strong>Released</strong> : ${
                    data.Released ? data.Released : "-"
                  }</li>
                  <li><strong>Awards</strong> : ${
                    data.Awards ? data.Awards : "-"
                  } </li>
                  <li><strong>Rating</strong>:  ${
                    data.Rated !== "N/A" ? data.Rated : "-"
                  } </li>
                  <li><strong>Languages</strong>:  ${
                    data.Language ? data.Language : "-"
                  } </li>
                    
                  
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="purchase-section">
          <div class="runtime">
            <span><strong>Runtime: </strong> ${
              data.Runtime ? data.Runtime : "-"
            }</span>
          </div>
          
     <div class="watch-trailer-btn">
      <a
        href="https://www.youtube.com/results?search_query=${
          data.Title
        }+trailer" target="_blank"
        >Watch Trailer</a
      ><i
        class="fa-solid fa-circle-play fa-2x"
        style="--fa-animation-duration: 2s;--fa-animation-iteration-count: 1"
      ></i>
    </div>
      `;

  document.querySelector(".movie-wrapper").innerHTML = html;
}

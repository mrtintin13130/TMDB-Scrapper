// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
document.getElementById("id_movie_form").addEventListener("submit", transferToSingleMovie)
document.getElementById("title_movie_form").addEventListener("submit", transferToMovieTitle)


// var extern = document.getElementsByTagName("link")[0].import;
// document.getElementsByTagName("html")[0].replaceChild(extern.getElementsByTagName("body")[0], document.getElementsByTagName("body")[0]);


if (!localStorage.getItem("api_key")) {
    // document.getElementById("api").className = "is_shown"
    movie = document.getElementById("movie")
    embed = document.getElementById("embed")
    movie_t = document.getElementById("movie-t")
    embed_t = document.getElementById("embed-t")
    movie.disabled = true
    embed.disabled = true
    movie_t.disabled = true
    embed_t.disabled = true
    document.getElementById("api-form").addEventListener("submit", checkApiKey)

} else {
    document.getElementById("api").innerHTML = "<p style=\"font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; color: grey; font-size: 11px;\">TMDB API Key: " + localStorage.getItem("api_key") + "</p><br>"
}

function checkApiKey(e) {
    e.preventDefault();
    api = document.getElementById("api-key").value
    url = "https://api.themoviedb.org/3/movie/324857?api_key=" + api
    fetch(url)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("ERROR IN API KEY !")
                document.getElementById("api-alert").innerHTML = "<b>Wrong API key !</b>"
            } else {
                document.getElementById("api").innerHTML = "<p style=\"font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; color: grey; font-size: 11px;\">TMDB API Key: " + api + "</p><br>"
                localStorage.setItem("api_key", api)
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}

// SEARCH MOVIES BY TITLE
function transferToMovieTitle(e) {
    e.preventDefault();
    document.getElementById("movie_list").innerHTML = null
    title_query = document.getElementById("movie-t").value
    MoviesByTitle(title_query);
}

function MoviesByTitle(title) {
    lang = document.getElementById("language-t").value
    url = "https://api.themoviedb.org/3/search/movie?api_key=" + localStorage.getItem("api_key") + "&language=" + lang + "&query=" + title + "&page=1&include_adult=false"

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(movie => {
                document.getElementById("movie_list").innerHTML += "<div class='sgl-movie' id='" + movie.id + "' onclick='MoviesById(" + movie.id + ")' style='background-image: url(\"https://image.tmdb.org/t/p/w185" + movie.poster_path + "\"'> \
                                                                \
                                                                    </div>"
            });
        })
        .catch(error => console.error(error))
}

function transferToSingleMovie(e) {
    e.preventDefault();
    id = document.getElementById("movie").value
    MoviesById(id)
}

// SEARCH MOVIES BY ID
function MoviesById(id) {
    if (document.getElementById("search_by_id").className == "is_hidden") {
        document.getElementById("search_by_id").className = "is_shown"
        document.getElementById("search_by_title").className = "is_hidden"
    }
    lang = document.getElementById("language").value
    url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + localStorage.getItem("api_key") + "&language=" + lang
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log(data) // Prints result from `response.json()` in getRequest
            document.getElementById('title').textContent = data.title;
            document.getElementById('overview').textContent = "Synopsis: " + data.overview;
            poster = document.getElementById('poster');
            poster.src = "https://image.tmdb.org/t/p/w185" + data.poster_path;
            document.getElementById('date').textContent = "Release date: " + data.release_date;
            document.getElementById('tmdb_id').textContent = "TMDB ID: " + data.id;
            document.getElementById('imdb_id').textContent = "IMDB ID: " + data.imdb_id;
            embed = document.getElementById('embed-t').value
            textarea = document.getElementById('movie-csv')
            textarea.style.display = 'block'
            genres = ""
            if (data.genres) {
                data.genres.forEach(gnr => {
                    genres += gnr['name'] + ","
                })
            }
            genres = genres.slice(0, -1)
            textarea.textContent = ", https://image.tmdb.org/t/p/w185" + data.poster_path + ", " + ", " + data.budget + ", \"" + genres + "\", movie_url, " + embed + ", " + "1, " + data.id + ", " + data.imdb_id + ", " + data.original_language + ", " + data.original_title + ", " + data.overview + ", " + data.popularity + ", " + data.release_date + ", " + data.revenue + ", " + data.runtime + ", " + data.status + ",, " + data.title + ",, " + data.vote_average
        })
        .catch(error => console.error(error))
}


document.getElementById("btn_movies_title").addEventListener("click", toggleDiv, event)
document.getElementById("btn_movies_id").addEventListener("click", toggleDiv, event)

function toggleDiv(button) {
    by_id = document.getElementById("search_by_id")
    by_title = document.getElementById("search_by_title")

    if (this.id == "btn_movies_id") {
        if (by_id.className == "is_hidden") {
            by_id.className = "is_shown"
            by_title.className = "is_hidden"
        }
    } else if (this.id == "btn_movies_title") {
        if (by_title.className == "is_hidden") {
            by_title.className = "is_shown"
            by_id.className = "is_hidden"
        }
    }
}
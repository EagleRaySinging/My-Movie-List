// 起手式，宣告URL，需要考慮固定的URL以及後面變動的內容規則
const baseURL = 'https://webdev.alphacamp.io'
const indexURL = baseURL + '/api/movies/'
const posterURL = baseURL + '/posters/'

// 建立空值，將資料庫存放進去後輸出
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const dataPanel = document.querySelector('#data-panel')
// const searchForm = document.querySelector('#search-form')
// const searchInput = document.querySelector('#search-input')

// 建立function把資料庫放進網頁
function renderMovieList(data) {

  let rawHTML = ''
  data.forEach((item) => {
    // title,image
    rawHTML += ` <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${posterURL + item.image}"
              class="card-img-top" alt="Movie Post">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>`
  })

  dataPanel.innerHTML = rawHTML
}

// 修改movie-modal視窗的內容，為電影簡介
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(indexURL + id).then((response) => {
    // response.data.results
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release Date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${posterURL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

// 建立新的function，讓電影可以被刪除
function removeFromFavorite(id) {
  if(!movies || !movies.length) return

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if(movieIndex === -1) return

  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


//  設定監聽器讓movie-modal動起來
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)

// 起手式，宣告URL，需要考慮固定的URL以及後面變動的內容規則
const baseURL = 'https://webdev.alphacamp.io'
const indexURL = baseURL + '/api/movies/'
const posterURL = baseURL + '/posters/'
const moviesPerPage = 12

// 建立空值，將資料庫存放進去後輸出
const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })

  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  // 80 / 12 = 6...8 = 7 pages
  const numberOfPages = Math.ceil(amount / moviesPerPage)
  let rawHTML = ''

  for(let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

// 建立function一個page只存放12部電影‘
function getMoviesByPage(page) {
  // page 1 -> movies 0-11
  // page 2 -> movies 12-23
  // page 3 -> movies 24-35
  // movies ? "movies" : "filterMovies"

  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) *moviesPerPage
  return data.slice(startIndex, startIndex + moviesPerPage)
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


function addToFavorite(id) {
  // 因localStorage只能存取字串，故前面需要加JSON.parse
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  // 避免在favorite裡面一直加到重複電影
  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中')
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


//  設定監聽器讓movie-modal動起來
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    // console.log(typeof (event.target.dataset.id))
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 設定監聽器點選不同頁會顯示不頁的電影內容
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if(event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})


axios
  .get(indexURL)
  .then((response) => {
    // 因response.data.results本身就是陣列
    // push(...)可消除多一個[]陣列，ES6新用法
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))

// 綁定search submit監聽器功能
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  

  // if(!keyword.length) {
  //   return alert('Please enter a valid string')
  // }

  //map, filter, reduce陣列操作三寶 
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword: ' + keyword)
  }

  // 同上filter結果
  // for(const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filterMovies.push(movie)
  //   }
  // }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))

})

import { fetchImages } from './pixabay-api';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init({
  position: 'right-top',
  showOnlyTheLastOne: true,
  clickToClose: true,
  timeout: 3000,
  clickToClose: true,
  pauseOnHover: true,
});

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const targetEl = document.querySelector('.js-guard');

let lightbox = '';

let options = {
  root: null,
  rootMargin: '0px 0px 500px 0px',
  threshold: 0,
};
let observer = new IntersectionObserver(onLoad, options);

let currentPage = 1;
let searchName = '';

formEl.addEventListener('submit', handlerForm);

function handlerForm(evt) {
  evt.preventDefault();
  galleryEl.innerHTML = '';
  observer.unobserve(targetEl);

  searchName = evt.currentTarget.elements.searchQuery.value.trim();

  if (!searchName) {
    Notiflix.Notify.failure('Please enter something.');
    return;
  }

  fetchImages(searchName)
    .then(({ data: { hits, totalHits } }) => {
      if (hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      galleryEl.insertAdjacentHTML('beforeend', createGallery(hits));
      observer.observe(targetEl);

      const { height: cardHeight } =
        galleryEl.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 0.3,
        behavior: 'smooth',
      });

      lightbox = new SimpleLightbox('.gallery a');
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      console.error(error);
    });
}

function onLoad(entries) {
  if (!entries[0].isIntersecting) return;
  currentPage += 1;
  fetchImages(searchName, currentPage)
    .then(({ config: { params }, data: { hits, totalHits } }) => {
      if (currentPage * params.per_page >= totalHits) {
        observer.unobserve(targetEl);
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }

      galleryEl.insertAdjacentHTML('beforeend', createGallery(hits));

      lightbox.refresh();
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      console.error(error);
    });
}

function createGallery(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
          <div class="photo-card">
            <a href="${largeImageURL}"> 
              <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px" height="200px"/>
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                  <span>${likes}</span>
                </p>
                <p class="info-item">
                  <b>Views</b>
                  <span>${views}</span>
                </p>
                <p class="info-item">
                  <b>Comments</b>
                  <span>${comments}</span>
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                  <span>${downloads}</span>
                </p>
              </div>
            </a> 
          </div>
          `
    )
    .join('');
}

// LOAD_BUTTON

// import { fetchImages } from './pixabay-api';

// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// Notiflix.Notify.init({
//   position: 'right-top',
//   showOnlyTheLastOne: true,
//   clickToClose: true,
//   timeout: 3000,
//   clickToClose: true,
//   pauseOnHover: true,
// });

// let lightbox = '';

// const formEl = document.querySelector('.search-form');
// const galleryEl = document.querySelector('.gallery');
// const loadBtnEl = document.querySelector('.load-more');

// let currentPage = 1;
// let searchName = '';

// formEl.addEventListener('submit', handlerForm);
// loadBtnEl.addEventListener('click', onLoad);

// function handlerForm(evt) {
//   evt.preventDefault();
//   galleryEl.innerHTML = '';
//   loadBtnEl.hidden = true;

//   searchName = evt.currentTarget.elements.searchQuery.value.trim();

//   if (!searchName) {
//     Notiflix.Notify.failure('Please enter something.');
//     return;
//   }

//   fetchImages(searchName)
//     .then(({ config: { params }, data: { hits, totalHits } }) => {
//       if (hits.length === 0) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }
//       Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
//       galleryEl.insertAdjacentHTML('beforeend', createGallery(hits));

//       const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();
//       window.scrollBy({
//         top: cardHeight * 0.3,
//         behavior: 'smooth',
//       });

//       lightbox = new SimpleLightbox('.gallery a');

//       if (totalHits > params.per_page) {
//         loadBtnEl.hidden = false;
//       }
//     })
//     .catch(error => {
//       Notiflix.Notify.failure(
//         'Oops! Something went wrong! Try reloading the page!'
//       );
//       console.error(error);
//     });
// }

// function onLoad() {
//   currentPage += 1;
//   fetchImages(searchName, currentPage)
//     .then(({ config: { params }, data: { hits, totalHits } }) => {
//       if (currentPage * params.per_page >= totalHits) {
//         loadBtnEl.hidden = true;
//         Notiflix.Notify.info(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//       galleryEl.insertAdjacentHTML('beforeend', createGallery(hits));

//       const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();
//       window.scrollBy({
//         top: cardHeight * 2,
//         behavior: 'smooth',
//       });

//       lightbox.refresh();
//     })
//     .catch(error => {
//       Notiflix.Notify.failure(
//         'Oops! Something went wrong! Try reloading the page!'
//       );
//       console.error(error);
//     });
// }
// function createGallery(arr) {
//   return arr
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => `
//           <div class="photo-card">
//             <a href="${largeImageURL}">
//               <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px" height="200px"/>
//               <div class="info">
//                 <p class="info-item">
//                   <b>Likes</b>
//                   <span>${likes}</span>
//                 </p>
//                 <p class="info-item">
//                   <b>Views</b>
//                   <span>${views}</span>
//                 </p>
//                 <p class="info-item">
//                   <b>Comments</b>
//                   <span>${comments}</span>
//                 </p>
//                 <p class="info-item">
//                   <b>Downloads</b>
//                   <span>${downloads}</span>
//                 </p>
//               </div>
//             </a>
//           </div>
//           `
//     )
//     .join('');
// }

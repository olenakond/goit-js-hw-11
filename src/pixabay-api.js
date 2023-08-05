import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(searchName, loadPage = 1) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: '38632532-d42edb29bc13300dd772b2b48',
      q: searchName,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: loadPage,
    },
  });
  return response;
}

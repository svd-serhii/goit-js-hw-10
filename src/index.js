import './css/styles.css';
import Notiflix from 'notiflix';
import API from './fetchCountries';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const refs = {
  searchInput: document.querySelector('#search-box'),
  countryContainer: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchCountry = e.target.value;
  if (!searchCountry) {
    clearCountrySearch();
    return;
  }
  API.fetchCountries(searchCountry.trim())
    .then(renderCountryCard)
    .catch(onFetchError);
}

function renderCountryCard(countries) {
  let markup = '';
  if (countries.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.',
      { clickToClose: true }
    );
  } else if (countries.length >= 2 && countries.length <= 10) {
    markup = countries
      .map(({ name, flags }) => {
        return `<li class='country-list__item'>
      <img src="${flags.svg}" alt="${name.official}" width='40'>
      ${name.official}</li>`;
      })
      .join('');
  } else {
    markup = countries
      .map(({ name, flags, capital, population, languages }) => {
        return `<div class="country-info">
        <img src="${flags.svg}" alt="${name.official}" width="40" class='img'/>
        <h2 class="country-info__country-name">${name.official}</h2>
      </div>
      <ul class="country-info__list">
        <li class="country-info__list-item">
          Capital: <span class="country-info__item-name">${capital}</span>
        </li>
        <li class="country-info__item">
          Population: <span class="country-info__item-name">${population}</span>
        </li>
        <li class="country-info__item"> Languages: <span class="country-info__item-name">${Object.values(
          languages
        ).join(', ')}</span></li>
      </ul>`;
      })
      .join('');
  }
  refs.countryContainer.innerHTML = markup;
}

function clearCountrySearch() {
  refs.countryContainer.innerHTML = '';
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name', {
    clickToClose: true,
  });
}

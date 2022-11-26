const url = `https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,flags,languages`;

function fetchCountries(countryName) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(onFetchError);
    }
    return response.json();
  });
}

export default { fetchCountries };

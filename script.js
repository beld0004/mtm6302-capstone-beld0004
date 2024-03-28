document.addEventListener('DOMContentLoaded', function () {
    const pokemonContainer = document.getElementById('pokemon-container');
    const loadMoreButton = document.getElementById('load-more');
    const pokemonDetails = document.getElementById('pokemon-details');
  
    let offset = 0;
    const limit = 20;
    let caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || [];
  
    // Fetch pokemon from PokeAPI
    async function fetchPokemon() {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
      const data = await response.json();
      return data.results;
    }
  
    // Display pokemon in the grid
    async function displayPokemon() {
      const pokemonList = await fetchPokemon();
      pokemonList.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon');
        const pokemonId = parseUrl(pokemon.url);
        pokemonDiv.innerHTML = `
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
          <p>${pokemon.name}</p>
        `;
        if (caughtPokemon.includes(pokemon.name)) {
          pokemonDiv.classList.add('caught');
        }
        pokemonDiv.addEventListener('click', () => showPokemonDetails(pokemon));
        pokemonContainer.appendChild(pokemonDiv);
      });
      offset += limit;
    }
  
    // Load more pokemon
    loadMoreButton.addEventListener('click', () => displayPokemon());
  
    // Show details of a clicked pokemon
    async function showPokemonDetails(pokemon) { 
      const response = await fetch(pokemon.url);
      const data = await response.json();
      const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
      const types = data.types.map(type => type.type.name).join(', ');
      pokemonDetails.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseUrl(pokemon.url)}.png" alt="${pokemon.name}">
        <p>Abilities: ${abilities}</p>
        <p>Types: ${types}</p>
        <button id="catch-release">${caughtPokemon.includes(pokemon.name) ? 'Release' : 'Catch'}</button>
      `;
      const catchReleaseButton = document.getElementById('catch-release');
      catchReleaseButton.addEventListener('click', () => catchOrReleasePokemon(pokemon));
    }
  
    // Catch or release a pokemon
    function catchOrReleasePokemon(pokemon) {
      if (caughtPokemon.includes(pokemon.name)) {
        caughtPokemon = caughtPokemon.filter(name => name !== pokemon.name);
      } else {
        caughtPokemon.push(pokemon.name);
      }
      localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
      const catchReleaseButton = document.getElementById('catch-release');
      catchReleaseButton.textContent = caughtPokemon.includes(pokemon.name) ? 'Release' : 'Catch';
      const pokemonDiv = document.querySelector(`.pokemon img[alt="${pokemon.name}"]`).parentNode;
      pokemonDiv.classList.toggle('caught');
    }
  
    // Parse pokemon ID from URL
    function parseUrl(url) {
      return url.substring(url.substring(0, url.length - 1).lastIndexOf('/') + 1, url.length - 1);
    }
  
    // Initial display of pokemon
    displayPokemon();
  });
  
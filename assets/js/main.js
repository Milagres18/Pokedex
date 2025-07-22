const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const detailsSection = document.getElementById('pokemonDetails')

const maxRecords = 151
const limit = 5
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function showPokemonDetails(pokemonId) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(response => response.json())
    .then(pokeDetail => {
      const pokemon = convertPokeApiDetailToPokemon(pokeDetail)

      detailsSection.innerHTML = `
        <button id="backButton">← Voltar</button>

        <div class="pokemon-detail ${pokemon.type}">
          <header>
            <span class="number">#${pokemon.number}</span>
            <h2 class="name">${pokemon.name}</h2>
            <ol class="types">
              ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
          </header>

          <div class="main-info">
            <img class="pokemon-img" src="${pokemon.photo}" alt="${pokemon.name}">

            <div class="info">
              <section class="measurements">
                <p><strong>Altura:</strong> ${pokeDetail.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokeDetail.weight / 10} kg</p>
              </section>

              <section class="abilities">
                <h3>Habilidades</h3>
                <ul>
                  ${pokeDetail.abilities
                    .map(ability => `<li>${ability.ability.name}</li>`)
                    .join('')}
                </ul>
              </section>

              <section class="stats">
                <h3>Stats</h3>
                <ul>
                  ${pokeDetail.stats
                    .map(stat => `
                      <li>
                        <span class="stat-name">${stat.stat.name}</span>
                        <div class="stat-bar-bg">
                          <div class="stat-bar-fill" style="width: ${stat.base_stat > 100 ? 100 : stat.base_stat}%;"></div>
                        </div>
                        <span class="stat-value">${stat.base_stat}</span>
                      </li>`)
                    .join('')}
                </ul>
              </section>

              <section class="moves">
                <h3>Movimentos (10 primeiros)</h3>
                <ul>
                  ${pokeDetail.moves
                    .slice(0, 10)
                    .map(move => `<li>${move.move.name}</li>`)
                    .join('')}
                </ul>
              </section>
            </div>
          </div>
        </div>
      `


    
      pokemonList.classList.add('hidden');
      loadMoreButton.classList.add('hidden');
      detailsSection.classList.remove('hidden');

      window.scrollTo({ top: 0, behavior: 'smooth' });

      const backBtn = document.getElementById('backButton');
      backBtn.addEventListener('click', () => {
        detailsSection.innerHTML = '';
        detailsSection.classList.add('hidden');
        pokemonList.classList.remove('hidden');
        loadMoreButton.classList.remove('hidden');
      });
    })
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        document.querySelectorAll('.pokemon').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.querySelector('.number').innerText.replace('#', '')
                showPokemonDetails(id)
            })
        })
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
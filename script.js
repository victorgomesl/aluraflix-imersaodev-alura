const apiKey = '6f7e8d7f58bd5afdbc3c64b3dd3e2b6c';
const listaFilmes = [];

function adicionarFilme() {
  const filmeFavoritoInput = document.getElementById('filme');
  const filmeFavorito = filmeFavoritoInput.value.trim().toLowerCase();

  if (filmeFavorito !== '') {
    buscarInformacoesDoFilme(filmeFavorito);
  } else {
    exibirMensagemErro('Preencha o título do filme');
    limparCampo(filmeFavoritoInput);
  }
}

function buscarInformacoesDoFilme(titulo) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${titulo}&language=pt-BR`)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const filme = data.results[0];
        adicionarFilmeNaLista(filme);
        exibirMensagemAdicionado();
        limparCampo(document.getElementById('filme'));
      } else {
        exibirMensagemErro('Nenhum filme encontrado com esse título ou título inválido.');
        limparCampo(document.getElementById('filme'));
      }
    })
    .catch(error => {
      exibirMensagemErro('Erro ao buscar informações do filme.');
      limparCampo(document.getElementById('filme'));
    });
}

function adicionarFilmeNaLista(filme) {
  const elementoListaFilmes = document.getElementById('listaFilmes');
  const filmeHTML = criarElementoFilme(filme);
  elementoListaFilmes.insertAdjacentHTML('beforeend', filmeHTML);
  listaFilmes.push(filme);
  adicionarEventoRemover(filme.id);
}

function criarElementoFilme(filme) {
  const { id, poster_path, title, overview, runtime, vote_average, original_language } = filme;

  const capa = `https://image.tmdb.org/t/p/w500/${poster_path}`;
  const descricao = original_language === 'en' ? overview : `${overview.substr(0, 200)}...`;
  const trailer = `https://www.themoviedb.org/video/play?key=${id}`;

  return `
    <div class="filme" id="filme-${id}">
      <img src="${capa}" alt="Capa do Filme">
      <h3>${title}</h3>
      <p>${descricao}</p>
      <p>Duração: ${runtime ? `${runtime} minutos` : 'Não informada'} | Avaliação: ${vote_average}/10</p>
      <div class="botoes">
        <a href="${trailer}" target="_blank" class="assistir-trailer">Assistir Trailer</a>
        <button class="remover-filme" data-id="${id}">Remover Filme</button>
      </div>
    </div>
  `;
}

function adicionarEventoRemover(filmeID) {
  const botaoRemover = document.querySelector(`#filme-${filmeID} .remover-filme`);
  botaoRemover.addEventListener('click', function() {
    removerFilme(filmeID);
  });
}

function removerFilme(filmeID) {
  const indice = listaFilmes.findIndex(filme => filme.id === filmeID);
  if (indice !== -1) {
    listaFilmes.splice(indice, 1);
    const elementoFilme = document.getElementById(`filme-${filmeID}`);
    elementoFilme.remove();
    exibirOcultarTextoLista();
  }
}

function limparCampo(elemento) {
  elemento.value = '';
}

function exibirMensagemErro(mensagem) {
  document.getElementById('mensagemDeErro').innerHTML = mensagem;
}

function exibirMensagemAdicionado() {
  const mensagemAdicionado = document.getElementById('mensagemAdicionado');
  mensagemAdicionado.textContent = 'Filme adicionado à lista!';

  setTimeout(() => {
    mensagemAdicionado.textContent = '';
  }, 3000);
}

function exibirOcultarTextoLista() {
  const textoLista = document.getElementById('textoLista');
  textoLista.style.display = listaFilmes.length > 0 ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const adicionarFilmeBtn = document.getElementById('adicionarFilmeBtn');
  adicionarFilmeBtn.addEventListener('click', adicionarFilme);
});

const num = 20; // Número de cartas que irão ser carregadas
let offset = 0; // Número que indica a partir de onde carregar
let carregarMaisCoisa = true;

function main() {
    carregar(`?num=${num}&offset=${offset}`); // Chama a função que carrega os dados
    offset += num; // Aumenta o parâmetro offset para a próxima busca
    let parametros = '';

    const carregarMais = document.getElementById("carregar-mais"); // Pega o botão no HTML
    carregarMais.addEventListener("click", () => { // Verifica o evento do tipo click
        if(carregarMaisCoisa) {
            carregar(`?${parametros? parametros+ "&": ''}num=${num}&offset=${offset}`); // Chama a função carregar passando os parâmetros de busca
            offset += num; // Aumenta o parâmetro offset para a próxima busca
        }
    });
    
    const inputBusca = document.getElementById('input'); // input de busca no HTML
    inputBusca.addEventListener("keyup", (evento) => {
        if(evento.key === "Enter" && inputBusca.value.length > 0 ) {
            offset = 0;
            deletaPagina();
            parametros = `fname=${inputBusca.value}`;
            carregar(`?${parametros? parametros+ "&": ''}num=${num}&offset=${offset}`);
        } else if(evento.key === "Backspace" && inputBusca.value.length == 0) {
            offset = 0;
            deletaPagina();
            parametros = '';
            carregar(`?num=${num}&offset=${offset}`);
        }
    });
}

// Função para carregar os dados da API
const carregar = async (parametros) => {
    const dados = await busca(parametros);
    console.log(dados.data.length)
    if(dados.data.length < 20) {
        carregarMaisCoisa = false;
    }
    dados.data.forEach((element) => {
        setDadosForm(element);
    });
};

// Função para buscar os dados na API
const busca = async (parametros) => {
    try {
        const resposta = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php${parametros}`);
        if (!resposta.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error('Erro:', erro);
        return [];
    }
};

// Função para pesquisar dados na API e exibir na página
// const pesquisar = async (termo) => {
//     deletaPagina();
//     const dados = await busca(`?fname=${termo}`);
//     dados.data.forEach((element) => {
//         setDadosForm(element);
//     });
// };

// Função para limpar a página
const deletaPagina = () => {
    const container = document.getElementById('containers');
    container.innerHTML = "";
};

// Função para exibir os dados na página
const setDadosForm = function (dados) {
    const divContainer = document.getElementById('containers');
    const divBoxCard = document.createElement('div');
    const divImagem = document.createElement('div');
    const img = document.createElement('img');
    const divInfo = document.createElement('div');
    const h2Nome = document.createElement('h2');
    const textNome = document.createTextNode(dados.name);
    const h3Tipo = document.createElement('h3');
    const textTipo = document.createTextNode(dados.type);
    const h3Raca = document.createElement('h3');
    const textRaca = document.createTextNode(dados.race);
    const h3Desc = document.createElement('h3');
    const textDesc = document.createTextNode(dados.desc);

    divBoxCard.setAttribute('class', 'card');
    divImagem.setAttribute('class', 'imagem');
    img.setAttribute('src', dados.card_images[0].image_url_small);
    img.setAttribute('class', 'image');
    divInfo.setAttribute('class', 'info');
    h2Nome.setAttribute('class', 'nome');
    h3Tipo.setAttribute('class', 'tipo');
    h3Raca.setAttribute('class', 'raca');
    h3Desc.setAttribute('class', 'desc');

    divContainer.appendChild(divBoxCard);
    divBoxCard.appendChild(divImagem);
    divImagem.appendChild(img);
    divBoxCard.appendChild(divInfo);
    divInfo.appendChild(h2Nome);
    h2Nome.appendChild(textNome);
    divInfo.appendChild(h3Tipo);
    h3Tipo.appendChild(textTipo);
    divInfo.appendChild(h3Raca);
    h3Raca.appendChild(textRaca);
    divInfo.appendChild(h3Desc);
    h3Desc.appendChild(textDesc);
};

main();
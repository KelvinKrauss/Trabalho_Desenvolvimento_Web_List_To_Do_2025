const API_URL = "http://127.0.0.1:5000";

//(editado)funcao que faz o login mandando dados pro python
async function fazerLogin() {
    const user = document.querySelector("#usuario").value;
    const pass = document.querySelector("#senha").value;

    const response = await fetch(API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
    });

    if (response.ok) {
        mostrarSite();
        carregarTarefas();
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

//(editado)cria conta nova no banco de dados
async function criarConta() {
    const user = document.querySelector("#usuario").value;
    const pass = document.querySelector("#senha").value;

    if(!user || !pass) return alert("Preencha todos os campos!");

    const response = await fetch(API_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
    });

    if (response.ok) {
        alert("Conta criada com sucesso! Agora faça login.");
    } else {
        alert("Erro: Usuário já existe.");
    }
}

//(editado)troca a tela de login pelo site principal
function mostrarSite() {
    document.querySelector("#tela-login").style.display = "none";
    document.querySelector("#conteudo-principal").style.display = "block";
}

//(editado)busca as tarefas no backend se tiver logado
async function carregarTarefas() {
    //(editado)credentials include eh obrigatorio pro cookie funcionar
    const response = await fetch(API_URL + "/tasks", { credentials: 'include' });
    
    //(editado)se der erro 401 nao carrega nada
    if (response.status === 401) return;

    mostrarSite(); 

    const tarefas = await response.json();
    const lista = document.querySelector(".criando-lista");
    lista.innerHTML = ""; 

    tarefas.forEach(tarefa => {
        adicionarNaTela(tarefa.id, tarefa.title);
    });
}

//(editado)funcao visual que desenha o html da tarefa
function adicionarNaTela(id, texto) {
    let lista = document.createElement("li");
    lista.dataset.id = id; 
    lista.innerHTML = `<article><input type='checkbox'> ${texto} <button class='deletar'>Deletar<span class='material-symbols-outlined icone-delete'>delete</span></button></article>`;
    document.querySelector(".criando-lista").appendChild(lista);
}

// Criando a função de adicionar tarefas
//(editado)agora manda pro python antes de adicionar
async function adicionarTarefa(){
    let entrada = document.querySelector(".entrada-de-texto").value;
    if (!entrada) return;

    const response = await fetch(API_URL + "/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ title: entrada })
    });

    if (response.ok) {
        const novaTarefa = await response.json();
        adicionarNaTela(novaTarefa.id, novaTarefa.title);
        document.querySelector(".entrada-de-texto").value = "";
    }
}

// Criando a função de deletar tarefas
//(editado)deleta do banco pelo id
async function deletarTarefa(botao){
    const item = botao.closest("li");
    const id = item.dataset.id; 

    await fetch(`${API_URL}/tasks/delete/${id}`, { 
        method: "DELETE",
        credentials: 'include'
    });
    item.remove(); 
}

// --- EVENTOS (Cliques e Teclas) ---

document.querySelector("#botao-adicionar-tarefas").addEventListener('click', adicionarTarefa);

// Criando uma declaração de eventos de click do mouse
document.querySelector(".criando-lista").addEventListener('click', function(event){
    const botao_de_Deletar = event.target.closest('.deletar');
    if (botao_de_Deletar){
        deletarTarefa(botao_de_Deletar);
    }
});

// Criando uma declaração de eventos da tecla enter
document.querySelector(".entrada-de-texto").addEventListener('keypress', function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        adicionarTarefa();
    }
})

// Criando a lógica do calendário
let dataAtual = new Date(); 
let ano = dataAtual.getFullYear();
let mes = dataAtual.getMonth();

function renderizar_Calendario(ano, mes){
    document.querySelector('#calendario').innerHTML = ""
    const total_de_Dias = new Date(ano, mes + 1, 0).getDate(); // Total de dias no mes
    const primeiro_dia_semana = new Date(ano, mes, 1).getDay();// Filtro de 1º dia da semana

    //Criando os dias da semana
    const dias_da_Semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    // Criando os meses do ano
    const meses_do_ano = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    document.querySelector("#nome-mes").innerText = meses_do_ano[mes] + " " + ano;

    for (let semana = 0; semana <= 6; semana++){
        let celula = document.createElement("article");
        celula.classList.add("dia-da-semana-header");
        celula.innerHTML = dias_da_Semana[semana];
        document.querySelector('#calendario').append(celula)
    }
    // Criando o primeiro dia da semana
    for (let dia = 1; dia <= primeiro_dia_semana; dia++){
        let vazia = document.createElement("article");
        vazia.classList.add('dia-vazio');
        document.querySelector('#calendario').append(vazia);
    }
    // Criando a contagem dos dias
    for (let dia = 1; dia <= total_de_Dias; dia ++){
        let celula = document.createElement("article");
        celula.classList.add('contador-de-dias');
        celula.innerText = dia;
        document.querySelector('#calendario').append(celula);
    }
}
renderizar_Calendario(ano, mes);

// Criando o controle de mês do ano
// Mês Anterior
document.querySelector("#botao-anterior").addEventListener('click', () => {
    mes--; // Diminuir o mês
    if (mes < 0){ mes = 11; ano--; }
    renderizar_Calendario(ano, mes);
});

// Mês Posterior
document.querySelector("#botao-posterior").addEventListener('click', () => {
    mes++; // Aumentar o mês
    if (mes > 11){ mes = 0; ano++; }
    renderizar_Calendario(ano, mes);
});

//(editado)tenta carregar tarefas ao abrir
carregarTarefas();
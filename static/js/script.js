const API_URL = "";
let filtroAtual = "todos";
let todasAsTarefas = [];
let idTarefaEmEdicao = null;

// ATIVAÇÃO DE FILTROS

// Filtro: Caixa de Entrada
const botaoInbox = document.querySelector("#filter-inbox");
if (botaoInbox) {
    botaoInbox.addEventListener("click", (e) => {
        e.preventDefault();
        filtroAtual = "todos";
        carregarTarefas()
    });
}

// Filtro: Importante
const botaoImportante = document.querySelector("#filter-important");
if (botaoImportante){
    botaoImportante.addEventListener("click", (e) => {
        e.preventDefault();
        filtroAtual = "importante"
        carregarTarefas();
    })
}

// Filtro: Hoje
const botaoHoje = document.querySelector("#filter-today");
if (botaoHoje){
    botaoHoje.addEventListener("click", (e) => {
        e.preventDefault();
        filtroAtual = "hoje";
        carregarTarefas();
    });
}

// Filtro: Por Vir
const botaoPorVir = document.querySelector("#filter-upcoming");
if (botaoPorVir) {
    botaoPorVir.addEventListener("click", (e) => {
        e.preventDefault();
        filtroAtual = "porvir";
        carregarTarefas();
    });
}

// BOTÕES DE AÇÕES

// Adicionar Tarefas
const botaoAdicionar = document.querySelector("#botao-adicionar-tarefas");
if (botaoAdicionar) botaoAdicionar.addEventListener('click', adicionarTarefa);

const entradaTexto = document.querySelector(".entrada-de-texto");
if (entradaTexto){
	entradaTexto.addEventListener('keypress', function(event){
        if (event.key == "Enter"){
            event.preventDefault();
            adicionarTarefa();
        }
    });
}

// Ouvinte de Cliques Inteligente (Delegação)
const listaUl = document.querySelector(".criando-lista");
if (listaUl) {
    listaUl.addEventListener('click', function(event){
        
        // 1. Verifica se clicou no botão DELETAR
        const botao_de_Deletar = event.target.closest('.deletar');
        if (botao_de_Deletar){
            deletarTarefa(botao_de_Deletar);
        }

        // 2. Verifica se clicou no botão EDITAR
        const botao_de_Editar = event.target.closest('.editar');
        if (botao_de_Editar) {
            // Recupera os dados escondidos no HTML (dataset)
            const id = botao_de_Editar.dataset.id;
            const titulo = botao_de_Editar.dataset.title;
            const data = botao_de_Editar.dataset.date;
            
            // Abre o modal com esses dados
            abrirModalEdicao(id, titulo, data);
        }
    });
}

// FUNÇÕES DE LÓGICAS

async function fazerLogin() {
    const user = document.querySelector("#usuario").value;
    const pass = document.querySelector("#senha").value;

    const response = await fetch(API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ username: user, password: pass })
    });

    if (response.ok) {
        mostrarSite();
        carregarTarefas();
    } else {
        const data = await response.json();
        alert(data.erro || "Falha no login!");
    }
}

async function fazerLogout() {
    await fetch(API_URL + "/logout", {
        method: "POST",
        credentials: 'include',
    });
    
    document.querySelector("#tela-login").style.display = "flex";
    document.querySelector("#conteudo-principal").style.display = "none";
    document.querySelector("#usuario").value = "";
    document.querySelector("#senha").value = "";
    document.querySelector(".criando-lista").innerHTML = "";
}

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
        const data = await response.json()
        alert(data.erro || "Erro ao criar conta!");
    }
}

function mostrarSite() {
    document.querySelector("#tela-login").style.display = "none";
    document.querySelector("#conteudo-principal").style.display = "block";
}

async function carregarTarefas() {
    const response = await fetch(API_URL + "/tasks", { credentials: 'include' });
    
    if (response.status === 401) return;

    mostrarSite(); 

    const tarefas = await response.json();
    todasAsTarefas = tarefas;
    renderizar_Calendario(ano, mes);
    
    const lista = document.querySelector(".criando-lista");
    lista.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual == "importante") {
            return tarefa.is_important === true; 
        }
        if (filtroAtual == "hoje"){
            const hoje = new Date().toISOString().split('T')[0]
            return tarefa.due_date == hoje;
        }
        if (filtroAtual == "porvir"){
            const hoje = new Date().toISOString().split('T')[0]
            return tarefa.due_date && tarefa.due_date > hoje;
        }
        return true; 
    })

    tarefasFiltradas.forEach(tarefa => {
        adicionarNaTela(tarefa); 
    });
}

// HTML do Botão Editar
function adicionarNaTela(tarefa) {
    let lista = document.createElement("li");
    lista.dataset.id = tarefa.id;

    const classEstrela = tarefa.is_important ? "active" : "";

    let htmlData = "";
    if (tarefa.due_date) {
        let partes = tarefa.due_date.split('-');
        let dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        htmlData = `<small style="font-size:0.75em; color:gray; margin-left:8px; display:block;">📅 ${dataFormatada}</small>`;
    }

    lista.innerHTML = `
    <article>
            <span style="display:flex; align-items:center; gap:10px;">
                <span onclick="alternarImportancia(${tarefa.id}, ${tarefa.is_important})" 
                    class="material-symbols-outlined icone-star ${classEstrela}">
                    star
                </span>
                
                <span style="display:flex; flex-direction:column; justify-content:center;">
                    ${tarefa.title} 
                    ${htmlData}
                </span>
            </span>
            
            <div style="display:flex; gap:5px;">
                <button class="editar" 
                        data-id="${tarefa.id}" 
                        data-title="${tarefa.title}" 
                        data-date="${tarefa.due_date || ''}"
                        style="border:none; background:transparent;">
                    <span class="material-symbols-outlined icone-edit">edit</span>
                </button>

                <button class='deletar'>
                    <span class='material-symbols-outlined icone-delete'>delete</span>
                </button>
            </div>
        </article>
    `;
    document.querySelector(".criando-lista").appendChild(lista);
}


async function adicionarTarefa(){
    let entrada = document.querySelector(".entrada-de-texto").value;
    let data = document.querySelector(".entrada-data").value;

    if (!entrada) return;

    const response = await fetch(API_URL + "/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ title: entrada, due_date: data })
    });

    if (response.ok) {
        const novaTarefa = await response.json();
        
        if (filtroAtual !== "todos") {
            filtroAtual = "todos";
            alert("Tarefa Criada! Voltando para a Caixa de Entrada.");
            carregarTarefas();
        } else {
            adicionarNaTela(novaTarefa);
        }
        
        document.querySelector(".entrada-de-texto").value = "";
        document.querySelector(".entrada-data").value = "";
    }
}

async function alternarImportancia(id, statusAtual) {
    const novoStatus = !statusAtual; 
    
    await fetch(`${API_URL}/tasks/update/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({is_important: novoStatus})
    });

    carregarTarefas();
}

async function deletarTarefa(botao){
    const item = botao.closest("li");
    const id = item.dataset.id; 

    await fetch(`${API_URL}/tasks/delete/${id}`, { 
        method: "DELETE",
        credentials: 'include'
    });
    item.remove(); 
}

// Edição de tarefas (Funções do Modal)
function abrirModalEdicao(id, tituloAtual, dataAtual) {
    idTarefaEmEdicao = id; 
    
    document.querySelector("#edit-titulo").value = tituloAtual;
    document.querySelector("#edit-data").value = dataAtual;
    
    document.querySelector("#modal-editar").style.display = "flex";
}

// Tornando globais (window) caso o HTML chame direto, ou para segurança
window.fecharModal = function() {
    document.querySelector("#modal-editar").style.display = "none";
    idTarefaEmEdicao = null; 
}

window.salvarEdicao = async function() {
    if (!idTarefaEmEdicao) return; 

    const novoTitulo = document.querySelector("#edit-titulo").value;
    const novaData = document.querySelector("#edit-data").value;

    if (!novoTitulo) return alert("O título não pode ser vazio!");

    await fetch(`${API_URL}/tasks/update/${idTarefaEmEdicao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
            title: novoTitulo,
            due_date: novaData
        })
    });

    fecharModal();
    carregarTarefas(); 
}

// CALENDARIO

let dataAtual = new Date(); 
let ano = dataAtual.getFullYear();
let mes = dataAtual.getMonth();

function renderizar_Calendario(ano, mes){
    const calendarioEl = document.querySelector('#calendario');
    calendarioEl.innerHTML = ""
    const total_de_Dias = new Date(ano, mes + 1, 0).getDate(); 
    const primeiro_dia_semana = new Date(ano, mes, 1).getDay();

    const dias_da_Semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const meses_do_ano = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    document.querySelector("#nome-mes").innerText = meses_do_ano[mes] + " " + ano;

    for (let semana = 0; semana <= 6; semana++){
        let celula = document.createElement("article");
        celula.classList.add("dia-da-semana-header");
        celula.innerHTML = dias_da_Semana[semana];
        document.querySelector('#calendario').append(celula)
    }
    
    for (let dia = 1; dia <= primeiro_dia_semana; dia++){
        let vazia = document.createElement("article");
        vazia.classList.add('dia-vazio');
        document.querySelector('#calendario').append(vazia);
    }
    
    for (let dia = 1; dia <= total_de_Dias; dia ++){
        let celula = document.createElement("article");
        celula.classList.add('contador-de-dias');
        celula.innerText = dia;

        let dataAtualDoLoop = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const temTarefaNesseDia = todasAsTarefas.some(t => t.due_date === dataAtualDoLoop);

        if (temTarefaNesseDia) {
            celula.classList.add('tem-tarefa');
            celula.title = "Existem tarefas para este dia!"
        }
        calendarioEl.append(celula);
    }
}

const botaoAnterior = document.querySelector("#botao-anterior")
if (botaoAnterior) botaoAnterior.addEventListener('click', () => {
    mes--; 
    if (mes < 0){ mes = 11; ano--; }
    renderizar_Calendario(ano, mes);
});

const botaoPosterior = document.querySelector("#botao-posterior")
if (botaoPosterior) botaoPosterior.addEventListener('click', () => {
    mes++; 
    if (mes > 11){ mes = 0; ano++; }
    renderizar_Calendario(ano, mes);
});

// Inicializar
renderizar_Calendario(ano, mes);
carregarTarefas();
const API_URL = "";
let filtroAtual = "todos";
let todasAsTarefas = [];
let idTarefaEmEdicao = null;

//ATIVAÇÃO DE FILTROS

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

// Criando uma declaração de eventos de click do mouse
const listaUl = document.querySelector(".criando-lista");
if (listaUl) {
	listaUl.addEventListener('click', function(event){
	    const botao_de_Deletar = event.target.closest('.deletar');
	    if (botao_de_Deletar){
	    	deletarTarefa(botao_de_Deletar);
	    	}
	    });
}

// FUNÇÕES DE LÓGICAS


//(editado)funcao que faz o login mandando dados pro python
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

// Criando Função de Logout
async function fazerLogout() {
    await fetch(API_URL + "/logout", {
        method: "POST",
        credentials: 'include',
    });
    
    // Esconde o site e mostra o login
    document.querySelector("#tela-login").style.display = "flex";
    document.querySelector("#conteudo-principal").style.display = "none";

    // Limpa os campos para a segurança
    document.querySelector("#usuario").value = "";
    document.querySelector("#senha").value = "";
    document.querySelector(".criando-lista").innerHTML = "" // Limpa as tarefas da tela
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
        const data = await response.json()
        alert(data.erro || "Erro ao criar conta!");
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
    todasAsTarefas = tarefas;
    renderizar_Calendario(ano, mes);
    const lista = document.querySelector(".criando-lista");
    lista.innerHTML = "";

    // data de Hoje no formato YYYY-MM-DD para comparação
    const hoje = new Date().toISOString().split('T')[0];

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual == "importante") {
            return tarefa.is_important === true; // Só mostra as importantes
        }
        if (filtroAtual == "hoje"){
            const hoje = new Date().toISOString().split('T')[0]
            // Mostra se tiver data E a data for igual a hoje
            return tarefa.due_date == hoje;
        }
        if (filtroAtual == "porvir"){
            const hoje = new Date().toISOString().split('T')[0]
            // Mostra se tiver data E a data for maior que hoje hoje
            return tarefa.due_date && tarefa.due_date > hoje;
        }
        return true; // Mostra "todos"
    })

    tarefasFiltradas.forEach(tarefa => {
        adicionarNaTela(tarefa); //Passando o objeto completo
    });
}

//(editado)funcao visual que desenha o html da tarefa
function adicionarNaTela(tarefa) {
    let lista = document.createElement("li");
    lista.dataset.id = tarefa.id;

    // Verificando se é importante
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
                <button onclick="abrirModalEdicao(${tarefa.id}, '${tarefa.title}', '${tarefa.due_date || ''}')" style="border:none; background:transparent;">
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

// Criando a função de adicionar tarefas
//(editado)agora manda pro python antes de adicionar
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
        if (filtroAtual == "todos") {
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

//Criando a função de alternar importancia
async function alternarImportancia(id, statusAtual) {
    // Inverter o status
    const novoStatus = !statusAtual; //true vira false e vice-versa
    
    await fetch(`${API_URL}/tasks/update/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({is_important: novoStatus})
    });

    // Recarrega a lista para mostrar a mudança
    carregarTarefas();
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

// Edição de tarefas
function abrirModalEdicao(id, tituloAtual, dataAtual) {
    idTarefaEmEdicao = id; // Guarda o ID na memória global
    
    // Preenche os inputs com o que já existe
    document.querySelector("#edit-titulo").value = tituloAtual;
    document.querySelector("#edit-data").value = dataAtual;
    
    // Mostra o modal (display: flex)
    document.querySelector("#modal-editar").style.display = "flex";
}

function fecharModal() {
    document.querySelector("#modal-editar").style.display = "none";
    idTarefaEmEdicao = null; // Limpa a memória
}

async function salvarEdicao() {
    if (!idTarefaEmEdicao) return; // Segurança

    const novoTitulo = document.querySelector("#edit-titulo").value;
    const novaData = document.querySelector("#edit-data").value;

    if (!novoTitulo) return alert("O título não pode ser vazio!");

    // Chama o Backend
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
    carregarTarefas(); // Atualiza a tela com os dados novos
}



// CALENDARIO

let dataAtual = new Date(); 
let ano = dataAtual.getFullYear();
let mes = dataAtual.getMonth();

function renderizar_Calendario(ano, mes){
    const calendarioEl = document.querySelector('#calendario');
    calendarioEl.innerHTML = ""
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

        // Monta a data do quadradinho
        //padStart(2, '0): 5 vira 05
        let dataAtualDoLoop = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        // Existe tarefa nessa data?
        //.some(): retorna true
        const temTarefaNesseDia = todasAsTarefas.some(t => t.due_date === dataAtualDoLoop);

        //Adicionando a classe virtual caso exista tarefa
        if (temTarefaNesseDia) {
            celula.classList.add('tem-tarefa');
            celula.title = "Existem tarefas para este dia!"
        }
        calendarioEl.append(celula);
    }
}

// Criando o controle de mês do ano
// Mês Anterior
const botaoAnterior = document.querySelector("#botao-anterior")
if (botaoAnterior) botaoAnterior.addEventListener('click', () => {
    mes--; // Diminuir o mês
    if (mes < 0){ mes = 11; ano--; }
    renderizar_Calendario(ano, mes);
});

// Mês Posterior
const botaoPosterior = document.querySelector("#botao-posterior")
if (botaoPosterior) botaoPosterior.addEventListener('click', () => {
    mes++; // Aumentar o mês
    if (mes > 11){ mes = 0; ano++; }
    renderizar_Calendario(ano, mes);
});

// Inicializar
	renderizar_Calendario(ano, mes);
	carregarTarefas();
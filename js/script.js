//Fazendo a lógica de adicionar a lista
/*
Lista de Tarefas
1- Saber quando o botão de adicionar for acionado [X];
2- Pegar a informaÇão do input [X];
3- Exibir o texto na tela [X];
4- Deletar a tarefa da tela (Ao clicar no botão deletar) [].
*/

function adicionarTarefa(){
    let entrada_do_usuario = document.querySelector(".entrada-de-texto").value;
    let lista = document.createElement("li");
    //lista.innerHTML = "<article><input type='checkbox'>" + entrada_do_usuario + "<button class='deletar'>Deletar<span class='material-symbols-outlined icone-delete'>delete</span></button></article>";
    lista.innerHTML = "<article><input type='checkbox'>" + entrada_do_usuario + "<button id='bota-remover-tarefas' class='deletar'>Deletar<span class='material-symbols-outlined icone-delete'>delete</span></button></article>";
    document.querySelector(".criando-lista").appendChild(lista);
    document.querySelector(".entrada-de-texto").value = "";
}
document.querySelector("#botao-adicionar-tarefas").addEventListener('click', adicionarTarefa);
// Criando uma declaração de eventos
document.querySelector(".criando-lista").addEventListener('click', function(event){
    const botao_de_Deletar = event.target.closest('.deletar')

    if (botao_de_Deletar){
        deletarTarefa(botao_de_Deletar);
    }
});

function deletarTarefa(botao_de_Deletar){
    botao_de_Deletar.closest("li").remove();
}

//Construindo a Lógica do Calendário
/* 
1- Saber como abstrair ano e mês [X]
2- Saber abstrair o primeiro e último dia do mês [X]
3- Criando as células da semana [X]
4- Criando dias vazios no calendário [X]
5- Juntando o passo 3 e 4 [X]
6- Criando contagem de dias [X]
7- Adicionado a contagem de dias no elemento html [X]
8- Criando o loop [X]
9- Criando uma função geral para Calendario [X]
*/
// 1
let dataAtual = new Date(); 
let ano = dataAtual.getFullYear();
let mes = dataAtual.getMonth();
/*
// 2
new Date(ano, mes + 1, 0).getDate(); // Último dia do Mês
new Date(2025, mes + 1, 0).getDate(); // Último dia de Novembro
new Date(2025, mes, 1).getDate(); // Primeiro dia do Mês
let dia_zero = new Date(2025, 11, 0).getDate(); // Retorne o último dia de Dezembro
console.log(dia_zero);

//3
for (var dia_da_semana = 0; dia_da_semana <= 5; dia_da_semana ++){
    console.log(dia_da_semana);
}

//4
let celula_Vazia = document.createElement("article");
celula_Vazia.classList.add('dia-vazio'); // Adiciona uma lista de classe de um elemento html
document.querySelector('#calendario').append(celula_Vazia); // Criando um elemento article dentro a section#calendario

//5
for (let dia_da_semana = 0; dia_da_semana <= 5; dia_da_semana ++){
    let celula_Vazia = document.createElement("article");
    celula_Vazia.classList.add('dia-vazio');
    document.querySelector('#calendario').append(celula_Vazia);
}
//6
let dias_novembro = 30
for (let contagem_dias = 1; contagem_dias <= dias_novembro; contagem_dias ++){
    console.log(contagem_dias)
}

//7
let celula_dia = document.createElement("article");
celula_dia.innerText = contagem_dias;
celula_dia.classList.add('contador-de-dias');
document.querySelector('#calendario').append(celula_dia);

//8
for (let contagem_dias = 1; contagem_dias <= dias_novembro; contagem_dias ++){
    let celula_Dia = document.createElement("article");
    celula_Dia.classList.add('dia-vazio');
    celula_Dia.innerText = contagem_dias;
    document.querySelector('#calendario').append(celula_Dia);
}*/

//9
function renderizar_Calendario(ano, mes){
    const total_de_Dias = new Date(ano, mes + 1, 0).getDate(); // Total de dias no mes
    const primeiro_dia_semana = new Date(ano, mes, 1).getDay();// Filtro de 1º dia da semana

    //Criando os dias da semana
    const dias_da_Semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    for (let semana = 0; semana <= 6; semana++){
        let celula_Semana = document.createElement("article");
        celula_Semana.classList.add("dia-da-semana-header");
        celula_Semana.innerHTML = dias_da_Semana[semana];
        document.querySelector('#calendario').append(celula_Semana)
    }

    // Criando o primeiro dia da semana
    for (let dia_da_semana = 1; dia_da_semana <= primeiro_dia_semana; dia_da_semana++){
        let celula_Vazia = document.createElement("article");
        celula_Vazia.classList.add('dia-vazio');
        document.querySelector('#calendario').append(celula_Vazia);
    }
    
    // Criando a contagem dos dias
    for (let contagem_dias = 1; contagem_dias <= total_de_Dias; contagem_dias ++){
        let celula_Dia = document.createElement("article");
        celula_Dia.classList.add('contador-de-dias');
        celula_Dia.innerText = contagem_dias;
        document.querySelector('#calendario').append(celula_Dia);
    }
}
renderizar_Calendario(2025,11);

// Criando o controle de mês do ano
// Mês Anterior
function botao_anterior(){
    mes--; // Diminuir o mês
    if (mes < 0){
        mes = 11;
        ano--;
    }
    renderizar_Calendario(ano, mes);
}
document.querySelector("#botao-anterior").addEventListener('click', botao_anterior);
// Mês Posterior
function botao_posterior(){
    mes++; // Aumentar o mês
    if (mes > 11){
        mes = 0;
        ano++;
    }
    renderizar_Calendario(ano, mes);
}
document.querySelector("#botao-posterior").addEventListener('click', botao_posterior);
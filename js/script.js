// Criando a função de adicionar tarefas
function adicionarTarefa(){
    let entrada_do_usuario = document.querySelector(".entrada-de-texto").value;
    let lista = document.createElement("li");
    //lista.innerHTML = "<article><input type='checkbox'>" + entrada_do_usuario + "<button class='deletar'>Deletar<span class='material-symbols-outlined icone-delete'>delete</span></button></article>";
    lista.innerHTML = "<article><input type='checkbox'>" + entrada_do_usuario + "<button id='bota-remover-tarefas' class='deletar'>Deletar<span class='material-symbols-outlined icone-delete'>delete</span></button></article>";
    document.querySelector(".criando-lista").appendChild(lista);
    document.querySelector(".entrada-de-texto").value = "";
}
document.querySelector("#botao-adicionar-tarefas").addEventListener('click', adicionarTarefa);
// Criando uma declaração de eventos de click do mouse
document.querySelector(".criando-lista").addEventListener('click', function(event){
    const botao_de_Deletar = event.target.closest('.deletar')

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

// Criando a função de deletar tarefas
function deletarTarefa(botao_de_Deletar){
    botao_de_Deletar.closest("li").remove();
}

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
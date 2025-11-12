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
    lista.innerHTML = "<article><input type='checkbox'>" + entrada_do_usuario + "<button onclick='deletarTarefa(this)' class='deletar'>Deletar<span class='material-symbols-outlined icone-delete'>delete</span></button></article>";
    document.querySelector(".criando-lista").appendChild(lista);
    document.querySelector(".entrada-de-texto").value = "";
}

function deletarTarefa(lista){
    lista.parentElement.remove();
}
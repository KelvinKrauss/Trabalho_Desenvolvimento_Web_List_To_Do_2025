//Fazendo a lógica de adicionar a lista
/*
Lista de Tarefas
1- Saber quando o botão de adicionar for acionado [];
2- Pegar a informaÇão do input [];
3- Exibir o texto na tela [];
4- Deletar a tarefa da tela (Ao clicar no botão deletar) [].
*/
function adicionarTarefa(){
    let entrada_do_usuario = document.querySelector(".entrada-de-texto").value;
    let lista = document.createElement("li");
    lista.innerHTML = "<article><input type='checkbox'>" + entrada_do_usuario + "<button class='deletar'>Deletar<span class='material-symbols-outlined icone-delete'>delete</span></button></article>"
    document.querySelector(".criando-lista").appendChild(lista)

}
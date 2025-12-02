# Trabalho_Desenvolvimento_Web_List_To_Do_2025
Trabalho de Desenvolvimento Web 2025, List To Do
Integrantes:
* Kelvin Krauss
* Marcelo Silva
* Natan Sampaio
* Renan Selke

--------Tutorial para criar e configurar o Ambiente Virtual e rodar o projeto--------
1. Pré-requisitos
    1. Certifique-se de ter o Python instalado no seu computador, Para verificar, abra o terminal e digite:
       python --version

    !Se der erro, baixe o Python no site oficial (python.org).
-------------------------------------------------------------------------------------
2. Criando o Ambiente Virtual
    1. Abra o terminal na pasta raiz do projeto(onde está o app.py) e rode:
       python -m venv venv

    !isso criará uma pasta chamada "venv"
-------------------------------------------------------------------------------------
3. Ativando o Ambiente

    1. No Windows:
       venv/Script/activate

    1. No Linux ou Mac:
       source venv/bin/activate

    !Sinal de Sucesso: Você verá (venv) aparecer no começo da linha do seu terminal.
-------------------------------------------------------------------------------------
4. Instalando as Dependências

    1. Com o ambiente ativado (aparecendo o (venv)), instale as bibliotecas que usamos (Flask, Banco de Dados, CORS, Etc):
       pip install -r requirements.txt
-------------------------------------------------------------------------------------
5. Configurando a Chave de Segurança (.env)

    1. No terminal(ou rodando o gerar_senha.py) execute o script de geração de senha:
       python gerar_senha.py

    2. Crie um arquivo chamado .env na raiz do projeto(aonde esta o app.py)

    3. Dentro do arquivo .env escreva o seguinte:
       SECRET_KEY="aqui você vai colocar o resultado do gerar_senha.py"
-------------------------------------------------------------------------------------
6. Rodando o Projeto
    1. python app.py

    2. Acesse no navegador: http://localhost:5000
-------------------------------------------------------------------------------------
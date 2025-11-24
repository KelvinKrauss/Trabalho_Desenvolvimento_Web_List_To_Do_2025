# Trabalho_Desenvolvimento_Web_List_To_Do_2025
Trabalho de Desenvolvimento Web 2025, List To Do
Integrantes:
* Kelvin Krauss
* Marcelo Silva
* Natan Sampaio
* Renan Selke

-----------------Tutorial para usar o Ambiente Virtual-----------------
1. Pré-requisitos
Certifique-se de ter o Python instalado no seu computador.
Para verificar, abra o terminal e digite:

python --version

Se der erro, baixe o Python no site oficial (python.org).

2. Criando o Ambiente
Abra o terminal na pasta raiz do projeto(onde está o app.py) e rode:

python -m venv venv

isso criará uma pasta chamada venv

3. Ativando o Ambiente
No Windows:
venv/Script/activate

No Linux ou Mac:
source venv/bin/activate

Sinal de Sucesso: Você verá (venv) aparecer no começo da linha do seu terminal.

4. Instalando as Dependências
Com o ambiente ativado (aparecendo o (venv)), instale as bibliotecas que usamos (Flask, Banco de Dados, CORS):

pip install -r requirements.txt

5. Rodando o Projeto
python app.py
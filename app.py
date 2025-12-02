import os
from flask import Flask, request, jsonify, session, render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

load_dotenv() # Carrega .env

app = Flask(__name__)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'#protecao, cookie só é enviado se usuario estiver no proprio site
app.config['SESSION_COOKIE_SECURE'] = False#pq ta em http e nao https
app.secret_key = os.environ.get('SECRET_KEY') # lendo .env
if not app.secret_key:
    raise RuntimeError("A variável SECRET_KEY não foi definida! Crie um arquivo .env com ela.")

# database
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'tasks.db')#pra nao criar banco no lugar errado
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
db = SQLAlchemy(app)#defini o banco 

# models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(200))

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    is_important = db.Column(db.Boolean, default =False)
    due_date = db.Column(db.String(10)) # Coluna para as datas
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    def to_dict(self):#pra inves de retorna objeto python retornar json
        return {'id': self.id, 'title': self.title, 'is_important': self.is_important, 'due_date': self.due_date}

# frontend routes
@app.route('/')
def home():
    return render_template('index.html')# pra entrega o index.html qnd entra

# auth routes
@app.route('/register', methods=['POST'])
def register():
    d = request.get_json()
    if User.query.filter_by(username=d['username']).first(): return jsonify({'erro':'existe'}), 400
    senha_hash = generate_password_hash(d['password'])  #Gera hash da senha
    db.session.add(User(username=d['username'], password=senha_hash))
    db.session.commit()
    return jsonify({'msg':'ok'}), 201

@app.route('/login', methods=['POST'])
def login():
    d = request.get_json()
    u = User.query.filter_by(username=d['username']).first()
    if u and check_password_hash(u.password, d['password']):
        session['user_id'] = u.id
        session.permanent = True
        return jsonify({'msg':'logado'})
    return jsonify({'erro':'senha errada'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'msg':'tchau'})

# task routes
@app.route('/tasks', methods=['GET'])
def get_tasks():
    uid = session.get('user_id')
    if not uid: return jsonify([]), 401
    return jsonify([t.to_dict() for t in Task.query.filter_by(user_id=uid).all()])

@app.route('/tasks/add', methods=['POST'])
def add_task():
    uid = session.get('user_id')
    d = request.get_json()
    if not uid: return jsonify({'erro':'login'}), 401
    if not d or 'title' not in d: return jsonify({'erro':'titulo'}), 400
    data_vencimento = d.get('due_date')
    t = Task(title=d['title'], user_id=uid, due_date = data_vencimento)
    db.session.add(t)
    db.session.commit()
    return jsonify(t.to_dict()), 201

@app.route('/tasks/delete/<int:id>', methods=['DELETE'])
def delete_task(id):
    uid = session.get('user_id')
    t = db.session.get(Task, id)
    if t and t.user_id == uid:
        db.session.delete(t)
        db.session.commit()
        return jsonify({'msg':'deletado'})
    return jsonify({'erro':'erro'}), 404

@app.route('/tasks/update/<int:id>', methods=['PUT'])
def update_task(id):
    uid = session.get('user_id')
    t = db.session.get(Task, id)
    
    if t and t.user_id == uid:
        d = request.get_json()
        
        if 'is_important' in d:
            t.is_important = d['is_important']
        if 'title' in d:
            t.title = d['title']
        if 'due_date' in d:
            t.due_date = d['due_date']
            
        db.session.commit()
        return jsonify(t.to_dict())
    return jsonify({'erro':'não autorizado ou não encontrado'}), 404

if __name__ == '__main__':
    with app.app_context(): db.create_all()#verifica se tasks.db e as tabelas existem, se nao existirem ele cria
    app.run(host='0.0.0.0', port=5000)#pra poder rodar em qlqr lugar
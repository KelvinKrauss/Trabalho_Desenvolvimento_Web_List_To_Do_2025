import os
from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

# [FIX] procura por arquivos na pasta atual(.) pra n dar error 404
app = Flask(__name__, static_folder='.', template_folder='.')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.secret_key = "segredo"
CORS(app, supports_credentials=True)

# database
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'tasks.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
db = SQLAlchemy(app)

# models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    def to_dict(self):
        return {'id': self.id, 'title': self.title}

# frontend routes
@app.route('/')
def home():
    return send_from_directory('.', 'templates/index.html')

@app.route('/<path:path>')
def serve_files(path):
    return send_from_directory('.', path)

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
    t = Task(title=d['title'], user_id=uid)
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

if __name__ == '__main__':
    with app.app_context(): db.create_all()
    app.run(host='0.0.0.0', port=5000)
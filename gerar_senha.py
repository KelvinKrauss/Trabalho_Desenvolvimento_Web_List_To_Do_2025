from werkzeug.security import generate_password_hash

senha_texto = "minha_senha_secreta"
hash_seguro = generate_password_hash(senha_texto)
print(hash_seguro)
from flask import Flask, request, jsonify
import psycopg2
import bcrypt
from psycopg2 import errors

app = Flask(__name__)

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="Auth",
    user="postgres",
    password="Hannan66"
)

cur = conn.cursor()

# Create users table
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
)
""")
conn.commit()


# 🔹 Create default admin if not exists
def create_admin():
    admin_username = "admin"
    admin_email = "admin@admin.com"
    admin_password = "admin123"

    hashed = bcrypt.hashpw(admin_password.encode(), bcrypt.gensalt()).decode()

    try:
        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (admin_email,)
        )
        admin = cur.fetchone()

        if not admin:
            cur.execute(
                "INSERT INTO users (username, email, password, is_admin) VALUES (%s,%s,%s,%s)",
                (admin_username, admin_email, hashed, True)
            )
            conn.commit()
            print("Admin created")
        else:
            print("Admin already exists")

    except Exception as e:
        conn.rollback()
        print("Admin creation error:", e)


create_admin()


@app.route("/signup", methods=["POST"])
def signup():

    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"msg": "All fields required"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    try:

        cur.execute(
            "INSERT INTO users (username,email,password) VALUES (%s,%s,%s)",
            (username,email,hashed)
        )

        conn.commit()

        return jsonify({"msg":"ok"}),200

    except errors.UniqueViolation:

        conn.rollback()

        return jsonify({"msg":"Email already exists"}),400

    except Exception as e:

        conn.rollback()

        print(e)

        return jsonify({"msg":"Server error"}),500


@app.route("/login", methods=["POST"])
def login():

    print("🔥 LOGIN REQUEST RECEIVED")

    data = request.json
    print(data)

    ...
    data = request.json

    login_input = data.get("login")
    password = data.get("password")

    if not login_input or not password:

        return jsonify({"msg":"All fields required"}),400

    try:

        cur.execute(
            "SELECT id,username,email,password,is_admin FROM users WHERE email=%s OR username=%s",
            (login_input,login_input)
        )

        user = cur.fetchone()

        if user and bcrypt.checkpw(password.encode(),user[3].encode()):

            return jsonify({
                "msg":"ok",
                "user":{
                    "id":user[0],
                    "username":user[1],
                    "email":user[2],
                    "is_admin":user[4]
                }
            }),200

        else:

            return jsonify({"msg":"wrong"}),401

    except Exception as e:

        print(e)

        return jsonify({"msg":"Server error"}),500
    

if __name__ == "__main__":

    app.run(host="0.0.0.0",port=5001,debug=True)   





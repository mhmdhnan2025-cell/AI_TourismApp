from flask import Flask, request, jsonify
import psycopg2
import requests  # for external requests if needed
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# ===== DATABASE CONNECTION =====
conn = psycopg2.connect(
    host="localhost",
    database="Auth",
    user="postgres",
    password="Hannan66"
)
cur = conn.cursor(cursor_factory=RealDictCursor)

# ===== CREATE TOURS TABLE =====
cur.execute("""
CREATE TABLE IF NOT EXISTS tours(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT,
    price INTEGER,
    description TEXT,
    image TEXT
)
""")
conn.commit()

# ===== CREATE BOOKINGS TABLE =====
cur.execute("""
CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    members INTEGER NOT NULL,
    date TEXT NOT NULL,
    tour_name TEXT NOT NULL,
    price FLOAT NOT NULL,
    payment_proof TEXT NOT NULL
)
""")
conn.commit()

# ===== TOURS ENDPOINTS =====
@app.route("/add-tour", methods=["POST"])
def add_tour():
    data = request.json
    cur.execute(
        "INSERT INTO tours (title, location, price, description, image) VALUES (%s,%s,%s,%s,%s)",
        (data.get("title"), data.get("location"), data.get("price"), data.get("description"), data.get("image"))
    )
    conn.commit()
    return jsonify({"msg": "Tour added"})

@app.route("/tours", methods=["GET"])
def get_tours():
    cur.execute("SELECT * FROM tours")
    rows = cur.fetchall()
    return jsonify(rows)

@app.route("/update-tour/<int:id>", methods=["PUT"])
def update_tour(id):
    data = request.json
    cur.execute(
        "UPDATE tours SET title=%s, location=%s, price=%s, description=%s, image=%s WHERE id=%s",
        (data.get("title"), data.get("location"), data.get("price"), data.get("description"), data.get("image"), id)
    )
    conn.commit()
    return jsonify({"msg": "Tour updated successfully"})

@app.route("/delete-tour/<int:id>", methods=["DELETE"])
def delete_tour(id):
    cur.execute("DELETE FROM tours WHERE id = %s", (id,))
    conn.commit()
    return jsonify({"msg": "Tour deleted"})

# ===== BOOKINGS ENDPOINTS =====
@app.route("/bookings", methods=["POST"])
def add_booking():
    data = request.json
    cur.execute("""
        INSERT INTO bookings (name, phone, members, date, tour_name, price, payment_proof)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        data['name'], data['phone'], int(data['members']), data['date'],
        data['tourName'], float(data['price']), data['paymentProof']
    ))
    conn.commit()
    return jsonify({"msg": "Booking added successfully"})

@app.route("/bookings", methods=["GET"])
def get_bookings():
    cur.execute("SELECT * FROM bookings")
    rows = cur.fetchall()
    return jsonify(rows)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  
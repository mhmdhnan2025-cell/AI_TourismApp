# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from PIL import Image
# import requests
# import io
# import base64
# import os
# from dotenv import load_dotenv



# app = Flask(__name__)
# CORS(app)
# load_dotenv()

# OPENROUTER_API_KEY = os.getenv("AR_Key")

# # ----------------------
# # TEXT API
# # ----------------------
# @app.route("/text-process", methods=["POST"])
# def text_process():
#     data = request.get_json()
#     prompt = data.get("prompt")

#     try:
#         response = requests.post(
#             "https://openrouter.ai/api/v1/chat/completions",
#             headers={
#                 "Authorization": f"Bearer {OPENROUTER_API_KEY}",
#                 "Content-Type": "application/json",
#             },
#             # openai/gpt-4o-mini
#             json={
#                 "model": "meta-llama/llama-3.2-11b-vision-instruct",
#                 "messages": [
#                     {"role": "user", "content": prompt}
#                 ],
#                 "max_tokens": 150
#             }
#         )

#         result = response.json()
#         text = result["choices"][0]["message"]["content"]

#         return jsonify({"result": text})

#     except Exception as e:
#         return jsonify({"result": str(e)}), 500


# # ----------------------
# # IMAGE API (RESIZED)
# # ----------------------
# @app.route("/process", methods=["POST"])
# def process_image():
#     if "image" not in request.files:
#         return jsonify({"result": "No image uploaded"}), 400

#     try:
#         file = request.files["image"]

#         # 🔥 Resize image (IMPORTANT for saving credits)
#         image = Image.open(io.BytesIO(file.read()))
#         image = image.convert("RGB")

#         MAX_SIZE = (512, 512)  # 👈 small = cheap
#         image.thumbnail(MAX_SIZE)

#         buffer = io.BytesIO()
#         image.save(buffer, format="JPEG", quality=70)  # compress
#         img_bytes = buffer.getvalue()

#         # 🔥 Convert to base64
#         img_base64 = base64.b64encode(img_bytes).decode("utf-8")

#         response = requests.post(
#             "https://openrouter.ai/api/v1/chat/completions",
#             headers={
#                 "Authorization": f"Bearer {OPENROUTER_API_KEY}",
#                 "Content-Type": "application/json",
#             },
#             json={
#                 "model": "openai/gpt-4o-mini",
#                 "messages": [
#                     {
#                         "role": "user",
#                         "content": [
#                             {"type": "text", "text": "Describe this image shortly"},
#                             {
#                                 "type": "image_url",
#                                 "image_url": {
#                                     "url": f"data:image/jpeg;base64,{img_base64}"
#                                 },
#                             },
#                         ],
#                     }
#                 ],
#                 "max_tokens": 150
#             }
#         )

#         result = response.json()
#         text = result["choices"][0]["message"]["content"]

#         return jsonify({"result": text})

#     except Exception as e:
#         return jsonify({"result": str(e)}), 500


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=8002, debug=True)
















from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
import io
import base64
import os
import bcrypt
import psycopg2

from psycopg2 import errors
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv


# ================= APP =================

app = Flask(__name__)
CORS(app)

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# ================= DATABASE =================
DATABASE_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor(cursor_factory=RealDictCursor)
# ================= CREATE TABLES =================


# USERS TABLE

cur.execute("""
CREATE TABLE IF NOT EXISTS users (

    id SERIAL PRIMARY KEY,

    username TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    is_admin BOOLEAN DEFAULT FALSE

)
""")



# TOURS TABLE

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



# BOOKINGS TABLE

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



# ================= ADMIN CREATION =================


def create_admin():

    admin_username = "admin"

    admin_email = "admin@admin.com"

    admin_password = "admin123"


    hashed = bcrypt.hashpw(
        admin_password.encode(),
        bcrypt.gensalt()
    ).decode()



    try:

        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (admin_email,)
        )


        admin = cur.fetchone()


        if not admin:

            cur.execute(
                """
                INSERT INTO users
                (username,email,password,is_admin)
                VALUES(%s,%s,%s,%s)
                """,

                (
                    admin_username,
                    admin_email,
                    hashed,
                    True
                )
            )

            conn.commit()

            print("Admin created")


        else:

            print("Admin already exists")



    except Exception as e:

        conn.rollback()

        print("Admin creation error:", e)



create_admin()




# ================= AUTH =================


@app.route("/signup", methods=["POST"])
def signup():


    data = request.json


    username = data.get("username")

    email = data.get("email")

    password = data.get("password")



    if not username or not email or not password:

        return jsonify(
            {"msg":"All fields required"}
        ),400



    hashed = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()



    try:


        cur.execute(

            """
            INSERT INTO users
            (username,email,password)
            VALUES(%s,%s,%s)
            """,

            (
                username,
                email,
                hashed
            )

        )


        conn.commit()


        return jsonify(
            {"msg":"ok"}
        ),200



    except errors.UniqueViolation:


        conn.rollback()


        return jsonify(
            {"msg":"Email already exists"}
        ),400



    except Exception as e:


        conn.rollback()

        print(e)


        return jsonify(
            {"msg":"Server error"}
        ),500






@app.route("/login", methods=["POST"])
def login():


    print("🔥 LOGIN REQUEST RECEIVED")
    print("VERSION_2_REALDICT_ACTIVE")
    data = request.json


    login_input = data.get("login")

    password = data.get("password")



    if not login_input or not password:

        return jsonify(
            {"msg":"All fields required"}
        ),400



    try:


        cur.execute(

            """
            SELECT id,username,email,password,is_admin

            FROM users

            WHERE email=%s OR username=%s

            """,

            (
                login_input,
                login_input
            )

        )


        user = cur.fetchone()



        if user and bcrypt.checkpw(
            password.encode(),
            user["password"].encode()
        ):


            return jsonify({

                "msg":"ok",

                "user":{

                    "id":user["id"],

                    "username":user["username"],

                    "email":user["email"],

                    "is_admin":user["is_admin"]

                }

            }),200



        else:


            return jsonify(
                {"msg":"wrong"}
            ),401



    except Exception as e:


        print(e)


        return jsonify(
            {"msg":"Server error"}
        ),500
    
    # ================= TOURS =================


@app.route("/add-tour", methods=["POST"])
def add_tour():

    data = request.json


    cur.execute(
        """
        INSERT INTO tours
        (title, location, price, description, image)

        VALUES(%s,%s,%s,%s,%s)
        """,

        (
            data.get("title"),
            data.get("location"),
            data.get("price"),
            data.get("description"),
            data.get("image")
        )
    )


    conn.commit()


    return jsonify(
        {"msg":"Tour added"}
    )





@app.route("/tours", methods=["GET"])
def get_tours():


    cur.execute(
        "SELECT * FROM tours"
    )


    rows = cur.fetchall()


    return jsonify(rows)







@app.route("/update-tour/<int:id>", methods=["PUT"])
def update_tour(id):


    data = request.json



    cur.execute(

        """
        UPDATE tours

        SET title=%s,
            location=%s,
            price=%s,
            description=%s,
            image=%s

        WHERE id=%s

        """,

        (

            data.get("title"),

            data.get("location"),

            data.get("price"),

            data.get("description"),

            data.get("image"),

            id

        )

    )


    conn.commit()



    return jsonify(
        {"msg":"Tour updated successfully"}
    )







@app.route("/delete-tour/<int:id>", methods=["DELETE"])
def delete_tour(id):


    cur.execute(

        "DELETE FROM tours WHERE id=%s",

        (id,)

    )


    conn.commit()



    return jsonify(
        {"msg":"Tour deleted"}
    )







# ================= BOOKINGS =================



@app.route("/bookings", methods=["POST"])
def add_booking():


    data = request.json



    cur.execute(

        """

        INSERT INTO bookings

        (name, phone, members, date, tour_name, price, payment_proof)

        VALUES(%s,%s,%s,%s,%s,%s,%s)

        """,

        (

            data["name"],

            data["phone"],

            int(data["members"]),

            data["date"],

            data["tourName"],

            float(data["price"]),

            data["paymentProof"]

        )

    )


    conn.commit()



    return jsonify(
        {"msg":"Booking added successfully"}
    )







@app.route("/bookings", methods=["GET"])
def get_bookings():


    cur.execute(
        "SELECT * FROM bookings"
    )


    rows = cur.fetchall()



    return jsonify(rows)


    # ================= AI SETTINGS =================

OPENROUTER_API_KEY = os.getenv("AR_Key")



# ================= TEXT API =================


@app.route("/text-process", methods=["POST"])
def text_process():

    data = request.get_json()

    prompt = data.get("prompt")


    try:

        response = requests.post(

            "https://openrouter.ai/api/v1/chat/completions",

            headers={

                "Authorization":
                f"Bearer {OPENROUTER_API_KEY}",

                "Content-Type":
                "application/json"

            },


            json={

                "model":
                "meta-llama/llama-3.2-11b-vision-instruct",


                "messages":[

                    {

                    "role":"user",

                    "content":prompt

                    }

                ],


                "max_tokens":150

            }

        )


        result = response.json()


        text = result["choices"][0]["message"]["content"]



        return jsonify(
            {"result":text}
        )



    except Exception as e:


        return jsonify(
            {"result":str(e)}
        ),500






# ================= IMAGE API =================


@app.route("/process", methods=["POST"])
def process_image():

    if "image" not in request.files:
        return jsonify({
            "result": "No image uploaded"
        }), 400

    try:
        file = request.files["image"]

        # Open image
        image = Image.open(
            io.BytesIO(file.read())
        )

        # Convert RGB
        image = image.convert("RGB")

        # Resize
        image.thumbnail((512, 512))

        # Compress image
        buffer = io.BytesIO()

        image.save(
            buffer,
            format="JPEG",
            quality=70
        )

        img_bytes = buffer.getvalue()

        # Convert to base64
        img_base64 = base64.b64encode(
            img_bytes
        ).decode("utf-8")


        # Send to OpenRouter
        response = requests.post(

            "https://openrouter.ai/api/v1/chat/completions",

            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },

            json={

                "model": "openai/gpt-4o-mini",

                "messages": [
                    {
                        "role": "user",

                        "content": [

                            {
                                "type": "text",
                                "text": "Describe this image shortly"
                            },

                            {
                                "type": "image_url",

                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{img_base64}"
                                }
                            }

                        ]
                    }
                ],

                "max_tokens": 150
            }
        )


        result = response.json()

        print("OPENROUTER RESPONSE:")
        print(result)


        text = result["choices"][0]["message"]["content"]


        return jsonify({
            "result": text
        })


    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "result": str(e)
        }), 500


# ================= RUN SERVER =================


if __name__ == "__main__":


    app.run(

        host="0.0.0.0",

        port=int(
            os.getenv("PORT",5000)
        ),

        debug=True

    )
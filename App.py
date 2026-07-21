from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
import io
import base64
import os
from dotenv import load_dotenv



app = Flask(__name__)
CORS(app)
load_dotenv()

OPENROUTER_API_KEY = os.getenv("AR_Key")

# ----------------------
# TEXT API
# ----------------------
@app.route("/text-process", methods=["POST"])
def text_process():
    data = request.get_json()
    prompt = data.get("prompt")

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            # openai/gpt-4o-mini
            json={
                "model": "meta-llama/llama-3.2-11b-vision-instruct",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 150
            }
        )

        result = response.json()
        text = result["choices"][0]["message"]["content"]

        return jsonify({"result": text})

    except Exception as e:
        return jsonify({"result": str(e)}), 500


# ----------------------
# IMAGE API (RESIZED)
# ----------------------
@app.route("/process", methods=["POST"])
def process_image():
    if "image" not in request.files:
        return jsonify({"result": "No image uploaded"}), 400

    try:
        file = request.files["image"]

        # 🔥 Resize image (IMPORTANT for saving credits)
        image = Image.open(io.BytesIO(file.read()))
        image = image.convert("RGB")

        MAX_SIZE = (512, 512)  # 👈 small = cheap
        image.thumbnail(MAX_SIZE)

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=70)  # compress
        img_bytes = buffer.getvalue()

        # 🔥 Convert to base64
        img_base64 = base64.b64encode(img_bytes).decode("utf-8")

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Describe this image shortly"},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{img_base64}"
                                },
                            },
                        ],
                    }
                ],
                "max_tokens": 150
            }
        )

        result = response.json()
        text = result["choices"][0]["message"]["content"]

        return jsonify({"result": text})

    except Exception as e:
        return jsonify({"result": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8002, debug=True)
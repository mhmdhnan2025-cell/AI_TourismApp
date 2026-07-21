import customtkinter as ctk
import threading
import os
from dotenv import load_dotenv
from openai import OpenAI
from datetime import datetime

# -----------------------------
# Load API Key
# -----------------------------
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")

if not API_KEY:
    raise ValueError("API key not found")

# -----------------------------
# OpenRouter Client
# -----------------------------
client = OpenAI(
    api_key=API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

# -----------------------------
# App Config
# -----------------------------
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

WIDTH = 900
HEIGHT = 620
HISTORY_FILE = "chat_history.txt"

SYSTEM_PROMPTS = {
    "Normal": "You are a helpful AI assistant.",
    "Study": "You are a study assistant who explains concepts simply.",
    "Coding": "You are a professional coding assistant."
}

# -----------------------------
# Main App
# -----------------------------
class AIAssistant(ctk.CTk):

    def __init__(self):
        super().__init__()

        self.title("AI Assistant 🤖")
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.minsize(820, 520)

        self.chat_history = []
        self.current_prompt = "Normal"
        self.typing_label = None

        self.build_ui()
        self.load_chat_history()

    # -------------------------
    # UI
    # -------------------------
    def build_ui(self):

        # Header
        top_frame = ctk.CTkFrame(self)
        top_frame.pack(fill="x", padx=15, pady=10)

        self.header = ctk.CTkLabel(
            top_frame,
            text="AI Chat Assistant",
            font=("Segoe UI", 24, "bold")
        )
        self.header.pack(side="left", padx=10)

        self.theme_btn = ctk.CTkButton(
            top_frame,
            text="Toggle Theme",
            width=120,
            command=self.toggle_theme
        )
        self.theme_btn.pack(side="right", padx=10)

        # Prompt Selector
        self.prompt_menu = ctk.CTkOptionMenu(
            top_frame,
            values=list(SYSTEM_PROMPTS.keys()),
            command=self.change_prompt
        )
        self.prompt_menu.pack(side="right", padx=10)

        # Chat Area
        self.chat_area = ctk.CTkScrollableFrame(
            self,
            corner_radius=15
        )
        self.chat_area.pack(padx=20, pady=10, fill="both", expand=True)

        # Input Area
        bottom = ctk.CTkFrame(self)
        bottom.pack(fill="x", padx=20, pady=12)

        self.input_box = ctk.CTkEntry(
            bottom,
            placeholder_text="Type your message...",
            height=40
        )
        self.input_box.pack(side="left", fill="x", expand=True, padx=10)
        self.input_box.bind("<Return>", lambda e: self.send_message())

        self.send_btn = ctk.CTkButton(
            bottom,
            text="Send",
            width=90,
            command=self.send_message
        )
        self.send_btn.pack(side="right", padx=5)

        self.clear_btn = ctk.CTkButton(
            bottom,
            text="Clear",
            width=80,
            command=self.clear_chat
        )
        self.clear_btn.pack(side="right", padx=5)

    # -------------------------
    # Theme
    # -------------------------
    def toggle_theme(self):
        mode = ctk.get_appearance_mode()
        ctk.set_appearance_mode("light" if mode == "Dark" else "dark")

    def change_prompt(self, value):
        self.current_prompt = value
        self.add_message(f"System mode set to: {value}", "assistant")

    # -------------------------
    # Chat UI
    # -------------------------
    def add_message(self, text, sender="user"):
        time = datetime.now().strftime("%H:%M")

        bg = "#1f6aa5" if sender == "user" else "#2b2b2b"
        anchor = "e" if sender == "user" else "w"

        bubble = ctk.CTkFrame(self.chat_area, fg_color=bg, corner_radius=15)
        bubble.pack(anchor=anchor, pady=6, padx=10)

        label = ctk.CTkLabel(
            bubble,
            text=f"[{time}] {text}",
            wraplength=620,
            justify="left",
            font=("Segoe UI", 14)
        )
        label.pack(padx=12, pady=8)

        self.chat_area.update_idletasks()
        self.chat_area._parent_canvas.yview_moveto(1.0)

    # -------------------------
    # Chat Logic
    # -------------------------
    def send_message(self):
        text = self.input_box.get().strip()
        if not text:
            return

        self.input_box.delete(0, "end")
        self.add_message(text, "user")

        self.chat_history.append({"role": "user", "content": text})
        self.save_to_file(f"USER: {text}")

        self.show_typing()

        threading.Thread(target=self.get_ai_response, daemon=True).start()

    def show_typing(self):
        if self.typing_label:
            self.typing_label.destroy()

        self.typing_label = ctk.CTkLabel(
            self.chat_area,
            text="AI is typing...",
            font=("Segoe UI", 12, "italic")
        )
        self.typing_label.pack(anchor="w", padx=20, pady=5)

    def remove_typing(self):
        if self.typing_label:
            self.typing_label.destroy()
            self.typing_label = None

    def get_ai_response(self):
        try:
            response = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPTS[self.current_prompt]},
                    *self.chat_history
                ]
            )

            ai_text = response.choices[0].message.content

            self.chat_history.append({"role": "assistant", "content": ai_text})
            self.save_to_file(f"AI: {ai_text}")

            self.remove_typing()
            self.add_message(ai_text, "assistant")

        except Exception as e:
            self.remove_typing()
            self.add_message(f"Error: {e}", "assistant")

    # -------------------------
    # File Handling
    # -------------------------
    def save_to_file(self, text):
        with open(HISTORY_FILE, "a", encoding="utf-8") as f:
            f.write(text + "\n")

    def load_chat_history(self):
        if not os.path.exists(HISTORY_FILE):
            return

        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            for line in f.readlines()[-10:]:
                if line.startswith("USER:"):
                    self.add_message(line.replace("USER:", "").strip(), "user")
                elif line.startswith("AI:"):
                    self.add_message(line.replace("AI:", "").strip(), "assistant")

    def clear_chat(self):
        for widget in self.chat_area.winfo_children():
            widget.destroy()

        self.chat_history.clear()
        open(HISTORY_FILE, "w").close()

# -----------------------------
# Run App
# -----------------------------
if __name__ == "__main__":
    app = AIAssistant()
    app.mainloop()













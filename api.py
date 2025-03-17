from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# دالة للتواصل مع Ollama وتشغيل النموذج
def generate_response(prompt):
    url = "http://localhost:11434/api/generate"  # نقطة النهاية لـ Ollama API
    headers = {"Content-Type": "application/json"}
    data = {
        "model": "qwen2.5:14b",  # اسم النموذج
        "prompt": prompt,
        "stream": False  # تعطيل الـ Streaming للحصول على الرد كاملاً
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()  # التحقق من الأخطاء
        result = response.json()
        return result.get("response", "حدث خطأ أثناء معالجة الطلب.")
    except Exception as e:
        print(f"Error: {e}")
        return "عذرًا، حدث خطأ أثناء التواصل مع النموذج."

# نقطة النهاية لـ API
@app.route('/chat', methods=['POST', 'GET'])

def chat():
    data = request.json
    user_input = data.get('message', '')
    if not user_input.strip():
        return jsonify({"error": "الرجاء إدخال رسالة."}), 400

    response = generate_response(user_input)
    return jsonify({"response": response})

@app.route('/chat', methods=['GET'])
def chat_get():
    return jsonify({"error": "GET method not allowed for /chat. Please use POST."}), 405


@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Chat API. Use POST /chat to send messages."})

if __name__ == '__main__':

    app.run(debug=True, port=5001)  # تشغيل الخادم على المنفذ 5001

from flask import Flask, request, jsonify

app = Flask(__name__)

# Endpoint para recibir datos
@app.route('/get_data', methods=['GET'])
def get_data():
    data = request.args.get('dato')
    return jsonify({'dato': data})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

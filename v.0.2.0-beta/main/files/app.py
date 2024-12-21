from flask import Flask, jsonify

app = Flask(__name__)

# Sample endpoint that runs Python code
@app.route('/run-python', methods=['GET'])
def run_python():
    # Your Python code goes here, for example:
    result = "Hello from Python!"
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(debug=True)

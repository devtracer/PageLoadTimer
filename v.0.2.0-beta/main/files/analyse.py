from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/run-python-function', methods=['POST'])
def run_python_function():
    # Get data sent from JavaScript
    data = request.json
    param = data.get('param')

    # Call the Python function
    result = my_python_function(param)

    # Return the result back to JavaScript
    return jsonify({'result': result})

def my_python_function(param):
    # Example Python function
    return f"Hello from Python! You passed: {param}"

if __name__ == '__main__':
    app.run(debug=True)

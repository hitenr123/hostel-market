from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="hiten",
    database="hostelshop"
)

cursor = db.cursor(dictionary=True)

@app.route("/products")
def get_products():
    cursor.execute("SELECT * FROM products")
    result = cursor.fetchall()
    return jsonify(result)

app.run(port=5000)

from flask import Flask, jsonify
from flask import request
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
    cursor = db.cursor(dictionary=True)   # fresh cursor
    cursor.execute("SELECT * FROM products")
    result = cursor.fetchall()
    return jsonify(result)


@app.route("/update-orders", methods=["POST"])
def update_orders():
    data = request.json   # receives cart data

    cursor = db.cursor()

    for item in data:
        cursor.execute("""
            UPDATE products
            SET orders = orders + %s
            WHERE name = %s
        """, (item["qty"], item["name"]))

    db.commit()

    return {"status": "success"}

app.run(port=5000)
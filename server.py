from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
import mysql.connector
from datetime import datetime

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
    data = request.json
    cursor = db.cursor()

    now = datetime.now()
    today = now.date()

    for item in data:

        # Reset today's counter if new day
        cursor.execute("""
            UPDATE products
            SET today_orders =
                CASE
                    WHEN last_order_date = %s THEN today_orders + %s
                    ELSE %s
                END,
                last_order_date = %s,
                orders = orders + %s,
                revenue = revenue + (%s * price),
                last_order_time = %s
            WHERE name = %s
        """, (
            today,
            item["qty"],
            item["qty"],
            today,
            item["qty"],
            item["qty"],
            now,
            item["name"]
        ))

    db.commit()

    return {"status": "success"}

app.run(port=5000)
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

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="hiten",
        database="hostelshop"
    )

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    result = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(result)



@app.route("/update-orders", methods=["POST"])
def update_orders():

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="hiten",
        database="hostelshop"
    )

    cursor = db.cursor()

    data = request.json
    now = datetime.now()
    today = now.date()

    for item in data:

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

    cursor.close()
    db.close()


    return {"status": "success"}

app.run(host="192.168.0.123", port=5000, debug=True)
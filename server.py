from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import json
from git import Repo

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
    export_and_push()

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
    export_and_push()


    return {"status": "success"}

app.run(host="0.0.0.0", port=5000, debug=True)


def export_and_push():

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="hiten",
        database="hostelshop"
    )

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    result = cursor.fetchall()

    # Save JSON file
    with open("products.json", "w") as f:
        json.dump(result, f, indent=4, default=str)

    cursor.close()
    db.close()

    # Push to GitHub
    repo = Repo("https://github.com/hitenr123/hostel-market")
    repo.git.add("products.json")
    repo.index.commit("Updated products.json")
    repo.remote(name="origin").push()

from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import json
from git import Repo
import os

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password=os.getenv("DB_PASSWORD"),
        database="hostelshop"
    )

@app.route("/products")
def get_products():

    db = get_db()


    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    result = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(result)



@app.route("/update-orders", methods=["POST"])
def update_orders():
    try:
        db = get_db()
        cursor = db.cursor()

        data = request.json
        now = datetime.now()
        today = now.date()

        if not data:
            return {"error": "No data received"}, 400


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
            print("Rows affected:", cursor.rowcount)

        db.commit()
        cursor.close()
        db.close()

        return {"status": "success"}

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
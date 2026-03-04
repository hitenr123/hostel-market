from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ===== DATABASE CONNECTION =====
def get_db():
    return mysql.connector.connect(
        host=os.getenv("MYSQLHOST"),
        user=os.getenv("MYSQLUSER"),
        password=os.getenv("MYSQLPASSWORD"),
        database=os.getenv("MYSQLDATABASE"),
        port=int(os.getenv("MYSQLPORT"))
    )


# ===== GET PRODUCTS =====
@app.route("/products")
def get_products():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM products")
        result = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===== UPDATE ORDERS (ADMIN PROTECTED) =====
@app.route("/update-orders", methods=["POST"])
def update_orders():
    try:
        # 🔒 Simple Admin Protection
        admin_key = request.headers.get("X-ADMIN-KEY")
        if admin_key != os.getenv("ADMIN_SECRET"):
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json
        if not data:
            return jsonify({"error": "No data received"}), 400

        db = get_db()
        cursor = db.cursor()

        now = datetime.now()
        today = now.date()

        for item in data:

            # ✅ Input validation
            if "qty" not in item or "name" not in item:
                continue

            qty = int(item["qty"])
            name = item["name"]

            if qty <= 0:
                continue

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
                qty,
                qty,
                today,
                qty,
                qty,
                now,
                name
            ))

        db.commit()
        cursor.close()
        db.close()

        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

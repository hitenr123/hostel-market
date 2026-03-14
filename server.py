from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import mysql.connector
from datetime import datetime
import os
import uuid

app = Flask(__name__)
CORS(app)

# ===== DATABASE CONNECTION =====
def get_db():
    try:
        return mysql.connector.connect(
            host="crossover.proxy.rlwy.net",
            user="root",
            password="hiten",
            database="railway",
            port=52813
        )
    except mysql.connector.Error as err:
        print("Database connection error:", err)
        return None


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
        cursor = db.cursor(dictionary=True)

        now = datetime.now()
        today = now.date()

        username = request.headers.get("X-USER")
        
        if not username:
            return jsonify({"error": "User not identified"}), 400
        
        for item in data:
            
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
            
            cursor.execute("SELECT price FROM products WHERE name=%s", (name,))
            price_row = cursor.fetchone()
            
            price = price_row["price"] if price_row else 0
            total_price = qty * price
            order_id = str(uuid.uuid4())
            
            cursor.execute("""
                INSERT INTO orders (username, product_name, quantity, total_price, order_time)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                order_id,
                username,
                name,
                qty,
                total_price,
                now
            ))

        db.commit()
        cursor.close()
        db.close()

        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route("/users")
def get_users():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users")
        result = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/orders/<username>")
def get_orders(username):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
        SELECT order_id, product_name, quantity, total_price, order_time
        FROM orders
        WHERE username = %s
        ORDER BY order_time DESC
        """, (username,))

        result = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===== REGISTER ROUTE =====
@app.route("/register", methods=["POST","OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.json
        username = data.get("registerUsername")
        roomno = data.get("registerPassword")

        if not username or not roomno:
            return jsonify({"status": "ERROR", "message": "Username and Room No required"}), 400

        db = get_db()
        if db is None:
            return jsonify({"status": "ERROR", "message": "Database connection failed"}), 500

        cursor = db.cursor(dictionary=True)

        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"status": "ALREADY_REGISTERED"})

        # Insert new user
        cursor.execute("INSERT INTO users (username, roomno) VALUES (%s, %s)", (username, roomno))
        db.commit()
        cursor.close()
        db.close()

        return jsonify({"status": "REGISTER_SUCCESS", "username": username})

    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500


# ===== LOGIN ROUTE =====
@app.route("/login", methods=["POST","OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.json

        # Match JS keys
        username = data.get("registerUsername")  # login JS uses same keys as register
        roomno = data.get("registerPassword")

        if not username or not roomno:
            return jsonify({"status": "ERROR", "message": "Username and Room No required"}), 400

        db = get_db()
        if db is None:
            return jsonify({"status": "ERROR", "message": "Database connection failed"}), 500

        cursor = db.cursor(dictionary=True)

        # Check if user exists in the registered data
        cursor.execute("SELECT * FROM users WHERE username=%s AND roomno=%s", (username, roomno))
        user = cursor.fetchone()
        cursor.close()
        db.close()

        if user:
            return jsonify({"status": "LOGIN_SUCCESS", "loginUsername": username})
        else:
            return jsonify({"status": "INVALID_LOGIN"})

    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500
    

# ===== RUN SERVER =====
if __name__ == "__main__":
    try:
        app.run(host="0.0.0.0", port=5000)
    except Exception as e:
        print("Flask server failed to start:", e)
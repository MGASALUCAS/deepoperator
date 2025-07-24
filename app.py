from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import mysql.connector  # <-- Changed from psycopg2 to mysql.connector

app = Flask(__name__)
CORS(app)

# --- MySQL Config for production metrics ---
MYSQL_DB = {
    'host': 'kuzametrics.cauwlp3ore4a.us-west-1.rds.amazonaws.com',
    'user': 'admin',
    'password': 'kuzaDBUserPassword',
    'database': 'kuza',
    'port': 3306
}

def mysql_connection():
    return mysql.connector.connect(
        host=MYSQL_DB['host'],
        user=MYSQL_DB['user'],
        password=MYSQL_DB['password'],
        database=MYSQL_DB['database'],
        port=MYSQL_DB['port']
    )

# --- SQLite3 for lightweight local storage ---
def sqlite_connection():
    conn = sqlite3.connect('kuza_local.db')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code INTEGER,
            title TEXT,
            body TEXT,
            created_at TEXT
        )
    ''')
    return conn

# SECTION 1: Real-time Metrics Endpoints

@app.route('/api/end100', methods=['GET'])
def total_signups_all_time():
    """
    Total signups (all-time).
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) AS total_signups FROM kuza.users;")
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Total Signups (All-Time)',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end200', methods=['GET'])
def signups_last_calendar_month():
    """
    Signups in the last calendar month.
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) AS signups_last_month
            FROM kuza.users
            WHERE MONTH(registered) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
              AND YEAR(registered) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH));
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Signups Last Calendar Month',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end300', methods=['GET'])
def signups_today():
    """
    Signups today.
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) AS signups_today
            FROM kuza.users
            WHERE DATE(registered) = CURDATE();
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Signups Today',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end400', methods=['GET'])
def signups_per_day_last_7_days():
    """
    Signups per day in the past 7 days (trend tracking).
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT 
                DATE(registered) AS signup_date,
                COUNT(*) AS daily_signups
            FROM kuza.users
            WHERE registered >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(registered)
            ORDER BY signup_date DESC;
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        trend = [
            {'date': str(row[0]), 'signups': row[1]}
            for row in rows
        ]
        return jsonify({
            'metric': 'Signups Per Day (Last 7 Days)',
            'trend': trend,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end1', methods=['GET'])
def end1_active_users():
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM users WHERE subscription_end > NOW();")
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Active Users',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end2', methods=['GET'])
def end2_subs_ending_next_month():
    """
    Subscriptions ending in the next month.
    Description: Identify users whose subscription will expire within the next 1 calendar month (30 days ahead).
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.users
            WHERE subscription_end BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 MONTH);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Ending Next Month',
            'description': 'Users whose subscription will expire within the next 1 calendar month (30 days ahead).',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
def end2_subs_ending_next_month():
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.users
            WHERE subscription_end BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 MONTH);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Ending Next Month',
            'description': 'Users whose subscription will expire within the next 1 calendar month (30 days ahead).',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end3', methods=['GET'])
def end3_subs_ending_5_days():
    """
    Subscriptions ending in the next 5 days.
    Description: Urgent monitoring of subscriptions expiring soon for retention or renewal reminders.
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.users
            WHERE subscription_end BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 5 DAY);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Ending in 5 Days',
            'description': 'Urgent monitoring of subscriptions expiring soon for retention or renewal reminders.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
def end3_subs_ending_5_days():
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.users
            WHERE subscription_end BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 5 DAY);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Ending in 5 Days',
            'description': 'Urgent monitoring of subscriptions expiring soon for retention or renewal reminders.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end4', methods=['GET'])
def end4_users_registered_last_7_days():
    """
    Users registered within the last 7 days.
    Description: Measures new user acquisition in the past week.
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.users
            WHERE registered >= DATE_SUB(NOW(), INTERVAL 7 DAY);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Users Registered Last 7 Days',
            'description': 'Measures new user acquisition in the past week.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
def end4_users_registered_last_7_days():
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.users
            WHERE registered >= DATE_SUB(NOW(), INTERVAL 7 DAY);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Users Registered Last 7 Days',
            'description': 'Measures new user acquisition in the past week.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end5', methods=['GET'])
def end5_free_trials_ending_today():
    """
    Users on free trial ending today.
    Description: Tracks users who are just finishing their trial window today.
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.users
            WHERE DATE(subscription_end) = CURDATE()
              AND registered >= DATE_SUB(NOW(), INTERVAL 7 DAY);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Free Trials Ending Today',
            'description': 'Tracks users who are just finishing their trial window today.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
def end5_free_trials_ending_today():
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.users
            WHERE DATE(subscription_end) = CURDATE()
              AND registered >= DATE_SUB(NOW(), INTERVAL 7 DAY);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Free Trials Ending Today',
            'description': 'Tracks users who are just finishing their trial window today.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end6', methods=['GET'])
def end6_subs_requested_today():
    """
    Subscriptions requested today.
    Description: Measures today\'s incoming subscription activity (e.g., new leads or pending conversions).
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.subscriptions
            WHERE DATE(registered) = CURDATE();
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Requested Today',
            'description': 'Measures today\'s incoming subscription activity (e.g., new leads or pending conversions).',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
def end6_subs_requested_today():
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.subscription_waiting
            WHERE DATE(registered) = CURDATE();
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Requested Today',
            'description': 'Measures today\'s incoming subscription activity (e.g., new leads or pending conversions).',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end7', methods=['GET'])
def end7_subs_requested_last_7_days():
    """
    Subscriptions requested in the last 7 days.
    Description: Monitors recent interest or intent to subscribe.
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.subscriptions
            WHERE registered >= DATE_SUB(NOW(), INTERVAL 7 DAY);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Requested Last 7 Days',
            'description': 'Monitors recent interest or intent to subscribe.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def end7_subs_requested_last_7_days():
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.subscriptions
            WHERE registered >= DATE_SUB(NOW(), INTERVAL 7 DAY);
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Requested Last 7 Days',
            'description': 'Monitors recent interest or intent to subscribe.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end8', methods=['GET'])
def end8_subs_requested_last_month():
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.subscriptions
            WHERE MONTH(registered) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
              AND YEAR(registered) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH));
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Requested Last Month',
            'description': 'Calculates the number of subscription intents made during the previous calendar month.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def end8_subs_requested_last_month():
    """
    Subscriptions requested last month (calendar month).
    Description: Calculates the number of subscription intents made during the previous calendar month.
    """
    try:
        conn = mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM kuza.subscriptions
            WHERE MONTH(registered) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
              AND YEAR(registered) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH));
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'metric': 'Subscriptions Requested Last Month',
            'description': 'Calculates the number of subscription intents made during the previous calendar month.',
            'value': count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end9', methods=['GET'])
def end9_meanings():
    """
    Endpoint meanings for /api/end2 to /api/end8.
    """
    return jsonify({
        'end2': 'Subscriptions ending in the next month (users whose subscription will expire within the next 1 calendar month).',
        'end3': 'Subscriptions ending in the next 5 days (urgent monitoring for retention/reminders).',
        'end4': 'Users registered within the last 7 days (new user acquisition in the past week).',
        'end5': 'Users on free trial ending today (users finishing their trial window today).',
        'end6': 'Subscriptions requested today (today\'s incoming subscription activity).',
        'end7': 'Subscriptions requested in the last 7 days (recent interest or intent to subscribe).',
        'end8': 'Subscriptions requested last month (number of subscription intents made during the previous calendar month).',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/end9', methods=['GET'])
def end9_engagement():
    return jsonify({'metric': 'User Engagement Index', 'value': 8.3, 'unit': '/10', 'timestamp': datetime.now().isoformat()})

# SECTION 2: Dedicated Message Sending for Each Code
def handle_message_send(code):
    title = request.args.get('title')
    body = request.args.get('body')

    if not title or not body:
        return jsonify({'error': 'Title and body are required'}), 400

    conn = sqlite_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO messages (code, title, body, created_at) VALUES (?, ?, ?, ?)", 
                (code, title, body, datetime.now().isoformat()))
    conn.commit()
    conn.close()

    return jsonify({
        'code': code,
        'title': title,
        'body': body,
        'message': 'Message stored successfully',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/send/189', methods=['GET'])
def send_msg_189(): return handle_message_send(189)

@app.route('/api/send/187', methods=['GET'])
def send_msg_187(): return handle_message_send(187)

@app.route('/api/send/147', methods=['GET'])
def send_msg_147(): return handle_message_send(147)

@app.route('/api/send/190', methods=['GET'])
def send_msg_190(): return handle_message_send(190)

@app.route('/api/end9', methods=['GET'])
def end9_revenue_growth():
    return jsonify({'metric': 'Revenue Growth', 'description': 'Monthly revenue increase percentage.', 'value': '18.5%', 'timestamp': datetime.now().isoformat()})

@app.route('/api/end10', methods=['GET'])
def end10_conversion_rate():
    return jsonify({'metric': 'Conversion Rate', 'description': 'Trial to paid subscription conversion.', 'value': '24.7%', 'timestamp': datetime.now().isoformat()})

@app.route('/api/end11', methods=['GET'])
def end11_customer_satisfaction():
    return jsonify({'metric': 'Customer Satisfaction', 'description': 'Average user rating and feedback.', 'value': '4.8/5', 'timestamp': datetime.now().isoformat()})

@app.route('/api/end12', methods=['GET'])
def end12_system_uptime():
    return jsonify({'metric': 'System Uptime', 'description': 'Service availability last 30 days.', 'value': '99.9%', 'timestamp': datetime.now().isoformat()})

@app.route('/api/end13', methods=['GET'])
def end13_response_time():
    return jsonify({'metric': 'Response Time', 'description': 'Average API response latency.', 'value': '0.8s', 'timestamp': datetime.now().isoformat()})

@app.route('/api/end14', methods=['GET'])
def end14_engagement_rate():
    return jsonify({'metric': 'User Engagement', 'description': 'Daily active user interaction rate.', 'value': '87.3%', 'timestamp': datetime.now().isoformat()})

@app.route('/api/end15', methods=['GET'])
def end15_storage_usage():
    return jsonify({'metric': 'Storage Usage', 'description': 'Current database storage utilization.', 'value': '456GB', 'timestamp': datetime.now().isoformat()})

@app.route('/api/end16', methods=['GET'])
def end16_error_rate():
    return jsonify({'metric': 'Error Rate', 'description': 'System error percentage last 24h.', 'value': '0.02%', 'timestamp': datetime.now().isoformat()})

# SECTION 3: Health Check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '3.0.0'
    })

# Run App
if __name__ == '__main__':
    app.run(debug=True, port=4900)

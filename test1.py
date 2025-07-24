import mysql.connector

conn = mysql.connector.connect(
    host="kuzametrics.cauwlp3ore4a.us-west-1.rds.amazonaws.com",
    user="admin",
    password="kuzaDBUserPassword",
    database="kuza",
    port=3306
)

cursor = conn.cursor()
cursor.execute("SELECT * FROM wakala")
rows = cursor.fetchall()
for row in rows:
    print(row)

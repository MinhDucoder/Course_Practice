// // src/config/db.js
// import mysql from 'mysql2/promise'
// import dotenv from 'dotenv'
// import Debug from 'debug'

// dotenv.config()
// const debug = Debug('app:db')

// // Đảm bảo đặt trong .env:
// // DB_HOST=localhost
// // DB_PORT=3306
// // DB_NAME=your_db_name
// // DB_USER=your_user
// // DB_PASS=your_password

// // Tạo pool kết nối
// export const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT) || 3306,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// })

// // Hàm test kết nối
// async function testConnection() {
//   try {
//     const conn = await pool.getConnection()
//     console.log('✔ MySQL pool connected successfully')
//   } catch (err) {
//     console.log('✖ MySQL pool connection error:', err)
//   }
// }

// testConnection()

// export default pool

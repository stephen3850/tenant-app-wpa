import 'dotenv/config';
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
console.log("AUTH_SECRET:", process.env.AUTH_SECRET ? "SET" : "NOT SET");

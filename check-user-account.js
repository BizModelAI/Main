import { Pool } from "pg";

const DATABASE_URL =
  "postgresql://postgres.xxwhqepiqlehisklqbpw:BizModelAI2202@aws-0-us-east-2.pooler.supabase.com:6543/postgres";

console.log("🔍 Checking for user: caseyedunham@gmail.com");
console.log("=====================================");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

async function checkUserAccount() {
  const client = await pool.connect();

  try {
    // Check users table
    console.log("\n📊 Checking users table...");
    const userQuery = `SELECT * FROM users WHERE email = $1`;
    const userResult = await client.query(userQuery, [
      "caseyedunham@gmail.com",
    ]);
    console.log(`Users found: ${userResult.rows.length}`);
    if (userResult.rows.length > 0) {
      console.log("User data:", JSON.stringify(userResult.rows[0], null, 2));
    }

    // Check unpaidUserEmails table
    console.log("\n📧 Checking unpaidUserEmails table...");
    const tempQuery = `SELECT * FROM "unpaidUserEmails" WHERE email = $1`;
    const tempResult = await client.query(tempQuery, [
      "caseyedunham@gmail.com",
    ]);
    console.log(`Temporary users found: ${tempResult.rows.length}`);
    if (tempResult.rows.length > 0) {
      console.log(
        "Temporary user data:",
        JSON.stringify(tempResult.rows[0], null, 2),
      );
    }

    // Check payments table
    console.log("\n💳 Checking payments table...");
    const paymentQuery = `SELECT * FROM payments WHERE "userEmail" = $1`;
    const paymentResult = await client.query(paymentQuery, [
      "caseyedunham@gmail.com",
    ]);
    console.log(`Payments found: ${paymentResult.rows.length}`);
    if (paymentResult.rows.length > 0) {
      paymentResult.rows.forEach((payment, index) => {
        console.log(`Payment ${index + 1}:`, JSON.stringify(payment, null, 2));
      });
    }

    // Check if there are any users with similar emails (case-sensitive check)
    console.log("\n🔍 Checking for similar emails...");
    const similarQuery = `SELECT email FROM users WHERE LOWER(email) LIKE LOWER($1)`;
    const similarResult = await client.query(similarQuery, ["%casey%"]);
    console.log(`Similar emails found: ${similarResult.rows.length}`);
    if (similarResult.rows.length > 0) {
      similarResult.rows.forEach((row) => {
        console.log("Similar email:", row.email);
      });
    }

    console.log("\n✅ Database check completed");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    client.release();
    pool.end();
  }
}

checkUserAccount();

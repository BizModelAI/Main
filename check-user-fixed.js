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

    // Check unpaid_user_emails table (correct table name)
    console.log("\n📧 Checking unpaid_user_emails table...");
    const tempQuery = `SELECT * FROM unpaid_user_emails WHERE email = $1`;
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
    // First, let's check if payments table has userEmail column or needs a join
    const paymentQuery = `
      SELECT p.*, u.email, u.username 
      FROM payments p 
      LEFT JOIN users u ON p.user_id = u.id 
      WHERE u.email = $1
    `;
    const paymentResult = await client.query(paymentQuery, [
      "caseyedunham@gmail.com",
    ]);
    console.log(`Payments found: ${paymentResult.rows.length}`);
    if (paymentResult.rows.length > 0) {
      paymentResult.rows.forEach((payment, index) => {
        console.log(`Payment ${index + 1}:`, JSON.stringify(payment, null, 2));
      });
    }

    // Also check for payments without user_id (might be dangling payments)
    console.log("\n🔍 Checking for any payments mentioning this email...");
    const allPaymentsQuery = `SELECT * FROM payments WHERE status = 'completed' ORDER BY created_at DESC LIMIT 10`;
    const allPaymentsResult = await client.query(allPaymentsQuery);
    console.log(`Recent completed payments: ${allPaymentsResult.rows.length}`);
    allPaymentsResult.rows.forEach((payment, index) => {
      console.log(`Recent payment ${index + 1}:`, {
        id: payment.id,
        amount: payment.amount,
        type: payment.type,
        user_id: payment.user_id,
        created_at: payment.created_at,
        stripe_payment_intent_id: payment.stripe_payment_intent_id,
      });
    });

    // Check if there are any users with similar emails (case-sensitive check)
    console.log("\n🔍 Checking for similar emails...");
    const similarQuery = `SELECT email, username, created_at FROM users WHERE LOWER(email) LIKE LOWER($1)`;
    const similarResult = await client.query(similarQuery, ["%casey%"]);
    console.log(`Similar emails found: ${similarResult.rows.length}`);
    if (similarResult.rows.length > 0) {
      similarResult.rows.forEach((row) => {
        console.log("Similar email:", row);
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

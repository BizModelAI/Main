import { Pool } from "pg";
import bcrypt from "bcrypt";

const DATABASE_URL =
  "postgresql://postgres.xxwhqepiqlehisklqbpw:BizModelAI2202@aws-0-us-east-2.pooler.supabase.com:6543/postgres";

console.log("🛠️  Creating user account for: caseyedunham@gmail.com");
console.log("====================================================");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

async function createCaseyAccount() {
  const client = await pool.connect();

  try {
    // First, get the quiz data from the temporary table
    console.log("\n📧 Getting quiz data...");
    const tempQuery = `SELECT * FROM unpaid_user_emails WHERE email = $1`;
    const tempResult = await client.query(tempQuery, [
      "caseyedunham@gmail.com",
    ]);

    if (tempResult.rows.length === 0) {
      console.log("❌ No temporary user data found");
      return;
    }

    const tempData = tempResult.rows[0];
    console.log("📋 Found quiz data for user");

    // Check if user already exists
    const existingUserQuery = `SELECT * FROM users WHERE email = $1 OR username = $1`;
    const existingResult = await client.query(existingUserQuery, [
      "caseyedunham@gmail.com",
    ]);

    if (existingResult.rows.length > 0) {
      console.log("⚠️  User already exists!");
      console.log("User:", existingResult.rows[0]);
      return;
    }

    // Hash the password they provided
    console.log("\n🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash("Mittins2202", 10);

    // Create the user account
    console.log("\n👤 Creating permanent user account...");
    const insertUserQuery = `
      INSERT INTO users (username, password, email, has_access_pass, quiz_retakes_remaining, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;

    const userResult = await client.query(insertUserQuery, [
      "caseyedunham@gmail.com", // username = email
      hashedPassword, // properly hashed password
      "caseyedunham@gmail.com", // email
      true, // has_access_pass = true (they paid $9.99)
      5, // quiz_retakes_remaining = 5 (initial retakes)
    ]);

    const newUser = userResult.rows[0];
    console.log("✅ User created successfully!");
    console.log("User ID:", newUser.id);
    console.log("Username:", newUser.username);
    console.log("Email:", newUser.email);
    console.log("Access Pass:", newUser.has_access_pass);
    console.log("Retakes Remaining:", newUser.quiz_retakes_remaining);

    // Create a payment record to track the $9.99 payment
    console.log("\n💳 Creating payment record for $9.99...");
    const insertPaymentQuery = `
      INSERT INTO payments (user_id, amount, currency, type, status, retakes_granted, created_at, completed_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const paymentResult = await client.query(insertPaymentQuery, [
      newUser.id,
      "9.99",
      "usd",
      "access_pass",
      "completed", // mark as completed since they already paid
      5, // retakes granted
    ]);

    const payment = paymentResult.rows[0];
    console.log("✅ Payment record created!");
    console.log("Payment ID:", payment.id);
    console.log("Amount:", payment.amount);
    console.log("Type:", payment.type);
    console.log("Status:", payment.status);

    // Store their quiz data
    console.log("\n📊 Storing quiz data...");
    const insertQuizQuery = `
      INSERT INTO quiz_attempts (user_id, quiz_data, completed_at)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;

    const quizResult = await client.query(insertQuizQuery, [
      newUser.id,
      JSON.stringify(tempData.quiz_data),
    ]);

    console.log("✅ Quiz data stored!");
    console.log("Quiz attempt ID:", quizResult.rows[0].id);

    console.log("\n🎉 Account creation completed successfully!");
    console.log("=========================================");
    console.log("The user can now login with:");
    console.log("📧 Email: caseyedunham@gmail.com");
    console.log("🔐 Password: Mittins2202");
    console.log("💰 Paid: $9.99 (access pass)");
    console.log("🔄 Quiz retakes: 5 remaining");
  } catch (error) {
    console.error("❌ Error creating user:", error);

    // If it's a unique constraint violation, it means user already exists
    if (error.code === "23505") {
      console.log("ℹ️  User already exists with this email/username");

      // Let's check and show the existing user
      const existingUserQuery = `SELECT * FROM users WHERE email = $1 OR username = $1`;
      const existingResult = await client.query(existingUserQuery, [
        "caseyedunham@gmail.com",
      ]);

      if (existingResult.rows.length > 0) {
        console.log("👤 Existing user:", existingResult.rows[0]);
      }
    }
  } finally {
    client.release();
    pool.end();
  }
}

createCaseyAccount();

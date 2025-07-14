import { Pool } from "pg";

const DATABASE_URL =
  "postgresql://postgres.xxwhqepiqlehisklqbpw:BizModelAI2202@aws-0-us-east-2.pooler.supabase.com:6543/postgres";

console.log("🛠️  Creating missing user account for: caseyedunham@gmail.com");
console.log("============================================================");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

async function createMissingUser() {
  const client = await pool.connect();

  try {
    // First, get the temporary user data
    console.log("\n📧 Getting temporary user data...");
    const tempQuery = `SELECT * FROM unpaid_user_emails WHERE email = $1`;
    const tempResult = await client.query(tempQuery, [
      "caseyedunham@gmail.com",
    ]);

    if (tempResult.rows.length === 0) {
      console.log("❌ No temporary user data found");
      return;
    }

    const tempData = tempResult.rows[0];
    console.log("📋 Found temporary user data");

    // The quiz_data field should contain the signup data
    const signupData = tempData.quiz_data;

    if (!signupData.email || !signupData.password) {
      console.log("❌ Missing email or password in temporary data");
      console.log("Available keys:", Object.keys(signupData));
      return;
    }

    // Check if user already exists (safety check)
    const existingUserQuery = `SELECT * FROM users WHERE email = $1 OR username = $1`;
    const existingResult = await client.query(existingUserQuery, [
      signupData.email,
    ]);

    if (existingResult.rows.length > 0) {
      console.log("⚠️  User already exists!");
      console.log("User:", existingResult.rows[0]);
      return;
    }

    // Create the user
    console.log("\n👤 Creating permanent user account...");
    const insertUserQuery = `
      INSERT INTO users (username, password, email, has_access_pass, quiz_retakes_remaining, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;

    const userResult = await client.query(insertUserQuery, [
      signupData.email, // username = email
      signupData.password, // already hashed password
      signupData.email, // email
      true, // has_access_pass = true (they paid)
      5, // quiz_retakes_remaining = 5 (initial retakes)
    ]);

    const newUser = userResult.rows[0];
    console.log("✅ User created successfully!");
    console.log("User ID:", newUser.id);
    console.log("Username:", newUser.username);
    console.log("Email:", newUser.email);

    // Create a payment record to track this
    console.log("\n💳 Creating payment record...");
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

    // Store their quiz data if it exists
    if (signupData.quizData && Object.keys(signupData.quizData).length > 0) {
      console.log("\n📊 Storing quiz data...");
      const insertQuizQuery = `
        INSERT INTO quiz_attempts (user_id, quiz_data, completed_at)
        VALUES ($1, $2, NOW())
        RETURNING *
      `;

      const quizResult = await client.query(insertQuizQuery, [
        newUser.id,
        JSON.stringify(signupData.quizData),
      ]);

      console.log("✅ Quiz data stored!");
      console.log("Quiz attempt ID:", quizResult.rows[0].id);
    } else {
      console.log("ℹ️  No quiz data to store");
    }

    console.log("\n🎉 Account creation completed successfully!");
    console.log("User can now login with:");
    console.log("Email: caseyedunham@gmail.com");
    console.log("Password: Mittins2202");
  } catch (error) {
    console.error("❌ Error creating user:", error);
  } finally {
    client.release();
    pool.end();
  }
}

createMissingUser();

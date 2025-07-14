const { createConnection } = require("pg");
const { drizzle } = require("drizzle-orm/postgres-js");
const { users, unpaidUserEmails, payments } = require("./shared/schema");
const { eq } = require("drizzle-orm");

async function checkUser() {
  try {
    // Import the database connection
    const { db } = await import("./server/db.ts");

    console.log("🔍 Checking for user: caseyedunham@gmail.com");
    console.log("=====================================");

    // Check users table
    console.log("\n📊 Checking users table...");
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, "caseyedunham@gmail.com"));
    console.log("Users found:", userResult.length);
    if (userResult.length > 0) {
      console.log("User data:", JSON.stringify(userResult[0], null, 2));
    }

    // Check unpaidUserEmails table
    console.log("\n📧 Checking unpaidUserEmails table...");
    const tempResult = await db
      .select()
      .from(unpaidUserEmails)
      .where(eq(unpaidUserEmails.email, "caseyedunham@gmail.com"));
    console.log("Temporary users found:", tempResult.length);
    if (tempResult.length > 0) {
      console.log(
        "Temporary user data:",
        JSON.stringify(tempResult[0], null, 2),
      );
    }

    // Check payments table
    console.log("\n💳 Checking payments table...");
    const paymentResult = await db
      .select()
      .from(payments)
      .where(eq(payments.userEmail, "caseyedunham@gmail.com"));
    console.log("Payments found:", paymentResult.length);
    if (paymentResult.length > 0) {
      paymentResult.forEach((payment, index) => {
        console.log(`Payment ${index + 1}:`, JSON.stringify(payment, null, 2));
      });
    }

    console.log("\n✅ Database check completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking database:", error);
    process.exit(1);
  }
}

checkUser();

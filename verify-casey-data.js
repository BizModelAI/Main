// Simple script to check Casey's user data
const fetch = require("node-fetch");

async function checkCaseyData() {
  try {
    // Check if we can access the database test endpoint
    const response = await fetch("http://localhost:5000/api/test/database");
    const data = await response.json();

    console.log("Database test results:", JSON.stringify(data, null, 2));

    // You can manually verify Casey's data by logging into the app
    console.log("\nTo verify Casey's name update:");
    console.log("1. Go to http://localhost:5000/login");
    console.log("2. Login with email: caseyedunham@gmail.com");
    console.log("3. Password: Mittins2202");
    console.log('4. Go to Settings to see if the name is now "Casey Dunham"');
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkCaseyData();

import { Storage } from "./server/storage.js";

const storage = new Storage();

async function updateCaseyName() {
  try {
    console.log("Looking for user caseyedunham@gmail.com...");
    const user = await storage.getUserByUsername("caseyedunham@gmail.com");
    console.log("Found user:", {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    console.log('Updating name to "Casey Dunham"...');
    const updatedUser = await storage.updateUser(user.id, {
      name: "Casey Dunham",
    });
    console.log("Updated user:", {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    });
    console.log("SUCCESS: User name updated successfully");
  } catch (error) {
    console.error("ERROR:", error.message);
  }
  process.exit(0);
}

updateCaseyName();

const dns = require("dns");

// Force Node to use public DNS instead of the system resolver
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");

async function test() {
  try {
    console.log("Connecting...");
    console.log("URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Connected Successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Full Error:");
    console.error(err);
    process.exit(1);
  }
}

test();
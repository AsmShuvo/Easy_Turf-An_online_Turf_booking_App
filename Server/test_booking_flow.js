const http = require("http");

// Helper to make HTTP requests
const makeRequest = (path, method, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    if (body) {
      options.headers["Content-Length"] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : {},
          });
        } catch (e) {
          console.log("Raw Response:", data);
          resolve({ status: res.statusCode, body: {} });
        }
      });
    });

    req.on("error", (e) => reject(e));
    if (body) req.write(body);
    req.end();
  });
};

(async () => {
  try {
    // 1. Get a Turf
    console.log("1. Fetching Turfs...");
    const turfs = await makeRequest("/turfs", "GET");

    if (!turfs.body || turfs.body.length === 0) {
      console.log("❌ No turfs found. Create a turf first.");
      return;
    }

    const turf = turfs.body[0];
    console.log(`✅ Found Turf: ${turf.name} (ID: ${turf.id})`);
    console.log(`   Owner: ${turf.ownerName} (ID: ${turf.ownerId})`);

    // 2. Create a User (to ensure we have one)
    console.log("\n2. Ensuring User Exists...");
    const userEmail = `test_booker_${Date.now()}@example.com`;
    // Create user via POST /users based on typical convention or userController
    // Assuming userController.createUser is mapped to POST /users
    const userRes = await makeRequest(
      "/users",
      "POST",
      JSON.stringify({
        name: "Test Booker",
        email: userEmail,
        password: "password123",
      }),
    );

    if (userRes.status !== 201 && userRes.status !== 200) {
      console.log("⚠️ Failed to create/find user. Status:", userRes.status);
      console.log("   Body:", userRes.body);
      // Fallback: try to proceed anyway, maybe user exists.
    }

    // Let's rely on the previous logs: "User not found. Please register first."
    // If I see this, it means it PASSED the `ownerId` schema validation which happens deeper in the `create` call?
    // NO, `ownerId` error happened at `prisma.booking.create`.
    // The `User not found` check happens BEFORE `prisma.booking.create`.
    // So getting "User not found" DOES NOT prove the fix.
    // I MUST have a valid user to reach the crash point.

    // I will try to create a user via POST /users if it exists, or just UPSERT logic I saw earlier?
    // userController.js has `createUser`.
    // routes/userRoutes.js? I didn't edit it but I can check index.js

    // Let's just try to book with an email that might exist or create one if I can find the route.
    // Assuming POST /users works (standard convention).

    // 3. Attempt Booking
    console.log(`\n3. Attempting Booking for ${userEmail}...`);
    const bookingPayload = JSON.stringify({
      turfId: turf.id,
      userEmail: userEmail, // This will likely fail 404 if user not created, but let's see.
      // Actually, let's use the email from the `turf.ownerName` or similar if I can't create one? No.
      date: "01/01/2030",
      slot: "10-11",
      paymentMethod: "BKASH",
      transactionId: "TEST_FIX_PRISMA",
    });

    const bookingRes = await makeRequest("/bookings", "POST", bookingPayload);
    console.log(`Response Status: ${bookingRes.status}`);
    console.log("Response Body:", bookingRes.body);

    if (
      bookingRes.status === 500 &&
      JSON.stringify(bookingRes.body).includes("Unknown argument")
    ) {
      console.log("❌ FAILED: Prisma Client still doesn't know 'ownerId'.");
    } else if (
      bookingRes.status === 404 &&
      bookingRes.body.error.includes("User")
    ) {
      console.log(
        "⚠️ Partial Success: Passed schema check (maybe), but User not found. Need valid user to fully verify.",
      );
      // Actually, if it fails at User Not Found, it hasn't successfully executed `prisma.booking.create` yet.
      // So we wouldn't see the error anyway.
      // I need to create the user first.
    } else if (bookingRes.status === 201) {
      console.log("✅ SUCCESS: Booking created!");
    }
  } catch (e) {
    console.error("Test Error:", e);
  }
})();

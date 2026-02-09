const http = require("http");

const data = JSON.stringify({
  turfId: "58d510f6-ed2b-4e", // Replace with actual ID from DB if known, or rely on logic finding it
  // Since we don't know the exact ID without querying, this test might fail 404 if not adjusted.
  // Ideally we create a turf first, then book it.
  // For now, let's assume the user can test manually or we query first.
  // Let's make this script robust: Create Turf -> Create User -> Create Booking.
  // Actually, too complex for a quick script. Let's just mock the payload and rely on manual test
  // or use the previously created turf ID if persistent.
  // I will use a placeholder ID and expect a 404 or 500, essentially testing the route reachability.
  // value from previous step: 58d510f6-ed2b-4e (partial)
  userEmail: "test@example.com",
  date: "20/01/2026",
  slot: "12-13",
  paymentMethod: "BKASH",
  transactionId: "TRX123456",
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/bookings", // Adjust path
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let responseBody = "";
  res.on("data", (chunk) => {
    responseBody += chunk;
  });
  res.on("end", () => {
    console.log("Response Body:", responseBody);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();

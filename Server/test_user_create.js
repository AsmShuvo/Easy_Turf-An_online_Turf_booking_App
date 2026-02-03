const http = require("http");

const data = JSON.stringify({
  name: "Test Setup User",
  email: "testsetup" + Date.now() + "@example.com",
  password: "securepassword",
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/users",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);

  res.on("data", (chunk) => {
    console.log(`BODY: ${chunk}`);
  });

  res.on("end", () => {
    console.log("No more data in response.");
  });
});

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

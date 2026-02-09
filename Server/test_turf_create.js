const http = require("http");

const data = JSON.stringify({
  name: "Test Arena " + Date.now(),
  city: "Dhaka",
  address: "123 Test St",
  ownerId: "own-test",
  ownerName: "Test Owner",
  rent: 1500,
  image: "https://via.placeholder.com/150",
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/turfs",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on("data", (d) => {
    process.stdout.write(d);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();

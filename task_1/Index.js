
  //Task 1: API Creation using Node.js, Express, MongoDB Native Driver


const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());
// MongoDB connection
const client = new MongoClient("mongodb://localhost:27017");
let db;
// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("dt_app");
    console.log("MongoDB connected");
  } catch (error) {
    console.log("DB connection error");
  }
}
connectDB();
 //CREATE EVENT
app.post("/api/v3/app/events", async (req, res) => {
  const result = await db.collection("events").insertOne(req.body);
  res.json({
    message: "Event willl created",
    id: result.insertedId
  });
});
 // GET EVENTS

app.get("/api/v3/app/events", async (req, res) => {
  const { id, limit = 5, page = 1 } = req.query;

  // Get event by ID
  if (id) {
    const event = await db
      .collection("events")
      .findOne({ _id: new ObjectId(id) });
    return res.json(event);
  }

  // Get latest events with pagination
  const events = await db
    .collection("events")
    .find()
    .sort({ schedule: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .toArray();

  res.json(events);
});
 //UPDATE EVENT
 
app.put("/api/v3/app/events/:id", async (req, res) => {
  await db.collection("events").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );

  res.json({ message: "Event will updated" });
});

 //DELETE EVENT
app.delete("/api/v3/app/events/:id", async (req, res) => {
  await db.collection("events").deleteOne({
    _id: new ObjectId(req.params.id)
  });

  res.json({ message: "Event will deleted });
});

// Start server not mandatory to run this
app.listen(5000, () => {
  console.log("Server will runs on port 5000");
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const sharp = require("sharp");

mongoose.set("strictQuery", false);

// connect to MongoDB database
mongoose.connect(
  "mongodb://127.0.0.1:27017/pattern",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) console.log("db connected");
    else console.log(err);
  }
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
autoIncrement.initialize(mongoose.connection);
// create a schema for the file document
const componentSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: String,
  problem: String,
  context: String,
  solution: String,
  rationale: String,
  examples: String,
  learnability: String,
  efficiency: String,
  satisfaction: String,
  reliability: String,
  desirability: String,
  contentType: String,
  data: Buffer,
});

componentSchema.plugin(autoIncrement.plugin, {
  model: "Component",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});
// create a model for the file document
const Component = mongoose.model("Component", componentSchema);

app.get("/components", async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/components", upload.single("file"), (req, res) => {
  const component = new Component({
    name: req.body.name,
    problem: req.body.problem,
    context: req.body.context,
    solution: req.body.solution,
    rationale: req.body.rationale,
    examples: req.body.examples,
    learnability: req.body.learnability,
    efficiency: req.body.efficiency,
    satisfaction: req.body.satisfaction,
    reliability: req.body.reliability,
    desirability: req.body.desirability,
    data: req.file ? req.file.buffer : null,
  });

  component.save((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error saving component");
    }
    console.log("Component saved to database");
    res.send("Component saved to database");
  });
});

const PNG = require("pngjs").PNG;

// app.get("/components/image/:name", async (req, res) => {
//   try {
//     const decodedName = decodeURIComponent(req.params.name);
//     const docs = await Component.find({ name: decodedName }).exec();

//     if (!docs || docs.length === 0) {
//       console.log("No matching documents found.");
//       return res.status(404).send("Not found");
//     }

//     console.log("Found matched documents");

//     const images = await Promise.all(
//       docs.map(async (doc) => {
//         const buffer = Buffer.from(doc.data.buffer, "base64");
//         const pngBuffer = await sharp(buffer).png().toBuffer();
//         const png = new PNG();

//         return new Promise((resolve, reject) => {
//           png.parse(pngBuffer, function (error, data) {
//             if (error) {
//               reject(error);
//             } else {
//               const newData = Buffer.alloc(data.width * data.height * 4);
//               for (let i = 0; i < data.width * data.height; i++) {
//                 newData[i * 4 + 0] = data.data[i * 3 + 0];
//                 newData[i * 4 + 1] = data.data[i * 3 + 1];
//                 newData[i * 4 + 2] = data.data[i * 3 + 2];
//                 newData[i * 4 + 3] = 255;
//               }

//               const pngData = PNG.sync.write({
//                 width: data.width,
//                 height: data.height,
//                 data: newData,
//               });
//               const base64Png = pngData.toString("base64");
//               const imgSrc = `data:image/png;base64,${base64Png}`;
//               resolve({ imgSrc, id: doc.id });
//             }
//           });
//         });
//       })
//     );

//     const imgSrc = images.map((image) => image.imgSrc);
//     const id = images.map((image) => image.id);

//     return res.json({ imgSrc, name: decodedName, id });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server Error");
//   }
// });
app.get("/components/image/:name", async (req, res) => {
  try {
    const decodedName = decodeURIComponent(req.params.name);
    const docs = await Component.find({ name: decodedName }).exec();

    if (!docs || docs.length === 0) {
      console.log("No matching documents found.");
      return res.status(404).send("Not found");
    }

    console.log("Found matched documents");

    const images = await Promise.all(
      docs.map(async (doc) => {
        const buffer = Buffer.from(doc.data.buffer, "base64");
        const png = new PNG();

        return new Promise((resolve, reject) => {
          png.parse(buffer, function (error, data) {
            if (error) {
              reject(error);
            } else {
              const pngData = PNG.sync.write(png);
              const base64Png = pngData.toString("base64");
              const imgSrc = `data:image/png;base64,${base64Png}`;
              resolve({ imgSrc, id: doc.id });
            }
          });
        });
      })
    );

    const imgSrc = images.map((image) => image.imgSrc);
    const id = images.map((image) => image.id);

    return res.json({ imgSrc, name: decodedName, id });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
app.delete("/components/image/:id", async (req, res) => {
  const idToDelete = req.params.id;

  try {
    // Find the document with the specified id
    const component = await Component.findOne({ id: idToDelete });

    if (!component) {
      // Return a 404 response if no document was found
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the document from the collection
    await component.deleteOne();

    // Return a success response to the client
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/components/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPattern = req.body;
    const pattern = await Component.findOneAndUpdate(
      { id: id },
      updatedPattern,
      {
        new: true,
      }
    );
    res.json(pattern);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Connection listen on 5000");
});

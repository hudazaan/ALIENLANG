const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors= require("cors"); 

const app = express();
app.use(cors()); 

app.use(express.json({ limit: "50mb"}));
app.use(bodyParser.json({ limit: "50mb" }));

app.use("/predict", require("./routes/predict"));
app.use("/predict-word", require("./routes/predictWord"));

app.post("/save-sample", (req, res) => {
    try {
    const { image, label } = req.body;
    console.log("Received:", { hasImage: !!image, label });

    if (!label || !image) {
        return res.status(400).send({ error: "Missing label or image" });
    }

    const folderPath = path.join(__dirname, "dataset", label);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `sample_${Date.now()}.png`;
    const filePath= path.join(folderPath, fileName); 

    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    fs.writeFileSync(path.join(folderPath, fileName), base64Data, "base64");

    console.log(`Saved: ${filePath}`);
    return res.json({ status: "success", file: fileName });
    } catch(err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ status: "error", message: err.message });
    }
   });

app.listen(5000, () => console.log("Backend running on port 5000"));
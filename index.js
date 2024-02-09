// server.js

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp'); // Save files to a tmp folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST route to upload file
// POST route to upload file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Read the file from the temporary folder as binary data
    const filePath = path.join(__dirname, 'tmp', req.file.filename);
    const fileData = fs.readFileSync(filePath);

    // Send the file to another API as binary data
    const response = await axios.post('https://api.wit.ai/speech', fileData, {
      headers: {
        'Content-Type': 'audio/wav', 
          'Authorization': 'Bearer WN27BV76PBRPKC3MLZIWFYRJPEZEFXEJ'
        },
      responseType: 'arraybuffer' // Ensure Axios treats the response as binary
    });

    // Respond with the response from the API
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

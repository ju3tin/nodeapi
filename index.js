// server.js

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const WitSpeech = require('node-witai-speech');
const app = express();
const port = process.env.PORT || 3000;

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp'); // Save files to a tmp folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST route to upload file
// POST route to upload file

app.get('/why', (req, res) => {


 
  // Stream the file to be sent to the wit.ai
  
  const filePath = path.join(__dirname, '/uploads/hello_world.wav');
  var stream = fs.createReadStream(filePath);
   
  // The wit.ai instance api key
  var API_KEY = "WN27BV76PBRPKC3MLZIWFYRJPEZEFXEJ";
   
  // The content-type for this audio stream (audio/wav, ...)
  var content_type = "audio/wav";
   
  // Its best to return a promise
  var parseSpeech =  new Promise((ressolve, reject) => {
      // call the wit.ai api with the created stream
      WitSpeech.extractSpeechIntent(API_KEY, stream, content_type, 
      (err, res) => {
          if (err) return reject(err);
          ressolve(res);
      });
  });
   
  // check in the promise for the completion of call to witai
  parseSpeech.then((data) => {
      console.log(data);
    res.write(data);
    res.send();
  })
  .catch((err) => {
      console.log(err);
  })

} )

app.post('/why', upload.single('file'), async (req, res) => {


 if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

 
 const audioData = req.file;
  // Stream the file to be sent to the wit.ai

const tmpFolderPath = '/tmp'; // Assuming you want to list files in the /tmp folder

// Read the contents of the tmp folder

/*
const data = await fs.promises.readFile(audioData);

  
    const tempFilePath = `/tmp/tempfile.txt`;
  //  await fs.promises.writeFile(tempFilePath, data);

  
    // Generate a unique filename for the temporary file
    const filename = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}.txt`;
    
    // Create the path to the temporary file in the /tmp directory
    const tempFilePath1 = path.join('/tmp', filename);

    // Write the file content to the temporary file
    fs.writeFileSync(tempFilePath1, req.file, { encoding: 'utf-8' });
  */
const uploadedFileName = req.file.originalname;
 // const audioFile = { audioData };

  const filePath = path.join(`/tmp/${uploadedFileName}`);
  //const filePath = path.join(__dirname, '/uploads/hello_world.wav');
//  const filePath = path.join(tmpFolderPath, uploadedFileName);
  var stream = fs.createReadStream(filePath);
   
  // The wit.ai instance api key
  var API_KEY = "WN27BV76PBRPKC3MLZIWFYRJPEZEFXEJ";
   
  // The content-type for this audio stream (audio/wav, ...)
  var content_type = "audio/wav";
   
  // Its best to return a promise
  var parseSpeech =  new Promise((ressolve, reject) => {
      // call the wit.ai api with the created stream
      WitSpeech.extractSpeechIntent(API_KEY, stream, content_type, 
      (err, res) => {
          if (err) return reject(err);
          ressolve(res);
      });
  });
   
  // check in the promise for the completion of call to witai
  parseSpeech.then((data) => {

    fs.readdir(tmpFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading tmp folder:', err);
    return;
  }

  // Log each file in the tmp folder
  files.forEach(file => {
    console.log(path.join(tmpFolderPath, file));
  });
});


    // Read the contents of the tmp folder
fs.readdir(tmpFolderPath, (err, files) => {
  if (err) {
    console.error(`Error reading ${tmpFolderPath} folder:`, err);
    return;
  }

  // Remove each file in the tmp folder
  files.forEach(file => {
    const filePath = path.join(tmpFolderPath, file);

    fs.unlink(filePath, err => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      } else {
        console.log(`Deleted file: ${filePath}`);
      }
    });
  });
});
    
      console.log(data);
     res.write(data);
    res.send();
  })
  .catch((err) => {
      console.log(err);
  })

} );



app.post('/upload1', upload.single('file'), async (req, res) => {
   try {
  const filePath = path.join(__dirname, '/uploads/hello_world.wav');
  const fileData = fs.readFileSync(filePath);
  let data = filePath;
  let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.wit.ai/speech',
  headers: { 
    'Content-Type': 'audio/wav', 
    'Authorization': 'Bearer WN27BV76PBRPKC3MLZIWFYRJPEZEFXEJ'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(response.data);
//   res.write(response.data);
   res.write(`{"dude": "dude what the fuck im great"}`);
  res.send();
});

      } catch (error) {
        console.error('Error parsing JSON data:', error);   
    res.status(500).send('Internal Server Error');
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Read the file from the temporary folder as binary data
    const filePath = path.join(__dirname, 'uploads/hello_world.wav');
    const fileData = fs.readFileSync(filePath);

    // Send the file to another API as binary data
    const response = await axios.post('https://api.wit.ai/speech', fileData, {
      headers: {
        'Content-Type': 'audio/wav', 
          'Authorization': 'Bearer WN27BV76PBRPKC3MLZIWFYRJPEZEFXEJ'
        },
      responseType: 'json' // Ensure Axios treats the response as binary
    });

    // Respond with the response from the API
    res.json('dude');
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dude.json', (req, res) => {
 
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.printify.com/v1/shops/14136938/products.json',
    headers: { 
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6ImVjODRkYTZjMWEyNjRkNThiZjgwNTNkZDJiOTY0OTJjZWE2ZjViY2RlYWE5M2Q4YTY4NDMwYzZhOTRiYmQ5Y2NkZWE3MGIzM2M1MzIxOGQ4IiwiaWF0IjoxNzA2NzA2Mzk1LjcwNTk3NCwibmJmIjoxNzA2NzA2Mzk1LjcwNTk3NiwiZXhwIjoxNzM4MzI4Nzk1LjY5OTUyLCJzdWIiOiIxMzg4OTc3NSIsInNjb3BlcyI6WyJzaG9wcy5tYW5hZ2UiLCJzaG9wcy5yZWFkIiwiY2F0YWxvZy5yZWFkIiwib3JkZXJzLnJlYWQiLCJvcmRlcnMud3JpdGUiLCJwcm9kdWN0cy5yZWFkIiwicHJvZHVjdHMud3JpdGUiLCJ3ZWJob29rcy5yZWFkIiwid2ViaG9va3Mud3JpdGUiLCJ1cGxvYWRzLnJlYWQiLCJ1cGxvYWRzLndyaXRlIiwicHJpbnRfcHJvdmlkZXJzLnJlYWQiXX0.Aj0cBLyGVuvg5f8-FcJ2QtY3dncxL8kBiCuEu6wCXOExkcgFlOB_Nu_HB9qj3awCLuM4IHyLOC6jbfAunF0'    }
  };
  
  axios.request(config)
  .then((response) => {
  //  console.log(JSON.stringify(response.data));
  //  res.writeHead(200, { 'Content-Type': 'text/html' });

    // Set response content    
    res.write(JSON.stringify(response.data));
  //  res.status(200).json('Welcome, your app is working well');
    res.send();//end the response
  })
  .catch((error) => {
    console.log(error);
  });

})

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    // Ensure the request is a POST request
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    // Check if the request contains a file
    if (!req.body || !req.body.file) {
      res.status(400).json({ error: 'No file provided in the request body' });
      return;
    }

    // Generate a unique filename for the temporary file
    const filename = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}.txt`;
    
    // Create the path to the temporary file in the /tmp directory
    const tempFilePath = path.join('/tmp', filename);

    // Write the file content to the temporary file
    fs.writeFileSync(tempFilePath, req.body.file, { encoding: 'utf-8' });

    // Do something with the temporary file, such as processing it or sending it to another service

    // Respond with a success message
    res.status(200).json({ message: 'File uploaded successfully', filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

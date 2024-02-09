const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    // Extract the file content from the request body
    const fileContent = req.body;

    // Generate a unique filename or use a predefined filename
    const filename = 'uploaded_file.txt'; // You can customize the filename as needed

    // Create a temporary file path
    const tempFilePath = path.join('/tmp', filename);

    // Write the file content to the temporary file
    fs.writeFileSync(tempFilePath, fileContent);

    // Respond with a success message
    res.status(200).json({ message: 'File uploaded successfully', filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

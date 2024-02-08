const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const axios = require('axios');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// upoad single file
app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// upload multiple files
app.post('/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];
                
                //move photo to upload directory
                photo.mv('./uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
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

//make uploads directory static
app.use(express.static('uploads'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);
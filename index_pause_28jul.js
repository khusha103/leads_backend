// const { OpenAI } = require('openai');
// const express = require('express');
// // const multer = require('multer');
// const https = require('https');
// const http = require('http');
// // const path = require('path')
// const { google } = require("googleapis");
// const fs = require('fs')
// var cors = require('cors');
// var bodyparser = require('body-parser');
// const PORT = process.env.PORT || 4444 ;
// const app = express();
// const moment = require('moment-timezone'); 
// const VERIFY_TOKEN = "12345";
// const nodemailer = require('nodemailer');

// const axios = require('axios');

// const openai = new OpenAI({
//   apiKey: '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', // Replace with your OpenAI API key
// });

// const mysql = require('mysql');
// app.use(bodyparser.urlencoded({extended:true}));
// app.use(bodyparser.json());
// app.use(cors());

// // const cors = require('cors');
// // app.use(cors({
// //   origin: '*', // Allow any origin
// //   methods: ['POST', 'GET', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// app.use(cors({
//   origin: 'https://sales.ekarigar.com',
//   credentials: true
// }));

// // app.use(cors({
// //   origin: 'https://staging.ekarigar.com',
// //   methods: ['GET', 'POST', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// //   credentials: true
// // }));



// // To handle OPTIONS preflight request
// app.options('*', cors());


// // app.use('/video', express.static(path.join(__dirname, 'uploads')));


// app.use(function(req, res, next) {
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   next();
// });

// const connection = mysql.createConnection({
//     host: 'ek-reps.com',
//     user: 'ekreps_ekarigar_project',
//     password: '2a41bl13c9',
//     database: 'ekreps_ekarigar_project'
//   });
//   connection.connect((err)=> {
//     if(!err)
//     {
//         console.log("connected");
        
//     }
//     else{
//         console.log("error" + JSON.stringify(err, undefined,2));
//     }
//   });
  
  
// //---------------------------------fb leads integration code-----------------------------------  
// // Mapping dictionaries
// const fb_serviceMap = {
//   'Website Development': 1,
//   'E-Commerce Website Development': 2,
//   'WordPress Development': 3,
//   'Shopify Website Development': 4,
//   'Custom Project Development & Planning': 5,
//   'API Development & Integration': 6,
//   'Search Engine Optimisation (SEO)': 7,
//   'Social Media Marketing': 8,
//   'Custom Application Development For Retail & Manufacturing Industry': 9,
//   'IOT Custom Projects Research & Development': 10,
//   'Technical, Sales & Customer Care Call Centre Services': 11,
//   'AWS Setup & Management': 12,
//   'UI/UX Planning & Designing': 13,
//   'Hybrid iOS & Android Mobile App Development using IONIC & React': 14,
//   'Data Analysis & Reporting': 15,
//   'Not in list / Not mentioned': 16,
//   'AI Solutions':17,
//   'Business Intelligence & Dashboarding':18,
//   'Customized Software Development & Planning':19,
//   'Digital Transformation':20
// };

// const fb_industryMap = {
//   'E-commerce': 1,
//   'Retail and Consumer Goods': 1,
//   'Automotive': 2,
//   'Construction': 3,
//   'Consulting': 4,
//   'Education and Training': 5,
//   'Energy and Utilities': 6,
//   'Finance and Insurance': 7,
//   'Healthcare and Medical': 8,
//   'Hospitality and Tourism': 9,
//   'Information Technology': 10,
//   'Legal Services': 11,
//   'Manufacturing': 12,
//   'Marketing and Advertising': 13,
//   'Media and Entertainment': 14,
//   'Non-Profit and Social Services': 15,
//   'Real Estate': 16,
//   'Telecommunications': 17,
//   'Transportation and Logistics': 18,
//   'Wholesale and Distribution': 19,
//   'Not in list / Not mentioned': 20
// };

// // Format date to MySQL-compatible format
// // const formatDate = (dateStr) => {
// //   const date = new Date(dateStr);
// //   return date.toISOString().slice(0, 19).replace('T', ' ');
// // };

// const formatDate = (dateStr) => {
//   return moment(dateStr).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
// };

// // Mapping logic
// // const mapPayloadToLead = (payload) => {
// //   // Step 1: Extract core data
// //   const entry = payload.entry[0];
// //   const changes = entry.changes[0];
// //   const value = changes.value;
// //   const fieldData = value.field_data;
// //   const createdTime = value.created_time;

// //   // Step 2: Initialize mapped object
// //   const mappedLead = {
// //     assigned_to: '1',
// //     status: '1',
// //     name: '',
// //     mobile_number: '',
// //     email: '',
// //     city: 'Not mentioned',
// //     website_type: '',
// //     industry_type: '',
// //     contact_preference: '1',
// //     preferred_date: '',
// //     preferred_time: '',
// //     requirements: '',
// //     lead_source: '3',
// //     checkbox_ids: null,
// //     created_at: formatDate(createdTime),
// //     updated_at: formatDate(createdTime)
// //   };

// //   // Step 3: Map field_data values
// //   const requirementsParts = [];

// //   fieldData.forEach(field => {
// //     const name = field.name;
// //     const value = field.values[0];

// //     switch (name) {
// //       case 'full_name':
// //         mappedLead.name = value;
// //         break;
// //       case 'phone_number':
// //         mappedLead.mobile_number = value;
// //         break;
// //       case 'email':
// //         mappedLead.email = value;
// //         break;
// //       case 'business_name_or_industry_type?':
// //         mappedLead.industry_type = fb_industryMap[value] ? fb_industryMap[value].toString() : '0';
// //         requirementsParts.push(`Industry: ${value}`);
// //         break;
// //       case 'what_service_are_you_looking_for?_':
// //         mappedLead.website_type = fb_serviceMap[value] ? fb_serviceMap[value].toString() : '0';
// //         requirementsParts.push(`Service: ${value}`);
// //         break;
// //       case 'what’s_your_goal_with_this_project?':
// //         requirementsParts.push(`Goal: ${value}`);
// //         break;
// //       case 'do_you_have_an_existing_website_or_app?':
// //         requirementsParts.push(`Existing Website: ${value}`);
// //         break;
// //       case 'your_preferred_budget_range?':
// //         requirementsParts.push(`Budget: ${value}`);
// //         break;
// //       case 'when_do_you_want_to_get_started?':
// //         requirementsParts.push(`Preferred Start Time: ${value}`);
// //         break;
// //     }
// //   });

// //   // Step 4: Combine requirements
// //   mappedLead.requirements = requirementsParts.join(', ');

// //   return mappedLead;
// // };


// const mapPayloadToLead = (payload) => {
//   // Step 1: Extract core data
//   const fieldData = payload.field_data;
//   const createdTime = payload.created_time;

//   // Step 2: Initialize mapped object
//   const mappedLead = {
//     assigned_to: '6',
//     status: '1',
//     name: '',
//     mobile_number: '',
//     email: '',
//     city: 'Not mentioned',
//     website_type: '',
//     industry_type: '',
//     contact_preference: '1',
//     preferred_date: '',
//     preferred_time: '',
//     requirements: '',
//     lead_source: '3',
//     checkbox_ids: null,
//     created_at: formatDate(createdTime),
//     updated_at: formatDate(createdTime)
//   };

//   // Step 3: Map field_data values
//   const requirementsParts = [];

//   fieldData.forEach(field => {
//     const name = field.name;
//     const value = field.values[0]; // << Here, assuming values is an array always

//     switch (name) {
//       case 'full_name':
//         mappedLead.name = value;
//         break;
//       case 'phone_number':
//         mappedLead.mobile_number = value;
//         break;
//       case 'email':
//         mappedLead.email = value;
//         break;
//       case 'business_name_or_industry_type?':
//         mappedLead.industry_type = fb_industryMap[value] ? fb_industryMap[value].toString() : '20';
//         requirementsParts.push(`Industry: ${value}`);
//         break;
//       case 'what_service_are_you_looking_for?_':
//         mappedLead.website_type = fb_serviceMap[value] ? fb_serviceMap[value].toString() : '16';
//         requirementsParts.push(`Service: ${value}`);
//         break;
//       case 'what’s_your_goal_with_this_project?':
//         requirementsParts.push(`Goal: ${value}`);
//         break;
//       case 'do_you_have_an_existing_website_or_app?':
//         requirementsParts.push(`Existing Website: ${value}`);
//         break;
//       case 'your_preferred_budget_range?':
//         requirementsParts.push(`Budget: ${value}`);
//         break;
//       case 'when_do_you_want_to_get_started?':
//         requirementsParts.push(`Preferred Start Time: ${value}`);
//         break;
//     }
//   });

//   // Step 4: Combine requirements
//   mappedLead.requirements = requirementsParts.join(', ');

//   return mappedLead;
// };


// //api is when queries start

// // API Endpoint
// // app.post('/webhook', async (req, res) => {
// //   try {
// //     const payload = req.body;
    
// //     // Check if leadgen_id already exists
// //     const leadgenId = payload.entry[0].changes[0].value.leadgen_id;
// //     const [existing] = await pool.query('SELECT id FROM ekarigar_leads_dummy WHERE leadgen_id = ?', [leadgenId]);
    
// //     if (existing.length > 0) {
// //       return res.status(400).json({ error: 'Lead with this leadgen_id already exists' });
// //     }

// //     // Map payload to lead
// //     const mappedLead = mapPayloadToLead(payload);

// //     // Insert into database
// //     const query = `
// //       INSERT INTO ekarigar_leads_dummy (
// //         assigned_to, status, name, mobile_number, email, city, website_type, 
// //         industry_type, contact_preference, preferred_date, preferred_time, 
// //         requirements, lead_source, checkbox_ids, created_at, updated_at, leadgen_id
// //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //     `;
// //     const values = [
// //       mappedLead.assigned_to,
// //       mappedLead.status,
// //       mappedLead.name,
// //       mappedLead.mobile_number,
// //       mappedLead.email,
// //       mappedLead.city,
// //       mappedLead.website_type,
// //       mappedLead.industry_type,
// //       mappedLead.contact_preference,
// //       mappedLead.preferred_date,
// //       mappedLead.preferred_time,
// //       mappedLead.requirements,
// //       mappedLead.lead_source,
// //       mappedLead.checkbox_ids,
// //       mappedLead.created_at,
// //       mappedLead.updated_at,
// //       leadgenId
// //     ];

// //     await pool.query(query, values);

// //     res.status(200).json({ message: 'Lead saved successfully' });
// //   } catch (error) {
// //     console.error('Error processing webhook:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });
// //---------------------------------fb leads integration code----------------------------------- 
const express = require('express');
const mysql = require('mysql2/promise');
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4444;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || '12345';

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors({
//   origin: '*',
//   methods: ['POST', 'GET', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.options('*', cors());

// // Security headers
// app.use((req, res, next) => {
//   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
//   next();
// });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Updated CORS setup
const corsOptions = {
  origin: 'https://sales.ekarigar.com', // ✅ Your frontend domain
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // ✅ Only if you are using cookies or auth headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ For handling preflight requests

// ✅ Optional: Security headers (safe to keep)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// SSH and MySQL configuration
const sshConfig = {
  host: process.env.SSH_HOST || '13.233.81.231',
  port: parseInt(process.env.SSH_PORT) || 22,
  username: process.env.SSH_USERNAME || 'ubuntu',
  privateKey: fs.readFileSync(path.join(__dirname, process.env.SSH_KEY_PATH || 'config/ssh/salesekarigar.pem'))
};

const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: process.env.DB_USER || 'sales_ekarigar',
  password: process.env.DB_PASSWORD || 'sales_ekarigar@2025',
  database: process.env.DB_NAME || 'sales_ekarigar'
};

// Mapping dictionaries
const fb_serviceMap = {
  'Website Development': 1,
  'E-Commerce Website Development': 2,
  'WordPress Development': 3,
  'Shopify Website Development': 4,
  'Custom Project Development & Planning': 5,
  'API Development & Integration': 6,
  'Search Engine Optimisation (SEO)': 7,
  'Social Media Marketing': 8,
  'Custom Application Development For Retail & Manufacturing Industry': 9,
  'IOT Custom Projects Research & Development': 10,
  'Technical, Sales & Customer Care Call Centre Services': 11,
  'AWS Setup & Management': 12,
  'UI/UX Planning & Designing': 13,
  'Hybrid iOS & Android Mobile App Development using IONIC & React': 14,
  'Data Analysis & Reporting': 15,
  'Not in list / Not mentioned': 16,
  'AI Solutions': 17,
  'Business Intelligence & Dashboarding': 18,
  'Customized Software Development & Planning': 19,
  'Digital Transformation': 20
};

const fb_industryMap = {
  'E-commerce': 1,
  'Retail and Consumer Goods': 1,
  'Automotive': 2,
  'Construction': 3,
  'Consulting': 4,
  'Education and Training': 5,
  'Energy and Utilities': 6,
  'Finance and Insurance': 7,
  'Healthcare and Medical': 8,
  'Hospitality and Tourism': 9,
  'Information Technology': 10,
  'Legal Services': 11,
  'Manufacturing': 12,
  'Marketing and Advertising': 13,
  'Media and Entertainment': 14,
  'Non-Profit and Social Services': 15,
  'Real Estate': 16,
  'Telecommunications': 17,
  'Transportation and Logistics': 18,
  'Wholesale and Distribution': 19,
  'Not in list / Not mentioned': 20
};

// Date formatting for MySQL
const formatDate = (dateStr) => {
  return moment(dateStr).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
};

// Map Facebook payload to lead
const mapPayloadToLead = (payload) => {
  if (!payload.field_data || !payload.created_time) {
    throw new Error('Invalid payload: missing field_data or created_time');
  }

  const fieldData = payload.field_data;
  const createdTime = payload.created_time;

  const mappedLead = {
    assigned_to: '6',
    status: '1',
    name: '',
    mobile_number: '',
    email: '',
    city: 'Not mentioned',
    website_type: '',
    industry_type: '',
    contact_preference: '1',
    preferred_date: '',
    preferred_time: '',
    requirements: '',
    lead_source: '3',
    checkbox_ids: null,
    created_at: formatDate(createdTime),
    updated_at: formatDate(createdTime)
  };

  const requirementsParts = [];

  fieldData.forEach(field => {
    if (!field.name || !field.values || !field.values.length) return;
    const name = field.name;
    const value = field.values[0];

    switch (name) {
      case 'full_name':
        mappedLead.name = value;
        break;
      case 'phone_number':
        mappedLead.mobile_number = value;
        break;
      case 'email':
        mappedLead.email = value;
        break;
      case 'business_name_or_industry_type?':
        mappedLead.industry_type = fb_industryMap[value] ? fb_industryMap[value].toString() : '20';
        requirementsParts.push(`Industry: ${value}`);
        break;
      case 'what_service_are_you_looking_for?_':
        mappedLead.website_type = fb_serviceMap[value] ? fb_serviceMap[value].toString() : '16';
        requirementsParts.push(`Service: ${value}`);
        break;
      case 'what’s_your_goal_with_this_project?':
        requirementsParts.push(`Goal: ${value}`);
        break;
      case 'do_you_have_an_existing_website_or_app?':
        requirementsParts.push(`Existing Website: ${value}`);
        break;
      case 'your_preferred_budget_range?':
        requirementsParts.push(`Budget: ${value}`);
        break;
      case 'when_do_you_want_to_get_started?':
        requirementsParts.push(`Preferred Start Time: ${value}`);
        break;
    }
  });

  mappedLead.requirements = requirementsParts.join(', ');
  return mappedLead;
};

// Initialize SSH tunnel and MySQL connection
let dbConnection = null;

async function startSSHTunnel() {
  const ssh = new Client();

  return new Promise((resolve, reject) => {
    ssh.on('ready', () => {
      console.log('SSH connection established');
      ssh.forwardOut(
        '127.0.0.1',
        3307,
        '127.0.0.1',
        3306,
        async (err, stream) => {
          if (err) {
            console.error('SSH forwarding error:', err);
            return reject(err);
          }

          try {
            dbConnection = await mysql.createConnection({
              ...dbConfig,
              stream
            });
            console.log('Connected to MySQL database via SSH tunnel');
            resolve(dbConnection);
          } catch (dbErr) {
            console.error('MySQL connection error:', dbErr);
            reject(dbErr);
          }
        }
      );
    }).on('error', (err) => {
      console.error('SSH connection error:', err);
      reject(err);
    }).connect(sshConfig);
  });
}

// Facebook webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Facebook webhook lead processing
app.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.entry || !payload.entry[0].changes) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    const leadData = mapPayloadToLead(payload.entry[0].changes[0].value);
    
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const query = `
      INSERT INTO leads (
        assigned_to, status, name, mobile_number, email, city, website_type,
        industry_type, contact_preference, preferred_date, preferred_time,
        requirements, lead_source, checkbox_ids, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      leadData.assigned_to,
      leadData.status,
      leadData.name,
      leadData.mobile_number,
      leadData.email,
      leadData.city,
      leadData.website_type,
      leadData.industry_type,
      leadData.contact_preference,
      leadData.preferred_date,
      leadData.preferred_time,
      leadData.requirements,
      leadData.lead_source,
      leadData.checkbox_ids,
      leadData.created_at,
      leadData.updated_at
    ];

    await dbConnection.execute(query, values);
    console.log('Lead inserted successfully:', leadData);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function startServer() {
  try {
    await startSSHTunnel();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}


// Get lead status list
app.get('/api/lead-statuses', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const [rows] = await dbConnection.execute('SELECT id, status_name FROM ekarigar_leads_status');
    res.status(200).json({ status: 'success', data: rows });
  } catch (err) {
    console.error('Error fetching lead statuses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//----------------------------------multer configuration-----------------------------------
// Import necessary modules
const multer = require('multer');
// const path = require('path');

// Define storage settings for the uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory to save the uploaded files
    cb(null, 'uploads/'); // Ensure the 'uploads' folder exists or create it
  },
  filename: (req, file, cb) => {
    // Generate a unique name for each file to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp and original file extension
  }
});

// File filter function to check the file types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     'application/pdf', 
//     'application/msword', 
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
//     'application/vnd.ms-excel', 
//     'image/jpeg', 
//     'image/png', 
//     'image/jpg',
//      "application/zip",
//      "application/x-zip-compressed",  
//      "multipart/x-zip" 
//   ];
  
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error('Invalid file type'), false); // Reject the file
//   }
// };

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm (optional)
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/zip',
    'application/x-zip-compressed',
    'multipart/x-zip'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type'), false); // Reject the file
  }
};


// Create multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // Max file size: 5MB
});

//-------------------------------------drive intergration code-----------------
// Authenticate with Google Drive
// const auth = new google.auth.GoogleAuth({
//   keyFile: "alert-smoke-450416-g3-9bbc203685cc.json",
//   scopes: ["https://www.googleapis.com/auth/drive.file"],
// });
// const drive = google.drive({ version: "v3", auth });

// // Upload File to Google Drive
// const uploadToDrive = async (filePath, fileName) => {
//   const fileMetadata = {
//     name: fileName,
//     parents: ["121isx78RRzbUpxI15DWEX1JUDCoXWvZX"],
//   };
//   const media = {
//     mimeType: "application/zip",
//     body: fs.createReadStream(filePath),
//   };

//   const response = await drive.files.create({
//     resource: fileMetadata,
//     media: media,
//     fields: "id, webViewLink",
//   });

//   // Delete file from local storage after upload
//   fs.unlinkSync(filePath);

//   return response.data;
// };

// API Route to Handle File Upload
app.post("/api/upload_g", upload.single("file"), async (req, res) => {
  try {
    const { path, originalname } = req.file;
    const driveFile = await uploadToDrive(path, originalname);
    res.json({ fileId: driveFile.id, fileUrl: driveFile.webViewLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//-------------------------------------add test mode code--------------------------

app.get('/api/mode', (req, res) => {
  const status = false; 
  console.log("checking",status);
  res.json({ status });
});

// app.get('/health', async (req, res) => {
//     try {
//         console.log('Testing connection to backend server...');
//         const response = await axios.get('http://ek-reps.com:4444/health', {
//             timeout: 5000
//         });
//         res.status(200).send(`Backend connection successful: ${JSON.stringify(response.data)}`);
//     } catch (error) {
//         console.error('Backend connection test failed:', error.message);
//         res.status(500).send(`Backend connection failed: ${error.message}`);
//     }
// });

//----------------------------------multer configuration-----------------------------------

// Define the mappings for service type, industry type, and checkbox options
const serviceMap = {
  'Website Designing & Development': 1,
  'E-Commerce Website Development': 2,
  'WordPress Development': 3,
  'Shopify Website Development': 4,
  'Custom Project Development & Planning': 5,
  'API Development & Integration': 6,
  'Search Engine Optimisation (SEO)': 7,
  'Social Media Marketing': 8,
  'Custom Application Development For Retail & Manufacturing Industry': 9,
  'IOT Custom Projects Research & Development': 10,
  'Technical, Sales & Customer Care Call Centre Services': 11,
  'AWS Setup & Management': 12,
  'UI/UX Planning & Designing': 13,
  'Hybrid iOS & Android Mobile App Development using IONIC & React': 14,
  'Data Analysis & Reporting': 15,
  'AI Solutions':17,
  'Business Intelligence & Dashboarding':18,
  'Customized Software Development & Planning':19,
  'Digital Transformation':20
};

const industryMap = {
  'Retail and Consumer Goods': 1,
  'Automotive': 2,
  'Construction': 3,
  'Consulting': 4,
  'Education and Training': 5,
  'Energy and Utilities': 6,
  'Finance and Insurance': 7,
  'Healthcare and Medical': 8,
  'Hospitality and Tourism': 9,
  'Information Technology': 10,
  'Legal Services': 11,
  'Manufacturing': 12,
  'Marketing and Advertising': 13,
  'Media and Entertainment': 14,
  'Non-Profit and Social Services': 15,
  'Real Estate': 16,
  'Telecommunications': 17,
  'Transportation and Logistics': 18,
  'Wholesale and Distribution': 19,
};

const checkboxMap = {
  'Need a new website for your business?': 1,
  'Want to appear on top of Google search?': 2,
  'Want more business leads?': 3,
  'Increase sales on your e-commerce website?': 4,
  'Want to take your brand to a larger audience?': 5,
  'Looking for automating your business process?': 6,
  'Something else?': 7,
};

// Helper function to map form data
// function mapFormData(formData) {
// const mappedData = {
//   name: formData.fullName,
//   assigned_to: 1,
//   mobile_number: formData.mobileNumber,
//   email: formData.email,
//   city: formData.cityName,
//   service_type: serviceMap[formData.selectedService] || null,
//   industry_type: industryMap[formData.selectedIndustry] || null,
//   contact_preference: formData.preferredContactMethod,
//   preferred_date: formData.date || '-',
//   preferred_time_slot: formData.selectTiming || '-',
//   lead_source: 'website',
//   selectedCheckboxes: formData.businessNeeds
//     .map(value => {
//       const normalizedValue = value.trim().toLowerCase(); // Normalize case
//       for (const [key, id] of Object.entries(checkboxMap)) {
//         if (key.toLowerCase() === normalizedValue) {
//           return id; // Return the matching ID
//         }
//       }
//       return null; // Return null if no match is found
//     })
//     .filter(id => id) // Filter out any null or undefined values
//     .join(','), // Convert the array to a comma-separated string (without quotes)
//   requirements: formData.requirements || null, // Default to null if not provided
// };

// console.log('Mapped Data:', mappedData);

// // Save this data to the database




//   console.log('Mapped Data:', mappedData);  // Debugging line
//   console.log('Business Needs:', formData.businessNeeds);
// console.log('Checkbox Map Keys:', Object.keys(checkboxMap));


//   return mappedData;
// }

// Helper function to map form data and assign `assigned_to`
// async function mapFormData(formData) {
//   const mappedData = {
//     name: formData.fullName,
//     mobile_number: formData.mobileNumber,
//     email: formData.email,
//     city: formData.cityName,
//     service_type: serviceMap[formData.selectedService] || null,
//     industry_type: industryMap[formData.selectedIndustry] || null,
//     contact_preference: formData.preferredContactMethod,
//     preferred_date: formData.date || '-',
//     preferred_time_slot: formData.selectTiming || '-',
//     lead_source: 'website',
//     selectedCheckboxes: formData.businessNeeds
//       .map(value => {
//         const normalizedValue = value.trim().toLowerCase(); // Normalize case
//         for (const [key, id] of Object.entries(checkboxMap)) {
//           if (key.toLowerCase() === normalizedValue) {
//             return id; // Return the matching ID
//           }
//         }
//         return null; // Return null if no match is found
//       })
//       .filter(id => id) // Filter out any null or undefined values
//       .join(','), // Convert the array to a comma-separated string (without quotes)
//     requirements: formData.requirements || null, // Default to null if not provided
//   };

//   // Assign the correct user based on the service selected
//   const assignedUser = await getAssignedUser(mappedData.service_type);
//   mappedData.assigned_to = assignedUser;

//   return mappedData;
// }


// Helper function to map form data and assign `assigned_to`
async function mapFormData(formData) {
  const mappedData = {
    name: formData.fullName,
    mobile_number: formData.mobileNumber,
    email: formData.email,
    city: formData.cityName,
    service_type: serviceMap[formData.selectedService] || null,
    industry_type: industryMap[formData.selectedIndustry] || null,
    
    // Map contact_preference values to their corresponding IDs
    contact_preference: formData.preferredContactMethod === 'Call' ? 1 : 
                         formData.preferredContactMethod === 'Schedule a Video Call' ? 2 : 0,
    
    preferred_date: formData.date || '-',
    preferred_time_slot: formData.selectTiming || '-',
    lead_source: 1,
    
    selectedCheckboxes: formData.businessNeeds.map(value => {
        const normalizedValue = value.trim().toLowerCase(); // Normalize case
        for (const [key, id] of Object.entries(checkboxMap)) {
          if (key.toLowerCase() === normalizedValue) {
            return id; // Return the matching ID
          }
        }
        return null; // Return null if no match is found
      })
      .filter(id => id) // Filter out any null or undefined values
      .join(','), // Convert the array to a comma-separated string (without quotes)
    
    requirements: formData.requirements || null, // Default to null if not provided
  };

  // Assign the correct user based on the service selected
  const assignedUser = await getAssignedUser(mappedData.service_type);
  mappedData.assigned_to = assignedUser;

  return mappedData;
}


// // Function to get the assigned user based on the selected service
// function getAssignedUser(serviceId) {
//   return new Promise((resolve, reject) => {
//     // Query to find a user assigned to the service and not marked as deleted
//     const query = `
//       SELECT id
//       FROM ekarigar_users
//       WHERE FIND_IN_SET(?, assigned_services) > 0
//       AND delete_status = '0'
//       LIMIT 1
//     `;
//     connection.query(query, [serviceId], (err, results) => {
//       if (err) {
//         reject(err);
//       } else if (results.length > 0) {
//         resolve(results[0].id); // Return the user ID of the first match
//       } else {
//         resolve(1); // Default to admin if no active user is found (fallback)
//       }
//     });
//   });
// }


async function getAssignedUser(serviceId) {
  try {
    if (!dbConnection) {
      throw new Error('Database connection not established');
    }

    const query = `
      SELECT id
      FROM ekarigar_users
      WHERE FIND_IN_SET(?, assigned_services) > 0
      AND delete_status = '0'
      LIMIT 1
    `;
    const [rows] = await dbConnection.execute(query, [serviceId]);

    if (rows.length > 0) {
      return rows[0].id; // Return the user ID of the first match
    }
    return 1; // Default to admin if no active user is found (fallback)
  } catch (err) {
    console.error('Error fetching assigned user:', err);
    throw err; // Re-throw the error for the caller to handle
  }
}




// app.all('/form',function(req, res){
// // res.sendFile(__dirname+"/form.html");
// res.setHeader('Content-Type', 'text/plain');
// res.setHeader('Access-Control-Allow-Origin', '*'); //config.allowedDomains
// res.setHeader('Access-Control-Allow-Credentials', true);
// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Requested-By');
// res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
// connection.query('select * from products',(err, rows, fields)=>{
//   if (!err) 

//   res.send(rows);
//   else{
//     console.log(err);
//   }
// });
// });

app.all('/api/form', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    // Set CORS headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Requested-By');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');

    const [rows] = await dbConnection.execute('SELECT * FROM products');
    res.status(200).json({ status: 'success', data: rows });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//--------------------queries start-----------------



//not configure code
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  console.log('Webhook GET received:', { mode, token, challenge });
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.set('Content-Type', 'text/plain');
    res.status(200).send(challenge);
  } else {
    console.log('Verification failed:', { mode, token });
    res.status(403).send('Forbidden');
  }
});



// app.post('/api/fb_leads_save', async (req, res) => {
//   try {
//     const payload = req.body;
    
//     // console.log(payload);
    
//     // Check form_id
//     const formId = payload.form_id;
//         // console.log("ekreps formid",formId);
//     //     529677880213221
//     //     1343440076956786
//     // if (formId !== '637356575939309') {
//     //   return res.status(400).json({ error: 'Invalid form_id' });
//     // }
    
//     const allowedFormIds = ['637356575939309', '529677880213221', '1343440076956786'];

//     if (!allowedFormIds.includes(formId)) {
//       return res.status(400).json({ error: 'Invalid form_id' });
//     }


//     // Map payload to lead
//     const mappedLead = mapPayloadToLead(payload);
//     console.log("MAPPED DATA", mappedLead);

//     // Insert into database
//     const query = `
//       INSERT INTO ekarigar_leads (
//         assigned_to, status, name, mobile_number, email, city, website_type, 
//         industry_type, contact_preference, preferred_date, preferred_time, 
//         requirements, lead_source, checkbox_ids, created_at, updated_at
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [
//       mappedLead.assigned_to,
//       mappedLead.status,
//       mappedLead.name,
//       mappedLead.mobile_number,
//       mappedLead.email,
//       mappedLead.city,
//       mappedLead.website_type,
//       mappedLead.industry_type,
//       mappedLead.contact_preference,
//       mappedLead.preferred_date,
//       mappedLead.preferred_time,
//       mappedLead.requirements,
//       mappedLead.lead_source,
//       mappedLead.checkbox_ids,
//       mappedLead.created_at,
//       mappedLead.updated_at
//     ];

//     await connection.query(query, values);

//     res.status(200).json({ message: 'Lead saved successfully' });
//   } catch (error) {
//     console.error('Error processing webhook:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/api/fb_leads_save', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const payload = req.body;

    // Validate form_id
    const formId = payload.form_id;
    const allowedFormIds = ['637356575939309', '529677880213221', '1343440076956786'];
    if (!allowedFormIds.includes(formId)) {
      return res.status(400).json({ error: 'Invalid form_id' });
    }

    // Map payload to lead
    const mappedLead = mapPayloadToLead(payload);
    console.log('MAPPED DATA', mappedLead);

    // Get assigned user based on serviceId (assuming it's in mappedLead)
    const serviceId = mappedLead.serviceId; // Adjust based on actual payload structure
    const assignedUserId = await getAssignedUser(serviceId);

    // Insert into database
    const query = `
      INSERT INTO ekarigar_leads (
        assigned_to, status, name, mobile_number, email, city, website_type, 
        industry_type, contact_preference, preferred_date, preferred_time, 
        requirements, lead_source, checkbox_ids, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      assignedUserId, // Use the dynamically fetched user ID
      mappedLead.status,
      mappedLead.name,
      mappedLead.mobile_number,
      mappedLead.email,
      mappedLead.city,
      mappedLead.website_type,
      mappedLead.industry_type,
      mappedLead.contact_preference,
      mappedLead.preferred_date,
      mappedLead.preferred_time,
      mappedLead.requirements,
      mappedLead.lead_source,
      mappedLead.checkbox_ids,
      mappedLead.created_at,
      mappedLead.updated_at
    ];

    await dbConnection.execute(query, values);

    res.status(200).json({ status: 'success', message: 'Lead saved successfully' });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//---------------------------------fb leads integration code end----------------------------------- 


// app.get('/api/recentleads', (req, res) => {
//   // Get user_id from request headers
//   const userId = req.headers['user-id'];

//   if (!userId) {
//     return res.status(400).json({
//       success: false,
//       message: 'User ID is required',
//     });
//   }

//   // Fetch the role_id for the given user_id from the ekarigar_users table
//   const roleQuery = 'SELECT role_id FROM ekarigar_users WHERE id = ? AND delete_status = "0"';

//   connection.query(roleQuery, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching role_id:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Database query failed while fetching role_id',
//       });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found or user is deleted',
//       });
//     }

//     const roleId = results[0].role_id;

//     // Base query with JOIN to fetch status name
//     let query = `
//       SELECT 
//       l.id,
//         l.name, 
//         l.email AS website, 
//         l.mobile_number AS mobile, 
//         s.status_name AS status
//       FROM ekarigar_leads l
//       INNER JOIN ekarigar_leads_status s ON l.status = s.id
//     `;

//     // If the user is an admin (role_id = 1), show all leads
//     if (roleId === 1) { // Admin role
//       query += 'ORDER BY l.created_at DESC LIMIT 5';
//     } else {
//       // If the user is not an admin, show only leads assigned to the user
//       query += 'WHERE l.assigned_to = ? ORDER BY l.created_at DESC LIMIT 5';
//     }

//     // Execute the query to fetch the leads
//     connection.query(query, [roleId === 1 ? [] : userId], (error, results) => {
//       if (error) {
//         console.error('Error fetching recent leads:', error);
//         return res.status(500).json({
//           success: false,
//           message: 'Database query failed while fetching recent leads',
//         });
//       }

//       const formattedResults = results.map((lead) => ({
//         id:lead.id,
//         name: lead.name,
//         website: lead.website,
//         mobile: lead.mobile,
//         status: lead.status,
//       }));

//       res.json({
//         success: true,
//         message: 'Recent leads fetched successfully',
//         data: formattedResults,
//       });
//     });
//   });
// });

app.get('/api/recentleads', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    // Get user_id from request headers
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch the role_id for the given user_id
    const roleQuery = 'SELECT role_id FROM ekarigar_users WHERE id = ? AND delete_status = "0"';
    const [roleResults] = await dbConnection.execute(roleQuery, [userId]);

    if (roleResults.length === 0) {
      return res.status(404).json({ error: 'User not found or user is deleted' });
    }

    const roleId = roleResults[0].role_id;

    // Base query with JOIN to fetch status name
    let query = `
      SELECT 
        l.id,
        l.name, 
        l.email AS website, 
        l.mobile_number AS mobile, 
        s.status_name AS status
      FROM ekarigar_leads l
      INNER JOIN ekarigar_leads_status s ON l.status = s.id
    `;
    let queryParams = [];

    // If the user is an admin (role_id = 1), show all leads
    if (roleId === 1) {
      query += ' ORDER BY l.created_at DESC LIMIT 5';
    } else {
      // If the user is not an admin, show only leads assigned to the user
      query += ' WHERE l.assigned_to = ? ORDER BY l.created_at DESC LIMIT 5';
      queryParams = [userId];
    }

    // Execute the query to fetch the leads
    const [results] = await dbConnection.execute(query, queryParams);

    // Format results to match the original structure
    const formattedResults = results.map((lead) => ({
      id: lead.id,
      name: lead.name,
      website: lead.website,
      mobile: lead.mobile,
      status: lead.status,
    }));

    res.status(200).json({
      status: 'success',
      message: 'Recent leads fetched successfully',
      data: formattedResults,
    });
  } catch (err) {
    console.error('Error fetching recent leads:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// app.get('/api/leadcounts_user_pause/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // First fetch user's assigned services and role_id
//   const userQuery = `
//     SELECT assigned_services, role_id 
//     FROM ekarigar_users 
//     WHERE id = ? AND delete_status = '0'
//   `;

//   connection.query(userQuery, [userId], (userError, userResults) => {
//     if (userError) {
//       console.error('Error fetching user:', userError);
//       return res.status(500).json({
//         success: false,
//         message: 'Database query failed',
//         error: userError.message,
//       });
//     }

//     if (!userResults.length) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found or inactive',
//       });
//     }

//     const { assigned_services, role_id } = userResults[0];

//     // Query customization based on userId
//     let leadCountQuery;
//     let queryParams;

   
    
//     if (userId == 6) {
//   leadCountQuery = `
//     SELECT 
//       s.id AS status_id, 
//       s.status_name,
//       COUNT(l.id) AS count
//     FROM 
//       ekarigar_leads_status s
//       LEFT JOIN ekarigar_leads l ON s.id = l.status AND l.assigned_to = ?
//     GROUP BY 
//       s.id, 
//       s.status_name
//     ORDER BY 
//       s.id ASC
//   `;
//   queryParams = [userId];
// }

//     else if (role_id === 1) {
//         //   if (role_id === 1) {
//       leadCountQuery = `
//         SELECT 
//           s.id AS status_id, 
//           s.status_name,
//           COUNT(l.id) AS count
//         FROM 
//           ekarigar_leads_status s
//           LEFT JOIN ekarigar_leads l ON s.id = l.status
//         GROUP BY 
//           s.id, 
//           s.status_name
//         ORDER BY 
//           s.id ASC
//       `;
//       queryParams = [];
//     } else if (role_id === 2 && assigned_services) {
//       leadCountQuery = `
//         SELECT 
//           s.id AS status_id, 
//           s.status_name,
//           COUNT(DISTINCT CASE 
//             WHEN FIND_IN_SET(?, l.assigned_to) 
//             AND EXISTS (
//               SELECT 1 
//               FROM (
//                 SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(?, ',', numbers.n), ',', -1) service_id
//                 FROM (
//                   SELECT a.N + b.N * 10 + 1 n
//                   FROM 
//                     (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
//                     (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
//                   ORDER BY n
//                 ) numbers
//                 WHERE numbers.n <= 1 + (LENGTH(?) - LENGTH(REPLACE(?, ',', '')) )
//               ) services
//               WHERE FIND_IN_SET(services.service_id, l.website_type)
//             )
//             THEN l.id 
//             ELSE NULL 
//           END) AS count
//         FROM 
//           ekarigar_leads_status s
//           LEFT JOIN ekarigar_leads l ON s.id = l.status
//         GROUP BY 
//           s.id, 
//           s.status_name
//         ORDER BY 
//           s.id ASC
//       `;
//       queryParams = [userId, assigned_services, assigned_services, assigned_services];
//     } else {
//       return res.json({
//         success: true,
//         message: 'No services assigned to user',
//         data: { total: 0, statuses: [] },
//       });
//     }

//     connection.query(leadCountQuery, queryParams, (error, results) => {
//       if (error) {
//         console.error('Error fetching lead counts:', error);
//         return res.status(500).json({
//           success: false,
//           message: 'Database query failed',
//           error: error.message,
//         });
//       }

//       // Transform results into response format
//       const counts = {
//         total: results.reduce((sum, row) => sum + row.count, 0),
//         statuses: results.map((row) => ({
//           id: row.status_id,
//           name: row.status_name,
//           count: row.count,
//         })),
//       };

//       res.json({
//         success: true,
//         message: 'Lead counts fetched successfully',
//         data: counts,
//       });
//     });
//   });
// });

app.get('/api/leadcounts_user_pause/:userId', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch user's assigned services and role_id
    const userQuery = `
      SELECT assigned_services, role_id 
      FROM ekarigar_users 
      WHERE id = ? AND delete_status = '0'
    `;
    const [userResults] = await dbConnection.execute(userQuery, [userId]);

    if (!userResults.length) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    const { assigned_services, role_id } = userResults[0];

    // Query customization based on userId and role_id
    let leadCountQuery;
    let queryParams = [];

    if (userId == 6) {
      leadCountQuery = `
        SELECT 
          s.id AS status_id, 
          s.status_name,
          COUNT(l.id) AS count
        FROM 
          ekarigar_leads_status s
          LEFT JOIN ekarigar_leads l ON s.id = l.status AND l.assigned_to = ?
        GROUP BY 
          s.id, 
          s.status_name
        ORDER BY 
          s.id ASC
      `;
      queryParams = [userId];
    } else if (role_id === 1) {
      leadCountQuery = `
        SELECT 
          s.id AS status_id, 
          s.status_name,
          COUNT(l.id) AS count
        FROM 
          ekarigar_leads_status s
          LEFT JOIN ekarigar_leads l ON s.id = l.status
        GROUP BY 
          s.id, 
          s.status_name
        ORDER BY 
          s.id ASC
      `;
      queryParams = [];
    } else if (role_id === 2 && assigned_services) {
      leadCountQuery = `
        SELECT 
          s.id AS status_id, 
          s.status_name,
          COUNT(DISTINCT CASE 
            WHEN FIND_IN_SET(?, l.assigned_to) 
            AND EXISTS (
              SELECT 1 
              FROM (
                SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(?, ',', numbers.n), ',', -1) service_id
                FROM (
                  SELECT a.N + b.N * 10 + 1 n
                  FROM 
                    (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
                    (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
                  ORDER BY n
                ) numbers
                WHERE numbers.n <= 1 + (LENGTH(?) - LENGTH(REPLACE(?, ',', '')))
              ) services
              WHERE FIND_IN_SET(services.service_id, l.website_type)
            )
            THEN l.id 
            ELSE NULL 
          END) AS count
        FROM 
          ekarigar_leads_status s
          LEFT JOIN ekarigar_leads l ON s.id = l.status
        GROUP BY 
          s.id, 
          s.status_name
        ORDER BY 
          s.id ASC
      `;
      queryParams = [userId, assigned_services, assigned_services, assigned_services];
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'No services assigned to user',
        data: { total: 0, statuses: [] },
      });
    }

    // Execute the lead count query
    const [results] = await dbConnection.execute(leadCountQuery, queryParams);

    // Transform results into response format
    const counts = {
      total: results.reduce((sum, row) => sum + Number(row.count), 0),
      statuses: results.map((row) => ({
        id: row.status_id,
        name: row.status_name,
        count: Number(row.count),
      })),
    };

    res.status(200).json({
      status: 'success',
      message: 'Lead counts fetched successfully',
      data: counts,
    });
  } catch (err) {
    console.error('Error fetching lead counts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


///--------khusha pause------

// app.get('/api/leadcounts_user/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // First fetch user's assigned services and role_id
//   const userQuery = `
//     SELECT assigned_services, role_id 
//     FROM ekarigar_users 
//     WHERE id = ? AND delete_status = '0'
//   `;

//   connection.query(userQuery, [userId], (userError, userResults) => {
//     if (userError) {
//       console.error('Error fetching user:', userError);
//       return res.status(500).json({
//         success: false,
//         message: 'Database query failed',
//         error: userError.message,
//       });
//     }

//     if (!userResults.length) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found or inactive',
//       });
//     }

//     const { assigned_services, role_id } = userResults[0];

//     let leadCountQuery;
//     let queryParams;

//     // If admin (role_id = 1), return all statuses and counts
//     if (role_id === 1) {
//       leadCountQuery = `
//         SELECT 
//           s.id AS status_id, 
//           s.status_name,
//           COUNT(l.id) AS count
//         FROM 
//           ekarigar_leads_status s
//         LEFT JOIN 
//           ekarigar_leads l ON s.id = l.status
//         GROUP BY 
//           s.id, 
//           s.status_name
//         ORDER BY 
//           s.id ASC
//       `;
//       queryParams = [];
//     }
//     // If regular user with assigned services (role_id = 2)
//     // else if (role_id === 2 && assigned_services) {
//     else if (role_id === 2) {
//       leadCountQuery = `
//         SELECT 
//           s.id AS status_id,
//           s.status_name,
//           COUNT(l.id) AS count
//         FROM 
//           ekarigar_leads_status s
//         LEFT JOIN 
//           ekarigar_leads l ON l.status = s.id 
//           AND FIND_IN_SET(?, l.assigned_to)
//         GROUP BY 
//           s.id, s.status_name
//         ORDER BY 
//           s.id ASC
//       `;
//       queryParams = [userId];
//     } else {
//       return res.json({
//         success: true,
//         message: 'No services assigned to user',
//         data: { total: 0, statuses: [] },
//       });
//     }

//     // Execute the lead count query
//     connection.query(leadCountQuery, queryParams, (error, results) => {
//       if (error) {
//         console.error('Error fetching lead counts:', error);
//         return res.status(500).json({
//           success: false,
//           message: 'Database query failed',
//           error: error.message,
//         });
//       }

//       // Transform the results into response format
//       const counts = {
//         total: results.reduce((sum, row) => sum + (row.count || 0), 0),
//         statuses: results.map((row) => ({
//           id: row.status_id,
//           name: row.status_name,
//           count: row.count || 0,
//         })),
//       };

//       res.json({
//         success: true,
//         message: 'Lead counts fetched successfully',
//         data: counts,
//       });
//     });
//   });
// });

app.get('/api/leadcounts_user/:userId', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const userQuery = `
      SELECT assigned_services, role_id 
      FROM ekarigar_users 
      WHERE id = ? AND delete_status = '0'
    `;
    const [userResults] = await dbConnection.execute(userQuery, [userId]);

    if (!userResults.length) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    const { assigned_services, role_id } = userResults[0];

    let leadCountQuery;
    let queryParams = [];

    if (role_id === 1) {
      leadCountQuery = `
        SELECT 
          s.id AS status_id, 
          s.status_name,
          COUNT(l.id) AS count
        FROM 
          ekarigar_leads_status s
        LEFT JOIN 
          ekarigar_leads l ON s.id = l.status
        GROUP BY 
          s.id, 
          s.status_name
        ORDER BY 
          s.id ASC
      `;
      queryParams = [];
    } else if (role_id === 2) {
      leadCountQuery = `
        SELECT 
          s.id AS status_id,
          s.status_name,
          COUNT(l.id) AS count
        FROM 
          ekarigar_leads_status s
        LEFT JOIN 
          ekarigar_leads l ON l.status = s.id 
          AND FIND_IN_SET(?, l.assigned_to)
        GROUP BY 
          s.id, s.status_name
        ORDER BY 
          s.id ASC
      `;
      queryParams = [userId];
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'No services assigned to user',
        data: { total: 0, statuses: [] },
      });
    }

    const [results] = await dbConnection.execute(leadCountQuery, queryParams);

    const counts = {
      total: results.reduce((sum, row) => sum + Number(row.count), 0),
      statuses: results.map((row) => ({
        id: row.status_id,
        name: row.status_name,
        count: Number(row.count),
      })),
    };

    res.status(200).json({
      status: 'success',
      message: 'Lead counts fetched successfully',
      data: counts,
    });
  } catch (err) {
    console.error('Error fetching lead counts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/api/leadsources_user/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Query to fetch the user's assigned services and role_id
//   const userQuery = `
//     SELECT assigned_services, role_id
//     FROM ekarigar_users
//     WHERE id = ? AND delete_status = '0'
//   `;

//   connection.query(userQuery, [userId], (userError, userResults) => {
//     if (userError) {
//       console.error('Error fetching user:', userError);
//       return res.status(500).json({
//         success: false,
//         message: 'Database query failed',
//         error: userError.message,
//       });
//     }

//     if (!userResults.length) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found or inactive',
//       });
//     }

//     const { assigned_services, role_id } = userResults[0];

//     let leadSourceQuery;
//     let queryParams;

//     if (role_id === 1) {
//       leadSourceQuery = `
//         SELECT 
//           s.source_name AS source,
//           COUNT(DISTINCT l.id) AS count
//         FROM 
//           ekarigar_lead_source s
//         LEFT JOIN 
//           ekarigar_leads l ON s.id = l.lead_source
//         GROUP BY 
//           s.source_name
//         ORDER BY 
//           s.source_name ASC
//       `;
//       queryParams = [];
//     } else if (role_id === 2 && assigned_services) {
//       leadSourceQuery = `
//         SELECT 
//           s.source_name AS source,
//           COUNT(DISTINCT l.id) AS count
//         FROM 
//           ekarigar_lead_source s
//         LEFT JOIN 
//           ekarigar_leads l ON s.id = l.lead_source
//         WHERE 
//           FIND_IN_SET(?, l.assigned_to)
//           AND EXISTS (
//             SELECT 1
//             FROM (
//               SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(?, ',', numbers.n), ',', -1) service_id
//               FROM (
//                 SELECT a.N + b.N * 10 + 1 n
//                 FROM 
//                   (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
//                   (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
//                 ORDER BY n
//               ) numbers
//               WHERE numbers.n <= 1 + (LENGTH(?) - LENGTH(REPLACE(?, ',', '')))
//             ) services
//             WHERE FIND_IN_SET(services.service_id, l.website_type)
//           )
//         GROUP BY 
//           s.source_name
//         ORDER BY 
//           s.source_name ASC
//       `;
//       queryParams = [userId, assigned_services, assigned_services, assigned_services];
//     } else {
//       return res.json({
//         success: true,
//         message: 'No services assigned to user',
//         data: [],
//       });
//     }

//     connection.query(leadSourceQuery, queryParams, (error, results) => {
//       if (error) {
//         console.error('Error fetching lead sources:', error);
//         return res.status(500).json({
//           success: false,
//           message: 'Database query failed',
//           error: error.message,
//         });
//       }

//       // Calculate total leads and percentages
//       const totalLeads = results.reduce((sum, lead) => sum + lead.count, 0);
//       const formattedResults = results.map((lead) => ({
//         source: lead.source,
//         percentage: ((lead.count / totalLeads) * 100).toFixed(2),
//       }));

//       res.json({
//         success: true,
//         message: 'Lead sources fetched successfully',
//         data: formattedResults,
//       });
//     });
//   });
// });


app.get('/api/leadsources_user/:userId', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const userQuery = `
      SELECT assigned_services, role_id
      FROM ekarigar_users
      WHERE id = ? AND delete_status = '0'
    `;
    const [userResults] = await dbConnection.execute(userQuery, [userId]);

    if (!userResults.length) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    const { assigned_services, role_id } = userResults[0];

    let leadSourceQuery;
    let queryParams = [];

    if (role_id === 1) {
      leadSourceQuery = `
        SELECT 
          s.source_name AS source,
          COUNT(DISTINCT l.id) AS count
        FROM 
          ekarigar_lead_source s
        LEFT JOIN 
          ekarigar_leads l ON s.id = l.lead_source
        GROUP BY 
          s.source_name
        ORDER BY 
          s.source_name ASC
      `;
      queryParams = [];
    } else if (role_id === 2 && assigned_services) {
      leadSourceQuery = `
        SELECT 
          s.source_name AS source,
          COUNT(DISTINCT l.id) AS count
        FROM 
          ekarigar_lead_source s
        LEFT JOIN 
          ekarigar_leads l ON s.id = l.lead_source
        WHERE 
          FIND_IN_SET(?, l.assigned_to)
          AND EXISTS (
            SELECT 1
            FROM (
              SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(?, ',', numbers.n), ',', -1) service_id
              FROM (
                SELECT a.N + b.N * 10 + 1 n
                FROM 
                  (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
                  (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
                ORDER BY n
              ) numbers
              WHERE numbers.n <= 1 + (LENGTH(?) - LENGTH(REPLACE(?, ',', '')))
            ) services
            WHERE FIND_IN_SET(services.service_id, l.website_type)
          )
        GROUP BY 
          s.source_name
        ORDER BY 
          s.source_name ASC
      `;
      queryParams = [userId, assigned_services, assigned_services, assigned_services];
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'No services assigned to user',
        data: [],
      });
    }

    const [results] = await dbConnection.execute(leadSourceQuery, queryParams);

    const totalLeads = results.reduce((sum, lead) => sum + Number(lead.count), 0);
    const formattedResults = results.map((lead) => ({
      source: lead.source,
      percentage: totalLeads > 0 ? Number(((lead.count / totalLeads) * 100).toFixed(2)) : 0,
    }));

    res.status(200).json({
      status: 'success',
      message: 'Lead sources fetched successfully',
      data: formattedResults,
    });
  } catch (err) {
    console.error('Error fetching lead sources:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/api/leadcounts', (req, res) => {
//   const query = `
//     SELECT 
//       s.id AS status_id,
//       s.status_name,
//       COUNT(l.id) AS count
//     FROM 
//       ekarigar_leads_status s
//     LEFT JOIN 
//       ekarigar_leads l 
//     ON 
//       s.id = l.status
//     GROUP BY 
//       s.id, s.status_name
//     ORDER BY 
//       s.id ASC;
//   `;

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching lead counts:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Database query failed',
//         error: error.message,
//       });
//     }

//     // Transform results into a structured response
//     const counts = {
//       total: results.reduce((sum, row) => sum + row.count, 0), // Sum of all leads
//       statuses: results.map((row) => ({
//         id: row.status_id,
//         name: row.status_name,
//         count: row.count,
//       })),
//     };

//     res.json({
//       success: true,
//       message: 'Lead counts fetched successfully',
//       data: counts,
//     });
//   });
// });


// // API to fetch lead sources
// app.get('/api/leadsources', (req, res) => {
//   const query = `
//     SELECT lead_source, COUNT(*) as count
//     FROM ekarigar_leads
//     GROUP BY lead_source;
//   `;

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching lead sources:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Database query failed',
//       });
//     }

//     // Calculate total leads and percentages
//     const totalLeads = results.reduce((sum, lead) => sum + lead.count, 0);
//     const formattedResults = results.map((lead) => ({
//       source: lead.lead_source,
//       percentage: ((lead.count / totalLeads) * 100).toFixed(2),
//     }));

//     res.json({
//       success: true,
//       message: 'Lead sources fetched successfully',
//       data: formattedResults,
//     });
//   });
// });

// API to fetch lead sources


app.get('/api/leadcounts', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const query = `
      SELECT 
        s.id AS status_id,
        s.status_name,
        COUNT(l.id) AS count
      FROM 
        ekarigar_leads_status s
      LEFT JOIN 
        ekarigar_leads l 
      ON 
        s.id = l.status
      GROUP BY 
        s.id, s.status_name
      ORDER BY 
        s.id ASC
    `;

    const [results] = await dbConnection.execute(query);

    const counts = {
      total: results.reduce((sum, row) => sum + Number(row.count), 0),
      statuses: results.map((row) => ({
        id: row.status_id,
        name: row.status_name,
        count: Number(row.count),
      })),
    };

    res.status(200).json({
      status: 'success',
      message: 'Lead counts fetched successfully',
      data: counts,
    });
  } catch (err) {
    console.error('Error fetching lead counts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/api/leadsources', (req, res) => {
//   const query = `
//     SELECT 
//       s.source_name AS source, 
//       COUNT(l.lead_source) AS count
//     FROM ekarigar_leads l
//     INNER JOIN ekarigar_lead_source s ON l.lead_source = s.id
//     GROUP BY s.source_name;
//   `;

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching lead sources:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Database query failed',
//       });
//     }

//     // Calculate total leads and percentages
//     const totalLeads = results.reduce((sum, lead) => sum + lead.count, 0);
//     const formattedResults = results.map((lead) => ({
//       source: lead.source,
//       percentage: ((lead.count / totalLeads) * 100).toFixed(2),
//     }));

//     res.json({
//       success: true,
//       message: 'Lead sources fetched successfully',
//       data: formattedResults,
//     });
//   });
// });


// app.get('/api/today-followups', (req, res) => {
//     const query = `
//         SELECT 
//             f.id,
//             f.lead_id,
//             f.description,
//             f.medium,
//             f.attended_by,
//             f.assign_to,
//             f.followup_date,
//             f.followup_doc_description,
//             f.followup_doc,
//             DATE(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i')) as formatted_date
//         FROM 
//             ekarigar_followups f
//         WHERE 
//             DATE(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i')) = CURDATE()
//         ORDER BY 
//             f.followup_date ASC
//     `;

//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error('Error fetching followups:', error);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Database query failed',
//                 error: error.message
//             });
//         }

//         const followups = {
//             total: results.length,
//             followups: results.map(row => ({
//                 id: row.id,
//                 lead_id: row.lead_id,
//                 description: row.description,
//                 medium: row.medium,
//                 attended_by: row.attended_by,
//                 assign_to: row.assign_to,
//                 followup_date: row.followup_date,
//                 followup_doc_description: row.followup_doc_description,
//                 followup_doc: row.followup_doc
//             }))
//         };

//         res.json({
//             success: true,
//             message: 'Today\'s followups fetched successfully',
//             data: followups
//         });
//     });
// });

// app.get('/api/today-followups', (req, res) => {
//     const userId = req.query.userId; // Get userId from query params
    
//     if (!userId) {
//         return res.status(400).json({
//             success: false,
//             message: 'User ID is required'
//         });
//     }
    
    

//     const query = `
//         SELECT 
//             f.id,
//             f.lead_id,
//             f.description,
//             f.medium,
//             f.attended_by,
//             f.assign_to,
//             f.followup_date,
//             f.followup_doc_description,
//             f.followup_doc,
//             DATE(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i')) as formatted_date
//         FROM 
//             ekarigar_followups f
//         WHERE 
//             DATE(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i')) = CURDATE()
//             AND f.attended_by = ?
//         ORDER BY 
//             f.followup_date ASC
//     `;

//     connection.query(query, [userId], (error, results) => {
//         if (error) {
//             console.error('Error fetching followups:', error);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Database query failed',
//                 error: error.message
//             });
//         }

//         const followups = {
//             total: results.length,
//             followups: results.map(row => ({
//                 id: row.id,
//                 lead_id: row.lead_id,
//                 description: row.description,
//                 medium: row.medium,
//                 attended_by: row.attended_by,
//                 assign_to: row.assign_to,
//                 followup_date: row.followup_date,
//                 followup_doc_description: row.followup_doc_description,
//                 followup_doc: row.followup_doc
//             }))
//         };

//         res.json({
//             success: true,
//             message: 'Today\'s followups fetched successfully',
//             data: followups
//         });
//     });
// });
app.get('/api/leadsources', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const query = `
      SELECT 
        s.source_name AS source, 
        COUNT(l.lead_source) AS count
      FROM ekarigar_leads l
      INNER JOIN ekarigar_lead_source s ON l.lead_source = s.id
      GROUP BY s.source_name
    `;

    const [results] = await dbConnection.execute(query);

    const totalLeads = results.reduce((sum, lead) => sum + Number(lead.count), 0);
    const formattedResults = results.map((lead) => ({
      source: lead.source,
      percentage: totalLeads > 0 ? Number(((lead.count / totalLeads) * 100).toFixed(2)) : 0,
    }));

    res.status(200).json({
      status: 'success',
      message: 'Lead sources fetched successfully',
      data: formattedResults,
    });
  } catch (err) {
    console.error('Error fetching lead sources:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/api/today-followups', (req, res) => {
//     const userId = req.query.userId; // Get userId from query params

//     if (!userId) {
//         return res.status(400).json({
//             success: false,
//             message: 'User ID is required'
//         });
//     }

//     // Get today's date in Indian Standard Time (IST)
//     const todayIST = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');

//     const query = `
//         SELECT 
//             f.id,
//             f.lead_id,
//             f.description,
//             f.medium,
//             f.attended_by,
//             f.assign_to,
//             f.followup_date,
//             f.followup_doc_description,
//             f.followup_doc,
//             DATE(CONVERT_TZ(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i'), '+00:00', '+05:30')) as formatted_date
//         FROM 
//             ekarigar_followups f
//         WHERE 
//             DATE(CONVERT_TZ(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i'), '+00:00', '+05:30')) = ?
//             AND f.attended_by = ?
//         ORDER BY 
//             f.followup_date ASC
//     `;

//     connection.query(query, [todayIST, userId], (error, results) => {
//         if (error) {
//             console.error('Error fetching followups:', error);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Database query failed',
//                 error: error.message
//             });
//         }

//         const followups = {
//             total: results.length,
//             followups: results.map(row => ({
//                 id: row.id,
//                 lead_id: row.lead_id,
//                 description: row.description,
//                 medium: row.medium,
//                 attended_by: row.attended_by,
//                 assign_to: row.assign_to,
//                 followup_date: row.followup_date,
//                 followup_doc_description: row.followup_doc_description,
//                 followup_doc: row.followup_doc
//             }))
//         };

//         res.json({
//             success: true,
//             message: "Today's followups fetched successfully",
//             data: followups
//         });
//     });
// });
// API endpoint to transfer wpforms entries to ekarigar_leads
// app.post('/api/transfer_wpforms_entries', (req, res) => {
//   const query = `
//     SELECT entry_id, fields, date
//     FROM wpkh_wpforms_entries;
//   `;

//   connection.beginTransaction((transactionError) => {
//     if (transactionError) {
//       console.error('Error starting transaction:', transactionError);
//       return res.status(500).json({ status: false, error: 'Failed to start transaction' });
//     }

//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error('Error fetching entries:', error);
//         connection.rollback(() => {
//           res.status(500).json({ status: false, error: 'Database query failed' });
//         });
//         return;
//       }

//       if (results.length === 0) {
//         connection.rollback(() => {
//           res.json({ status: true, message: 'No entries found for the past month.' });
//         });
//         return;
//       }
      

//       // Process each entry
//       const leadInsertPromises = results.map((row) => {
//         const fields = JSON.parse(row.fields);

//         // Map JSON fields to table columns
//         let name = fields['5']?.value || 'Unknown';
//         const mobileNumber = fields['6']?.value || '';
//         const email = fields['7']?.value || '';
//         let city = fields['8']?.value || '';
//         const websiteType = fields['9']?.value || '';
//         const industryType = fields['10']?.value || '';
//         const contactPreference = fields['11']?.value || '';
//         const preferredDate = fields['12']?.date || '';
//         const preferredTime = fields['14']?.value || '';
//         const requirements = '';

//         // Replace specific Hindi values with English equivalents
//         if (city === 'मुंबई') {
//           city = 'Mumbai';
//         }
//         if (name === 'प्रल्हाद') {
//           name = 'Pralhad';
//         }
//         if (name === 'सीताराम') {
//           name = 'Sitaram';
//         }

//         // Map website_type and industry_type to their IDs
//         const websiteTypeId = websiteType ? serviceMap[websiteType] || 0 : 0; // Default to 0 if empty
//         const industryTypeId = industryType ? industryMap[industryType] || 0 : 0; // Default to 0 if empty

//         // Format date to remove milliseconds
//         const formatDate = (date) => {
//           const d = new Date(date);
//           return d.toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:MM:SS'
//         };

//         // Use the date field from the wpforms table as created_at and updated_at
//         const createdAt = formatDate(row.date);
//         const updatedAt = formatDate(row.date);

//         // Function to get the assigned user based on the service type
//         const getAssignedUser = (serviceId) => {
//           return new Promise((resolve, reject) => {
//             const query = `
//               SELECT id
//               FROM ekarigar_users
//               WHERE FIND_IN_SET(?, assigned_services) > 0
//               AND delete_status = '0'  
//               LIMIT 1
//             `;
//             connection.query(query, [serviceId], (err, results) => {
//               if (err) {
//                 reject(err);
//               } else if (results.length > 0) {
//                 resolve(results[0].id); // Return the user ID of the first match
//               } else {
//                 resolve(1); // Default to admin if no active user is found (fallback)
//               }
//             });
//           });
//         };

//         // Determine the user to assign based on the service type
//         return getAssignedUser(websiteTypeId)
//           .then((assignedTo) => {
//             const insertQuery = `
//               INSERT INTO ekarigar_leads_duplicate  (
//                 assigned_to, status, name, mobile_number, email, city, website_type, industry_type,
//                 contact_preference, preferred_date, preferred_time, requirements, lead_source, created_at, updated_at
//               ) VALUES (
//                 ?, 'Pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'website', ?, ?
//               );
//             `;

//             return new Promise((resolve, reject) => {
//               connection.query(
//                 insertQuery,
//                 [
//                   assignedTo,  // Assigned to dynamic based on service type
//                   name,
//                   mobileNumber,
//                   email,
//                   city,
//                   websiteTypeId, // Store the ID for website_type
//                   industryTypeId, // Store the ID for industry_type
//                   contactPreference,
//                   preferredDate,
//                   preferredTime,
//                   requirements,
//                   createdAt,
//                   updatedAt,
//                 ],
//                 (err, result) => {
//                   if (err) {
//                     console.error('Error inserting lead:', err);
//                     return reject(err);
//                   }
//                   resolve(result);
//                 }
//               );
//             });
//           });
//       });

//       // Execute all insert queries
//       Promise.all(leadInsertPromises)
//         .then(() => {
//           connection.commit((commitError) => {
//             if (commitError) {
//               console.error('Error committing transaction:', commitError);
//               connection.rollback(() => {
//                 res.status(500).json({ status: false, error: 'Failed to commit transaction' });
//               });
//               return;
//             }
//             res.json({ status: true, message: 'All leads have been successfully transferred.' });
//           });
//         })
//         .catch((err) => {
//           console.error('Error during lead processing:', err);
//           connection.rollback(() => {
//             res.status(500).json({ status: false, error: 'Failed to transfer all leads.' });
//           });
//         });
//     });
//   });
// });


app.get('/api/today-followups', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const todayIST = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');

    const query = `
      SELECT 
        f.id,
        f.lead_id,
        f.description,
        f.medium,
        f.attended_by,
        f.assign_to,
        f.followup_date,
        f.followup_doc_description,
        f.followup_doc,
        DATE(CONVERT_TZ(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i'), '+00:00', '+05:30')) as formatted_date
      FROM 
        ekarigar_followups f
      WHERE 
        DATE(CONVERT_TZ(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i'), '+00:00', '+05:30')) = ?
        AND f.attended_by = ?
      ORDER BY 
        f.followup_date ASC
    `;

    const [results] = await dbConnection.execute(query, [todayIST, userId]);

    const followups = {
      total: results.length,
      followups: results.map(row => ({
        id: row.id,
        lead_id: row.lead_id,
        description: row.description,
        medium: row.medium,
        attended_by: row.attended_by,
        assign_to: row.assign_to,
        followup_date: row.followup_date,
        followup_doc_description: row.followup_doc_description,
        followup_doc: row.followup_doc
      }))
    };

    res.status(200).json({
      status: 'success',
      message: "Today's followups fetched successfully",
      data: followups
    });
  } catch (err) {
    console.error('Error fetching followups:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.post('/api/transfer_wpforms_entries', (req, res) => {
//   const query = `
//     SELECT entry_id, fields, date
//     FROM wpkh_wpforms_entries;
//   `;

//   connection.beginTransaction((transactionError) => {
//     if (transactionError) {
//       console.error('Error starting transaction:', transactionError);
//       return res.status(500).json({ status: false, error: 'Failed to start transaction' });
//     }

//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error('Error fetching entries:', error);
//         connection.rollback(() => {
//           res.status(500).json({ status: false, error: 'Database query failed' });
//         });
//         return;
//       }

//       if (results.length === 0) {
//         connection.rollback(() => {
//           res.json({ status: true, message: 'No entries found for the past month.' });
//         });
//         return;
//       }

//       // Define the mapping for checkbox options to their respective IDs
//       const checkboxMapping = {
//         "NEED A NEW WEBSITE FOR YOUR BUSINESS?": 1,
//         "WANT TO APPEAR ON TOP OF GOOGLE SEARCH?": 2,
//         "WANT MORE BUSINESS LEADS?": 3,
//         "INCREASE SALES ON YOUR E-COMMERCE WEBSITE?": 4,
//         "WANT TO TAKE YOUR BRAND TO LARGER AUDIENCE?": 5,
//         "LOOKING FOR AUTOMATING YOUR BUSINESS PROCESS?": 6,
//         "SOMETHING ELSE?": 7,
//       };

//       // Map contactPreference values to IDs
//       const contactPreferenceMapping = {
//         'Call': 1,
//         'Schedule a Video Call': 2,
//         // Add more mappings as needed
//       };

//       // Format date to remove milliseconds and make it 'YYYY-MM-DD HH:MM:SS'
//       const formatDate = (date) => {
//         const d = new Date(date);
//         return d.toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:MM:SS'
//       };

//       // Function to add minutes to a date
//       const addMinutes = (date, minutes) => {
//         const d = new Date(date);
//         d.setMinutes(d.getMinutes() + minutes); // Add minutes
//         return d;
//       };

//       // Process each entry
//       const leadInsertPromises = results.map((row) => {
//         const fields = JSON.parse(row.fields);

//         // Map JSON fields to table columns
//         let name = fields['5']?.value || 'Unknown';
//         const mobileNumber = fields['6']?.value || '';
//         const email = fields['7']?.value || '';
//         let city = fields['8']?.value || '';
//         const websiteType = fields['9']?.value || '';
//         const industryType = fields['10']?.value || '';
//         let contactPreference = fields['11']?.value || '';
//         const preferredDate = fields['12']?.date || '';
//         const preferredTime = fields['14']?.value || '';
//         const requirements = '';

//         // Replace specific Hindi values with English equivalents
//         if (city === 'मुंबई') {
//           city = 'Mumbai';
//         }
//         if (name === 'प्रल्हाद') {
//           name = 'Pralhad';
//         }
//         if (name === 'सीताराम') {
//           name = 'Sitaram';
//         }

//         // Map website_type and industry_type to their IDs
//         const websiteTypeId = websiteType ? serviceMap[websiteType] || 0 : 0; // Default to 0 if empty
//         const industryTypeId = industryType ? industryMap[industryType] || 0 : 0; // Default to 0 if empty

//         // Extract selected checkboxes and map to their IDs
//         const checkboxField = fields['2']?.value || ''; // Assuming '2' is the checkbox field
//         const selectedOptions = checkboxField.split('\n'); // Split by newline if options are separated by newline

//         const selectedIds = selectedOptions
//           .map(option => checkboxMapping[option]) // Map the option to its ID
//           .filter(id => id !== undefined); // Remove undefined values (in case of invalid options)

//         const checkBoxes = selectedIds.join(','); // Join the IDs into a comma-separated string without spaces

//         // Map contactPreference to its ID
//         contactPreference = contactPreferenceMapping[contactPreference] || 0; // Default to 0 if no match

//         // Use the date field from the wpforms table as created_at and updated_at
//         let createdAt = formatDate(addMinutes(row.date, 30)); // Add 30 minutes to created_at
//         let updatedAt = formatDate(addMinutes(row.date, 30)); // Add 30 minutes to updated_at

//         // Function to get the assigned user based on the service type
//         const getAssignedUser = (serviceId) => {
//           return new Promise((resolve, reject) => {
//             const query = `
//               SELECT id
//               FROM ekarigar_users
//               WHERE FIND_IN_SET(?, assigned_services) > 0
//               AND delete_status = '0'  
//               LIMIT 1
//             `;
//             connection.query(query, [serviceId], (err, results) => {
//               if (err) {
//                 reject(err);
//               } else if (results.length > 0) {
//                 resolve(results[0].id); // Return the user ID of the first match
//               } else {
//                 resolve(1); // Default to admin if no active user is found (fallback)
//               }
//             });
//           });
//         };

//         // Determine the user to assign based on the service type
//         return getAssignedUser(websiteTypeId)
//           .then((assignedTo) => {
//             const insertQuery = `
//               INSERT INTO ekarigar_leads  (
//                 assigned_to, status, name, mobile_number, email, city, website_type, industry_type,
//                 contact_preference, preferred_date, preferred_time, requirements, lead_source, created_at, updated_at, checkbox_ids
//               ) VALUES (
//                 ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?
//               );
//             `;

//             return new Promise((resolve, reject) => {
//               connection.query(
//                 insertQuery,
//                 [
//                   assignedTo,  // Assigned to dynamic based on service type
//                   name,
//                   mobileNumber,
//                   email,
//                   city,
//                   websiteTypeId, // Store the ID for website_type
//                   industryTypeId, // Store the ID for industry_type
//                   contactPreference,
//                   preferredDate,
//                   preferredTime,
//                   requirements,
//                   createdAt,
//                   updatedAt, // Insert the adjusted updated_at (updated_on)
//                   checkBoxes  // Insert the checkbox IDs here
//                 ],
//                 (err, result) => {
//                   if (err) {
//                     console.error('Error inserting lead:', err);
//                     return reject(err);
//                   }
//                   resolve(result);
//                 }
//               );
//             });
//           });
//       });

//       // Execute all insert queries
//       Promise.all(leadInsertPromises)
//         .then(() => {
//           connection.commit((commitError) => {
//             if (commitError) {
//               console.error('Error committing transaction:', commitError);
//               connection.rollback(() => {
//                 res.status(500).json({ status: false, error: 'Failed to commit transaction' });
//               });
//               return;
//             }
//             res.json({ status: true, message: 'All leads have been successfully transferred.' });
//           });
//         })
//         .catch((err) => {
//           console.error('Error during lead processing:', err);
//           connection.rollback(() => {
//             res.status(500).json({ status: false, error: 'Failed to transfer all leads.' });
//           });
//         });
//     });
//   });
// });


// app.post('/login', async (req, res) => {
//     // console.log(req.body);  // Log the request body

//     const { username, password } = req.body;

//     // Check if both username/email and password are provided
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username/Email and password are required' });
//     }

//     // Use parameterized query to prevent SQL injection
//     const query = `
//         SELECT id, username, email 
//         FROM ekarigar_users 
//         WHERE (username = ? OR email = ?) 
//           AND password = ? 
//           AND delete_status = '0'
//     `;

//     connection.query(query, [username, username, password], (err, rows) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ message: 'Database query error' });
//         }

//         // If no rows are found, the credentials are invalid
//         if (rows.length === 0) {
//             return res.status(401).json({ message: 'Invalid username/email or password' });
//         }

//         // If user is found, return user data or a success message
//         res.status(200).json({ message: 'Login successful', user: rows[0] });
//     });
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     if (!dbConnection) {
//       return res.status(500).json({ error: 'Database connection not established' });
//     }

//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username/Email and password are required' });
//     }

//     const query = `
//       SELECT id, username, email 
//       FROM ekarigar_users 
//       WHERE (username = ? OR email = ?) 
//         AND password = ? 
//         AND delete_status = '0'
//     `;
//     const [rows] = await dbConnection.execute(query, [username, username, password]);

//     if (rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid username/email or password' });
//     }

//     res.status(200).json({ status: 'success', message: 'Login successful', data: { user: rows[0] } });
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/api/login', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ message: 'Database connection not established' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    const query = `
      SELECT id, username, email 
      FROM ekarigar_users 
      WHERE (username = ? OR email = ?) 
        AND password = ? 
        AND delete_status = '0'
    `;
    const [rows] = await dbConnection.execute(query, [username, username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    res.status(200).json({ message: 'Login successful', user: rows[0] });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/transfer_wpforms_entries', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    await dbConnection.beginTransaction();

    const query = `
      SELECT entry_id, fields, date
      FROM wpkh_wpforms_entries
    `;
    const [results] = await dbConnection.execute(query);

    if (results.length === 0) {
      await dbConnection.rollback();
      return res.status(200).json({ status: 'success', message: 'No entries found for the past month.' });
    }

    const checkboxMapping = {
      "NEED A NEW WEBSITE FOR YOUR BUSINESS?": 1,
      "WANT TO APPEAR ON TOP OF GOOGLE SEARCH?": 2,
      "WANT MORE BUSINESS LEADS?": 3,
      "INCREASE SALES ON YOUR E-COMMERCE WEBSITE?": 4,
      "WANT TO TAKE YOUR BRAND TO LARGER AUDIENCE?": 5,
      "LOOKING FOR AUTOMATING YOUR BUSINESS PROCESS?": 6,
      "SOMETHING ELSE?": 7,
    };

    const contactPreferenceMapping = {
      'Call': 1,
      'Schedule a Video Call': 2,
    };

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().slice(0, 19).replace('T', ' ');
    };

    const addMinutes = (date, minutes) => {
      const d = new Date(date);
      d.setMinutes(d.getMinutes() + minutes);
      return d;
    };

    const getAssignedUser = async (serviceId) => {
      try {
        const query = `
          SELECT id
          FROM ekarigar_users
          WHERE FIND_IN_SET(?, assigned_services) > 0
          AND delete_status = '0'  
          LIMIT 1
        `;
        const [rows] = await dbConnection.execute(query, [serviceId]);
        return rows.length > 0 ? rows[0].id : 1;
      } catch (err) {
        console.error('Error fetching assigned user:', err);
        throw err;
      }
    };

    const leadInsertPromises = results.map(async (row) => {
      const fields = JSON.parse(row.fields);

      let name = fields['5']?.value || 'Unknown';
      const mobileNumber = fields['6']?.value || '';
      const email = fields['7']?.value || '';
      let city = fields['8']?.value || '';
      const websiteType = fields['9']?.value || '';
      const industryType = fields['10']?.value || '';
      let contactPreference = fields['11']?.value || '';
      const preferredDate = fields['12']?.date || '';
      const preferredTime = fields['14']?.value || '';
      const requirements = '';

      if (city === 'मुंबई') city = 'Mumbai';
      if (name === 'प्रल्हाद') name = 'Pralhad';
      if (name === 'सीताराम') name = 'Sitaram';

      const websiteTypeId = websiteType ? serviceMap[websiteType] || 0 : 0;
      const industryTypeId = industryType ? industryMap[industryType] || 0 : 0;

      const checkboxField = fields['2']?.value || '';
      const selectedOptions = checkboxField.split('\n');
      const selectedIds = selectedOptions
        .map(option => checkboxMapping[option])
        .filter(id => id !== undefined);
      const checkBoxes = selectedIds.join(',');

      contactPreference = contactPreferenceMapping[contactPreference] || 0;

      let createdAt = formatDate(addMinutes(row.date, 30));
      let updatedAt = formatDate(addMinutes(row.date, 30));

      const assignedTo = await getAssignedUser(websiteTypeId);

      const insertQuery = `
        INSERT INTO ekarigar_leads (
          assigned_to, status, name, mobile_number, email, city, website_type, industry_type,
          contact_preference, preferred_date, preferred_time, requirements, lead_source, created_at, updated_at, checkbox_ids
        ) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
      `;
      await dbConnection.execute(insertQuery, [
        assignedTo,
        name,
        mobileNumber,
        email,
        city,
        websiteTypeId,
        industryTypeId,
        contactPreference,
        preferredDate,
        preferredTime,
        requirements,
        createdAt,
        updatedAt,
        checkBoxes
      ]);
    });

    await Promise.all(leadInsertPromises);
    await dbConnection.commit();

    res.status(200).json({ status: 'success', message: 'All leads have been successfully transferred.' });
  } catch (err) {
    console.error('Error during lead processing:', err);
    await dbConnection.rollback();
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     // Check if both username/email and password are provided
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username/Email and password are required' });
//     }

//     // Use parameterized query to prevent SQL injection
//     const query = `
//         SELECT id, username, email 
//         FROM ekarigar_users 
//         WHERE (username = ? OR email = ?) 
//           AND password = ? 
//           AND delete_status = '0'
//     `;

//     connection.query(query, [username, username, password], (err, rows) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ message: 'Database query error' });
//         }

//         // If no rows are found, the credentials are invalid
//         if (rows.length === 0) {
//             return res.status(401).json({ message: 'Invalid username/email or password' });
//         }

//         // Get the current Kolkata timestamp
//         const kolkataTimestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

//         // Update the `last_login` field for the logged-in user
//         const updateQuery = `
//             UPDATE ekarigar_users 
//             SET last_login = ? 
//             WHERE id = ?
//         `;
//         connection.query(updateQuery, [kolkataTimestamp, rows[0].id], (updateErr) => {
//             if (updateErr) {
//                 console.error(updateErr);
//                 return res.status(500).json({ message: 'Error updating last login timestamp' });
//             }

//             // Send a success response with user data
//             res.status(200).json({ 
//                 message: 'Login successful', 
//                 user: rows[0], 
//                 last_login: kolkataTimestamp 
//             });
//         });
//     });
// });



app.post('/login', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const query = `
      SELECT id, username, email 
      FROM ekarigar_users 
      WHERE (username = ? OR email = ?) 
        AND password = ? 
        AND delete_status = '0'
    `;
    const [rows] = await dbConnection.execute(query, [username, username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const kolkataTimestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

    const updateQuery = `
      UPDATE ekarigar_users 
      SET last_login = ? 
      WHERE id = ?
    `;
    await dbConnection.execute(updateQuery, [kolkataTimestamp, rows[0].id]);

    res.status(200).json({ 
      status: 'success',
      message: 'Login successful', 
      data: { user: rows[0], last_login: kolkataTimestamp }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//----pause here khusha---

// API endpoint to get leads checkbox options
// app.get('/api/checkbox-options', (req, res) => {
//   const query = 'SELECT id, option_name FROM ekarigar_lead_checkbox';

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching checkbox options:', error);
//       return res.status(500).json({ error: 'Database query failed' });
//     }
//     res.json(results);
//   });
// });


app.get('/api/checkbox-options', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const query = 'SELECT id, option_name FROM ekarigar_lead_checkbox';
    const [results] = await dbConnection.execute(query);

    res.status(200).json({ status: 'success', data: results });
  } catch (err) {
    console.error('Error fetching checkbox options:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// API endpoint to get leads status options
// app.get('/api/status-options', (req, res) => {
//   const query = 'SELECT id, status_name FROM ekarigar_leads_status';

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching status options:', error);
//       return res.status(500).json({ error: 'Database query failed' });
//     }
//     res.json(results);
//   });
// });
app.get('/api/status-options', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const query = 'SELECT id, status_name FROM ekarigar_leads_status';
    const [results] = await dbConnection.execute(query);

    res.status(200).json({ status: 'success', data: results });
  } catch (err) {
    console.error('Error fetching status options:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/api/likelihood-options', (req, res) => {
//   const query = 'SELECT id, likelihood_name FROM ekarigar_leads_likelihood';

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching likelihood options:', error);
//       return res.status(500).json({ error: 'Database query failed' });
//     }
//     res.json(results);
//   });
// });


// API endpoint to get lead source options
app.get('/api/likelihood-options', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const query = 'SELECT id, likelihood_name FROM ekarigar_leads_likelihood';
    const [results] = await dbConnection.execute(query);

    res.status(200).json({ status: 'success', data: results });
  } catch (err) {
    console.error('Error fetching likelihood options:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/api/lead-sources', (req, res) => {
//   const query = 'SELECT id, source_name FROM ekarigar_lead_source';

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching lead sources:', error);
//       return res.status(500).json({ error: 'Database query failed' });
//     }
//     res.json(results);
//   });
// });

// // API endpoint to get likelihood options
// app.get('/api/likelihood-options', (req, res) => {
//   const query = 'SELECT id, likelihood_name FROM ekarigar_leads_likelihood';

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching likelihood options:', error);
//       return res.status(500).json({ error: 'Database query failed' });
//     }
//     res.json(results);
//   });
// });



// API endpoint to get users for checkbox options
app.get('/api/lead-sources', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const query = 'SELECT id, source_name FROM ekarigar_lead_source';
    const [results] = await dbConnection.execute(query);

    res.status(200).json({ status: 'success', data: results });
  } catch (err) {
    console.error('Error fetching lead sources:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/likelihood-options', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const query = 'SELECT id, likelihood_name FROM ekarigar_leads_likelihood';
    const [results] = await dbConnection.execute(query);

    res.status(200).json({ status: 'success', data: results });
  } catch (err) {
    console.error('Error fetching likelihood options:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----hard pause khusha---

app.get('/api/get_users', (req, res) => {
  const query = `
    SELECT id, username 
    FROM ekarigar_users
    WHERE delete_status = '0'; 
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ status: false, error: 'Database query failed' });
    }

    // Check if results are empty
    if (results.length === 0) {
      return res.json({ status: true, data: [], message: 'No users found' });
    }

    // Successful response with data
    res.json({ status: true, data: results });
  });
});


// API endpoint to get leads checkbox options
app.get('/api/get_industryType', (req, res) => {
  const query = 'SELECT id, industryname FROM ekarigar_industrytype';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Define the GET API to fetch service types in reverse order
app.get('/api/getservicetypes', (req, res) => {
//   const query = 'SELECT * FROM ekarigar_servicetype ORDER BY servicename ASC'; 
const query = 'SELECT * FROM ekarigar_servicetype'; 


  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error fetching service types' });
    } else {
      res.json(results);
    }
  });
});
//update this if we need we only show service type acc to select user as (assignee)
//--------------------------------If required then add this in frontend page with below endpoint
//https://ek-reps.com:4444/api/getuserservicetypes?user_id=2
app.get('/api/getuserservicetypes', (req, res) => {
  // Simulating getting the user ID from local storage (for server-side testing)
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).send({ message: 'User ID is required' });
  }

  // Query to get the assigned services for the user
  const userQuery = 'SELECT assigned_services FROM ekarigar_users WHERE id = ?';

  connection.query(userQuery, [userId], (err, userResults) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error fetching user data' });
    }

    if (userResults.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    const assignedServices = userResults[0].assigned_services;

    if (!assignedServices) {
      return res.json([]); // No services assigned
    }

    // Convert comma-separated service IDs into an array
    const serviceIds = assignedServices.split(',').map(id => id.trim());

    // Query to get only the assigned services
    const serviceQuery = `
      SELECT * 
      FROM ekarigar_servicetype 
      WHERE id IN (?)
    `;

    connection.query(serviceQuery, [serviceIds], (err, serviceResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching service types' });
      }

      res.json(serviceResults);
    });
  });
});


app.get('/api/get_roles', (req, res) => {

const query = 'SELECT * FROM ekarigar_roles'; 


  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error fetching roles' });
    } else {
      res.json(results);
    }
  });
});


// API endpoint to get contact methods
app.get('/api/get_contact_methods', (req, res) => {
    const query = 'SELECT * FROM ekarigar_contact_methods';

    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: 'Error fetching contact methods' });
        } else {
            res.json(results);
        }
    });
});

app.get('/api/get_permissions', (req, res) => {

const query = 'SELECT * FROM ekarigar_permissions'; 


  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error fetching ekarigar_permissions' });
    } else {
      res.json(results);
    }
  });
});




app.get('/api/get_services_with_status', (req, res) => {
  const query = `
    SELECT 
      s.id, 
      s.servicename,
      (SELECT COUNT(*) 
       FROM ekarigar_users u 
       WHERE FIND_IN_SET(s.id, u.assigned_services) 
         AND u.delete_status = '0') AS is_assigned
    FROM ekarigar_servicetype s;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error fetching services with status' });
    } else {
      res.json(results);
    }
  });
});




app.get('/api/getUserRole/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT role_id FROM ekarigar_users WHERE id = ? AND delete_status = "0"';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error fetching user role' });
    } else if (results.length > 0) {
      const roleId = results[0].role_id; // Get the role_id from the results
      res.json({ role_id: roleId }); // Return the role_id directly
    } else {
      res.status(404).send({ message: 'User not found or deleted' });
    }
  });
});



app.get('/api/user/:userId/permissions', (req, res) => {
    const userId = req.params.userId;

    // SQL query to get permissions for the specified user
    const query = `
        SELECT p.id 
        FROM ekarigar_users u 
        JOIN ekarigar_permissions p ON FIND_IN_SET(p.id, u.permissions) > 0 
        WHERE u.id = ? AND u.delete_status = '0'
    `;

    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error fetching user permissions' });
        }

        // Extract permission IDs from results
        const permissionIds = results.map(row => row.id);
        
        // Send back the permission IDs as an array
        res.json(permissionIds);
    });
});


//------------------------------------------------------------------all leads page----------------------------------------------------------

// app.get('/api/getleads', (req, res) => {
//   // Retrieve user ID and permissions from request headers
//   const userId = req.headers['user-id']; // Replace with appropriate logic to get user ID
//   const userPermissions = req.headers['user-permissions']; // Replace with logic to get permissions

//   if (!userId || !userPermissions) {
//     return res.status(400).send({ message: 'User ID or permissions not provided' });
//   }

//   // Prepare base query
//   let query = `
//     SELECT 
//         l.id, 
//         l.assigned_to, 
//         u.username AS assigned_username,
//         l.status AS status_id, 
//         ls.status_name AS status, 
//         l.name, 
//         l.mobile_number, 
//         l.email, 
//         l.city,
//         l.website_type AS website_type_id,
//         l.industry_type AS industry_type_id,
//         st.servicename AS website_type, 
//         it.industryname AS industry_type, 
//         cm.id AS contact_preference_id, 
//         cm.method_name AS contact_preference, 
//         l.preferred_date, 
//         l.preferred_time, 
//         l.requirements, 
//         l.lead_source AS source_id,
//         ls_table.source_name AS lead_source,
//         l.checkbox_ids, 
//         l.created_at, 
//         l.updated_at,
//         COUNT(f.id) AS followUpCount
//     FROM 
//         ekarigar_leads l
//     LEFT JOIN 
//         ekarigar_servicetype st ON l.website_type = st.id
//     LEFT JOIN 
//         ekarigar_industrytype it ON l.industry_type = it.id
//     LEFT JOIN 
//         ekarigar_followups f ON l.id = f.lead_id
//     LEFT JOIN 
//         ekarigar_users u ON l.assigned_to = u.id
//     LEFT JOIN 
//         ekarigar_contact_methods cm ON l.contact_preference = cm.id
//     LEFT JOIN 
//         ekarigar_leads_status ls ON l.status = ls.id
//     LEFT JOIN 
//         ekarigar_lead_source ls_table ON l.lead_source = ls_table.id
//   `;

//   // Check user permissions and append WHERE clause
//   if (userPermissions === '1') {
//     console.log("Admin permissions: Fetching all leads");
//     query += ` GROUP BY l.id ORDER BY l.id DESC;`;
//   } else {
      
//     console.log("Restricted permissions: Fetching assigned leads");
//     query += ` WHERE l.assigned_to = ${connection.escape(userId)} 
//               OR l.id IN (SELECT id FROM ekarigar_leads WHERE assigned_to = ${connection.escape(userId)})
//               GROUP BY l.id ORDER BY l.id DESC;`;
//   }

//   // Execute query
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send({ message: 'Error fetching leads' });
//     }

//     // Map the results
//     const data = results.map(row => ({
//       id: row.id,
//       assigned_to_id: row.assigned_to,
//       assigned_to: row.assigned_username || null,
//       status_id: row.status_id,
//       status: row.status,
//       name: row.name,
//       mobile_number: row.mobile_number,
//       email: row.email,
//       city: row.city,
//       website_type_id: row.website_type_id,
//       industry_type_id: row.industry_type_id,
//       website_type: row.website_type,
//       industry_type: row.industry_type,
//       contact_preference: row.contact_preference,
//       contact_preference_id: row.contact_preference_id || null,
//       preferred_date: row.preferred_date,
//       preferred_time: row.preferred_time,
//       requirements: row.requirements,
//       source_id: row.source_id,
//       lead_source: row.lead_source,
//       checkbox_ids: row.checkbox_ids,
//       created_at: row.created_at,
//       updated_at: row.updated_at,
//       followUpCount: row.followUpCount || 0,
//     }));

//     res.json({ status: true, data });
//   });
// });


app.get('/api/getleads', (req, res) => {
  const userId = req.headers['user-id'];
  const userPermissions = req.headers['user-permissions'];

  if (!userId || !userPermissions) {
    return res.status(400).send({ message: 'User ID or permissions not provided' });
  }

  let query = `
    SELECT 
        l.id, 
        l.assigned_to, 
        u.username AS assigned_username,
        l.status AS status_id, 
        ls.status_name AS status, 
        l.name, 
        l.mobile_number, 
        l.email, 
        l.city,
        l.website_type AS website_type_id,
        l.industry_type AS industry_type_id,
        st.servicename AS website_type, 
        it.industryname AS industry_type, 
        cm.id AS contact_preference_id, 
        cm.method_name AS contact_preference, 
        l.preferred_date, 
        l.preferred_time, 
        l.requirements, 
        l.lead_source AS source_id,
        ls_table.source_name AS lead_source,
        l.checkbox_ids, 
        l.created_at, 
        l.updated_at,
        COUNT(f.id) AS followUpCount
    FROM 
        ekarigar_leads l
    LEFT JOIN 
        ekarigar_servicetype st ON l.website_type = st.id
    LEFT JOIN 
        ekarigar_industrytype it ON l.industry_type = it.id
    LEFT JOIN 
        ekarigar_followups f ON l.id = f.lead_id
    LEFT JOIN 
        ekarigar_users u ON l.assigned_to = u.id
    LEFT JOIN 
        ekarigar_contact_methods cm ON l.contact_preference = cm.id
    LEFT JOIN 
        ekarigar_leads_status ls ON l.status = ls.id
    LEFT JOIN 
        ekarigar_lead_source ls_table ON l.lead_source = ls_table.id
    WHERE 
        MONTH(l.created_at) = MONTH(CURDATE()) 
        AND YEAR(l.created_at) = YEAR(CURDATE())
  `;

  if (userPermissions !== '1') {
    console.log("Restricted permissions: Fetching assigned leads");
    query += ` AND (l.assigned_to = ${connection.escape(userId)} 
               OR l.id IN (SELECT id FROM ekarigar_leads WHERE assigned_to = ${connection.escape(userId)}))`;
  } else {
    console.log("Admin permissions: Fetching all leads for current month");
  }

  query += ` GROUP BY l.id ORDER BY l.id DESC;`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error fetching leads' });
    }

    const data = results.map(row => ({
      id: row.id,
      assigned_to_id: row.assigned_to,
      assigned_to: row.assigned_username || null,
      status_id: row.status_id,
      status: row.status,
      name: row.name,
      mobile_number: row.mobile_number,
      email: row.email,
      city: row.city,
      website_type_id: row.website_type_id,
      industry_type_id: row.industry_type_id,
      website_type: row.website_type,
      industry_type: row.industry_type,
      contact_preference: row.contact_preference,
      contact_preference_id: row.contact_preference_id || null,
      preferred_date: row.preferred_date,
      preferred_time: row.preferred_time,
      requirements: row.requirements,
      source_id: row.source_id,
      lead_source: row.lead_source,
      checkbox_ids: row.checkbox_ids,
      created_at: row.created_at,
      updated_at: row.updated_at,
      followUpCount: row.followUpCount || 0,
    }));

    res.json({ status: true, data });
  });
});

app.get('/api/getleads_wip', (req, res) => {
  const userId = req.headers['user-id'];
  const userPermissions = req.headers['user-permissions'];

  // Get startDate and endDate from query params (optional)
  const { startDate, endDate } = req.query;

  if (!userId || !userPermissions) {
    return res.status(400).send({ message: 'User ID or permissions not provided' });
  }

  // Base query
  let query = `
    SELECT 
        l.id, 
        l.assigned_to, 
        u.username AS assigned_username,
        l.status AS status_id, 
        ls.status_name AS status, 
        l.name, 
        l.mobile_number, 
        l.email, 
        l.city,
        l.website_type AS website_type_id,
        l.industry_type AS industry_type_id,
        st.servicename AS website_type, 
        it.industryname AS industry_type, 
        cm.id AS contact_preference_id, 
        cm.method_name AS contact_preference, 
        l.preferred_date, 
        l.preferred_time, 
        l.requirements, 
        l.lead_source AS source_id,
        ls_table.source_name AS lead_source,
        l.checkbox_ids, 
        l.created_at, 
        l.updated_at,
        l.likelihood_id,
        COUNT(f.id) AS followUpCount
    FROM 
        ekarigar_leads l
    LEFT JOIN 
        ekarigar_servicetype st ON l.website_type = st.id
    LEFT JOIN 
        ekarigar_industrytype it ON l.industry_type = it.id
    LEFT JOIN 
        ekarigar_followups f ON l.id = f.lead_id
    LEFT JOIN 
        ekarigar_users u ON l.assigned_to = u.id
    LEFT JOIN 
        ekarigar_contact_methods cm ON l.contact_preference = cm.id
    LEFT JOIN 
        ekarigar_leads_status ls ON l.status = ls.id
    LEFT JOIN 
        ekarigar_lead_source ls_table ON l.lead_source = ls_table.id
    WHERE 
  `;

  // Add date filtering condition
  if (startDate && endDate) {
    query += ` DATE(l.created_at) BETWEEN ${connection.escape(startDate)} AND ${connection.escape(endDate)}`;
  } else {
    query += ` MONTH(l.created_at) = MONTH(CURDATE()) AND YEAR(l.created_at) = YEAR(CURDATE())`;
  }

  // Filter based on permissions
  if (userPermissions !== '1') {
    console.log("Restricted permissions: Fetching assigned leads");
    query += ` AND (l.assigned_to = ${connection.escape(userId)} 
               OR l.id IN (SELECT id FROM ekarigar_leads WHERE assigned_to = ${connection.escape(userId)}))`;
  } else {
    console.log("Admin permissions: Fetching all leads");
  }

  query += ` GROUP BY l.id ORDER BY l.id DESC;`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error fetching leads' });
    }

    const data = results.map(row => ({
      id: row.id,
      assigned_to_id: row.assigned_to,
      assigned_to: row.assigned_username || null,
      status_id: row.status_id,
      status: row.status,
      name: row.name,
      mobile_number: row.mobile_number,
      email: row.email,
      city: row.city,
      website_type_id: row.website_type_id,
      industry_type_id: row.industry_type_id,
      website_type: row.website_type,
      industry_type: row.industry_type,
      contact_preference: row.contact_preference,
      contact_preference_id: row.contact_preference_id || null,
      preferred_date: row.preferred_date,
      preferred_time: row.preferred_time,
      requirements: row.requirements,
      source_id: row.source_id,
      lead_source: row.lead_source,
      checkbox_ids: row.checkbox_ids,
      created_at: row.created_at,
      updated_at: row.updated_at,
      likelihood_id : row.likelihood_id,
      followUpCount: row.followUpCount || 0,
    }));

    res.json({ status: true, data });
  });
});


///-----with updated on filter params-----------

app.get('/api/getleads_wipp', (req, res) => {
  const userId = req.headers['user-id'];
  const userPermissions = req.headers['user-permissions'];
  
  // Get date parameters for both created and updated dates
  const { 
    createdStartDate, 
    createdEndDate, 
    updatedStartDate, 
    updatedEndDate 
  } = req.query;
  
  if (!userId || !userPermissions) {
    return res.status(400).send({ message: 'User ID or permissions not provided' });
  }
  
  // Base query
  let query = `
    SELECT 
        l.id, 
        l.assigned_to, 
        u.username AS assigned_username,
        l.status AS status_id, 
        ls.status_name AS status, 
        l.name, 
        l.mobile_number, 
        l.email, 
        l.city,
        l.website_type AS website_type_id,
        l.industry_type AS industry_type_id,
        st.servicename AS website_type, 
        it.industryname AS industry_type, 
        cm.id AS contact_preference_id, 
        cm.method_name AS contact_preference, 
        l.preferred_date, 
        l.preferred_time, 
        l.requirements, 
        l.lead_source AS source_id,
        ls_table.source_name AS lead_source,
        l.checkbox_ids, 
        l.created_at, 
        l.updated_at,
        l.likelihood_id,
        COUNT(f.id) AS followUpCount
    FROM 
        ekarigar_leads l
    LEFT JOIN 
        ekarigar_servicetype st ON l.website_type = st.id
    LEFT JOIN 
        ekarigar_industrytype it ON l.industry_type = it.id
    LEFT JOIN 
        ekarigar_followups f ON l.id = f.lead_id
    LEFT JOIN 
        ekarigar_users u ON l.assigned_to = u.id
    LEFT JOIN 
        ekarigar_contact_methods cm ON l.contact_preference = cm.id
    LEFT JOIN 
        ekarigar_leads_status ls ON l.status = ls.id
    LEFT JOIN 
        ekarigar_lead_source ls_table ON l.lead_source = ls_table.id
    WHERE 1=1
  `;
  
  // Build date filtering conditions
  let dateConditions = [];
  
  // Created date filter
  if (createdStartDate && createdEndDate) {
    dateConditions.push(`DATE(l.created_at) BETWEEN ${connection.escape(createdStartDate)} AND ${connection.escape(createdEndDate)}`);
  }
  
  // Updated date filter
  if (updatedStartDate && updatedEndDate) {
    dateConditions.push(`DATE(l.updated_at) BETWEEN ${connection.escape(updatedStartDate)} AND ${connection.escape(updatedEndDate)}`);
  }
  
  // If no date filters are provided, default to current month for created_at
  if (dateConditions.length === 0) {
    dateConditions.push(`MONTH(l.created_at) = MONTH(CURDATE()) AND YEAR(l.created_at) = YEAR(CURDATE())`);
  }
  
  // Add date conditions to query
  if (dateConditions.length > 0) {
    query += ` AND (${dateConditions.join(' AND ')})`;
  }
  
  // Filter based on permissions
  if (userPermissions !== '1') {
    console.log("Restricted permissions: Fetching assigned leads");
    query += ` AND (l.assigned_to = ${connection.escape(userId)} 
               OR l.id IN (SELECT id FROM ekarigar_leads WHERE assigned_to = ${connection.escape(userId)}))`;
  } else {
    console.log("Admin permissions: Fetching all leads");
  }
  
  query += ` GROUP BY l.id ORDER BY l.id DESC;`;
  
  console.log('Executing query:', query); // For debugging
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error fetching leads' });
    }
    
    const data = results.map(row => ({
      id: row.id,
      assigned_to_id: row.assigned_to,
      assigned_to: row.assigned_username || null,
      status_id: row.status_id,
      status: row.status,
      name: row.name,
      mobile_number: row.mobile_number,
      email: row.email,
      city: row.city,
      website_type_id: row.website_type_id,
      industry_type_id: row.industry_type_id,
      website_type: row.website_type,
      industry_type: row.industry_type,
      contact_preference: row.contact_preference,
      contact_preference_id: row.contact_preference_id || null,
      preferred_date: row.preferred_date,
      preferred_time: row.preferred_time,
      requirements: row.requirements,
      source_id: row.source_id,
      lead_source: row.lead_source,
      checkbox_ids: row.checkbox_ids,
      created_at: row.created_at,
      updated_at: row.updated_at,
      likelihood_id: row.likelihood_id,
      followUpCount: row.followUpCount || 0,
    }));
    
    res.json({ status: true, data });
  });
});



app.post('/api/leads', (req, res) => {
  const lead = req.body;
  
  // Get current timestamp in Indian timezone
  const createdAt = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  const updatedAt = createdAt;

  // Check if the `selectedCheckboxes` array is empty, and handle it accordingly
  const checkboxIds = lead.selectedCheckboxes && lead.selectedCheckboxes.length > 0 
    ? lead.selectedCheckboxes.join(',') 
    : null;

  // Validate assigned_to
  if (!lead.assigned_to) {
    return res.status(400).json({ 
      status: false, 
      message: 'Assigned to field is required' 
    });
  }

  // Construct the SQL query to insert the lead
  const query = `
    INSERT INTO ekarigar_leads 
    (name, mobile_number, assigned_to, email, city, website_type, industry_type, 
     contact_preference, preferred_date, preferred_time, requirements, lead_source, 
     checkbox_ids, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    lead.name,
    lead.mobile_number,
    lead.assigned_to, // This will now come from the dropdown
    lead.email,
    lead.city,
    lead.service_type,
    lead.industry_type,
    lead.contact_preference,
    lead.preferred_date,
    lead.preferred_time_slot,
    lead.requirements,
    lead.lead_source || 'Manual',
    checkboxIds,
    createdAt,
    updatedAt
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting lead:', err);
      return res.status(500).json({ 
        status: false, 
        message: 'Error saving lead', 
        error: err 
      });
    }
    
    // Return success response with status true
    res.status(200).json({ 
      status: true, 
      message: 'Lead saved successfully', 
      id: result.insertId 
    });
  });
});

// app.put('/api/update_leads', (req, res) => {
//   const lead = req.body;

//   // Get current timestamp in Indian timezone for `updated_at`
//   const updatedAt = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');



//   // Construct the SQL query to update the lead
//   const query = `
//     UPDATE ekarigar_leads 
//     SET 
//       name = ?, 
//       mobile_number = ?,
//       email = ?, 
//       city = ?, 
//       website_type = ?, 
//       industry_type = ?, 
//       contact_preference = ?, 
//       preferred_date = ?, 
//       preferred_time = ?, 
//       requirements = ?, 
//       lead_source = ?, 
      
//       status = ?,
//       updated_at = ? 
//     WHERE id = ?
//   `;

//   const values = [
//     lead.name,
//     lead.mobile_number,
//     lead.email,
//     lead.city,
//     lead.website_type_id,
//     lead.industry_type_id,
//     lead.contact_preference,
//     lead.preferred_date,
//     lead.preferred_time,
//     lead.requirements,
//     lead.lead_source || 'Manual', // Use provided lead_source or default to 'Manual'
//      lead.status,
//     updatedAt, // Pass Indian timezone formatted timestamp
//     lead.id // ID of the lead to update
//   ];

//   connection.query(query, values, (err, result) => {
//     if (err) {
//       console.error('Error updating lead:', err);
//       return res.status(500).json({ status: false, message: 'Error updating lead', error: err });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ status: false, message: 'Lead not found' });
//     }

//     // Return success response with status true
//     res.status(200).json({ status: true, message: 'Lead updated successfully' });
//   });
// });

app.put('/api/update_leads', async (req, res) => {
  const lead = req.body;

  // Get current timestamp in Indian timezone for `updated_at`
  const updatedAt = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

  // Function to get the assigned user based on the selected service (website_type)
  async function getAssignedUser(serviceId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id
        FROM ekarigar_users
        WHERE FIND_IN_SET(?, assigned_services) > 0
        AND delete_status = '0'
        LIMIT 1
      `;
      connection.query(query, [serviceId], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length > 0) {
          resolve(results[0].id); // Return the user ID of the first match
        } else {
          resolve(1); // Default to admin if no active user is found (fallback)
        }
      });
    });
  }

  // Get the assigned user based on the website_type (service)
  try {
    const assignedUser = await getAssignedUser(lead.website_type_id); // Pass website_type_id to get assigned user

    // Construct the SQL query to update the lead
    // const query = `
    //   UPDATE ekarigar_leads 
    //   SET 
    //     name = ?, 
    //     mobile_number = ?,
    //     email = ?, 
    //     city = ?, 
    //     website_type = ?, 
    //     industry_type = ?, 
        
    //     preferred_date = ?, 
    //     preferred_time = ?, 
    //     requirements = ?, 
    //     lead_source = ?, 
    //     assigned_to = ?,  -- Update assigned_to based on the selected service type
    //     status = ?,
    //     updated_at = ? 
    //   WHERE id = ?
    // `;
    
    // const values = [
    //   lead.name,
    //   lead.mobile_number,
    //   lead.email,
    //   lead.city,
    //   lead.website_type_id,  // website_type_id will be used to fetch the assigned user
    //   lead.industry_type_id,
     
    //   lead.preferred_date,
    //   lead.preferred_time,
    //   lead.requirements,
    //   lead.source_id || 0, // Use provided lead_source or default to 'Manual'
    //   assignedUser, // Update assigned_to with the user assigned to the service type
    //   lead.status_id,
    //   updatedAt, // Pass Indian timezone formatted timestamp
    //   lead.id // ID of the lead to update
    // ];
    
     const query = `
      UPDATE ekarigar_leads 
      SET 
        name = ?, 
        mobile_number = ?,
        email = ?, 
        city = ?, 
        website_type = ?, 
        industry_type = ?, 
        
        preferred_date = ?, 
        preferred_time = ?, 
        requirements = ?, 
        lead_source = ?, 
        
        status = ?,
        updated_at = ? 
      WHERE id = ?
    `;

    const values = [
      lead.name,
      lead.mobile_number,
      lead.email,
      lead.city,
      lead.website_type_id,  // website_type_id will be used to fetch the assigned user
      lead.industry_type_id,
     
      lead.preferred_date,
      lead.preferred_time,
      lead.requirements,
      lead.source_id || 0, // Use provided lead_source or default to 'Manual'
      
      lead.status_id,
      updatedAt, // Pass Indian timezone formatted timestamp
      lead.id // ID of the lead to update
    ];

    // Execute the update query
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error updating lead:', err);
        return res.status(500).json({ status: false, message: 'Error updating lead', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, message: 'Lead not found' });
      }

      // Return success response with status true
      res.status(200).json({ status: true, message: 'Lead updated successfully' });
    });
  } catch (err) {
    console.error('Error fetching assigned user:', err);
    res.status(500).json({ status: false, message: 'Error fetching assigned user', error: err });
  }
});


app.delete('/api/leads/:lead_id', async (req, res) => {
    try {
        const { lead_id } = req.params;

        // Validate input
        if (!lead_id) {
            return res.status(400).json({ message: 'Lead ID is required' });
        }

        // Start transaction
        connection.beginTransaction((err) => {
            if (err) {
                console.error('Transaction start error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Delete follow-ups first
            const deleteFollowupsQuery = `DELETE FROM ekarigar_followups WHERE lead_id = ?`;

            connection.query(deleteFollowupsQuery, [lead_id], (followupErr) => {
                if (followupErr) {
                    console.error('Error deleting follow-ups:', followupErr);
                    return connection.rollback(() => {
                        res.status(500).json({ message: 'Error deleting follow-ups' });
                    });
                }

                // Delete the lead
                const deleteLeadQuery = `DELETE FROM ekarigar_leads WHERE id = ?`;

                connection.query(deleteLeadQuery, [lead_id], (leadErr, result) => {
                    if (leadErr) {
                        console.error('Error deleting lead:', leadErr);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error deleting lead' });
                        });
                    }

                    // Check if any row was deleted
                    if (result.affectedRows === 0) {
                        return connection.rollback(() => {
                            res.status(404).json({ message: 'Lead not found' });
                        });
                    }

                    // Commit transaction
                    connection.commit((commitErr) => {
                        if (commitErr) {
                            console.error('Transaction commit error:', commitErr);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Error completing delete operation' });
                            });
                        }

                        res.status(200).json({ message: 'Lead deleted successfully' });
                    });
                });
            });
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Unexpected server error' });
    }
});



// API Route
app.post('/api/saveFollowUp', upload.single('followup_doc'), (req, res) => {
    
    // const { lead_id, description, medium, followup_date, attended_by, assign_to, followup_doc_description } = req.body;
    // const file = req.file;
    
    // console.log(req.body);
  try {
    const { lead_id, description, medium, followup_date, attended_by, assign_to, followup_doc_description } = req.body;
    const file = req.file;
    
//     [Object: null prototype] {
//   lead_id: '221',
//   description: 'Officiis duis occaec',
//   medium: 'meeting',
//   attended_by: '1',
//   followup_date: '2000-04-10T10:19',
//   followup_doc_description: 'Labore animi velit '
// }

    // Validate required fields
    if (!lead_id || !description || !medium  || !attended_by ) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    // Prepare the file path if file is uploaded
    let filePath = null;
    if (file) {
      filePath = `/uploads/${file.filename}`;
    }

    // Generate current timestamps
    const created_at = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const updated_at = created_at;

    // Insert data into the database
    const query = `
      INSERT INTO ekarigar_followups (lead_id, description, medium, attended_by, followup_doc_description, followup_doc, followup_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [lead_id, description, medium, attended_by, followup_doc_description, filePath, followup_date, created_at, updated_at];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to save follow-up' });
      }

      res.json({ status: 'success', message: 'Follow-up saved successfully', id: result.insertId });
    });
  } catch (error) {
    console.error('Error in saveFollowUp API:', error);
    res.status(500).json({ status: 'error', message: 'An unexpected error occurred' });
  }
});
// app.get('/api/get_followups', (req, res) => {
//   const leadId = req.query.lead_id; // Getting lead_id from the query parameter

//   // Query to get lead details
//   const leadQuery = `
//     SELECT 
//       leads.id AS lead_id,
//       leads.name AS lead_name,
//       leads.mobile_number,
//       leads.email AS lead_email,
//       leads.city,
//       leads.website_type,
//       leads.industry_type,
//       leads.contact_preference,
//       s.servicename AS website_type_name,
//       i.industryname AS industry_type_name
//     FROM ekarigar_leads leads
//     LEFT JOIN ekarigar_servicetype s ON leads.website_type = s.id
//     LEFT JOIN ekarigar_industrytype i ON leads.industry_type = i.id
//     WHERE leads.id = ?
//   `;

// //   // Query to get follow-up details
// //   const followUpQuery = `
// //     SELECT 
// //       followups.id AS followup_id,
// //       followups.lead_id,
// //       followups.description,
// //       followups.medium,
// //       followups.attended_by,
// //       followups.followup_date,
// //       followups.created_at,
// //       followups.updated_at,
// //       users.username AS attended_by_name
// //     FROM ekarigar_followups followups
// //     LEFT JOIN ekarigar_users users ON followups.attended_by = users.id
// //     WHERE followups.lead_id = ?
// //     ORDER BY followups.followup_date DESC
// //   `;


// const followUpQuery = `
//   SELECT 
//     followups.id AS followup_id,
//     followups.lead_id,
//     followups.description,
//     followups.medium,
//     followups.attended_by,
//     followups.assign_to,
//     followups.followup_date,
//     followups.created_at,
//     followups.updated_at,
//     followups.followup_doc_description,
//     followups.followup_doc,
//     users.username AS attended_by_name
//   FROM ekarigar_followups followups
//   LEFT JOIN ekarigar_users users ON followups.attended_by = users.id
//   WHERE followups.lead_id = ?
//   ORDER BY followups.followup_date DESC
// `;



//   // Fetch lead details first
//   connection.query(leadQuery, [leadId], (error, leadResults) => {
//     if (error) {
//       console.error('Error fetching lead details:', error);
//       return res.status(500).json({ status: false, error: 'Error fetching lead details' });
//     }

//     // Check if the lead exists
//     if (leadResults.length === 0) {
//       return res.status(404).json({ status: false, error: 'Lead not found' });
//     }

//     const leadDetails = {
//       lead_id: leadResults[0].lead_id,
//       lead_name: leadResults[0].lead_name,
//       mobile_number: leadResults[0].mobile_number,
//       lead_email: leadResults[0].lead_email,
//       city: leadResults[0].city,
//       website_type: leadResults[0].website_type,
//       industry_type: leadResults[0].industry_type,
//       contact_preference: leadResults[0].contact_preference,
//       website_type_name: leadResults[0].website_type_name,
//       industry_type_name: leadResults[0].industry_type_name
//     };

//     // Fetch follow-up details
//     connection.query(followUpQuery, [leadId], (error, followUpResults) => {
//       if (error) {
//         console.error('Error fetching follow-up details:', error);
//         return res.status(500).json({ status: false, error: 'Error fetching follow-up details' });
//       }

//       // Map follow-up results to desired structure
//       const followups = followUpResults.map(followup => ({
//         followup_id: followup.followup_id,
//         description: followup.description,
//         medium: followup.medium,
//         attended_by: followup.attended_by,
//         attended_by_name: followup.attended_by_name,
//         followup_date: followup.followup_date,
//         created_at: followup.created_at,
//         updated_at: followup.updated_at
//       }));

//       // Return response with lead details and follow-up history
//       return res.json({
//         status: true,
//         lead: leadDetails,
//         followups: followups // Empty array if no follow-ups exist
//       });
//     });
//   });
// });


// app.get('/api/get_followups', (req, res) => {
//   const leadId = req.query.lead_id; // Getting lead_id from the query parameter

//   // Query to get lead details
//   const leadQuery = `
//     SELECT 
//       leads.id AS lead_id,
//       leads.name AS lead_name,
//       leads.mobile_number,
//       leads.email AS lead_email,
//       leads.city,
//       leads.website_type,
//       leads.industry_type,
//       leads.contact_preference,
//       s.servicename AS website_type_name,
//       i.industryname AS industry_type_name
//     FROM ekarigar_leads leads
//     LEFT JOIN ekarigar_servicetype s ON leads.website_type = s.id
//     LEFT JOIN ekarigar_industrytype i ON leads.industry_type = i.id
//     WHERE leads.id = ?
//   `;

//   // Query to get follow-up details
//   const followUpQuery = `
//     SELECT 
//       followups.id AS followup_id,
//       followups.lead_id,
//       followups.description,
//       followups.medium,
//       followups.attended_by,
//       followups.assign_to,
//       followups.followup_date,
//       followups.created_at,
//       followups.updated_at,
//       followups.followup_doc_description,
//       followups.followup_doc,
//       users.username AS attended_by_name
//     FROM ekarigar_followups followups
//     LEFT JOIN ekarigar_users users ON followups.attended_by = users.id
//     WHERE followups.lead_id = ?
//     ORDER BY followups.followup_date DESC
//   `;

//   // Fetch lead details first
//   connection.query(leadQuery, [leadId], (error, leadResults) => {
//     if (error) {
//       console.error('Error fetching lead details:', error);
//       return res.status(500).json({ status: false, error: 'Error fetching lead details' });
//     }

//     // Check if the lead exists
//     if (leadResults.length === 0) {
//       return res.status(404).json({ status: false, error: 'Lead not found' });
//     }

//     const leadDetails = {
//       lead_id: leadResults[0].lead_id,
//       lead_name: leadResults[0].lead_name,
//       mobile_number: leadResults[0].mobile_number,
//       lead_email: leadResults[0].lead_email,
//       city: leadResults[0].city,
//       website_type: leadResults[0].website_type,
//       industry_type: leadResults[0].industry_type,
//       contact_preference: leadResults[0].contact_preference,
//       website_type_name: leadResults[0].website_type_name,
//       industry_type_name: leadResults[0].industry_type_name
//     };

//     // Fetch follow-up details
//     connection.query(followUpQuery, [leadId], (error, followUpResults) => {
//       if (error) {
//         console.error('Error fetching follow-up details:', error);
//         return res.status(500).json({ status: false, error: 'Error fetching follow-up details' });
//       }

//       // Map follow-up results to desired structure
//       const followups = followUpResults.map(followup => ({
//         followup_id: followup.followup_id,
//         description: followup.description,
//         medium: followup.medium,
//         attended_by: followup.attended_by,
//         attended_by_name: followup.attended_by_name,
//         followup_date: followup.followup_date,
//         created_at: followup.created_at,
//         updated_at: followup.updated_at,
//         followup_doc_description: followup.followup_doc_description, // Document description
//         followup_doc: followup.followup_doc // Document file path
//       }));

//       // Return response with lead details and follow-up history
//       return res.json({
//         status: true,
//         lead: leadDetails,
//         followups: followups // Include follow-ups with documents and descriptions
//       });
//     });
//   });
// });


// app.get('/api/get_followups', (req, res) => {
//   const leadId = req.query.lead_id; // Getting lead_id from the query parameter

//   // Query to get lead details, including checkbox options
// //   const leadQuery = `
// //     SELECT 
// //       leads.id AS lead_id,
// //       leads.name AS lead_name,
// //       leads.mobile_number,
// //       leads.email AS lead_email,
// //       leads.city,
// //       leads.website_type,
// //       leads.industry_type,
// //       leads.contact_preference,
// //       leads.checkbox_ids, 
// //       leads.requirements,
// //       s.servicename AS website_type_name,
// //       i.industryname AS industry_type_name,
// //       GROUP_CONCAT(cb.option_name) AS checkbox_options
// //     FROM ekarigar_leads leads
// //     LEFT JOIN ekarigar_servicetype s ON leads.website_type = s.id
// //     LEFT JOIN ekarigar_industrytype i ON leads.industry_type = i.id
// //     LEFT JOIN ekarigar_lead_checkbox cb 
// //       ON FIND_IN_SET(cb.id, leads.checkbox_ids) > 0
// //     WHERE leads.id = ?
// //     GROUP BY leads.id
// //   `;

// const leadQuery = `
//     SELECT 
//       leads.id AS lead_id,
//       leads.name AS lead_name,
//       leads.mobile_number,
//       leads.email AS lead_email,
//       leads.city,
//       leads.website_type,
//       leads.industry_type,
//       leads.contact_preference,
//       leads.checkbox_ids, 
//       leads.requirements,
//       leads.lead_source,
//       ids.source_name AS lead_source_name,
//       sts.id AS lead_status,
//       s.servicename AS website_type_name,
//       i.industryname AS industry_type_name,
//       GROUP_CONCAT(cb.option_name) AS checkbox_options
//     FROM ekarigar_leads leads
//     LEFT JOIN ekarigar_servicetype s ON leads.website_type = s.id
//     LEFT JOIN ekarigar_industrytype i ON leads.industry_type = i.id
//     LEFT JOIN ekarigar_lead_source ids ON leads.lead_source = ids.id
//     LEFT JOIN ekarigar_leads_status sts ON leads.status = sts.id
//     LEFT JOIN ekarigar_lead_checkbox cb 
//       ON FIND_IN_SET(cb.id, leads.checkbox_ids) > 0
//     WHERE leads.id = ?
//     GROUP BY leads.id;

//   `;
  
 

//   // Query to get follow-up details
//   const followUpQuery = `
//     SELECT 
//       followups.id AS followup_id,
//       followups.lead_id,
//       followups.description,
//       followups.medium,
//       followups.attended_by,
//       followups.assign_to,
//       followups.followup_date,
//       followups.created_at,
//       followups.updated_at,
//       followups.followup_doc_description,
//       followups.followup_doc,
//       users.username AS attended_by_name
//     FROM ekarigar_followups followups
//     LEFT JOIN ekarigar_users users ON followups.attended_by = users.id
//     WHERE followups.lead_id = ?
//     ORDER BY followups.followup_date DESC
//   `;

//   // Fetch lead details first
//   connection.query(leadQuery, [leadId], (error, leadResults) => {
//     if (error) {
//       console.error('Error fetching lead details:', error);
//       return res.status(500).json({ status: false, error: 'Error fetching lead details' });
//     }

//     // Check if the lead exists
//     if (leadResults.length === 0) {
//       return res.status(404).json({ status: false, error: 'Lead not found' });
//     }

//     const leadDetails = {
//       lead_id: leadResults[0].lead_id,
//       lead_name: leadResults[0].lead_name,
//       mobile_number: leadResults[0].mobile_number,
//       lead_email: leadResults[0].lead_email,
//       city: leadResults[0].city,
//       website_type: leadResults[0].website_type,
//       industry_type: leadResults[0].industry_type,
//       contact_preference: leadResults[0].contact_preference,
//       website_type_name: leadResults[0].website_type_name,
//       industry_type_name: leadResults[0].industry_type_name,
//       source:leadResults[0].lead_source_name,
//       lead_descp: leadResults[0].requirements,
//       lead_status: leadResults[0].lead_status,
//       checkbox_options: leadResults[0].checkbox_options ? leadResults[0].checkbox_options.split(',') : [] // Split options into an array
//     };

//     // Fetch follow-up details
//     connection.query(followUpQuery, [leadId], (error, followUpResults) => {
//       if (error) {
//         console.error('Error fetching follow-up details:', error);
//         return res.status(500).json({ status: false, error: 'Error fetching follow-up details' });
//       }

//       // Map follow-up results to desired structure
//       const followups = followUpResults.map(followup => ({
//         followup_id: followup.followup_id,
//         description: followup.description,
//         medium: followup.medium,
//         attended_by: followup.attended_by,
//         attended_by_name: followup.attended_by_name,
//         followup_date: followup.followup_date,
//         created_at: followup.created_at,
//         updated_at: followup.updated_at,
//         followup_doc_description: followup.followup_doc_description, // Document description
//         followup_doc: followup.followup_doc // Document file path
//       }));

//       // Return response with lead details and follow-up history
//       return res.json({
//         status: true,
//         lead: leadDetails,
//         followups: followups // Include follow-ups with documents and descriptions
//       });
//     });
//   });
// });


app.get('/api/get_followups', (req, res) => {
  const leadId = req.query.lead_id; // Getting lead_id from the query parameter

  // Query to get lead details, including checkbox options
//   const leadQuery = `
//     SELECT 
//       leads.id AS lead_id,
//       leads.name AS lead_name,
//       leads.mobile_number,
//       leads.email AS lead_email,
//       leads.city,
//       leads.website_type,
//       leads.industry_type,
//       leads.contact_preference,
//       leads.checkbox_ids, 
//       leads.requirements,
//       s.servicename AS website_type_name,
//       i.industryname AS industry_type_name,
//       GROUP_CONCAT(cb.option_name) AS checkbox_options
//     FROM ekarigar_leads leads
//     LEFT JOIN ekarigar_servicetype s ON leads.website_type = s.id
//     LEFT JOIN ekarigar_industrytype i ON leads.industry_type = i.id
//     LEFT JOIN ekarigar_lead_checkbox cb 
//       ON FIND_IN_SET(cb.id, leads.checkbox_ids) > 0
//     WHERE leads.id = ?
//     GROUP BY leads.id
//   `;

const leadQuery = `
    SELECT 
      leads.id AS lead_id,
      leads.name AS lead_name,
      leads.mobile_number,
      leads.email AS lead_email,
      leads.city,
      leads.website_type,
      leads.industry_type,
      leads.contact_preference,
      leads.checkbox_ids, 
      leads.requirements,
      leads.lead_source,
      leads.likelihood_id,
      ids.source_name AS lead_source_name,
      sts.id AS lead_status,
      s.servicename AS website_type_name,
      i.industryname AS industry_type_name,
      GROUP_CONCAT(cb.option_name) AS checkbox_options
    FROM ekarigar_leads leads
    LEFT JOIN ekarigar_servicetype s ON leads.website_type = s.id
    LEFT JOIN ekarigar_industrytype i ON leads.industry_type = i.id
    LEFT JOIN ekarigar_lead_source ids ON leads.lead_source = ids.id
    LEFT JOIN ekarigar_leads_status sts ON leads.status = sts.id
    LEFT JOIN ekarigar_lead_checkbox cb 
      ON FIND_IN_SET(cb.id, leads.checkbox_ids) > 0
    WHERE leads.id = ?
    GROUP BY leads.id;

  `;
  
 

  // Query to get follow-up details
  const followUpQuery = `
    SELECT 
      followups.id AS followup_id,
      followups.lead_id,
      followups.description,
      followups.medium,
      followups.attended_by,
      followups.assign_to,
      followups.followup_date,
      followups.created_at,
      followups.updated_at,
      followups.followup_doc_description,
      followups.followup_doc,
      users.username AS attended_by_name
    FROM ekarigar_followups followups
    LEFT JOIN ekarigar_users users ON followups.attended_by = users.id
    WHERE followups.lead_id = ?
    ORDER BY followups.followup_date DESC
  `;

  // Fetch lead details first
  connection.query(leadQuery, [leadId], (error, leadResults) => {
    if (error) {
      console.error('Error fetching lead details:', error);
      return res.status(500).json({ status: false, error: 'Error fetching lead details' });
    }

    // Check if the lead exists
    if (leadResults.length === 0) {
      return res.status(404).json({ status: false, error: 'Lead not found' });
    }

    const leadDetails = {
      lead_id: leadResults[0].lead_id,
      lead_name: leadResults[0].lead_name,
      mobile_number: leadResults[0].mobile_number,
      lead_email: leadResults[0].lead_email,
      city: leadResults[0].city,
      website_type: leadResults[0].website_type,
      industry_type: leadResults[0].industry_type,
      contact_preference: leadResults[0].contact_preference,
      website_type_name: leadResults[0].website_type_name,
      industry_type_name: leadResults[0].industry_type_name,
      source:leadResults[0].lead_source_name,
      lead_descp: leadResults[0].requirements,
      lead_status: leadResults[0].lead_status,
      lead_likelihood: leadResults[0].likelihood_id,
      checkbox_options: leadResults[0].checkbox_options ? leadResults[0].checkbox_options.split(',') : [] // Split options into an array
    };

    // Fetch follow-up details
    connection.query(followUpQuery, [leadId], (error, followUpResults) => {
      if (error) {
        console.error('Error fetching follow-up details:', error);
        return res.status(500).json({ status: false, error: 'Error fetching follow-up details' });
      }

      // Map follow-up results to desired structure
      const followups = followUpResults.map(followup => ({
        followup_id: followup.followup_id,
        description: followup.description,
        medium: followup.medium,
        attended_by: followup.attended_by,
        attended_by_name: followup.attended_by_name,
        followup_date: followup.followup_date,
        created_at: followup.created_at,
        updated_at: followup.updated_at,
        followup_doc_description: followup.followup_doc_description, // Document description
        followup_doc: followup.followup_doc // Document file path
      }));

      // Return response with lead details and follow-up history
      return res.json({
        status: true,
        lead: leadDetails,
        followups: followups // Include follow-ups with documents and descriptions
      });
    });
  });
});


//--------------------------------------------wordpress form--------------------------------------------

// // Save Form Data API
app.post('/api/save-form-data_pause', async (req, res) => {
  try {
    const formData = req.body;  // Incoming data from form submission

    // Map the data asynchronously
    const mappedData = await mapFormData(formData);

    // Validate required fields
    if (!mappedData.name || !mappedData.mobile_number || !mappedData.email || !mappedData.city) {
      return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
    }

    // Prepare values for insertion into the database
    const created_at = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const updated_at = created_at;

    // Modify selectedCheckboxes to store as "1,2,3" (without quotes around numbers)
    const checkboxValues = mappedData.selectedCheckboxes;

    // Insert query to save the data
    const query = `
      INSERT INTO ekarigar_leads (name, assigned_to, mobile_number, email, city, website_type, industry_type, contact_preference, preferred_date, preferred_time, lead_source, checkbox_ids, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      mappedData.name,
      mappedData.assigned_to,
      mappedData.mobile_number,
      mappedData.email,
      mappedData.city,
      mappedData.service_type,
      mappedData.industry_type,
      mappedData.contact_preference,
      mappedData.preferred_date,
      mappedData.preferred_time_slot,
      mappedData.lead_source,
      checkboxValues,
      created_at,
      updated_at
    ];

    // Execute the query to insert data into the database
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error saving form data:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to save form data' });
      }

      res.json({ status: 'success', message: 'Form data saved successfully', id: result.insertId });
    });
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// // Set up transporter (you can use Gmail SMTP or another provider)
// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: 'khusha.ss103@gmail.com',      // Replace with your email
// //     pass: 'cgafjjbjrpibcyls'
// //   }
// // });


// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // true for port 465
//   auth: {
//     user: 'khusha.ss103@gmail.com',
//     pass: 'xeon nqyi zbts wkqh'
//   },
//   tls: {
//     rejectUnauthorized: false // bypass invalid/expired cert
//   }
// });


// app.post('/api/save-form-data_wip', async (req, res) => {
//   try {
//     const formData = req.body;

//     const mappedData = await mapFormData(formData);

//     // Validate required fields
//     if (!mappedData.name || !mappedData.mobile_number || !mappedData.email || !mappedData.city) {
//       return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
//     }

//     const created_at = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
//     const updated_at = created_at;

//     const checkboxValues = mappedData.selectedCheckboxes;

//     const query = `
//       INSERT INTO ekarigar_leads_dummy (name, assigned_to, mobile_number, email, city, website_type, industry_type, contact_preference, preferred_date, preferred_time, lead_source, checkbox_ids, created_at, updated_at)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       mappedData.name,
//       mappedData.assigned_to,
//       mappedData.mobile_number,
//       mappedData.email,
//       mappedData.city,
//       mappedData.service_type,
//       mappedData.industry_type,
//       mappedData.contact_preference,
//       mappedData.preferred_date,
//       mappedData.preferred_time_slot,
//       mappedData.lead_source,
//       checkboxValues,
//       created_at,
//       updated_at
//     ];

//     connection.query(query, values, async (err, result) => {
//       if (err) {
//         console.error('Error saving form data:', err);
//         return res.status(500).json({ status: 'error', message: 'Failed to save form data' });
//       }
      
//       //after post please 

//       // Determine recipient based on assigned_to
//       let recipientEmail = '';
//       switch (mappedData.assigned_to) {
//         case 1:
//           recipientEmail = 'khushi.ss2811@gmail.com';
//           break;
//         case 2:
//           recipientEmail = 'khushi.ss2811@gmail.com';
//           break;
//         case 3:
//           recipientEmail = 'khushi.ss103@gmail.com';
//           break;
//         default:
//           recipientEmail = '';  // or some fallback
//       }

//       if (recipientEmail) {
//         const mailOptions = {
//           from: '"Lead Notifier" <your.email@gmail.com>',
//           to: recipientEmail,
//           subject: 'New Lead Assigned',
//           html: `
//             <h3>New Lead Received</h3>
//             <p><strong>Name:</strong> ${mappedData.name}</p>
//             <p><strong>Email:</strong> ${mappedData.email}</p>
//             <p><strong>Mobile:</strong> ${mappedData.mobile_number}</p>
//             <p><strong>City:</strong> ${mappedData.city}</p>
//             <p><strong>Website Type:</strong> ${mappedData.service_type}</p>
//             <p><strong>Industry:</strong> ${mappedData.industry_type}</p>
//             <p><strong>Contact Preference:</strong> ${mappedData.contact_preference}</p>
//             <p><strong>Preferred Date:</strong> ${mappedData.preferred_date}</p>
//             <p><strong>Preferred Time:</strong> ${mappedData.preferred_time_slot}</p>
//             <p><strong>Lead Source:</strong> ${mappedData.lead_source}</p>
//             <p><strong>Checkbox IDs:</strong> ${checkboxValues}</p>
//             <p><strong>Submitted At:</strong> ${created_at}</p>
//           `
//         };

//         try {
//           await transporter.sendMail(mailOptions);
//           console.log('Email sent successfully to:', recipientEmail);
//         } catch (mailErr) {
//           console.error('Failed to send email:', mailErr);
//         }
//       }

//       res.json({ status: 'success', message: 'Form data saved successfully', id: result.insertId });
//     });

//   } catch (error) {
//     console.error('Error processing form data:', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

app.post('/api/save-form-data', async (req, res) => {
  try {
    const formData = req.body;

    const mappedData = await mapFormData(formData);

    // Validate required fields
    if (!mappedData.name || !mappedData.mobile_number || !mappedData.email || !mappedData.city) {
      return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
    }

    const created_at = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const updated_at = created_at;

    const checkboxValues = mappedData.selectedCheckboxes;

    // const query = `
    //   INSERT INTO ekarigar_leads_dummy (name, assigned_to, mobile_number, email, city, website_type, industry_type, contact_preference, preferred_date, preferred_time, lead_source, checkbox_ids, created_at, updated_at)
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    // `;
    
     const query = `
      INSERT INTO ekarigar_leads (name, assigned_to, mobile_number, email, city, website_type, industry_type, contact_preference, preferred_date, preferred_time, lead_source, checkbox_ids, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      mappedData.name,
      mappedData.assigned_to,
      mappedData.mobile_number,
      mappedData.email,
      mappedData.city,
      mappedData.service_type,
      mappedData.industry_type,
      mappedData.contact_preference,
      mappedData.preferred_date,
      mappedData.preferred_time_slot,
      mappedData.lead_source,
      checkboxValues,
      created_at,
      updated_at
    ];

    connection.query(query, values, async (err, result) => {
      if (err) {
        console.error('Error saving form data:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to save form data' });
      }

      // Prepare payload for 3rd-party API
      const thirdPartyPayload = {
        name: mappedData.name,
        assigned_to: mappedData.assigned_to,
        mobile_number: mappedData.mobile_number,
        email: mappedData.email,
        city: mappedData.city,
        website_type: mappedData.service_type,
        industry_type: mappedData.industry_type,
        contact_preference: mappedData.contact_preference,
        preferred_date: mappedData.preferred_date,
        preferred_time_slot: mappedData.preferred_time_slot,
        lead_source: mappedData.lead_source,
        checkbox_ids: checkboxValues,
        created_at,
        updated_at,
      };

      try {
        // Call the third-party API
        const apiResponse = await axios.post('https://shopify-backend-sand.vercel.app/send_lead_email', thirdPartyPayload);
        console.log('3rd party API response:', apiResponse.data);
      } catch (apiErr) {
        console.error('Failed to send data to 3rd-party API:', apiErr);
        // You can choose to continue or return an error here based on your requirements
      }

      res.json({ status: 'success', message: 'Form data saved successfully', id: result.insertId });
    });

  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});







//-------------------------------------------------usermanagement apis--------------------------------------
app.get('/api/get_usertable', (req, res) => {
  const query = `
    SELECT 
      u.id AS user_id,
      u.username,
      u.email,
      u.password,
      u.last_login,
      r.role_name,
      u.created_at,
      IFNULL(GROUP_CONCAT(DISTINCT s.servicename), '') AS assigned_services,
      IFNULL(GROUP_CONCAT(DISTINCT p.permission_name), '') AS permissions
    FROM ekarigar_users u
    LEFT JOIN ekarigar_roles r ON u.role_id = r.id
    LEFT JOIN ekarigar_servicetype s ON FIND_IN_SET(s.id, u.assigned_services)
    LEFT JOIN ekarigar_permissions p ON FIND_IN_SET(p.id, u.permissions)
    WHERE u.delete_status = '0' 
    GROUP BY u.id;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ status: false, error: 'Database query failed' });
    }
    
    res.json({ status: true, data: results });
  });
});




app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT 
      u.id AS user_id,
      u.username,
      u.email,
      u.password,
      r.role_name,
      u.created_at,
      GROUP_CONCAT(s.servicename) AS assigned_services
    FROM ekarigar_users u
    LEFT JOIN ekarigar_roles r ON u.role_id = r.id
    LEFT JOIN ekarigar_servicetype s ON FIND_IN_SET(s.id, u.assigned_services)
    WHERE u.id = ?
    GROUP BY u.id;
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ status: false, error: 'Database query failed' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const user = results[0];
    user.assigned_services = user.assigned_services ? user.assigned_services.split(',') : [];
    res.json({ status: true, data: user });
  });
});


// app.put('/api/user/:id', (req, res) => {
//   const userId = req.params.id;
//   const { username, email, role_id, assigned_services } = req.body;

//   const query = `
//     UPDATE ekarigar_users 
//     SET 
//       username = ?, 
//       email = ?, 
//       role_id = ?, 
//       assigned_services = ?
//     WHERE id = ?;
//   `;

//   connection.query(
//     query, 
//     [username, email, role_id, assigned_services, userId], 
//     (error, results) => {
//       if (error) {
//         console.error('Error updating user:', error);
//         return res.status(500).json({ status: false, error: 'Database query failed' });
//       }

//       if (results.affectedRows === 0) {
//         return res.status(404).json({ status: false, message: 'User not found' });
//       }

//       res.json({ status: true, message: 'User updated successfully' });
//     }
//   );
// });


app.post('/api/saveUser', (req, res) => {
  const { username, email, password, role, assigned_services, permissions } = req.body;

  // Validate required fields
  if (!username || !email || !password || !role) {
    return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
  }

  const created_at = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  const last_login = null;

  // Convert arrays to comma-separated strings
  const services = Array.isArray(assigned_services) ? assigned_services.join(',') : '';
  const perms = Array.isArray(permissions) ? permissions.join(',') : '';

  // Insert user into `ekarigar_users` table
  const query = `
    INSERT INTO ekarigar_users (username, email, password, role_id, assigned_services, permissions, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [username, email, password, role, services, perms, created_at];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error saving user:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to save user' });
    }

    // Success response
    res.json({ status: 'success', message: 'User saved successfully', userId: result.insertId });
  });
});



// app.put('/api/users/:id', (req, res) => {
//   const { id } = req.params;
//   const { username, email, password, role, assigned_services, permissions } = req.body;

//   if (!username || !email || !role) {
//     return res.status(400).json({ status: 'error', message: 'Required fields are missing' });
//   }

//   const updated_at = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
//   const query = `
//     UPDATE ekarigar_users
//     SET username = ?, email = ?, password = ?, role_id = ?, assigned_services = ?, permissions = ?, updated_at = ?
//     WHERE id = ?
//   `;
//   const values = [username, email, password, role, assigned_services, permissions, updated_at, id];

//   connection.query(query, values, (err, result) => {
//     if (err) {
//       console.error('Error updating user:', err);
//       return res.status(500).json({ status: 'error', message: 'Failed to update user' });
//     }
//     res.json({ status: 'success', message: 'User updated successfully' });
//   });
// });

// app.put('/api/updateLeadStatus', (req, res) => {
//   const { lead_id, status_id } = req.body;

//   // Validate input
//   if (!lead_id || !status_id) {
//     return res.status(400).json({ status: 'error', message: 'Missing lead_id or status_id' });
//   }

//   // Optional: Validate that status_id exists in `ekarigar_leads_status`
//   const statusCheckQuery = `SELECT * FROM ekarigar_leads_status WHERE id = ?`;

//   connection.query(statusCheckQuery, [status_id], (err, statusResults) => {
//     if (err) {
//       console.error('Error checking status ID:', err);
//       return res.status(500).json({ status: 'error', message: 'Database error' });
//     }

//     if (statusResults.length === 0) {
//       return res.status(400).json({ status: 'error', message: 'Invalid status ID' });
//     }

//     // Update lead status
//     const updateQuery = `
//       UPDATE ekarigar_leads 
//       SET status = ?, updated_at = NOW() 
//       WHERE id = ?
//     `;

//     connection.query(updateQuery, [status_id, lead_id], (updateErr, result) => {
//       if (updateErr) {
//         console.error('Error updating lead status:', updateErr);
//         return res.status(500).json({ status: 'error', message: 'Failed to update lead status' });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ status: 'error', message: 'Lead not found' });
//       }

//       res.json({ status: 'success', message: 'Lead status updated successfully' });
//     });
//   });
// });

app.put('/api/updateLeadStatus', (req, res) => {
  const { lead_id, status_id } = req.body;

  if (!lead_id || !status_id) {
    return res.status(400).json({ status: 'error', message: 'Missing lead_id or status_id' });
  }

  const statusCheckQuery = `SELECT * FROM ekarigar_leads_status WHERE id = ?`;

  connection.query(statusCheckQuery, [status_id], (err, statusResults) => {
    if (err) {
      console.error('Error checking status ID:', err);
      return res.status(500).json({ status: 'error', message: 'Database error' });
    }

    if (statusResults.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid status ID' });
    }

    const updatedAt = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const updateQuery = `
      UPDATE ekarigar_leads 
      SET status = ?, updated_at = ? 
      WHERE id = ?
    `;

    connection.query(updateQuery, [status_id, updatedAt, lead_id], (updateErr, result) => {
      if (updateErr) {
        console.error('Error updating lead status:', updateErr);
        return res.status(500).json({ status: 'error', message: 'Failed to update lead status' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'error', message: 'Lead not found' });
      }

      res.json({ status: 'success', message: 'Lead status updated successfully' });
    });
  });
});


app.put('/api/updateLeadLikelihood', (req, res) => {
  const { lead_id, likelihood_id } = req.body;

  if (!lead_id || !likelihood_id) {
    return res.status(400).json({ status: 'error', message: 'Missing lead_id or likelihood_id' });
  }

  const likelihoodCheckQuery = `SELECT * FROM ekarigar_leads_likelihood WHERE id = ?`;

  connection.query(likelihoodCheckQuery, [likelihood_id], (err, likelihoodResults) => {
    if (err) {
      console.error('Error checking likelihood ID:', err);
      return res.status(500).json({ status: 'error', message: 'Database error' });
    }

    if (likelihoodResults.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid likelihood ID' });
    }

    const updatedAt = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const updateQuery = `
      UPDATE ekarigar_leads 
      SET likelihood_id = ?, updated_at = ? 
      WHERE id = ?
    `;

    connection.query(updateQuery, [likelihood_id, updatedAt, lead_id], (updateErr, result) => {
      if (updateErr) {
        console.error('Error updating lead likelihood:', updateErr);
        return res.status(500).json({ status: 'error', message: 'Failed to update lead likelihood' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'error', message: 'Lead not found' });
      }

      res.json({ status: 'success', message: 'Lead likelihood updated successfully' });
    });
  });
});


app.put('/api/updateUser', (req, res) => {
  const { user_id, username, email, password, role_id, assigned_services, permissions } = req.body;
  
//   console.log("req body",req.body);

  // Validate required fields
  if (!user_id || !username || !email || !role_id) {
    return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
  }

  // Convert arrays to comma-separated strings
  const services = Array.isArray(assigned_services) ? assigned_services.join(',') : '';
  const perms = Array.isArray(permissions) ? permissions.join(',') : '';

  // Prepare the update query
  const query = `
    UPDATE ekarigar_users 
    SET username = ?, email = ?, password = ?, role_id = ?, assigned_services = ?, permissions = ? 
    WHERE id = ?
  `;
  
  // Use hashed password or update only if provided
  const values = [username, email, password || null, role_id, services, perms, user_id];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to update user' });
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Success response
    res.json({ status: 'success', message: 'User updated successfully' });
  });
});

// Delete User API - Soft Delete
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  // Update delete_status to 1 for the specified user
  const query = 'UPDATE ekarigar_users SET delete_status = 1 WHERE id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error updating delete_status:', error);
      return res.status(500).json({ status: false, error: 'Database query failed' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    res.json({ status: true, message: 'User deleted successfully (soft delete).' });
  });
});



//-------------------social media leads query-------------------------

app.post('/api/run-sql', (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ status: false, message: 'SQL query is required' });
  }

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('SQL execution error:', err);
      return res.status(500).json({ status: false, message: 'SQL execution failed', error: err });
    }

    res.status(200).json({
      status: true,
      message: 'SQL executed successfully',
      results
    });
  });
});






// -------------------------------------------------end of queries--------------------------------------------


// const sslServer = https.createServer(
//   {
//   key: fs.readFileSync(path.join(__dirname,'certificate','key.pem')),
//   cert: fs.readFileSync(path.join(__dirname,'certificate','cert.pem'))
//   },
//   app
// );

// sslServer.listen(4444, () => console.log('Secure serve on port 4444'));


startServer();



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

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// Security headers
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

startServer();
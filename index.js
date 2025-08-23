const express = require("express");
const mysql = require("mysql2/promise");
const { Client } = require("ssh2");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment-timezone");
require("dotenv").config();
const axios = require('axios');



const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
// const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
// const multer = require('multer');
// const moment = require('moment-timezone');

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || 'sales-ekarigar-bucket';
const multer = require('multer');
// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });


const app = express();
const PORT = process.env.PORT || 4444;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "12345";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

const sshConfig = {
  host: process.env.SSH_HOST || "localhost",
  port: parseInt(process.env.SSH_PORT) || 22,
  username: process.env.SSH_USERNAME || "ubuntu",
  privateKey: fs.readFileSync(
    path.join(
      __dirname,
      process.env.SSH_KEY_PATH || "config/ssh/salesekarigar.pem"
    )
  ),
};

const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};


let dbConnection = null;

const connectToDb = async () => {
  try {
    // Create the pool
    dbConnection = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // ✅ Test a connection right away
    const connection = await dbConnection.getConnection();
    console.info("[DB] Connection successful!");
    connection.release();

  } catch (error) {
    console.error("[DB] Error: Could not connect =>", error.message);
    dbConnection = null; // prevent accidental usage
    process.exit(1); // stop the app if DB is critical
  }
};






async function startServer() {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

const fb_serviceMap = {
  "Website Development": 1,
  "E-Commerce Website Development": 2,
  "WordPress Development": 3,
  "Shopify Website Development": 4,
  "Custom Project Development & Planning": 5,
  "API Development & Integration": 6,
  "Search Engine Optimisation (SEO)": 7,
  "Social Media Marketing": 8,
  "Custom Application Development For Retail & Manufacturing Industry": 9,
  "IOT Custom Projects Research & Development": 10,
  "Technical, Sales & Customer Care Call Centre Services": 11,
  "AWS Setup & Management": 12,
  "UI/UX Planning & Designing": 13,
  "Hybrid iOS & Android Mobile App Development using IONIC & React": 14,
  "Data Analysis & Reporting": 15,
  "Not in list / Not mentioned": 16,
  "AI Solutions": 17,
  "Business Intelligence & Dashboarding": 18,
  "Customized Software Development & Planning": 19,
  "Digital Transformation": 20,
};

const fb_industryMap = {
  "E-commerce": 1,
  "Retail and Consumer Goods": 1,
  "Automotive": 2,
  Construction: 3,
  Consulting: 4,
  "Education and Training": 5,
  "Energy and Utilities": 6,
  "Finance and Insurance": 7,
  "Healthcare and Medical": 8,
  "Hospitality and Tourism": 9,
  "Information Technology": 10,
  "Legal Services": 11,
  Manufacturing: 12,
  "Marketing and Advertising": 13,
  "Media and Entertainment": 14,
  "Non-Profit and Social Services": 15,
  "Real Estate": 16,
  Telecommunications: 17,
  "Transportation and Logistics": 18,
  "Wholesale and Distribution": 19,
  "Not in list / Not mentioned": 20,
};

const formatDate = (dateStr) => {
  return moment(dateStr).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
};

const mapPayloadToLead = (payload) => {
  if (!payload.field_data || !payload.created_time) {
    throw new Error("Invalid payload: missing field_data or created_time");
  }

  const fieldData = payload.field_data;
  const createdTime = payload.created_time;

  const mappedLead = {
    assigned_to: "6",
    status: "1",
    name: "",
    mobile_number: "",
    email: "",
    city: "Not mentioned",
    website_type: "",
    industry_type: "",
    contact_preference: "1",
    preferred_date: "",
    preferred_time: "",
    requirements: "",
    lead_source: "3",
    checkbox_ids: null,
    created_at: formatDate(createdTime),
    updated_at: formatDate(createdTime),
  };

  const requirementsParts = [];

  fieldData.forEach((field) => {
    if (!field.name || !field.values || !field.values.length) return;
    const name = field.name;
    const value = field.values[0];

    switch (name) {
      case "full_name":
        mappedLead.name = value;
        break;
      // case "phone_number":
      //   mappedLead.mobile_number = value;
      //   break;
      case "phone_number":
        let phone = value.trim();

        // Remove spaces, dashes, and parentheses
        phone = phone.replace(/[\s\-\(\)]/g, "");

        // Check if starts with + and country code
        if (/^\+?[0-9]{10,15}$/.test(phone)) {
          // If number has country code (starts with +91 or similar), keep it
          if (phone.startsWith("+")) {
            mappedLead.mobile_number = phone;
          } else if (phone.length === 10) {
            // If exactly 10 digits, prepend country code (+91 by default)
            mappedLead.mobile_number = "+91" + phone;
          } else {
            // Otherwise, store as-is if valid
            mappedLead.mobile_number = phone;
          }
        } else {
          console.warn("Invalid phone number:", phone);
        }
        break;

      // case "email":
      //   mappedLead.email = value;
      //   break;
      case "email":
        let email = value.trim();

        // Simple email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
          mappedLead.email = email.toLowerCase(); // normalize to lowercase
        } else {
          console.warn("Invalid email:", email);
        }
        break;

      case "business_name_or_industry_type?":
        mappedLead.industry_type = fb_industryMap[value]
          ? fb_industryMap[value].toString()
          : "20";
        requirementsParts.push(`Industry: ${value}`);
        break;
      case "what_service_are_you_looking_for?_":
        mappedLead.website_type = fb_serviceMap[value]
          ? fb_serviceMap[value].toString()
          : "16";
        requirementsParts.push(`Service: ${value}`);
        break;
      case "what’s_your_goal_with_this_project?":
        requirementsParts.push(`Goal: ${value}`);
        break;
      case "do_you_have_an_existing_website_or_app?":
        requirementsParts.push(`Existing Website: ${value}`);
        break;
      case "your_preferred_budget_range?":
        requirementsParts.push(`Budget: ${value}`);
        break;
      case "when_do_you_want_to_get_started?":
        requirementsParts.push(`Preferred Start Time: ${value}`);
        break;
    }
  });

  mappedLead.requirements = requirementsParts.join(", ");
  return mappedLead;
};



app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});


app.get("/api/mode_check", (req, res) => {
  res.status(200).json({
    Mode: process.env.OPENAI_API_KEY
  });
});


app.post("/webhook", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.entry || !payload.entry[0].changes) {
      return res.status(400).json({ error: "Invalid payload structure" });
    }

    const leadData = mapPayloadToLead(payload.entry[0].changes[0].value);

    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
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
      leadData.updated_at,
    ];

    await dbConnection.execute(query, values);
    // console.log("Lead inserted successfully:", leadData);
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

app.get("/api/lead-statuses", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const [rows] = await dbConnection.execute(
      "SELECT id, status_name FROM ekarigar_leads_status"
    );
    res.status(200).json({ status: "success", data: rows });
  } catch (err) {
    console.error("Error fetching lead statuses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/zip",
    "application/x-zip-compressed",
    "multipart/x-zip",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 50 * 1024 * 1024 },
// });

app.post("/api/upload_g", upload.single("file"), async (req, res) => {
  try {
    const { path, originalname } = req.file;
    const driveFile = await uploadToDrive(path, originalname);
    res.json({ fileId: driveFile.id, fileUrl: driveFile.webViewLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/mode", (req, res) => {
  const status = false;
  console.log("checking", status);
  res.json({ status });
});

const serviceMap = {
  "Website Designing & Development": 1,
  "E-Commerce Website Development": 2,
  "WordPress Development": 3,
  "Shopify Website Development": 4,
  "Custom Project Development & Planning": 5,
  "API Development & Integration": 6,
  "Search Engine Optimisation (SEO)": 7,
  "Social Media Marketing": 8,
  "Custom Application Development For Retail & Manufacturing Industry": 9,
  "IOT Custom Projects Research & Development": 10,
  "Technical, Sales & Customer Care Call Centre Services": 11,
  "AWS Setup & Management": 12,
  "UI/UX Planning & Designing": 13,
  "Hybrid iOS & Android Mobile App Development using IONIC & React": 14,
  "Data Analysis & Reporting": 15,
  "AI Solutions": 17,
  "Business Intelligence & Dashboarding": 18,
  "Customized Software Development & Planning": 19,
  "Digital Transformation": 20,
};

const industryMap = {
  "Retail and Consumer Goods": 1,
  Automotive: 2,
  Construction: 3,
  Consulting: 4,
  "Education and Training": 5,
  "Energy and Utilities": 6,
  "Finance and Insurance": 7,
  "Healthcare and Medical": 8,
  "Hospitality and Tourism": 9,
  "Information Technology": 10,
  "Legal Services": 11,
  Manufacturing: 12,
  "Marketing and Advertising": 13,
  "Media and Entertainment": 14,
  "Non-Profit and Social Services": 15,
  "Real Estate": 16,
  Telecommunications: 17,
  "Transportation and Logistics": 18,
  "Wholesale and Distribution": 19,
};

const checkboxMap = {
  "Need a new website for your business?": 1,
  "Want to appear on top of Google search?": 2,
  "Want more business leads?": 3,
  "Increase sales on your e-commerce website?": 4,
  "Want to take your brand to a larger audience?": 5,
  "Looking for automating your business process?": 6,
  "Something else?": 7,
};

async function mapFormData(formData) {
  const mappedData = {
    name: formData.fullName,
    mobile_number: formData.mobileNumber,
    email: formData.email,
    city: formData.cityName,
    service_type: serviceMap[formData.selectedService] || null,
    industry_type: industryMap[formData.selectedIndustry] || null,

    contact_preference:
      formData.preferredContactMethod === "Call"
        ? 1
        : formData.preferredContactMethod === "Schedule a Video Call"
          ? 2
          : 0,

    preferred_date: formData.date || "-",
    preferred_time_slot: formData.selectTiming || "-",
    lead_source: 1,

    selectedCheckboxes: formData.businessNeeds
      .map((value) => {
        const normalizedValue = value.trim().toLowerCase();
        for (const [key, id] of Object.entries(checkboxMap)) {
          if (key.toLowerCase() === normalizedValue) {
            return id;
          }
        }
        return null;
      })
      .filter((id) => id)
      .join(","),

    requirements: formData.requirements || null,
  };

  const assignedUser = await getAssignedUser(mappedData.service_type);
  mappedData.assigned_to = assignedUser;

  return mappedData;
}

// async function getAssignedUser(serviceId) {
//   try {
//     if (!dbConnection) {
//       throw new Error("Database connection not established");
//     }

//     const query = `
//       SELECT id
//       FROM ekarigar_users
//       WHERE FIND_IN_SET(?, assigned_services) > 0
//       AND delete_status = '0'
//       LIMIT 1
//     `;
//     const [rows] = await dbConnection.execute(query, [serviceId]);

//     if (rows.length > 0) {
//       return rows[0].id;
//     }
//     return 1;
//   } catch (err) {
//     console.error("Error fetching assigned user:", err);
//     throw err;
//   }
// }

// async function getAssignedUser(serviceId) {
//   try {
//     if (!dbConnection) {
//       throw new Error("[getAssignedUser] Database connection not established");
//     }

//     console.log(`[getAssignedUser] serviceId received: ${serviceId}`);

//     const query = `
//       SELECT id
//       FROM ekarigar_users
//       WHERE FIND_IN_SET(?, assigned_services) > 0
//         AND delete_status = '0'
//       LIMIT 1
//     `;


//     console.log("[getAssignedUser] Executing query:", query, "with param:", serviceId);

//     const [rows] = await dbConnection.execute(query, [serviceId]);


//     console.log("[getAssignedUser] Query returned rows:", rows);

//     if (rows && rows.length > 0) {
//       return rows[0].id;
//     } else {
//       console.warn("[getAssignedUser] No assigned user found, returning default 1");
//       return 1;
//     }

//   } catch (err) {
//     console.error("[getAssignedUser] Error details:", {
//       message: err.message,
//       stack: err.stack,
//       code: err.code || null,
//       sqlState: err.sqlState || null,
//       sqlMessage: err.sqlMessage || null
//     });
//     throw err; // rethrow so route handler can handle it
//   }
// }

async function getAssignedUser(serviceId) {
  try {
    if (!dbConnection) {
      throw new Error("[getAssignedUser] Database connection not established");
    }

    if (!serviceId) {
      console.error("[getAssignedUser] ❌ serviceId is missing/invalid:", serviceId);
      return 1; // fallback to default user
    }

    console.log(`[getAssignedUser] serviceId received: ${serviceId}`);

    const query = `
      SELECT id
      FROM ekarigar_users
      WHERE FIND_IN_SET(?, assigned_services) > 0
        AND delete_status = '0'
      LIMIT 1
    `;

    console.log("[getAssignedUser] Executing query:", query, "with param:", serviceId);

    const [rows] = await dbConnection.execute(query, [serviceId]);

    console.log("[getAssignedUser] Query returned rows:", rows);

    if (rows && rows.length > 0) {
      return rows[0].id;
    } else {
      console.warn("[getAssignedUser] No assigned user found → returning default 1");
      return 1;
    }

  } catch (err) {
    console.error("[getAssignedUser] Error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code || null,
      sqlState: err.sqlState || null,
      sqlMessage: err.sqlMessage || null
    });
    return 1; // fallback instead of crashing the whole API
  }
}



app.all("/api/form", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, X-Requested-By"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, GET, POST, DELETE, OPTIONS"
    );

    const [rows] = await dbConnection.execute("SELECT * FROM products");
    res.status(200).json({ status: "success", data: rows });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  console.log("Webhook GET received:", { mode, token, challenge });
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.set("Content-Type", "text/plain");
    res.status(200).send(challenge);
  } else {
    console.log("Verification failed:", { mode, token });
    res.status(403).send("Forbidden");
  }
});

// app.post("/api/fb_leads_save", async (req, res) => {
//   try {
//     if (!dbConnection) {
//       return res
//         .status(500)
//         .json({ error: "Database connection not established" });
//     }

//     const payload = req.body;

//     const formId = payload.form_id;
//     const allowedFormIds = [
//       "637356575939309",
//       "529677880213221",
//       "1343440076956786",
//     ];
//     if (!allowedFormIds.includes(formId)) {
//       return res.status(400).json({ error: "Invalid form_id" });
//     }

//     const mappedLead = mapPayloadToLead(payload);
//     // console.log("MAPPED DATA", mappedLead);

//     const serviceId = mappedLead.serviceId;
//     const assignedUserId = await getAssignedUser(serviceId);

//     const query = `
//       INSERT INTO ekarigar_leads (
//         assigned_to, status, name, mobile_number, email, city, website_type, 
//         industry_type, contact_preference, preferred_date, preferred_time, 
//         requirements, lead_source, checkbox_ids, created_at, updated_at
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [
//       assignedUserId,
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
//       mappedLead.updated_at,
//     ];

//     await dbConnection.execute(query, values);

//     res.status(200).json({ message: "Lead saved successfully" });
//   } catch (err) {
//     console.error("Error processing webhook:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/api/fb_leads_save", async (req, res) => {
//   let connection;
//   try {
//     if (!dbConnection) {
//       return res.status(500).json({ error: "Database connection not established" });
//     }

//     const payload = req.body;

//     const formId = payload.form_id;
//     const allowedFormIds = [
//       "637356575939309",
//       "529677880213221",
//       "1343440076956786",
//       "1092207153038376", // ✅ New form added
//     ];
//     if (!allowedFormIds.includes(formId)) {
//       return res.status(400).json({ error: "Invalid form_id" });
//     }

//     // ✅ Check if new form id
//   if (payload.form_id === "1092207153038376") {
//     // return map1092207153038376(payload);
//     const mappedLead = map1092207153038376(payload);
//   }else{
//     const mappedLead = mapPayloadToLead(payload);

//   }

//     const serviceId = mappedLead.serviceId;
//     const assignedUserId = await getAssignedUser(serviceId);

//     const query = `
//       INSERT INTO ekarigar_leads (
//         assigned_to, status, name, mobile_number, email, city, website_type, 
//         industry_type, contact_preference, preferred_date, preferred_time, 
//         requirements, lead_source, checkbox_ids, created_at, updated_at
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [
//       assignedUserId,
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
//       mappedLead.updated_at,
//     ];

//     // ✅ Get a connection from pool for transaction
//     connection = await dbConnection.getConnection();
//     await connection.beginTransaction();

//     await connection.execute(query, values);

//     await connection.commit();

//     res.status(200).json({ message: "Lead saved successfully" });
//   } catch (err) {
//     if (connection) await connection.rollback();
//     console.error("Error processing webhook:", err);
//     res.status(500).json({ error: "Internal server error" });
//   } finally {
//     if (connection) connection.release();
//   }
// });


app.post("/api/fb_leads_save", async (req, res) => {
  let connection;
  try {
    if (!dbConnection) {
      return res.status(500).json({ error: "Database connection not established" });
    }

    const payload = req.body;

    const formId = payload.form_id;
    const allowedFormIds = [
      "637356575939309",
      "529677880213221",
      "1343440076956786",
      "1092207153038376",
      "761120296625634"
    ];

    if (!allowedFormIds.includes(formId)) {
      return res.status(400).json({ error: "Invalid form_id" });
    }

    // ✅ Map payload depending on form_id
    let mappedLead;
    if (formId === "1092207153038376" || formId === "761120296625634") {
      mappedLead = map1092207153038376(payload);
    } else {
      mappedLead = mapPayloadToLead(payload);
    }

    console.log("mappedLead", mappedLead);

    // const serviceId = mappedLead.serviceId;
    const serviceId = mappedLead.website_type;

    // const assignedUserId = await getAssignedUser(serviceId);
    const assignedUserId = mappedLead.assigned_to;


    const query = `
      INSERT INTO ekarigar_leads (
        assigned_to, status, name, mobile_number, email, city, website_type, 
        industry_type, contact_preference, preferred_date, preferred_time, 
        requirements, lead_source, checkbox_ids, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      assignedUserId,
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
      mappedLead.updated_at,
    ];

    // ✅ Get connection from pool
    connection = await dbConnection.getConnection();
    await connection.beginTransaction();

    await connection.execute(query, values);

    await connection.commit();
    res.status(200).json({ message: "Lead saved successfully" });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release(); // ✅ Always release to pool
  }
});




// ✅ New mapping for form_id = 1092207153038376
const map1092207153038376 = (payload) => {
  const fieldData = payload.field_data;
  const createdTime = payload.created_time;

  const mappedLead = {
    assigned_to: "6",
    status: "1",
    likelihood_id: 1,
    name: "",
    mobile_number: "",
    email: "",
    city: "Not mentioned",
    website_type: "",
    industry_type: "",
    contact_preference: "1",
    preferred_date: "",
    preferred_time: "",
    requirements: "",
    lead_source: "3",
    checkbox_ids: null,
    created_at: formatDate(createdTime),
    updated_at: formatDate(createdTime),
  };

  const requirementsParts = [];

  fieldData.forEach((field) => {
    if (!field.name || !field.values || !field.values.length) return;
    const name = field.name;
    const value = field.values[0];

    //field.name = mobile_number
    // +917498056847---8108805141
    //add validation for 10 digit allow with coutnry code

    switch (name) {
      case "full_name":
        mappedLead.name = value;
        break;
      // case "phone_number":
      //   mappedLead.mobile_number = value;
      //   break;
      case "phone_number":
        let phone = value.trim();

        // Remove spaces, dashes, and parentheses
        phone = phone.replace(/[\s\-\(\)]/g, "");

        // Check if starts with + and country code
        if (/^\+?[0-9]{10,15}$/.test(phone)) {
          // If number has country code (starts with +91 or similar), keep it
          if (phone.startsWith("+")) {
            mappedLead.mobile_number = phone;
          } else if (phone.length === 10) {
            // If exactly 10 digits, prepend country code (+91 by default)
            mappedLead.mobile_number = "+91" + phone;
          } else {
            // Otherwise, store as-is if valid
            mappedLead.mobile_number = phone;
          }
        } else {
          console.warn("Invalid phone number:", phone);
        }
        break;

      // case "email":
      //   mappedLead.email = value;
      //   break;
      case "email":
        let email = value.trim();

        // Simple email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
          mappedLead.email = email.toLowerCase(); // normalize to lowercase
        } else {
          console.warn("Invalid email:", email);
        }
        break;

      case "city":
        mappedLead.city = value;
        break;
      case "job_title":
        requirementsParts.push(`Job Title: ${value}`);
        break;
      case "do_you_need_a_new_website_or_a_redesign?":
        mappedLead.website_type = value.includes("redesign") ? "2" : "1"; // Example: 1=new, 2=redesign
        requirementsParts.push(`Need: ${value}`);
        break;
      case "what_kind_of_website_is_it?":
        mappedLead.website_type = fb_serviceMap[value]
          ? fb_serviceMap[value].toString()
          : "16";
        requirementsParts.push(`Website Type: ${value}`);
        break;
      case "what_industry_is_your_business_in?":
        mappedLead.industry_type = fb_industryMap[value]
          ? fb_industryMap[value].toString()
          : "20";
        requirementsParts.push(`Industry: ${value}`);
        break;
      case "what_is_your_estimated_budget?":
        requirementsParts.push(`Budget: ${value}`);
        break;
      case "what_best_describes_your_reason_for_inquiry?":
        requirementsParts.push(`Reason: ${value}`);
        break;
    }
  });

  mappedLead.requirements = requirementsParts.join(", ");
  return mappedLead;
};

app.get("/api/recentleads", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const userId = req.headers["user-id"];
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const roleQuery =
      'SELECT role_id FROM ekarigar_users WHERE id = ? AND delete_status = "0"';
    const [roleResults] = await dbConnection.execute(roleQuery, [userId]);

    if (roleResults.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found or user is deleted" });
    }

    const roleId = roleResults[0].role_id;

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

    if (roleId === 1) {
      query += " ORDER BY l.created_at DESC LIMIT 5";
    } else {
      query += " WHERE l.assigned_to = ? ORDER BY l.created_at DESC LIMIT 5";
      queryParams = [userId];
    }

    const [results] = await dbConnection.execute(query, queryParams);

    const formattedResults = results.map((lead) => ({
      id: lead.id,
      name: lead.name,
      website: lead.website,
      mobile: lead.mobile,
      status: lead.status,
    }));

    res.status(200).json({
      success: true,
      message: "Recent leads fetched successfully",
      data: formattedResults,
    });
  } catch (err) {
    console.error("Error fetching recent leads:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/leadcounts_user_pause/:userId", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userQuery = `
      SELECT assigned_services, role_id 
      FROM ekarigar_users 
      WHERE id = ? AND delete_status = '0'
    `;
    const [userResults] = await dbConnection.execute(userQuery, [userId]);

    if (!userResults.length) {
      return res.status(404).json({ error: "User not found or inactive" });
    }

    const { assigned_services, role_id } = userResults[0];

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
      queryParams = [
        userId,
        assigned_services,
        assigned_services,
        assigned_services,
      ];
    } else {
      return res.status(200).json({
        status: "success",
        message: "No services assigned to user",
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
      status: "success",
      message: "Lead counts fetched successfully",
      data: counts,
    });
  } catch (err) {
    console.error("Error fetching lead counts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/leadcounts_user/:userId", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userQuery = `
      SELECT assigned_services, role_id 
      FROM ekarigar_users 
      WHERE id = ? AND delete_status = '0'
    `;
    const [userResults] = await dbConnection.execute(userQuery, [userId]);

    if (!userResults.length) {
      return res.status(404).json({ error: "User not found or inactive" });
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
        status: "success",
        message: "No services assigned to user",
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
      success: true,
      message: "Lead counts fetched successfully",
      data: counts,
    });
  } catch (err) {
    console.error("Error fetching lead counts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/leadsources_user/:userId", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userQuery = `
      SELECT assigned_services, role_id
      FROM ekarigar_users
      WHERE id = ? AND delete_status = '0'
    `;
    const [userResults] = await dbConnection.execute(userQuery, [userId]);

    if (!userResults.length) {
      return res.status(404).json({ error: "User not found or inactive" });
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
      queryParams = [
        userId,
        assigned_services,
        assigned_services,
        assigned_services,
      ];
    } else {
      return res.status(200).json({
        success: true,
        message: "No services assigned to user",
        data: [],
      });
    }

    const [results] = await dbConnection.execute(leadSourceQuery, queryParams);

    const totalLeads = results.reduce(
      (sum, lead) => sum + Number(lead.count),
      0
    );
    const formattedResults = results.map((lead) => ({
      source: lead.source,
      percentage:
        totalLeads > 0
          ? Number(((lead.count / totalLeads) * 100).toFixed(2))
          : 0,
    }));

    res.status(200).json({
      success: true,
      message: "Lead sources fetched successfully",
      data: formattedResults,
    });
  } catch (err) {
    console.error("Error fetching lead sources:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/leadcounts", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
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
      success: true,
      message: "Lead counts fetched successfully",
      data: counts,
    });
  } catch (err) {
    console.error("Error fetching lead counts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/leadsources", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
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

    const totalLeads = results.reduce(
      (sum, lead) => sum + Number(lead.count),
      0
    );
    const formattedResults = results.map((lead) => ({
      source: lead.source,
      percentage:
        totalLeads > 0
          ? Number(((lead.count / totalLeads) * 100).toFixed(2))
          : 0,
    }));

    res.status(200).json({
      success: true,
      message: "Lead sources fetched successfully",
      data: formattedResults,
    });
  } catch (err) {
    console.error("Error fetching lead sources:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/today-followups", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const todayIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

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
      followups: results.map((row) => ({
        id: row.id,
        lead_id: row.lead_id,
        description: row.description,
        medium: row.medium,
        attended_by: row.attended_by,
        assign_to: row.assign_to,
        followup_date: row.followup_date,
        followup_doc_description: row.followup_doc_description,
        followup_doc: row.followup_doc,
      })),
    };

    res.status(200).json({
      success: true,
      message: "Today's followups fetched successfully",
      data: followups,
    });
  } catch (err) {
    console.error("Error fetching followups:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//-------pause------

app.post("/api/login", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ message: "Database connection not established" });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username/Email and password are required" });
    }

    const query = `
      SELECT id, username, email 
      FROM ekarigar_users 
      WHERE (username = ? OR email = ?) 
        AND password = ? 
        AND delete_status = '0'
    `;
    const [rows] = await dbConnection.execute(query, [
      username,
      username,
      password,
    ]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    res.status(200).json({ message: "Login successful", user: rows[0] });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/transfer_wpforms_entries", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    await dbConnection.beginTransaction();

    const query = `
      SELECT entry_id, fields, date
      FROM wpkh_wpforms_entries
    `;
    const [results] = await dbConnection.execute(query);

    if (results.length === 0) {
      await dbConnection.rollback();
      return res.status(200).json({
        status: "success",
        message: "No entries found for the past month.",
      });
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
      Call: 1,
      "Schedule a Video Call": 2,
    };

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().slice(0, 19).replace("T", " ");
    };

    const addMinutes = (date, minutes) => {
      const d = new Date(date);
      d.setMinutes(d.getMinutes() + minutes);
      return d;
    };

    // const getAssignedUser = async (serviceId) => {
    //   try {
    //     const query = `
    //       SELECT id
    //       FROM ekarigar_users
    //       WHERE FIND_IN_SET(?, assigned_services) > 0
    //       AND delete_status = '0'  
    //       LIMIT 1
    //     `;
    //     const [rows] = await dbConnection.execute(query, [serviceId]);
    //     return rows.length > 0 ? rows[0].id : 1;
    //   } catch (err) {
    //     console.error("Error fetching assigned user:", err);
    //     throw err;
    //   }
    // };

    const getAssignedUser = async (serviceId) => {
      try {
        // Validate serviceId
        if (serviceId === undefined) {
          console.warn("serviceId is undefined, returning default user ID");
          return 1; // Or handle differently based on your requirements
        }

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
        console.error("Error fetching assigned user:", err);
        throw err;
      }
    };

    const leadInsertPromises = results.map(async (row) => {
      const fields = JSON.parse(row.fields);

      let name = fields["5"]?.value || "Unknown";
      const mobileNumber = fields["6"]?.value || "";
      const email = fields["7"]?.value || "";
      let city = fields["8"]?.value || "";
      const websiteType = fields["9"]?.value || "";
      const industryType = fields["10"]?.value || "";
      let contactPreference = fields["11"]?.value || "";
      const preferredDate = fields["12"]?.date || "";
      const preferredTime = fields["14"]?.value || "";
      const requirements = "";

      if (city === "मुंबई") city = "Mumbai";
      if (name === "प्रल्हाद") name = "Pralhad";
      if (name === "सीताराम") name = "Sitaram";

      const websiteTypeId = websiteType ? serviceMap[websiteType] || 0 : 0;
      const industryTypeId = industryType ? industryMap[industryType] || 0 : 0;

      const checkboxField = fields["2"]?.value || "";
      const selectedOptions = checkboxField.split("\n");
      const selectedIds = selectedOptions
        .map((option) => checkboxMapping[option])
        .filter((id) => id !== undefined);
      const checkBoxes = selectedIds.join(",");

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
        checkBoxes,
      ]);
    });

    await Promise.all(leadInsertPromises);
    await dbConnection.commit();

    res.status(200).json({
      status: "success",
      message: "All leads have been successfully transferred.",
    });
  } catch (err) {
    console.error("Error during lead processing:", err);
    await dbConnection.rollback();
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/api/checkbox-options", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT id, option_name FROM ekarigar_lead_checkbox";
    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching checkbox options:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/status-options", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT id, status_name FROM ekarigar_leads_status";
    const [results] = await dbConnection.execute(query);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching status options:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/likelihood-options", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT id, likelihood_name FROM ekarigar_leads_likelihood";
    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching likelihood options:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/lead-sources", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT id, source_name FROM ekarigar_lead_source";
    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching lead sources:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/likelihood-options", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT id, likelihood_name FROM ekarigar_leads_likelihood";
    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching likelihood options:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get_users", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = `
      SELECT id, username 
      FROM ekarigar_users
      WHERE delete_status = '0';
    `;

    const [results] = await dbConnection.execute(query);

    if (results.length === 0) {
      return res
        .status(200)
        .json({ status: true, data: [], message: "No users found" });
    }

    res.json({ status: true, data: results });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get_industryType", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT id, industryname FROM ekarigar_industrytype";
    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching industry types:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/getservicetypes", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT * FROM ekarigar_servicetype";

    const [results] = await dbConnection.execute(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching service types:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/getuserservicetypes", async (req, res) => {
  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const userQuery =
      "SELECT assigned_services FROM ekarigar_users WHERE id = ?";
    const [userResults] = await dbConnection.execute(userQuery, [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const assignedServices = userResults[0].assigned_services;

    if (!assignedServices) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No services assigned to this user",
      });
    }

    const serviceIds = assignedServices.split(",").map((id) => id.trim());

    if (serviceIds.length === 0) {
      return res
        .status(200)
        .json({ status: "success", data: [], message: "No valid service IDs" });
    }

    const placeholders = serviceIds.map(() => "?").join(",");
    const serviceQuery = `SELECT * FROM ekarigar_servicetype WHERE id IN (${placeholders})`;
    const [serviceResults] = await dbConnection.execute(
      serviceQuery,
      serviceIds
    );

    res.json(serviceResults);
  } catch (err) {
    console.error("Error fetching user service types:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get_roles", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT * FROM ekarigar_roles";
    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get_contact_methods", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT * FROM ekarigar_contact_methods";
    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching contact methods:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get_permissions", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = "SELECT * FROM ekarigar_permissions";
    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching ekarigar_permissions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get_services_with_status", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = `
      SELECT 
        s.id, 
        s.servicename,
        (
          SELECT COUNT(*) 
          FROM ekarigar_users u 
          WHERE FIND_IN_SET(s.id, u.assigned_services) 
            AND u.delete_status = '0'
        ) AS is_assigned
      FROM ekarigar_servicetype s;
    `;

    const [results] = await dbConnection.execute(query);

    res.json(results);
  } catch (err) {
    console.error("Error fetching services with status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/getUserRole/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query =
      'SELECT role_id FROM ekarigar_users WHERE id = ? AND delete_status = "0"';
    const [results] = await dbConnection.execute(query, [userId]);

    if (results.length > 0) {
      const roleId = results[0].role_id;

      res.json({ role_id: roleId });
    } else {
      res.status(404).json({ error: "User not found or deleted" });
    }
  } catch (err) {
    console.error("Error fetching user role:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/user/:userId/permissions", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const query = `
      SELECT p.id 
      FROM ekarigar_users u 
      JOIN ekarigar_permissions p 
        ON FIND_IN_SET(p.id, u.permissions) > 0 
      WHERE u.id = ? AND u.delete_status = '0'
    `;

    const [results] = await dbConnection.execute(query, [userId]);

    const permissionIds = results.map((row) => row.id);

    res.json(permissionIds);
  } catch (err) {
    console.error("Error fetching user permissions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/getleads", async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    const userPermissions = req.headers["user-permissions"];

    if (!userId || !userPermissions) {
      return res
        .status(400)
        .json({ error: "User ID or permissions not provided" });
    }

    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
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

    const queryParams = [];

    if (userPermissions !== "1") {
      console.log("Restricted permissions: Fetching assigned leads");
      query += `
        AND (
          l.assigned_to = ? 
          OR l.id IN (SELECT id FROM ekarigar_leads WHERE assigned_to = ?)
        )
      `;
      queryParams.push(userId, userId);
    } else {
      console.log("Admin permissions: Fetching all leads for current month");
    }

    query += ` GROUP BY l.id ORDER BY l.id DESC`;

    const [results] = await dbConnection.execute(query, queryParams);

    const data = results.map((row) => ({
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

    res.status(200).json({ status: true, data });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/getleads_wip", async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    const userPermissions = req.headers["user-permissions"];

    const {
      createdStartDate,
      createdEndDate,
      updatedStartDate,
      updatedEndDate,
    } = req.query;

    if (!userId || !userPermissions) {
      return res
        .status(400)
        .json({ message: "User ID or permissions not provided" });
    }

    if (!dbConnection) {
      return res
        .status(500)
        .json({ message: "Database connection not established" });
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

    const queryParams = [];

    const dateConditions = [];

    if (createdStartDate && createdEndDate) {
      dateConditions.push(`DATE(l.created_at) BETWEEN ? AND ?`);
      queryParams.push(createdStartDate, createdEndDate);
    }

    if (updatedStartDate && updatedEndDate) {
      dateConditions.push(`DATE(l.updated_at) BETWEEN ? AND ?`);
      queryParams.push(updatedStartDate, updatedEndDate);
    }

    if (dateConditions.length === 0) {
      dateConditions.push(
        `MONTH(l.created_at) = MONTH(CURDATE()) AND YEAR(l.created_at) = YEAR(CURDATE())`
      );
    }

    if (dateConditions.length > 0) {
      query += ` AND (${dateConditions.join(" AND ")})`;
    }

    if (userPermissions !== "1") {
      query += `
        AND (
          l.assigned_to = ? 
          OR l.id IN (SELECT id FROM ekarigar_leads WHERE assigned_to = ?)
        )
      `;
      queryParams.push(userId, userId);
    }

    query += ` GROUP BY l.id ORDER BY l.id DESC`;

    // console.log("Executing query:", query, queryParams);

    const [results] = await dbConnection.execute(query, queryParams);

    const data = results.map((row) => ({
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

    res.status(200).json({ status: true, data });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/getleads_wipp", async (req, res) => {
  try {
    if (!dbConnection) {
      return res
        .status(500)
        .json({ error: "Database connection not established" });
    }

    const userId = req.headers["user-id"];
    const userPermissions = req.headers["user-permissions"];

    const {
      createdStartDate,
      createdEndDate,
      updatedStartDate,
      updatedEndDate,
    } = req.query;

    if (!userId || !userPermissions) {
      return res
        .status(400)
        .json({ message: "User ID or permissions not provided" });
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

    let dateConditions = [];

    if (createdStartDate && createdEndDate) {
      dateConditions.push(`DATE(l.created_at) BETWEEN ? AND ?`);
    }

    if (updatedStartDate && updatedEndDate) {
      dateConditions.push(`DATE(l.updated_at) BETWEEN ? AND ?`);
    }

    if (dateConditions.length === 0) {
      dateConditions.push(
        `MONTH(l.created_at) = MONTH(CURDATE()) AND YEAR(l.created_at) = YEAR(CURDATE())`
      );
    }

    if (dateConditions.length > 0) {
      query += ` AND (${dateConditions.join(" AND ")})`;
    }

    if (userPermissions !== "1") {
      console.log("Restricted permissions: Fetching assigned leads");
      query += ` AND (l.assigned_to = ? OR l.id IN (SELECT id FROM ekarigar_leads WHERE assigned_to = ?))`;
    } else {
      console.log("Admin permissions: Fetching all leads");
    }

    query += ` GROUP BY l.id ORDER BY l.id DESC;`;

    console.log("Executing query:", query);

    const queryParams = [];
    if (createdStartDate && createdEndDate) {
      queryParams.push(createdStartDate, createdEndDate);
    }
    if (updatedStartDate && updatedEndDate) {
      queryParams.push(updatedStartDate, updatedEndDate);
    }
    if (userPermissions !== "1") {
      queryParams.push(userId, userId);
    }

    const [results] = await dbConnection.execute(query, queryParams);

    console.log("Query results length:", results.length);

    const data =
      results.length > 0
        ? results.map((row) => ({
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
        }))
        : [];

    res.json({ status: results.length > 0, data });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    const lead = req.body;

    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const createdAt = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const updatedAt = createdAt;

    const checkboxIds =
      lead.selectedCheckboxes && lead.selectedCheckboxes.length > 0
        ? lead.selectedCheckboxes.join(",")
        : null;

    if (!lead.assigned_to) {
      return res.status(400).json({
        status: false,
        message: "Assigned to field is required",
      });
    }

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
      lead.assigned_to,
      lead.email,
      lead.city,
      lead.service_type,
      lead.industry_type,
      lead.contact_preference,
      lead.preferred_date,
      lead.preferred_time_slot,
      lead.requirements,
      lead.lead_source || "Manual",
      checkboxIds,
      createdAt,
      updatedAt,
    ];

    console.log("Executing insert query:", query, values);

    const [result] = await dbConnection.execute(query, values);

    res.status(200).json({
      status: true,
      message: "Lead saved successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error inserting lead:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

app.put("/api/update_leads", async (req, res) => {
  try {
    const lead = req.body;

    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const updatedAt = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // async function getAssignedUser(serviceId) {
    //   try {
    //     const query = `
    //       SELECT id
    //       FROM ekarigar_users
    //       WHERE FIND_IN_SET(?, assigned_services) > 0
    //       AND delete_status = '0'
    //       LIMIT 1
    //     `;

    //     const [results] = await dbConnection.execute(query, [serviceId]);

    //     if (results.length > 0) {
    //       return results[0].id;
    //     } else {
    //       return 1;
    //     }
    //   } catch (err) {
    //     console.error("Error fetching assigned user:", err);
    //     throw err;
    //   }
    // }

    async function getAssignedUser(serviceId) {
      try {
        // Validate serviceId
        if (serviceId === undefined) {
          console.warn("serviceId is undefined, returning default user ID");
          return 1; // Consistent with your default behavior
        }

        const query = `
      SELECT id
      FROM ekarigar_users
      WHERE FIND_IN_SET(?, assigned_services) > 0
      AND delete_status = '0'
      LIMIT 1
    `;

        const [results] = await dbConnection.execute(query, [serviceId]);

        if (results.length > 0) {
          return results[0].id;
        } else {
          return 1;
        }
      } catch (err) {
        console.error(`Error fetching assigned user for serviceId=${serviceId}:`, err);
        throw err;
      }
    }

    const assignedUser = await getAssignedUser(lead.website_type_id);

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
      lead.website_type_id,
      lead.industry_type_id,
      lead.preferred_date,
      lead.preferred_time,
      lead.requirements,
      lead.source_id || 0,
      lead.status_id,
      updatedAt,
      lead.id,
    ];

    console.log("Executing update query:", query, values);

    const [result] = await dbConnection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Lead updated successfully",
    });
  } catch (err) {
    console.error("Error updating lead:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});



app.delete("/api/leads/:lead_id", async (req, res) => {
  let connection;
  try {
    const { lead_id } = req.params;

    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    if (!lead_id) {
      return res.status(400).json({
        status: false,
        message: "Lead ID is required",
      });
    }

    console.log("Deleting lead with ID:", lead_id);

    connection = await dbConnection.getConnection(); // <-- get a single connection
    await connection.beginTransaction();

    try {
      const deleteFollowupsQuery = `DELETE FROM ekarigar_followups WHERE lead_id = ?`;
      console.log("Executing delete followups query:", deleteFollowupsQuery, [
        lead_id,
      ]);

      await connection.execute(deleteFollowupsQuery, [lead_id]);

      const deleteLeadQuery = `DELETE FROM ekarigar_leads WHERE id = ?`;
      const [leadResult] = await connection.execute(deleteLeadQuery, [lead_id]);

      if (leadResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({
          status: false,
          message: "Lead not found",
        });
      }

      await connection.commit();
      console.log("Lead deleted successfully, ID:", lead_id);

      res.status(200).json({
        status: true,
        message: "Lead deleted successfully",
      });
    } catch (transactionError) {
      await connection.rollback();
      console.error("Transaction error:", transactionError);
      throw transactionError;
    }
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    if (connection) connection.release(); // release back to pool
  }
});


// ---pause---

// app.post(
//   "/api/saveFollowUp",
//   upload.single("followup_doc"),
//   async (req, res) => {
//     try {
//       const {
//         lead_id,
//         description,
//         medium,
//         followup_date,
//         attended_by,
//         assign_to,
//         followup_doc_description,
//       } = req.body;
//       const file = req.file;

//       if (!dbConnection) {
//         return res.status(500).json({
//           status: false,
//           message: "Database connection not established",
//         });
//       }

//       // console.log("Follow-up request body:", req.body);
//       // console.log("Uploaded file:", file);

//       if (!lead_id || !description || !medium || !attended_by) {
//         return res.status(400).json({
//           status: false,
//           message: "Missing required fields",
//         });
//       }

//       let filePath = null;
//       if (file) {
//         filePath = `/uploads/${file.filename}`;
//       }

//       const created_at = moment
//         .tz("Asia/Kolkata")
//         .format("YYYY-MM-DD HH:mm:ss");
//       const updated_at = created_at;

//       const query = `
//       INSERT INTO ekarigar_followups (lead_id, description, medium, attended_by, followup_doc_description, followup_doc, followup_date, created_at, updated_at)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//       const values = [
//         lead_id,
//         description,
//         medium,
//         attended_by,
//         followup_doc_description,
//         filePath,
//         followup_date,
//         created_at,
//         updated_at,
//       ];

//       // console.log("Executing insert followup query:", query, values);

//       const [result] = await dbConnection.execute(query, values);

//       res.status(200).json({
//         status: true,
//         message: "Follow-up saved successfully",
//         id: result.insertId,
//       });
//     } catch (error) {
//       console.error("Error in saveFollowUp API:", error);
//       res.status(500).json({
//         status: false,
//         message: "Internal server error",
//         error:
//           process.env.NODE_ENV === "development" ? error.message : undefined,
//       });
//     }
//   }
// );


app.post(
  '/api/saveFollowUp',
  upload.single('followup_doc'),
  async (req, res) => {
    try {
      const {
        lead_id,
        description,
        medium,
        followup_date,
        attended_by,
        assign_to,
        followup_doc_description,
      } = req.body;
      const file = req.file;

      if (!dbConnection) {
        return res.status(500).json({
          status: false,
          message: 'Database connection not established',
        });
      }

      if (!lead_id || !description || !medium || !attended_by) {
        return res.status(400).json({
          status: false,
          message: 'Missing required fields',
        });
      }

      let filePath = null;
      if (file) {
        // Generate unique filename
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `followups/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

        // S3 upload parameters
        const params = {
          Bucket: bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          // Optional: Set ACL to public-read if needed
          // ACL: 'public-read'
        };

        // Upload to S3
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        filePath = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${fileName}`;
        // https://sales-ekarigar-bucket.s3.ap-south-1.amazonaws.com/followups/1754828721454_e7f6z8hza.png
      }

      const created_at = moment
        .tz('Asia/Kolkata')
        .format('YYYY-MM-DD HH:mm:ss');
      const updated_at = created_at;

      const query = `
        INSERT INTO ekarigar_followups (lead_id, description, medium, attended_by, followup_doc_description, followup_doc, followup_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        lead_id,
        description,
        medium,
        attended_by,
        followup_doc_description,
        filePath,
        followup_date,
        created_at,
        updated_at,
      ];

      const [result] = await dbConnection.execute(query, values);

      res.status(200).json({
        status: true,
        message: 'Follow-up saved successfully',
        id: result.insertId,
      });
    } catch (error) {
      console.error('Error in saveFollowUp API:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

app.get('/api/listS3Files', async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'sales-ekarigar-bucket',
      Prefix: 'followups/'
    });
    const data = await s3Client.send(command);
    res.status(200).json({
      status: true,
      files: data.Contents || []
    });
  } catch (error) {
    console.error('Error listing S3 files:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to list S3 files',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get("/api/get_followups", async (req, res) => {
  try {
    const leadId = req.query.lead_id;

    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    if (!leadId) {
      return res.status(400).json({
        status: false,
        message: "Lead ID is required",
      });
    }

    // console.log("Fetching followups for lead ID:", leadId);

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
      GROUP BY leads.id
    `;

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

    // console.log("Executing lead query:", leadQuery, [leadId]);

    const [leadResults] = await dbConnection.execute(leadQuery, [leadId]);

    if (leadResults.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Lead not found",
      });
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
      source: leadResults[0].lead_source_name,
      lead_descp: leadResults[0].requirements,
      lead_status: leadResults[0].lead_status,
      lead_likelihood: leadResults[0].likelihood_id,
      checkbox_options: leadResults[0].checkbox_options
        ? leadResults[0].checkbox_options.split(",")
        : [],
    };

    // console.log("Executing followup query:", followUpQuery, [leadId]);

    const [followUpResults] = await dbConnection.execute(followUpQuery, [
      leadId,
    ]);

    const followups = followUpResults.map((followup) => ({
      followup_id: followup.followup_id,
      description: followup.description,
      medium: followup.medium,
      attended_by: followup.attended_by,
      attended_by_name: followup.attended_by_name,
      followup_date: followup.followup_date,
      created_at: followup.created_at,
      updated_at: followup.updated_at,
      followup_doc_description: followup.followup_doc_description,
      followup_doc: followup.followup_doc,
    }));

    console.log(`Found ${followups.length} followups for lead ${leadId}`);

    return res.status(200).json({
      status: true,
      lead: leadDetails,
      followups: followups,
    });
  } catch (error) {
    console.error("Error fetching followups:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/api/save-form-data_pause", async (req, res) => {
  try {
    const formData = req.body;

    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    console.log("Form data received:", formData);

    const mappedData = await mapFormData(formData);
    console.log("Mapped data:", mappedData);

    if (
      !mappedData.name ||
      !mappedData.mobile_number ||
      !mappedData.email ||
      !mappedData.city
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid data provided",
      });
    }

    const created_at = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const updated_at = created_at;

    const checkboxValues = mappedData.selectedCheckboxes;

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
      updated_at,
    ];

    // console.log("Executing insert form data query:", query, values);

    const [result] = await dbConnection.execute(query, values);

    res.status(200).json({
      status: true,
      message: "Form data saved successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error processing form data:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/api/save-form-data", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const formData = req.body;
    const mappedData = await mapFormData(formData);

    if (
      !mappedData.name ||
      !mappedData.mobile_number ||
      !mappedData.email ||
      !mappedData.city
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid data provided" });
    }

    const created_at = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const updated_at = created_at;
    const checkboxValues = mappedData.selectedCheckboxes;

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
      updated_at,
    ];

    const [result] = await dbConnection.execute(query, values);

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
      // const apiResponse = await axios.post(
      //   "https://shopify-backend-sand.vercel.app/send_lead_email",
      //   thirdPartyPayload
      // );
      // console.log("3rd party API response:", apiResponse.data);
    } catch (apiErr) {
      console.error("Failed to send data to 3rd-party API:", apiErr);
    }

    res.json({
      status: "success",
      message: "Form data saved successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error processing form data:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.get("/api/get_usertable", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

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

    const [results] = await dbConnection.execute(query);

    res.json({ status: true, data: results });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

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

    const [results] = await dbConnection.execute(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const user = results[0];
    user.assigned_services = user.assigned_services
      ? user.assigned_services.split(",")
      : [];
    res.json({ status: true, data: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

app.post("/api/saveUser", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const { username, email, password, role, assigned_services, permissions } =
      req.body;

    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid data provided" });
    }

    const created_at = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const last_login = null;

    const services = Array.isArray(assigned_services)
      ? assigned_services.join(",")
      : "";
    const perms = Array.isArray(permissions) ? permissions.join(",") : "";

    const query = `
      INSERT INTO ekarigar_users (username, email, password, role_id, assigned_services, permissions, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      username,
      email,
      password,
      role,
      services,
      perms,
      created_at,
    ];

    const [result] = await dbConnection.execute(query, values);

    res.json({
      status: "success",
      message: "User saved successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.put("/api/updateLeadStatus", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const { lead_id, status_id } = req.body;

    if (!lead_id || !status_id) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing lead_id or status_id" });
    }

    const statusCheckQuery = `SELECT * FROM ekarigar_leads_status WHERE id = ?`;

    const [statusResults] = await dbConnection.execute(statusCheckQuery, [
      status_id,
    ]);

    if (statusResults.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid status ID" });
    }

    const updatedAt = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const updateQuery = `
      UPDATE ekarigar_leads 
      SET status = ?, updated_at = ? 
      WHERE id = ?
    `;

    const [result] = await dbConnection.execute(updateQuery, [
      status_id,
      updatedAt,
      lead_id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Lead not found" });
    }

    res.json({
      status: "success",
      message: "Lead status updated successfully",
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.put("/api/updateLeadLikelihood", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const { lead_id, likelihood_id } = req.body;

    if (!lead_id || !likelihood_id) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing lead_id or likelihood_id" });
    }

    const likelihoodCheckQuery = `SELECT * FROM ekarigar_leads_likelihood WHERE id = ?`;

    const [likelihoodResults] = await dbConnection.execute(
      likelihoodCheckQuery,
      [likelihood_id]
    );

    if (likelihoodResults.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid likelihood ID" });
    }

    const updatedAt = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const updateQuery = `
      UPDATE ekarigar_leads 
      SET likelihood_id = ?, updated_at = ? 
      WHERE id = ?
    `;

    const [result] = await dbConnection.execute(updateQuery, [
      likelihood_id,
      updatedAt,
      lead_id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Lead not found" });
    }

    res.json({
      status: "success",
      message: "Lead likelihood updated successfully",
    });
  } catch (error) {
    console.error("Error updating lead likelihood:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.put("/api/updateUser", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const {
      user_id,
      username,
      email,
      password,
      role_id,
      assigned_services,
      permissions,
    } = req.body;

    if (!user_id || !username || !email || !role_id) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid data provided" });
    }

    const services = Array.isArray(assigned_services)
      ? assigned_services.join(",")
      : "";
    const perms = Array.isArray(permissions) ? permissions.join(",") : "";

    const query = `
      UPDATE ekarigar_users 
      SET username = ?, email = ?, password = ?, role_id = ?, assigned_services = ?, permissions = ? 
      WHERE id = ?
    `;

    const values = [
      username,
      email,
      password || null,
      role_id,
      services,
      perms,
      user_id,
    ];

    const [result] = await dbConnection.execute(query, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.json({ status: "success", message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const userId = req.params.id;

    const query = "UPDATE ekarigar_users SET delete_status = 1 WHERE id = ?";

    const [results] = await dbConnection.execute(query, [userId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({
      status: true,
      message: "User deleted successfully (soft delete).",
    });
  } catch (error) {
    console.error("Error updating delete_status:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

app.post("/api/run-sql", async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(500).json({
        status: false,
        message: "Database connection not established",
      });
    }

    const { sql } = req.body;

    if (!sql) {
      return res
        .status(400)
        .json({ status: false, message: "SQL query is required" });
    }

    const [results] = await dbConnection.execute(sql);

    res.status(200).json({
      status: true,
      message: "SQL executed successfully",
      results,
    });
  } catch (error) {
    console.error("SQL execution error:", error);
    res
      .status(500)
      .json({ status: false, message: "SQL execution failed", error });
  }
});

startServer();
const moment = require('moment-timezone');

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
  'Digital Transformation': 20,
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
  'Not in list / Not mentioned': 20,
};

const formatDate = (dateStr) => {
  if (!dateStr) {
    return moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  }
  return moment(dateStr).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
};

const mapPayloadToLead = (payload) => {
  if (!payload.field_data || !payload.created_time) {
    throw new Error('Invalid payload: missing field_data or created_time');
  }

  const fieldData = payload.field_data;
  const createdTime = payload.created_time;

  const mappedLead = {
    assigned_to: '6',
    status: '1',
    name: null,
    mobile_number: null,
    email: null,
    city: 'Not mentioned',
    website_type: null,
    industry_type: null,
    contact_preference: '1',
    preferred_date: null,
    preferred_time: null,
    requirements: null,
    lead_source: '3',
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
      case 'full_name':
        mappedLead.name = value || null;
        break;
      case 'phone_number':
        mappedLead.mobile_number = value || null;
        break;
      case 'email':
        mappedLead.email = value || null;
        break;
      case 'business_name_or_industry_type?':
        mappedLead.industry_type = fb_industryMap[value]
          ? fb_industryMap[value].toString()
          : '20';
        requirementsParts.push(`Industry: ${value || 'Not mentioned'}`);
        break;
      case 'what_service_are_you_looking_for?_':
        mappedLead.website_type = fb_serviceMap[value]
          ? fb_serviceMap[value].toString()
          : '16';
        requirementsParts.push(`Service: ${value || 'Not mentioned'}`);
        break;
      case 'what’s_your_goal_with_this_project?':
        requirementsParts.push(`Goal: ${value || 'Not mentioned'}`);
        break;
      case 'do_you_have_an_existing_website_or_app?':
        requirementsParts.push(`Existing Website: ${value || 'Not mentioned'}`);
        break;
      case 'your_preferred_budget_range?':
        requirementsParts.push(`Budget: ${value || 'Not mentioned'}`);
        break;
      case 'when_do_you_want_to_get_started?':
        requirementsParts.push(`Preferred Start Time: ${value || 'Not mentioned'}`);
        break;
    }
  });

  mappedLead.requirements = requirementsParts.length ? requirementsParts.join(', ') : null;
  return mappedLead;
};

module.exports = { mapPayloadToLead, fb_serviceMap, fb_industryMap, formatDate };
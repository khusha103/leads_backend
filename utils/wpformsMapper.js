const moment = require('moment-timezone');
const UserModel = require('../models/userModel');
const { serviceMap, industryMap } = require('./formMapper');

const checkboxMapping = {
  'NEED A NEW WEBSITE FOR YOUR BUSINESS?': 1,
  'WANT TO APPEAR ON TOP OF GOOGLE SEARCH?': 2,
  'WANT MORE BUSINESS LEADS?': 3,
  'INCREASE SALES ON YOUR E-COMMERCE WEBSITE?': 4,
  'WANT TO TAKE YOUR BRAND TO LARGER AUDIENCE?': 5,
  'LOOKING FOR AUTOMATING YOUR BUSINESS PROCESS?': 6,
  'SOMETHING ELSE?': 7,
};

const contactPreferenceMapping = {
  'Call': 1,
  'Schedule a Video Call': 2,
};

const formatDate = (date) => {
  if (!date) {
    return moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  }
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
};

const addMinutes = (date, minutes) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return formatDate(d);
};

async function mapWpformsEntry(entry) {
  try {
    const fields = JSON.parse(entry.fields);
    let name = fields['5']?.value || 'Unknown';
    const mobileNumber = fields['6']?.value || null;
    const email = fields['7']?.value || null;
    let city = fields['8']?.value || null;
    const websiteType = fields['9']?.value || null;
    const industryType = fields['10']?.value || null;
    let contactPreference = fields['11']?.value || null;
    const preferredDate = fields['12']?.date || null;
    const preferredTime = fields['14']?.value || null;
    const requirements = null;

    if (city === 'मुंबई') city = 'Mumbai';
    if (name === 'प्रल्हाद') name = 'Pralhad';
    if (name === 'सीताराम') name = 'Sitaram';

    const websiteTypeId = websiteType ? serviceMap[websiteType] || 0 : 0;
    const industryTypeId = industryType ? industryMap[industryType] || 0 : 0;

    const checkboxField = fields['2']?.value || '';
    const selectedOptions = checkboxField ? checkboxField.split('\n') : [];
    const selectedIds = selectedOptions
      .map(option => checkboxMapping[option?.toUpperCase()])
      .filter(id => id !== undefined);
    const checkBoxes = selectedIds.length > 0 ? selectedIds.join(',') : null;

    const contactPreferenceId = contactPreference ? contactPreferenceMapping[contactPreference] || 0 : 0;

    const createdAt = addMinutes(entry.date, 30);
    const updatedAt = createdAt;

    const assignedTo = await UserModel.getAssignedUser(websiteTypeId);

    return {
      assigned_to: assignedTo,
      status: 1,
      name,
      mobile_number: mobileNumber,
      email,
      city,
      website_type: websiteTypeId,
      industry_type: industryTypeId,
      contact_preference: contactPreferenceId,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      requirements,
      lead_source: 1,
      checkbox_ids: checkBoxes,
      created_at: createdAt,
      updated_at: updatedAt,
    };
  } catch (err) {
    throw new Error('Error mapping WPForms entry: ' + err.message);
  }
}

module.exports = { mapWpformsEntry, checkboxMapping, contactPreferenceMapping };
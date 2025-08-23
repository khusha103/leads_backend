const UserModel = require('../models/userModel');

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
  'AI Solutions': 17,
  'Business Intelligence & Dashboarding': 18,
  'Customized Software Development & Planning': 19,
  'Digital Transformation': 20,
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

async function mapFormData(formData) {
  try {
    const mappedData = {
      name: formData.fullName ?? null,
      mobile_number: formData.mobileNumber ?? null,
      email: formData.email ?? null,
      city: formData.cityName ?? null,
      service_type: serviceMap[formData.selectedService] || null,
      industry_type: industryMap[formData.selectedIndustry] || null,
      contact_preference:
        formData.preferredContactMethod === 'Call'
          ? 1
          : formData.preferredContactMethod === 'Schedule a Video Call'
            ? 2
            : 0,
      preferred_date: formData.date || null,
      preferred_time_slot: formData.selectTiming || null,
      lead_source: 1,
      selectedCheckboxes: formData.businessNeeds
        ? formData.businessNeeds
            .map((value) => {
              const normalizedValue = value?.trim().toLowerCase();
              for (const [key, id] of Object.entries(checkboxMap)) {
                if (key.toLowerCase() === normalizedValue) {
                  return id;
                }
              }
              return null;
            })
            .filter((id) => id)
            .join(',')
        : null,
      requirements: formData.requirements ?? null,
    };
    const assignedUser = await UserModel.getAssignedUser(mappedData.service_type);
    mappedData.assigned_to = assignedUser;
    return mappedData;
  } catch (err) {
    throw new Error('Error mapping form data: ' + err.message);
  }
}

module.exports = { mapFormData, serviceMap, industryMap, checkboxMap };
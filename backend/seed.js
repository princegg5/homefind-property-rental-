const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Property = require('./models/Property');
const Inquiry = require('./models/Inquiry');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homefind';

const sampleProperties = [
  {
    title: 'Lodha Bellissimo 3BHK Sea-Facing Luxury Apartment',
    description: 'Breathtaking Arabian Sea views from the 34th floor. Features Italian marble flooring, floor-to-ceiling soundproof glass, automated smart lighting, imported modular kitchen with Bosch appliances, and two dedicated covered car parking spaces in prime South Mumbai.',
    purpose: 'Buy',
    propertyType: 'Apartment',
    price: 48500000, // 4.85 Crore
    location: {
      address: 'N.M. Joshi Marg, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1850,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Balcony'],
    isFeatured: true,
  },
  {
    title: 'Modern High-Rise Penthouse with Private Terrace',
    description: 'Stunning penthouse in Bandra West featuring a private landscaped rooftop terrace, jacuzzi, private elevator access, and designer interiors. Walking distance from Carter Road and upscale cafes.',
    purpose: 'Rent',
    propertyType: 'Apartment',
    price: 185000, // 1.85 Lakhs / month
    location: {
      address: 'Pali Hill, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 2900,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Balcony'],
    isFeatured: true,
  },
  {
    title: 'Independent Spanish Colonial Villa in DLF Phase 1',
    description: 'Sprawling 5-bedroom Spanish colonial architecture bungalow with a private swimming pool, landscaped lawn, servant quarters, VRV central air conditioning, and solar rooftop power system.',
    purpose: 'Buy',
    propertyType: 'Villa',
    price: 85000000, // 8.5 Crore
    location: {
      address: 'Golf Course Road, DLF Phase 1',
      city: 'Delhi',
      state: 'Delhi NCR',
      pincode: '122002',
    },
    bedrooms: 5,
    bathrooms: 5,
    areaSqFt: 5200,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Balcony'],
    isFeatured: true,
  },
  {
    title: 'Chic 2BHK Furnished Flat near Hauz Khas Village',
    description: 'Fully furnished, sunlit designer apartment surrounded by lush greenery and historic deer park. Ideal for young professionals and expatriates with high-speed fiber internet and metro connectivity.',
    purpose: 'Rent',
    propertyType: 'Apartment',
    price: 52000, // 52k / month
    location: {
      address: 'Hauz Khas Enclave',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110016',
    },
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1150,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Security', 'Elevator', 'Balcony'],
    isFeatured: false,
  },
  {
    title: 'Prestige Lakeside Habitat 3BHK Gated Community Home',
    description: 'Scenic resort-style gated township overlooking Varthur Lake. Over 80 acres of open green spaces, 4 Olympic-sized pools, tennis and badminton courts, skating rink, and international schools nearby.',
    purpose: 'Buy',
    propertyType: 'Apartment',
    price: 19500000, // 1.95 Crore
    location: {
      address: 'Whitefield - Sarjapur Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560087',
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1720,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Balcony'],
    isFeatured: true,
  },
  {
    title: 'Contemporary Studio Apartment in Indiranagar 100ft Road',
    description: 'Vibrant modern studio apartment located 2 minutes from top brewpubs, cafes, and metro station. Comes with a kitchenette, smart work desk setup, and acoustic balcony glass.',
    purpose: 'Rent',
    propertyType: 'Apartment',
    price: 34000, // 34k / month
    location: {
      address: '12th Main, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
    },
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 620,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Security', 'Elevator', 'Balcony'],
    isFeatured: false,
  },
  {
    title: 'Boutique Grade-A IT Park Office Space',
    description: 'Plug-and-play commercial corporate suite with 45 workstations, 2 executive boardrooms, server room, cafeteria, biometric access control, and 100% DG power backup.',
    purpose: 'Rent',
    propertyType: 'Commercial',
    price: 240000, // 2.4 Lakhs / month
    location: {
      address: 'Kalyani Nagar Main Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411006',
    },
    bedrooms: 0,
    bathrooms: 3,
    areaSqFt: 3800,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Security', 'Elevator'],
    isFeatured: false,
  },
  {
    title: 'Amanora Park Town 2BHK Highrise Eco Suite',
    description: 'Modern 2-bedroom eco-suite inside the township of Amanora. Close to Magarpatta Cybercity, featuring round-the-clock water and electricity guarantee, sports club, and open sky garden.',
    purpose: 'Buy',
    propertyType: 'Apartment',
    price: 9200000, // 92 Lakhs
    location: {
      address: 'Hadapsar Bypass',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411028',
    },
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Balcony'],
    isFeatured: false,
  },
  {
    title: 'Sobha Silicon Oasis 3BHK Premium Residence',
    description: 'Exquisite 3BHK overlooking sprawling tropical gardens. Features a grand clubhouse, cricket pitch, amphitheater, and high-speed elevators. 10 minutes from Electronic City Phase 1.',
    purpose: 'Rent',
    propertyType: 'Apartment',
    price: 44000, // 44k / month
    location: {
      address: 'Hosa Road, Off Hosur Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560100',
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1550,
    images: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Balcony'],
    isFeatured: true,
  },
  {
    title: 'Emerald Bay Luxury Duplex Row House',
    description: 'Designer 4BHK triplex row house in Baner with a private lawn, Italian modular wardrobe systems, and an open terrace barbecue deck. Prime connectivity to Hinjawadi IT Hub.',
    purpose: 'Buy',
    propertyType: 'House',
    price: 26000000, // 2.6 Crore
    location: {
      address: 'Baner-Pashan Link Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
    },
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3100,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Gym', 'Security', 'Balcony'],
    isFeatured: true,
  },
  {
    title: 'Lutyens Heritage Style 4BHK Bungalow',
    description: 'Regal standalone house in South Delhi featuring colonial colonnade corridors, grand chandeliers, private staff annex, manicured rose gardens, and a 4-car garage portico.',
    purpose: 'Buy',
    propertyType: 'House',
    price: 140000000, // 14 Crore
    location: {
      address: 'Panchsheel Park North',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110017',
    },
    bedrooms: 4,
    bathrooms: 5,
    areaSqFt: 4600,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Security', 'Balcony'],
    isFeatured: false,
  },
  {
    title: 'Prime Retail Showroom Space on Linking Road',
    description: 'High-visibility corner commercial showroom with glass facade on Mumbai’s busiest retail avenue. Massive footfall, valet parking provisions, and ready air-conditioning ducting.',
    purpose: 'Rent',
    propertyType: 'Commercial',
    price: 450000, // 4.5 Lakhs / month
    location: {
      address: 'Linking Road, Khar West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400052',
    },
    bedrooms: 0,
    bathrooms: 2,
    areaSqFt: 2200,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Parking', 'Security', 'Elevator'],
    isFeatured: false,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB at:', MONGO_URI);

    // Clear existing collections
    await User.deleteMany();
    await Property.deleteMany();
    await Inquiry.deleteMany();
    console.log('[Seed] Cleared existing Users, Properties, and Inquiries.');

    // Create Admin User
    const adminUser = await User.create({
      name: 'HomeFind Admin',
      email: 'admin@homefind.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
    });

    // Create Regular Demo User
    const demoUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'user',
    });

    console.log('[Seed] Created default users:');
    console.log('   - Admin: admin@homefind.com / admin123');
    console.log('   - User:  rahul@example.com / password123');

    // Attach owner to properties and insert
    const propertiesWithOwner = sampleProperties.map((prop) => ({
      ...prop,
      owner: adminUser._id,
    }));

    const insertedProperties = await Property.insertMany(propertiesWithOwner);
    console.log(`[Seed] Successfully inserted ${insertedProperties.length} realistic properties!`);

    // Insert a sample inquiry
    await Inquiry.create({
      property: insertedProperties[0]._id,
      user: demoUser._id,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      visitDate: '2025-05-15',
      message: 'Hello, I would like to schedule a guided weekend tour for this 3BHK flat.',
      status: 'Pending',
    });

    console.log('[Seed] Created 1 sample initial tour inquiry.');
    console.log('====================================================');
    console.log('Database Seeding Completed Successfully! Enjoy MERN!');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

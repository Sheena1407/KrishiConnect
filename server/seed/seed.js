const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const PestAlert = require('../models/PestAlert');
const Resource = require('../models/Resource');
const Order = require('../models/Order');
const Expert = require('../models/Expert');
const Consultation = require('../models/Consultation');
const CommunityPost = require('../models/CommunityPost');
const FarmActivity = require('../models/FarmActivity');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/krishiconnect';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany(),
      Farm.deleteMany(),
      Crop.deleteMany(),
      SoilReport.deleteMany(),
      PestAlert.deleteMany(),
      Resource.deleteMany(),
      Order.deleteMany(),
      Expert.deleteMany(),
      Consultation.deleteMany(),
      CommunityPost.deleteMany(),
      FarmActivity.deleteMany(),
      Notification.deleteMany(),
    ]);
    console.log('[Seed]: Cleared existing database records.');

    // 1. Create Users (Farmer & Admin)
    // The pre-save hook in User model automatically hashes the password
    const farmer = await User.create({
      name: 'Ramesh Patel',
      email: 'farmer@krishiconnect.demo',
      phone: '+91 98260 12345',
      password: 'Farmer@123',
      role: 'Farmer',
      location: 'Sehore, Madhya Pradesh',
      language: 'en',
      profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
      isActive: true,
    });

    const admin = await User.create({
      name: 'Dr. Anita Sharma (Admin)',
      email: 'admin@krishiconnect.demo',
      phone: '+91 94250 99887',
      password: 'Admin@123',
      role: 'Admin',
      location: 'Bhopal Central Agro Hub',
      language: 'en',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      isActive: true,
    });

    const fellowFarmer = await User.create({
      name: 'Balwinder Singh',
      email: 'balwinder@krishi.demo',
      phone: '+91 98140 55443',
      password: 'Farmer@123',
      role: 'Farmer',
      location: 'Ludhiana, Punjab',
      language: 'en',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      isActive: true,
    });

    console.log('[Seed]: Users seeded.');

    // 2. Create Farms for Ramesh Patel
    const farm1 = await Farm.create({
      userId: farmer._id,
      farmName: 'Green Valley Farm',
      location: 'Village Shyampur, Sehore, MP',
      area: 7.5,
      soilType: 'Black Soil',
      irrigationType: 'Drip Irrigation',
      waterSource: 'Borewell',
      farmingMethod: 'Organic Farming',
      description: 'Primary fertile farm with drip lines and solar powered borewell pump.',
    });

    const farm2 = await Farm.create({
      userId: farmer._id,
      farmName: 'Sunrise Agro Fields',
      location: 'Ashta Bypass Road, Sehore, MP',
      area: 4.5,
      soilType: 'Alluvial Soil',
      irrigationType: 'Sprinkler',
      waterSource: 'Canal',
      farmingMethod: 'Natural/Zero Budget',
      description: 'Second plot dedicated to pulse-oilseed rotation and vegetable cultivation.',
    });

    console.log('[Seed]: Farms seeded.');

    // 3. Create Crops
    const crop1 = await Crop.create({
      userId: farmer._id,
      farmId: farm1._id,
      cropName: 'Wheat',
      variety: 'Sharbati C-306',
      area: 4.0,
      sowingDate: new Date('2026-11-05'),
      expectedHarvestDate: new Date('2027-03-20'),
      growthStage: 'Vegetative',
      health: 'Healthy',
      irrigationStatus: 'Adequate',
      fertilizerUsed: 'Vermicompost + Bio-NPK',
      notes: 'Excellent tillering. Zero weed pressure observed.',
    });

    const crop2 = await Crop.create({
      userId: farmer._id,
      farmId: farm1._id,
      cropName: 'Soybean',
      variety: 'JS-335 Yellow',
      area: 3.5,
      sowingDate: new Date('2026-06-25'),
      expectedHarvestDate: new Date('2026-10-15'),
      growthStage: 'Harvest Ready',
      health: 'Healthy',
      irrigationStatus: 'Not Needed',
      fertilizerUsed: 'Rhizobium Culture & DAP',
      notes: 'Pods fully mature, ready for combine harvester.',
    });

    const crop3 = await Crop.create({
      userId: farmer._id,
      farmId: farm2._id,
      cropName: 'Chickpea (Chana)',
      variety: 'Desi JG-11',
      area: 2.5,
      sowingDate: new Date('2026-10-20'),
      expectedHarvestDate: new Date('2027-02-15'),
      growthStage: 'Seedling',
      health: 'Healthy',
      irrigationStatus: 'Due Soon',
      fertilizerUsed: 'SSP & Trichoderma',
      notes: 'Germination rate exceeds 92%. First light irrigation scheduled.',
    });

    const crop4 = await Crop.create({
      userId: farmer._id,
      farmId: farm2._id,
      cropName: 'Tomato',
      variety: 'Abhinav Hybrid',
      area: 2.0,
      sowingDate: new Date('2026-08-10'),
      expectedHarvestDate: new Date('2026-12-05'),
      growthStage: 'Fruiting',
      health: 'Moderate',
      irrigationStatus: 'Adequate',
      fertilizerUsed: 'Drip fertigation 19:19:19',
      notes: 'Flowering dense, monitored for early blight.',
    });

    console.log('[Seed]: Crops seeded.');

    // 4. Create Soil Report
    await SoilReport.create({
      userId: farmer._id,
      farmId: farm1._id,
      pH: 7.2,
      nitrogen: 340,
      phosphorus: 38,
      potassium: 220,
      moisture: 42,
      organicCarbon: 0.82,
      healthScore: 88,
      recommendations: [
        'Soil parameters are well balanced. Maintain current organic vermicompost routine.',
        'Nitrogen and phosphorus levels are optimal for rabi cereal crops.',
      ],
    });

    await SoilReport.create({
      userId: farmer._id,
      farmId: farm2._id,
      pH: 6.3,
      nitrogen: 240,
      phosphorus: 22,
      potassium: 160,
      moisture: 32,
      organicCarbon: 0.58,
      healthScore: 74,
      recommendations: [
        'Soil pH is slightly acidic (6.3). Apply a light dose of agricultural lime (200 kg/acre).',
        'Available Nitrogen is slightly low (<280 kg/ha). Top-dress with organic compost.',
        'Moisture is low (<35%). Schedule irrigation within 48 hours.',
      ],
    });

    console.log('[Seed]: Soil Reports seeded.');

    // 5. Create Resources / Products (Krishi Market)
    const product1 = await Resource.create({
      name: 'Certified Sharbati Wheat Seeds (40 kg)',
      category: 'Seeds',
      description: 'High-yield, disease-resistant certified premium Sharbati wheat seeds with 98% germination rate.',
      price: 1850,
      unit: 'bag',
      stock: 45,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
      seller: 'National Seeds Corporation',
      rating: 4.8,
      isActive: true,
    });

    const product2 = await Resource.create({
      name: 'Organic Vermicompost Enricher (50 kg)',
      category: 'Organic Manure',
      description: '100% pure organic earthworm castings rich in humic acid, micro-nutrients and beneficial nitrogen-fixing flora.',
      price: 650,
      unit: 'bag',
      stock: 120,
      image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80&w=400',
      seller: 'Gramin Bio Agrotech',
      rating: 4.9,
      isActive: true,
    });

    const product3 = await Resource.create({
      name: 'Bio-NPK Liquid Consortia (1 Liter)',
      category: 'Fertilizers',
      description: 'Liquid bio-fertilizer containing Azotobacter, PSB and KMB strains. Reduces chemical fertilizer requirement by 25%.',
      price: 420,
      unit: 'bottle',
      stock: 80,
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400',
      seller: 'Krishi Vigyan Agro',
      rating: 4.7,
      isActive: true,
    });

    const product4 = await Resource.create({
      name: 'Precision Drip Irrigation Kit (1 Acre)',
      category: 'Irrigation Equipment',
      description: 'Complete 1-acre drip kit including 16mm inline lateral pipes, screen filter, venturi injector, and fittings.',
      price: 14500,
      unit: 'kit',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=400',
      seller: 'Jain Irrigation Solutions',
      rating: 4.9,
      isActive: true,
    });

    const product5 = await Resource.create({
      name: 'Neem Shield Bio-Pesticide (10,000 PPM)',
      category: 'Plant Protection',
      description: 'Cold-pressed pure Azadirachtin organic repellent effective against whitefly, aphids, bollworms and caterpillars.',
      price: 580,
      unit: 'bottle',
      stock: 60,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&q=80&w=400',
      seller: 'Prakriti Agro Organics',
      rating: 4.6,
      isActive: true,
    });

    const product6 = await Resource.create({
      name: 'Battery Operated Knapsack Sprayer (16L)',
      category: 'Farming Tools',
      description: 'Rechargeable 12V 8Ah battery sprayer with stainless steel extendable lance and 4 adjustable spray nozzles.',
      price: 2499,
      unit: 'piece',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400',
      seller: 'Kisan Shakti Implements',
      rating: 4.7,
      isActive: true,
    });

    console.log('[Seed]: Products seeded.');

    // 6. Create Orders
    await Order.create({
      userId: farmer._id,
      items: [
        {
          resourceId: product2._id,
          name: product2.name,
          price: product2.price,
          quantity: 2,
          image: product2.image,
          unit: product2.unit,
        },
        {
          resourceId: product5._id,
          name: product5.name,
          price: product5.price,
          quantity: 1,
          image: product5.image,
          unit: product5.unit,
        },
      ],
      totalAmount: 1880,
      status: 'Shipped',
      shippingAddress: {
        recipientName: 'Ramesh Patel',
        phone: '+91 98260 12345',
        street: 'Main Farm Gate, Village Shyampur',
        villageOrCity: 'Sehore',
        district: 'Sehore',
        state: 'Madhya Pradesh',
        pincode: '466001',
      },
      paymentMethod: 'Cash on Delivery',
    });

    console.log('[Seed]: Orders seeded.');

    // 7. Create Experts
    const expert1 = await Expert.create({
      name: 'Dr. Virendra Kumar',
      specialization: 'Soil Science',
      experience: '16+ Years',
      qualification: 'Ph.D. Soil Chemistry, ICAR-IISS',
      rating: 4.9,
      consultationFee: 0,
      availability: 'Mon - Fri (10 AM - 4 PM)',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      languages: ['Hindi', 'English'],
    });

    const expert2 = await Expert.create({
      name: 'Dr. Sunita Deshmukh',
      specialization: 'Pest Management',
      experience: '12+ Years',
      qualification: 'M.Sc. Agricultural Entomology',
      rating: 4.8,
      consultationFee: 0,
      availability: 'Tue - Sat (11 AM - 5 PM)',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      languages: ['Hindi', 'Marathi', 'English'],
    });

    const expert3 = await Expert.create({
      name: 'Er. Rajesh Choudhary',
      specialization: 'Irrigation',
      experience: '10+ Years',
      qualification: 'M.Tech Water Resource Engineering',
      rating: 4.7,
      consultationFee: 0,
      availability: 'Mon - Thu (09 AM - 2 PM)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      languages: ['Hindi', 'English'],
    });

    const expert4 = await Expert.create({
      name: 'Prof. Harpreet Gill',
      specialization: 'Organic Farming',
      experience: '18+ Years',
      qualification: 'Senior Agronomist, PAU Ludhiana',
      rating: 5.0,
      consultationFee: 0,
      availability: 'Wed - Sun (02 PM - 6 PM)',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      languages: ['Punjabi', 'Hindi', 'English'],
    });

    console.log('[Seed]: Experts seeded.');

    // 8. Create Consultation
    await Consultation.create({
      userId: farmer._id,
      expertId: expert1._id,
      topic: 'Organic carbon improvement for Rabi wheat',
      question: 'My soil test shows 0.58% organic carbon in plot 2. What dosage of FYM or green manure should I apply before sowing?',
      date: '2026-10-28',
      time: '11:30 AM',
      status: 'Confirmed',
      expertReply: 'Apply 2.5 tonnes of well-decomposed FYM or 1 tonne of vermicompost enriched with PSB per acre during final ploughing.',
    });

    console.log('[Seed]: Consultations seeded.');

    // 9. Create Pest Alerts
    await PestAlert.create({
      crop: 'Soybean',
      pestName: 'Girdle Beetle (Obereopsis brevis)',
      symptoms: 'Ring-like cuts made by adult beetles on leaf petiole and main stem, causing top leaves to droop and dry up.',
      riskLevel: 'Medium',
      prevention: 'Deep summer ploughing. Install yellow sticky traps (15/acre). Avoid excess dense vegetative growth.',
      recommendation: 'Spray Chlorantraniliprole 18.5% SC @ 60 ml/acre or Thiamethoxam + Lambda-cyhalothrin @ 50 ml/acre.',
      isActive: true,
    });

    await PestAlert.create({
      crop: 'Wheat',
      pestName: 'Yellow Stripe Rust Alert (Puccinia striiformis)',
      symptoms: 'Bright yellow linear pustules appearing parallel along leaf veins in early morning dew.',
      riskLevel: 'High',
      prevention: 'Grow certified resistant varieties (DBW-187, DBW-303). Monitor field corners near tree shades.',
      recommendation: 'Foliar spray of Propiconazole 25% EC (Tilt) @ 200 ml in 200 liters of water per acre immediately on notice.',
      isActive: true,
    });

    await PestAlert.create({
      crop: 'Cotton',
      pestName: 'Pink Bollworm (Pectinophora gossypiella)',
      symptoms: 'Rosetted blooms with closed petals. Bored holes on green bolls filled with frass.',
      riskLevel: 'High',
      prevention: 'Hang Gossyplure pheromone traps (5 traps/acre) for continuous monitoring.',
      recommendation: 'Spray Spinetoram 11.7% SC @ 170 ml/acre or Emamectin Benzoate 5% SG @ 100 g/acre.',
      isActive: true,
    });

    console.log('[Seed]: Pest Alerts seeded.');

    // 10. Create Community Posts
    await CommunityPost.create({
      userId: farmer._id,
      authorName: 'Ramesh Patel',
      authorLocation: 'Sehore, MP',
      title: 'Success with Drip Irrigation in Sharbati Wheat Cultivation',
      content: 'Sharing my experience: Shifted 4 acres of Sharbati wheat to inline drip irrigation this rabi season. Saved nearly 40% borewell electricity and water while crop tillering is much more uniform compared to traditional flood irrigation. Has anyone tried solar-powered fertigation automation?',
      category: 'Irrigation',
      likes: [farmer._id, fellowFarmer._id],
      comments: [
        {
          userId: fellowFarmer._id,
          userName: 'Balwinder Singh',
          userRole: 'Farmer',
          comment: 'Great initiative Ramesh ji! We use solar pump with auto timer in Punjab, works smoothly and cuts diesel bills.',
        },
      ],
    });

    await CommunityPost.create({
      userId: fellowFarmer._id,
      authorName: 'Balwinder Singh',
      authorLocation: 'Ludhiana, Punjab',
      title: 'Managing Paddy Straw without Burning — In-situ Mulching Tips',
      content: 'Using Happy Seeder directly into combine-harvested paddy stubble preserves soil moisture and eliminates air pollution. Soil organic carbon improved by 0.15% in two seasons.',
      category: 'Soil Health',
      likes: [farmer._id],
      comments: [
        {
          userId: farmer._id,
          userName: 'Ramesh Patel',
          userRole: 'Farmer',
          comment: 'Very inspiring! Residue retention is the future of sustainable farming.',
        },
      ],
    });

    console.log('[Seed]: Community Posts seeded.');

    // 11. Create Farm Planner Activities
    await FarmActivity.create({
      userId: farmer._id,
      farmId: farm1._id,
      cropId: crop1._id,
      title: 'First CRI Irrigation & Nitrogen Feeding',
      description: 'Crown Root Initiation stage irrigation. Broadcast first split of Urea (25 kg/acre).',
      activityType: 'Irrigation',
      date: '2026-10-26',
      time: '07:30 AM',
      status: 'Upcoming',
    });

    await FarmActivity.create({
      userId: farmer._id,
      farmId: farm1._id,
      cropId: crop2._id,
      title: 'Harvest & Threshing of Soybean Plot',
      description: 'Bring combine harvester for plot 1 soybean. Store seed grains under tarpaulins.',
      activityType: 'Harvesting',
      date: '2026-10-27',
      time: '09:00 AM',
      status: 'Upcoming',
    });

    await FarmActivity.create({
      userId: farmer._id,
      farmId: farm2._id,
      cropId: crop3._id,
      title: 'Pest Scouting for Gram Pod Borer',
      description: 'Inspect lower foliage and flower buds for early instar Helicoverpa larvae.',
      activityType: 'Pest inspection',
      date: '2026-10-30',
      time: '08:00 AM',
      status: 'Upcoming',
    });

    console.log('[Seed]: Farm Activities seeded.');

    // 12. Create Notifications
    await Notification.create({
      userId: farmer._id,
      title: '🌾 Yellow Rust Alert in Surrounding Block',
      message: 'Agricultural warning issued for Sehore district. Inspect wheat seedlings for yellow rust stripes.',
      type: 'pest',
      link: '/pest-alerts',
      isRead: false,
    });

    await Notification.create({
      userId: farmer._id,
      title: '🌧️ Weather Advisory: Rain Expected',
      message: 'Scattered light showers expected tomorrow. Postpone chemical sprays for 48 hours.',
      type: 'weather',
      link: '/weather',
      isRead: false,
    });

    await Notification.create({
      userId: farmer._id,
      title: '📦 Order #KM-7821 Dispatched',
      message: 'Your order for Vermicompost & Neem Shield is out for delivery today via Krishi Express.',
      type: 'order',
      link: '/orders',
      isRead: true,
    });

    console.log('[Seed]: Notifications seeded.');
    console.log('\n===========================================');
    console.log('✅ KrishiConnect Database Seeding Complete!');
    console.log('===========================================');
    console.log('Farmer Demo:  farmer@krishiconnect.demo  /  Farmer@123');
    console.log('Admin Demo:   admin@krishiconnect.demo   /  Admin@123');
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();

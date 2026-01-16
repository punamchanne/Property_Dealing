require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');

// Sample property images from Unsplash
const propertyImages = {
    apartments: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ],
    villas: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ],
    plots: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    ],
    commercial: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    ],
};

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

const amenities = {
    apartment: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup', 'Lift', 'Club House', 'Garden'],
    villa: ['Private Pool', 'Garden', 'Parking', 'Security', 'Modular Kitchen', 'Servant Room', 'Terrace'],
    plot: ['Gated Community', 'Water Supply', 'Electricity', 'Road Access', 'Security'],
    commercial: ['Parking', 'Power Backup', 'Lift', 'Security', 'Cafeteria', 'Conference Room'],
};

async function seedDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME || 'property_dealing',
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Property.deleteMany({});
        console.log('✅ Existing data cleared');

        // Create sample users
        console.log('👥 Creating sample users...');

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@propertydealing.com',
            password: 'password123',
            role: 'admin',
            phone: '+91 9876543210',
        });

        const owners = [];
        for (let i = 1; i <= 5; i++) {
            const owner = await User.create({
                name: `Property Owner ${i}`,
                email: `owner${i}@example.com`,
                password: 'password123',
                role: 'owner',
                phone: `+91 98765432${10 + i}`,
            });
            owners.push(owner);
        }

        const regularUser = await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
            phone: '+91 9876543220',
        });

        console.log('✅ Created users');

        // Create sample properties
        console.log('🏢 Creating sample properties...');
        const properties = [];

        // Apartments
        for (let i = 1; i <= 8; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const property = await Property.create({
                title: `Luxury ${2 + (i % 3)}BHK Apartment in ${city}`,
                description: `Spacious ${2 + (i % 3)}BHK apartment with modern amenities and stunning city views. Perfect for families looking for comfort and convenience.`,
                type: 'Apartment',
                price: 5000000 + (i * 500000),
                priceType: i % 3 === 0 ? 'rent' : 'sale',
                location: {
                    address: `${100 + i} Main Street, ${city}`,
                    city: city,
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: `40000${i}`,
                    coordinates: {
                        lat: 19.0760 + (Math.random() * 0.1),
                        lng: 72.8777 + (Math.random() * 0.1),
                    },
                },
                images: [
                    {
                        url: propertyImages.apartments[i % propertyImages.apartments.length],
                        publicId: `apartment_${i}_living`,
                        roomType: 'living-room',
                        caption: 'Spacious Living Room',
                        isPrimary: true,
                        order: 1
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop',
                        publicId: `apartment_${i}_bedroom`,
                        roomType: 'bedroom',
                        caption: 'Master Bedroom',
                        isPrimary: false,
                        order: 2
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&h=800&fit=crop',
                        publicId: `apartment_${i}_kitchen`,
                        roomType: 'kitchen',
                        caption: 'Modern Modular Kitchen',
                        isPrimary: false,
                        order: 3
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&h=800&fit=crop',
                        publicId: `apartment_${i}_bathroom`,
                        roomType: 'bathroom',
                        caption: 'Luxury Bathroom',
                        isPrimary: false,
                        order: 4
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=800&fit=crop',
                        publicId: `apartment_${i}_balcony`,
                        roomType: 'balcony',
                        caption: 'Balcony with City View',
                        isPrimary: false,
                        order: 5
                    }
                ],
                amenities: amenities.apartment.slice(0, 5 + (i % 3)),
                bedrooms: 2 + (i % 3),
                bathrooms: 2 + (i % 2),
                area: {
                    value: 1000 + (i * 100),
                    unit: 'sqft',
                },
                ownerId: owners[i % owners.length]._id,
                approved: true,
                featured: i <= 3,
                status: 'available',
            });
            properties.push(property);
        }

        // Villas
        for (let i = 1; i <= 6; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const property = await Property.create({
                title: `Premium ${3 + (i % 2)}BHK Villa in ${city}`,
                description: `Luxurious independent villa with private garden, modern architecture, and premium fittings. Ideal for those seeking privacy and luxury.`,
                type: 'Villa',
                price: 15000000 + (i * 2000000),
                priceType: 'sale',
                location: {
                    address: `Villa ${i}, Green Valley, ${city}`,
                    city: city,
                    state: 'Karnataka',
                    country: 'India',
                    zipCode: `56000${i}`,
                    coordinates: {
                        lat: 12.9716 + (Math.random() * 0.1),
                        lng: 77.5946 + (Math.random() * 0.1),
                    },
                },
                images: [
                    {
                        url: propertyImages.villas[i % propertyImages.villas.length],
                        publicId: `villa_${i}_living`,
                        roomType: 'living-room',
                        caption: 'Luxurious Living Area',
                        isPrimary: true,
                        order: 1
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=800&fit=crop',
                        publicId: `villa_${i}_bedroom`,
                        roomType: 'bedroom',
                        caption: 'Master Suite',
                        isPrimary: false,
                        order: 2
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1200&h=800&fit=crop',
                        publicId: `villa_${i}_kitchen`,
                        roomType: 'kitchen',
                        caption: 'Gourmet Kitchen',
                        isPrimary: false,
                        order: 3
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=1200&h=800&fit=crop',
                        publicId: `villa_${i}_bathroom`,
                        roomType: 'bathroom',
                        caption: 'Spa Bathroom',
                        isPrimary: false,
                        order: 4
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
                        publicId: `villa_${i}_garden`,
                        roomType: 'exterior',
                        caption: 'Private Garden',
                        isPrimary: false,
                        order: 5
                    }
                ],
                amenities: amenities.villa,
                bedrooms: 3 + (i % 2),
                bathrooms: 3 + (i % 2),
                area: {
                    value: 2500 + (i * 200),
                    unit: 'sqft',
                },
                ownerId: owners[i % owners.length]._id,
                approved: true,
                featured: i <= 2,
                status: 'available',
            });
            properties.push(property);
        }

        // Plots
        for (let i = 1; i <= 5; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const property = await Property.create({
                title: `Residential Plot in ${city} - ${1000 + (i * 200)} sqft`,
                description: `Prime residential plot in a gated community with all modern amenities. Perfect for building your dream home.`,
                type: 'Plot',
                price: 3000000 + (i * 500000),
                priceType: 'sale',
                location: {
                    address: `Plot ${i}, Sunrise Layout, ${city}`,
                    city: city,
                    state: 'Telangana',
                    country: 'India',
                    zipCode: `50000${i}`,
                    coordinates: {
                        lat: 17.3850 + (Math.random() * 0.1),
                        lng: 78.4867 + (Math.random() * 0.1),
                    },
                },
                images: [
                    {
                        url: propertyImages.plots[i % propertyImages.plots.length],
                        publicId: `plot_${i}_main`,
                    }
                ],
                amenities: amenities.plot,
                area: {
                    value: 1000 + (i * 200),
                    unit: 'sqft',
                },
                ownerId: owners[i % owners.length]._id,
                approved: true,
                featured: i === 1,
                status: 'available',
            });
            properties.push(property);
        }

        // Commercial Properties
        for (let i = 1; i <= 3; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const property = await Property.create({
                title: `Commercial Office Space in ${city}`,
                description: `Modern commercial office space in prime business district. Ideal for startups and established businesses.`,
                type: 'Commercial',
                price: 8000000 + (i * 1000000),
                priceType: i % 2 === 0 ? 'rent' : 'sale',
                location: {
                    address: `${i}th Floor, Business Tower, ${city}`,
                    city: city,
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: `40001${i}`,
                    coordinates: {
                        lat: 19.0760 + (Math.random() * 0.1),
                        lng: 72.8777 + (Math.random() * 0.1),
                    },
                },
                images: [
                    {
                        url: propertyImages.commercial[i % propertyImages.commercial.length],
                        publicId: `commercial_${i}_main`,
                    }
                ],
                amenities: amenities.commercial,
                area: {
                    value: 1500 + (i * 300),
                    unit: 'sqft',
                },
                ownerId: owners[i % owners.length]._id,
                approved: true,
                featured: false,
                status: 'available',
            });
            properties.push(property);
        }

        console.log(`✅ Created ${properties.length} properties`);

        // Summary
        console.log('\n📊 Database Seeding Summary:');
        console.log(`   - Admin Users: 1`);
        console.log(`   - Property Owners: ${owners.length}`);
        console.log(`   - Regular Users: 1`);
        console.log(`   - Total Properties: ${properties.length}`);
        console.log(`   - Featured Properties: ${properties.filter(p => p.featured).length}`);
        console.log(`   - Apartments: ${properties.filter(p => p.type === 'Apartment').length}`);
        console.log(`   - Villas: ${properties.filter(p => p.type === 'Villa').length}`);
        console.log(`   - Plots: ${properties.filter(p => p.type === 'Plot').length}`);
        console.log(`   - Commercial: ${properties.filter(p => p.type === 'Commercial').length}`);
        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Test Credentials:');
        console.log('   Admin: admin@propertydealing.com / password123');
        console.log('   Owner: owner1@example.com / password123');
        console.log('   User: user@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();

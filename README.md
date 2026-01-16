# 🏠 AI Homes - Real Estate Platform

AI Homes is a premium, full-stack real estate platform designed to provide an immersive property buying and selling experience. It features cutting-edge technology including real-time 3D and 360° property viewing, role-based dashboards, and a sleek, modern UI.

![AI Homes Hero](https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop)

## 🚀 Key Features

### 🌟 Immersive Property Viewing
- **Interactive 3D Mode**: Uses **React Three Fiber (R3F)** and **Three.js** to transform standard property photos into interactive 3D scenes with depth and perspective.
- **360° Panorama**: Integrated **Photo Sphere Viewer** allowing users to rotate and explore rooms in a full 360-degree environment from a single flat image.
- **Room-wise Filtering**: Navigate through different parts of the property (Living Room, Bedrooms, Kitchen, etc.) with a single click.

### 👥 Role-Based Dashboards
- **User Dashboard**: Manage wishlists, track meeting schedules (Virtual/In-person), and view saved properties.
- **Owner Dashboard**: Comprehensive property management, analytics on listing performance, and easy add/edit property forms.
- **Admin Panel**: High-level oversight of all platform data, user management, and system statistics.

### 🎨 Premium UI/UX
- **Modern Red & White Theme**: A bold, professional aesthetic optimized for clarity and high conversion.
- **Responsive Design**: Seamless experience across Mobile, Tablet, and Desktop.
- **Advanced Filtering**: Search properties by type (Apartment, Villa, Plot, Commercial), location, price range, and amenities.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, Framer Motion
- **3D/360 Engine**: Three.js, @react-three/fiber, react-photo-sphere-viewer
- **Backend**: Node.js, Express, MongoDB with Mongoose
- **Authentication**: JWT-based secure authentication
- **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/punamchanne/Property_Dealing.git
cd Property_Dealing
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and fill in details
cp .env.example .env

# Run development server
npm run dev
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
# Fill in your MONGODB_URI and JWT_SECRET in .env


# Seed the database (Optional but recommended for demo)
node seed.js

# Start backend server
npm run dev
```

## 📄 License

This project is licensed under the MIT License.

---

Crafted with ❤️ for the future of Real Estate.

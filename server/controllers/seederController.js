import Room from "../models/room.js";
import Addon from "../models/addon.js";

export const seedDatabase = async (req, res) => {
  try {
    const roomTypes = ["Single", "Double", "Deluxe", "Luxury", "Suite"];
    const locations = ["Floor 1", "Floor 2", "Floor 3", "Penthouse", "Sea View Wing"];
    const images = [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591088398332-8a77d399c843?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop"
    ];

    const roomsToAdd = [];

    for (let i = 1; i <= 25; i++) {
      const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const randomImages = [...images].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      roomsToAdd.push({
        name: `${type} Room ${100 + i}`,
        type: type.toLowerCase(),
        description: `Experience ultimate comfort in our ${type} Room. Featuring premium amenities, stunning views, and a sophisticated atmosphere tailored for both relaxation and productivity.`,
        price: Math.floor(Math.random() * (800 - 150) + 150),
        maxPerson: Math.floor(Math.random() * 4) + 1,
        location: locations[Math.floor(Math.random() * locations.length)],
        images: randomImages
      });
    }

    // Optional: Clear existing rooms
    // await Room.deleteMany({});

    await Room.insertMany(roomsToAdd);
    res.status(200).json({ status: true, message: "25 Rooms seeded successfully!", count: roomsToAdd.length });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const seedAddons = async (req, res) => {
  try {
    const addons = [
      { name: 'High-Speed Wifi', price: 20, icon: 'Wifi', description: 'Ultra fast internet for all your devices.' },
      { name: 'Gourmet Breakfast', price: 40, icon: 'Coffee', description: 'Freshly prepared breakfast delivered to your room.' },
      { name: 'Smart TV Premium', price: 20, icon: 'Tv', description: 'Access to Netflix, HBO Max and more.' },
      { name: 'Climate Control', price: 20, icon: 'Wind', description: 'Personalized temperature and humidity settings.' },
      { name: 'Safe & Secure', price: 40, icon: 'ShieldCheck', description: 'Biometric safe and 24/7 security monitoring.' },
      { name: 'Airport Shuttle', price: 50, icon: 'Car', description: 'Luxury car transfer to and from the airport.' },
    ];

    await Addon.deleteMany({});
    await Addon.insertMany(addons);
    res.status(200).json({ status: true, message: "Add-ons seeded successfully!" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

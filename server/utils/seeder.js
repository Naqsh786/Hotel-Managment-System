import Room from '../models/room.js';

export const seedSampleRooms = async () => {
  const roomTypes = ["Standard", "Deluxe", "Suite", "Royal", "Family"];
  const locations = ["Floor 1, Wing A", "Floor 2, Wing B", "Floor 3, Ocean View", "Penthouse Level"];
  const images = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80'
  ];

  const rooms = [];
  for (let i = 1; i <= 25; i++) {
    const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    rooms.push({
      name: `${type} Premium Room ${100 + i}`,
      maxPerson: Math.floor(Math.random() * 4) + 2,
      location: locations[Math.floor(Math.random() * locations.length)],
      price: Math.floor(Math.random() * (500 - 100) + 100),
      type: type,
      images: [images[i % images.length]],
      amenities: ['Wifi', 'Coffee', 'AC', 'Smart TV', 'Mini Bar'],
      description: `A luxury ${type} stay with high-quality service and premium comfort at Sona Hotel.`
    });
  }

  await Room.deleteMany({});
  const createdRooms = await Room.insertMany(rooms);
  return createdRooms;
};

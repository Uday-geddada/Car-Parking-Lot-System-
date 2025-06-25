export interface ParkingLot {
  id: string;
  name: string;
  location: string;
  address: string;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
}

export const parkingLots: ParkingLot[] = [
  {
    id: '1',
    name: 'Downtown Plaza Parking',
    location: 'Downtown',
    address: '123 Main Street, Downtown',
    totalSlots: 200,
    availableSlots: 45,
    pricePerHour: 5,
    amenities: ['24/7 Security', 'CCTV', 'Covered Parking'],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    image: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    name: 'Metro Station Parking',
    location: 'Metro Area',
    address: '456 Transit Ave, Metro District',
    totalSlots: 150,
    availableSlots: 28,
    pricePerHour: 4,
    amenities: ['Metro Access', 'EV Charging', 'Security'],
    coordinates: { lat: 40.7589, lng: -73.9851 },
    image: 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    name: 'Mall Parking Complex',
    location: 'Shopping District',
    address: '789 Commerce Blvd, Shopping Center',
    totalSlots: 500,
    availableSlots: 120,
    pricePerHour: 3,
    amenities: ['Shopping Access', 'Food Court', 'Restrooms'],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    image: 'https://images.pexels.com/photos/63294/autos-technology-vw-multi-storey-car-park-63294.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    name: 'Airport Long-term Parking',
    location: 'Airport',
    address: '321 Airport Rd, Terminal Area',
    totalSlots: 800,
    availableSlots: 200,
    pricePerHour: 8,
    amenities: ['Shuttle Service', 'Long-term Rates', 'Indoor Parking'],
    coordinates: { lat: 40.6892, lng: -74.1745 },
    image: 'https://images.pexels.com/photos/888095/pexels-photo-888095.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    name: 'Business District Garage',
    location: 'Business District',
    address: '555 Corporate Ave, Financial District',
    totalSlots: 300,
    availableSlots: 75,
    pricePerHour: 6,
    amenities: ['Valet Service', 'Car Wash', 'Reserved Spots'],
    coordinates: { lat: 40.7416, lng: -74.0114 },
    image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '6',
    name: 'Stadium Event Parking',
    location: 'Entertainment District',
    address: '777 Sports Complex Dr, Stadium Area',
    totalSlots: 1000,
    availableSlots: 350,
    pricePerHour: 10,
    amenities: ['Event Parking', 'Tailgating Area', 'Security Patrol'],
    coordinates: { lat: 40.8296, lng: -73.9262 },
    image: 'https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];
import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Users, Shield, Zap, Car } from 'lucide-react';
import { parkingLots, ParkingLot } from '../../data/parkingLots';

interface ParkingLotsProps {
  onSelectLot: (lot: ParkingLot) => void;
  selectedLot?: ParkingLot;
}

const ParkingLots: React.FC<ParkingLotsProps> = ({ onSelectLot, selectedLot }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLots = parkingLots.filter(lot =>
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes('Security') || amenity.includes('CCTV')) return Shield;
    if (amenity.includes('EV') || amenity.includes('Charging')) return Zap;
    if (amenity.includes('24/7')) return Clock;
    return Users;
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600 bg-green-100';
    if (percentage > 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Parking Lots</h2>
          <p className="text-gray-600 mt-1">Choose from {filteredLots.length} available locations</p>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by location or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => (
          <div
            key={lot.id}
            className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
              selectedLot?.id === lot.id 
                ? 'border-blue-500 ring-2 ring-blue-100' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectLot(lot)}
          >
            <div className="relative">
              <img
                src={lot.image}
                alt={lot.name}
                className="w-full h-48 object-cover rounded-t-xl"
                loading="lazy"
              />
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(lot.availableSlots, lot.totalSlots)}`}>
                  {lot.availableSlots} available
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-90 text-gray-800">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${lot.pricePerHour}/hr
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{lot.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {lot.location}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{lot.address}</p>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-600">Total Slots:</span>
                <span className="font-medium">{lot.totalSlots}</span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {lot.amenities.slice(0, 3).map((amenity, index) => {
                    const IconComponent = getAmenityIcon(amenity);
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        <IconComponent className="h-3 w-3 mr-1" />
                        {amenity}
                      </span>
                    );
                  })}
                </div>
              </div>

              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  selectedLot?.id === lot.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedLot?.id === lot.id ? (
                  <span className="flex items-center justify-center">
                    <Car className="h-4 w-4 mr-2" />
                    Selected
                  </span>
                ) : (
                  'Select This Lot'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLots.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parking lots found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default ParkingLots;
import React, { useState } from 'react';
import ParkingLots from './ParkingLots';
import BookingForm from './BookingForm';
import { ParkingLot } from '../../data/parkingLots';

const BookingPage: React.FC = () => {
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);

  const handleSelectLot = (lot: ParkingLot) => {
    setSelectedLot(lot);
  };

  const handleBack = () => {
    setSelectedLot(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedLot ? (
          <BookingForm selectedLot={selectedLot} onBack={handleBack} />
        ) : (
          <ParkingLots onSelectLot={handleSelectLot} selectedLot={selectedLot} />
        )}
      </div>
    </div>
  );
};

export default BookingPage;
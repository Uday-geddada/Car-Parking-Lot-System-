import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Car, AlertCircle, CheckCircle } from 'lucide-react';
import { ParkingLot } from '../../data/parkingLots';
import { useFirestore } from '../../hooks/useFirestore';

interface BookingFormProps {
  selectedLot: ParkingLot;
  onBack: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedLot, onBack }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [slotNumber, setSlotNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { createBooking } = useFirestore();
  const navigate = useNavigate();

  const calculateEndTime = () => {
    if (!startDate || !startTime) return null;
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 60 * 1000));
    return endDateTime;
  };

  const calculateAmount = () => {
    return selectedLot.pricePerHour * duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = calculateEndTime()!;
      const now = new Date();

      if (startDateTime <= now) {
        setError('Start time must be in the future');
        return;
      }

      const booking = {
        parkingLotId: selectedLot.id,
        parkingLotName: selectedLot.name,
        location: selectedLot.location,
        slotNumber,
        startTime: startDateTime,
        endTime: endDateTime,
        status: 'active' as const,
        amount: calculateAmount()
      };

      await createBooking(booking);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const endTime = calculateEndTime();
  const amount = calculateAmount();

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-4">
          Your parking slot has been successfully booked. Redirecting to dashboard...
        </p>
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-200 mb-4 transition-colors"
          >
            ← Back to parking lots
          </button>
          <h2 className="text-2xl font-bold mb-2">Book Your Parking Slot</h2>
          <p className="opacity-90">{selectedLot.name} - {selectedLot.location}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Duration and Slot Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 8, 12, 24].map(hours => (
                  <option key={hours} value={hours}>
                    {hours} {hours === 1 ? 'hour' : 'hours'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car className="inline h-4 w-4 mr-1" />
                Slot Number
              </label>
              <select
                value={slotNumber}
                onChange={(e) => setSlotNumber(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: Math.min(selectedLot.availableSlots, 20) }, (_, i) => i + 1).map(slot => (
                  <option key={slot} value={slot}>
                    Slot #{slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Parking Lot:</span>
                <span className="font-medium">{selectedLot.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{selectedLot.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Slot Number:</span>
                <span className="font-medium">#{slotNumber}</span>
              </div>
              {startDate && startTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Time:</span>
                  <span className="font-medium">
                    {new Date(`${startDate}T${startTime}`).toLocaleString()}
                  </span>
                </div>
              )}
              {endTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">End Time:</span>
                  <span className="font-medium">
                    {endTime.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration} {duration === 1 ? 'hour' : 'hours'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">${selectedLot.pricePerHour}/hour</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-lg font-semibold text-green-600 flex items-center">
                    <DollarSign className="h-5 w-5 mr-1" />
                    {amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !startDate || !startTime}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Confirming Booking...</span>
              </div>
            ) : (
              `Confirm Booking - $${amount.toFixed(2)}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
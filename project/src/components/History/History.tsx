import React, { useState } from 'react';
import { Calendar, MapPin, Clock, DollarSign, Car, Filter, Search } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';

const History: React.FC = () => {
  const { getBookingHistory, loading } = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'location'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const bookingHistory = getBookingHistory();

  const filteredAndSortedBookings = bookingHistory
    .filter(booking => {
      const matchesSearch = booking.parkingLotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'all') return matchesSearch;
      
      const now = new Date();
      const isActive = booking.status === 'active' && booking.endTime > now;
      const isCompleted = booking.status === 'completed' || booking.endTime <= now;
      
      if (filterStatus === 'active') return matchesSearch && isActive;
      if (filterStatus === 'completed') return matchesSearch && isCompleted;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getStatusBadge = (booking: any) => {
    const now = new Date();
    const isActive = booking.status === 'active' && booking.endTime > now;
    
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Completed
        </span>
      );
    }
  };

  const totalSpent = bookingHistory.reduce((sum, booking) => sum + booking.amount, 0);
  const totalBookings = bookingHistory.length;
  const averageAmount = totalBookings > 0 ? totalSpent / totalBookings : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking History</h1>
          <p className="text-gray-600">
            View and manage all your parking bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Cost</p>
                <p className="text-2xl font-bold text-purple-600">${averageAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location or parking lot..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Bookings</option>
                <option value="active">Active Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="location">Sort by Location</option>
              </select>
            </div>
          </div>
        </div>

        {/* Booking History List */}
        {filteredAndSortedBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Car className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You haven\'t made any parking bookings yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.parkingLotName}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.location}
                        </p>
                      </div>
                      {getStatusBadge(booking)}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Slot Number</p>
                        <p className="font-medium">#{booking.slotNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Start Time</p>
                        <p className="font-medium">{formatDateTime(booking.startTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Duration</p>
                        <p className="font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(booking.startTime, booking.endTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Amount</p>
                        <p className="font-medium text-green-600 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {booking.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Booked on</p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show results count */}
        {filteredAndSortedBookings.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredAndSortedBookings.length} of {bookingHistory.length} bookings
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
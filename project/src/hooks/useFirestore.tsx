import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export interface Booking {
  id?: string;
  userId: string;
  parkingLotId: string;
  parkingLotName: string;
  location: string;
  slotNumber: number;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed';
  createdAt: Date;
  amount: number;
}

export const useFirestore = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookingsData: Booking[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookingsData.push({
          id: doc.id,
          ...data,
          startTime: data.startTime.toDate(),
          endTime: data.endTime.toDate(),
          createdAt: data.createdAt.toDate(),
        } as Booking);
      });
      setBookings(bookingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const createBooking = async (booking: Omit<Booking, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) throw new Error('User not authenticated');

    const bookingData = {
      ...booking,
      userId: currentUser.uid,
      createdAt: Timestamp.now(),
      startTime: Timestamp.fromDate(booking.startTime),
      endTime: Timestamp.fromDate(booking.endTime),
    };

    await addDoc(collection(db, 'bookings'), bookingData);
  };

  const getActiveBookings = () => {
    const now = new Date();
    return bookings.filter(booking => 
      booking.status === 'active' && booking.endTime > now
    );
  };

  const getBookingHistory = () => {
    const now = new Date();
    return bookings.filter(booking => 
      booking.status === 'completed' || booking.endTime <= now
    );
  };

  return {
    bookings,
    loading,
    createBooking,
    getActiveBookings,
    getBookingHistory
  };
};
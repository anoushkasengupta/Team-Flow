'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { useSocketContext } from '@/components/layout/SocketProvider';

const localizer = momentLocalizer(moment);

const initialEvents = [
  { title: 'Design UI', start: new Date(2024, 5, 20), end: new Date(2024, 5, 20), desc: 'Landing page' },
  { title: 'API Integration', start: new Date(2024, 5, 22), end: new Date(2024, 5, 22), desc: 'Connect backend' },
];

export default function CalendarPage() {
  const [events, setEvents] = useState(initialEvents);
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    const onTaskAssigned = (data: any) => {
      setEvents(prev => [...prev, data]);
    };
    socket.on('taskAssigned', onTaskAssigned);
    return () => {
      socket.off('taskAssigned', onTaskAssigned);
    };
  }, [socket]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event: any) => alert(event.title + ': ' + event.desc)}
        />
      </div>
    </div>
  );
} 
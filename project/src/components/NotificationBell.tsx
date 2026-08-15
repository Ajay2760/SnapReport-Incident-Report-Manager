import React, { useState } from 'react';
import { Bell, X, Radio } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'new' | 'update' | 'resolved';
}

export const NotificationBell: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'CRITICAL DISPATCH FILED',
      message: 'Hazardous Pothole reported on Main Street & Oak Ave',
      time: '5 MIN AGO',
      type: 'new'
    },
    {
      id: '2',
      title: 'STATUS UPDATE LOGGED',
      message: 'Streetlight Corridor repair work is currently in progress',
      time: '1 HOUR AGO',
      type: 'update'
    }
  ]);

  const getNotificationBadgeStyle = (type: Notification['type']) => {
    switch (type) {
      case 'new': return 'bg-[#CC0000] text-white';
      case 'update': return 'bg-[#111111] text-white';
      case 'resolved': return 'bg-neutral-300 text-[#111111] border border-[#111111]';
      default: return 'bg-[#111111] text-white';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 border border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white transition-all relative font-mono text-xs hard-shadow-sm flex items-center gap-1.5 font-bold uppercase"
        title="View Bulletin Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="hidden sm:inline">BULLETINS</span>
        {notifications.length > 0 && (
          <span className="bg-[#CC0000] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 ml-1">
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 border-2 border-[#111111] bg-white hard-shadow-lg z-50 newsprint-texture">
          {/* Popover Header */}
          <div className="p-3 border-b-2 border-[#111111] bg-[#111111] text-white flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#CC0000] animate-pulse" />
              <span className="font-bold tracking-widest uppercase">DISPATCH BULLETINS</span>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-white hover:text-[#CC0000] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-[#111111]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center font-mono text-xs text-neutral-500 uppercase">
                NO RECENT DISPATCH BULLETINS LOGGED
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-[#F9F9F7] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${getNotificationBadgeStyle(notification.type)}`}>
                      {notification.type}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-sm uppercase text-[#111111] leading-tight">
                        {notification.title}
                      </h4>
                      <p className="font-body text-xs text-neutral-800 mt-1">
                        {notification.message}
                      </p>
                      <span className="font-mono text-[10px] text-neutral-500 uppercase mt-2 block border-t border-neutral-200 pt-1">
                        TIMESTAMPE: {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-[#111111] bg-[#F9F9F7] text-center font-mono text-[10px] uppercase text-neutral-600">
            GAZETTE TELEGRAM DISPATCH SERVICE
          </div>
        </div>
      )}
    </div>
  );
};
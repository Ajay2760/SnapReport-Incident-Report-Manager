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
      case 'new': return 'bg-gold text-obsidian font-bold';
      case 'update': return 'bg-midnight text-champagne border border-gold/40';
      case 'resolved': return 'bg-obsidian text-pewter border border-pewter/40';
      default: return 'bg-gold text-obsidian';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2.5 border border-gold/60 bg-charcoal text-gold hover:border-gold hover:bg-gold hover:text-obsidian transition-all relative font-mono text-xs shadow-gold-glow-sm flex items-center gap-2 font-bold uppercase tracking-widest"
        title="View Art Deco Bulletins"
      >
        <Bell className="w-4 h-4" />
        <span className="hidden sm:inline">BULLETINS</span>
        {notifications.length > 0 && (
          <span className="w-5 h-5 bg-gold text-obsidian text-[10px] font-mono font-bold flex items-center justify-center rotate-45 ml-1">
            <span className="-rotate-45">{notifications.length}</span>
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 border border-gold bg-charcoal shadow-gold-glow-lg z-50 art-deco-corner-wrapper">
          {/* Popover Header */}
          <div className="p-3 border-b border-gold/40 bg-obsidian text-champagne flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="font-serif font-bold tracking-widest text-gold uppercase">DISPATCH BULLETINS</span>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-pewter hover:text-gold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gold/20">
            {notifications.length === 0 ? (
              <div className="p-6 text-center font-mono text-xs text-pewter uppercase">
                NO RECENT DISPATCH BULLETINS LOGGED
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-obsidian/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${getNotificationBadgeStyle(notification.type)}`}>
                      {notification.type}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-sm uppercase text-gold leading-tight tracking-wider">
                        {notification.title}
                      </h4>
                      <p className="font-body text-xs text-champagne mt-1">
                        {notification.message}
                      </p>
                      <span className="font-mono text-[10px] text-pewter uppercase mt-2 block border-t border-gold/20 pt-1">
                        TIMESTAMP: {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-gold/40 bg-obsidian text-center font-mono text-[10px] uppercase text-pewter tracking-widest">
            ✦ GAZETTE TELEGRAM DISPATCH SERVICE ✦
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  accent?: 'blue' | 'amber' | 'red';
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Resolution Update',
      message: 'Water Main Repair on Broadway & 4th St marked as RESOLVED.',
      timestamp: '10 mins ago',
      isRead: false,
      accent: 'blue',
    },
    {
      id: '2',
      title: 'New Co-Signer',
      message: '12 neighbors co-signed your Main Street Pothole dispatch.',
      timestamp: '1 hour ago',
      isRead: false,
      accent: 'amber',
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getAccentClass = (accent?: string) => {
    switch (accent) {
      case 'blue': return 'notification-card-accent-blue';
      case 'amber': return 'notification-card-accent-amber';
      case 'red': return 'notification-card-accent-red';
      default: return '';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="app-btn-ghost p-2.5 relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-alert-red text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 app-card-floating p-4 z-40 space-y-3">
          <div className="flex justify-between items-center border-b border-silver/30 dark:border-white/[0.08] pb-2.5">
            <span className="font-bold text-[13px] text-black dark:text-white">
              Notifications ({unreadCount})
            </span>
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-signal-blue font-semibold hover:underline"
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-[13px] text-steel text-center py-6">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-card ${getAccentClass(n.accent)} ${
                    n.isRead ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[13px] text-black dark:text-white">{n.title}</span>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-steel hover:text-alert-red transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[13px] text-carbon dark:text-silver mt-1">{n.message}</p>
                  <span className="text-[11px] text-steel block mt-1.5">{n.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
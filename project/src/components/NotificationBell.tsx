import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  accent?: 'violet' | 'wine' | 'lagoon';
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Resolution Update',
      message: 'Water Main Repair on Broadway & 4th St marked as RESOLVED.',
      timestamp: '10 mins ago',
      isRead: false,
      accent: 'lagoon',
    },
    {
      id: '2',
      title: 'New Co-Signer',
      message: '12 neighbors co-signed your Main Street Pothole dispatch.',
      timestamp: '1 hour ago',
      isRead: false,
      accent: 'violet',
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
      case 'violet': return 'notification-card-accent-violet';
      case 'wine': return 'notification-card-accent-wine';
      case 'lagoon': return 'notification-card-accent-lagoon';
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
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-midnight-wine text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 app-card p-4 z-40 space-y-3">
          <div className="flex justify-between items-center border-b border-soft-mist dark:border-white/[0.12] pb-2.5">
            <span className="font-bold text-[13px] text-ink-charcoal dark:text-ink-light">
              Notifications ({unreadCount})
            </span>
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-royal-violet font-semibold hover:underline"
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-[13px] text-stone-gray text-center py-6">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-card ${getAccentClass(n.accent)} ${
                    n.isRead ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[13px] text-ink-charcoal dark:text-ink-light">{n.title}</span>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-stone-gray hover:text-midnight-wine transition-colors"
                      aria-label="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[13px] text-stone-gray mt-1">{n.message}</p>
                  <span className="text-[11px] text-stone-gray block mt-1.5">{n.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
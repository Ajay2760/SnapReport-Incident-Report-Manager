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

  const getAccentBorderClass = (accent?: string) => {
    if (accent === 'violet' || accent === 'wine' || accent === 'lagoon') {
      return 'border-l-2 border-l-accent';
    }
    return '';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost !min-h-[40px] !p-2.5 relative"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] min-h-[18px] px-1 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center tabular" style={{ background: 'var(--accent)' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="surface-glass absolute right-0 top-full mt-2 w-80 p-4 z-40 space-y-3 !rounded-3xl">
          <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border-default)' }}>
            <span className="font-bold text-sm tabular">
              Notifications ({unreadCount})
            </span>
            <button
              onClick={markAllAsRead}
              className="text-accent text-caption font-semibold hover:underline"
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-body-sm text-center py-6">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`surface-panel p-3 border border-border-default ${getAccentBorderClass(n.accent)}${n.isRead ? ' opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-foreground font-semibold text-sm">{n.title}</span>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-foreground-muted hover:text-foreground transition-colors"
                      aria-label="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-body-sm mt-1">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
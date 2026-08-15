import React, { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Dispatch Resolution Update',
      message: 'Water Main Repair on Broadway & 4th St has been marked as RESOLVED.',
      timestamp: '10 mins ago',
      isRead: false,
    },
    {
      id: '2',
      title: 'New Citizen Co-Signer',
      message: '12 neighbors co-signed your Main Street Pothole dispatch.',
      timestamp: '1 hour ago',
      isRead: false,
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-all relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-40 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/60 pb-2">
            <span className="font-bold text-xs text-slate-900 dark:text-white">
              Notifications ({unreadCount})
            </span>
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl text-xs space-y-1 relative ${
                    n.isRead
                      ? 'bg-slate-50 dark:bg-slate-900/50 text-slate-500'
                      : 'bg-indigo-50 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-200 border border-indigo-100 dark:border-indigo-900/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold">{n.title}</span>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block">{n.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
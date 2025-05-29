import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Mail, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

const MessagesManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchMessages();
    }
  }, [isAuthenticated, navigate]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        fetchMessages();
      } else {
        showToast('Failed to update read status.', 'error');
      }
    } catch (error) {
      console.error('Error updating read status:', error);
      showToast('Error updating read status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchMessages();
        showToast('Message deleted successfully.', 'success');
      } else {
        showToast('Failed to delete message.', 'error');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast('Error deleting message.', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white flex items-center gap-2">
          <Mail className="w-6 h-6" /> Manage Messages
        </h1>
      </div>

      {isLoading ? (
        <p className="text-center text-lg text-text-secondary dark:text-text-secondary-dark">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-lg text-text-secondary dark:text-text-secondary-dark">No messages found.</p>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-xl p-5 border transition-all sm:flex sm:items-start sm:justify-between gap-4 ${
                msg.read
                  ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                  : 'bg-white dark:bg-gray-900 border-blue-400 hover:shadow-lg'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-lg text-text-primary dark:text-white">{msg.name}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {msg.email} •{' '}
                      {msg.date ? new Date(msg.date).toLocaleString() : 'No Date'}
                    </p>
                  </div>
                </div>
                <p className="text-text-primary dark:text-text-primary-dark leading-relaxed whitespace-pre-line mt-2">
                  {msg.message}
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-col gap-2 sm:gap-3 mt-4 sm:mt-0 sm:ml-4">
                <Button
                  onClick={() => toggleRead(msg._id, msg.read)}
                  variant={msg.read ? 'outline' : 'default'}
                  className="text-sm flex items-center gap-1"
                >
                  {msg.read ? (
                    <>
                      <EyeOff size={16} /> Mark Unread
                    </>
                  ) : (
                    <>
                      <Eye size={16} /> Mark Read
                    </>
                  )}
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => handleDelete(msg._id)}
                    className="text-sm flex items-center gap-1 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Trash2 size={16} /> Delete
                </Button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesManager;

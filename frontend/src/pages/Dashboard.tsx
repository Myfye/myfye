import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../env';

interface ErrorLog {
  id: string;
  user_id: string;
  creation_date: string;
  error_message: string;
  error_type: string;
  error_stack_trace: string;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
}

interface User {
  uid: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  country: string;
  evm_pub_key: string;
  solana_pub_key: string;
  privy_user_id: string;
  persona_account_id: string;
  blind_pay_receiver_id: string;
  blind_pay_evm_wallet_id: string;
  kyc_verified: boolean;
  creation_date: string;
  last_login_date: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'errors' | 'users'>('errors');

  useEffect(() => {
    fetchErrorLogs();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_all_users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': MYFYE_BACKEND_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchErrorLogs = async () => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_error_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': MYFYE_BACKEND_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch error logs');
      }

      const data = await response.json();
      setErrorLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleStackTrace = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('errors')}
          className={`px-4 py-2 rounded ${activeTab === 'errors' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          style={{backgroundColor: activeTab === 'errors' ? '#FF9D00' : '#CCCCCC', padding: '10px', borderRadius: '5px'}}
        >
          Error Logs
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          style={{backgroundColor: activeTab === 'users' ? '#FF9D00' : '#CCCCCC', padding: '10px', borderRadius: '5px'}}
        >
          Users
        </button>
      </div>

      {activeTab === 'errors' ? (
        <div>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', padding: '20px'}}>Error Logs Dashboard</h1>
          <div className="space-y-6">
            {errorLogs.map((log) => (
              <div key={log.id} style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px'}}>
                <div style={{fontWeight: 'bold'}}>Error ID:{log.id}</div>
                <div className="grid grid-cols-4 gap-4 mb-2">
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">User: {log.user_email ? log.user_email : 'Anonymous'}</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Error Type: </span>
                      {log.error_type}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Error Message: </span>
                      {log.error_message}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Date: </span>
                      {new Date(log.creation_date).toLocaleString('en-US', {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <button
                    onClick={() => toggleStackTrace(log.id)}
                    style={{backgroundColor: '#CCCCCC', padding: '5px', borderRadius: '5px'}}
                  >
                    {expandedLogs.has(log.id) ? 'Hide Stack Trace ^' : 'Show Stack Trace v'}

                  </button>
                  
                  {expandedLogs.has(log.id) && (
                    <div className="mt-2 bg-gray-50 rounded p-3">
                      <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
                        {log.error_stack_trace}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', padding: '20px'}}>Users Dashboard</h1>
          <div className="space-y-6">
            {users.map((user) => (
              <div key={user.uid} style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px'}}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">User ID: </span>
                      {user.uid}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Email: </span>
                      {user.email}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Name: </span>
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Phone: </span>
                      {user.phone_number || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Country: </span>
                      {user.country || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">KYC Verified: </span>
                      {user.kyc_verified ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Created: </span>
                      {new Date(user.creation_date).toLocaleString('en-US', {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Last Login: </span>
                      {user.last_login_date ? new Date(user.last_login_date).toLocaleString() : 'Never'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">EVM Pub Key: </span>
                      {user.evm_pub_key || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-600">Solana Pub Key: </span>
                      {user.solana_pub_key || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
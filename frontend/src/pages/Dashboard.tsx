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

interface SwapTransaction {
  id: string;
  user_id: string;
  input_amount: string;
  output_amount: string;
  input_chain: string;
  output_chain: string;
  input_public_key: string;
  output_public_key: string;
  input_currency: string;
  output_currency: string;
  transaction_type: string;
  transaction_hash: string;
  transaction_status: string;
  creation_date: string;
}

interface PayTransaction {
  id: string;
  sender_id: string;
  sender_public_key: string;
  receiver_id: string;
  receiver_phone_number: string;
  receiver_email: string;
  receiver_public_key: string;
  amount: string;
  currency: string;
  chain: string;
  creation_date: string;
  transaction_hash: string;
  transaction_status: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [swapTransactions, setSwapTransactions] = useState<SwapTransaction[]>([]);
  const [payTransactions, setPayTransactions] = useState<PayTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'errors' | 'users' | 'transactions' | 'pay'>('errors');

  useEffect(() => {
    fetchErrorLogs();
    fetchUsers();
    fetchSwapTransactions();
    fetchPayTransactions();
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
      console.log(data);
      setErrorLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchSwapTransactions = async () => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_all_swap_transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': MYFYE_BACKEND_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch swap transactions');
      }

      const data = await response.json();
      setSwapTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchPayTransactions = async () => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_all_pay_transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': MYFYE_BACKEND_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pay transactions');
      }

      const data = await response.json();
      setPayTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  const deleteErrorLog = async (logId: string) => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/delete_error_log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({ error_log_id: logId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete error log');
      }

      // Remove the deleted log from the state
      setErrorLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the log');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen" style={{color: 'white'}}>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4" style={{color: 'white'}}>{error}</div>;
  }

  return (
    <div className="p-6" style={{background: '#000000', minWidth: '100vw', minHeight: '100vh', color: 'white'}}>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('errors')}
          className={`px-4 py-2 rounded ${activeTab === 'errors' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          style={{backgroundColor: activeTab === 'errors' ? '#ffffff' : '#000000', 
            padding: '10px', borderRadius: '5px', 
            color: activeTab === 'errors' ? 'black' : 'white', fontWeight: 'bold', border: '1px solid #ffffff'}}
        >
          Error Logs
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          style={{backgroundColor: activeTab === 'users' ? '#ffffff' : '#000000', 
            padding: '10px', borderRadius: '5px', color: activeTab === 'users' ? 'black' : 'white', 
            fontWeight: 'bold', border: '1px solid #ffffff'}}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded ${activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          style={{backgroundColor: activeTab === 'transactions' ? '#ffffff' : '#000000', 
            padding: '10px', borderRadius: '5px', color: activeTab === 'transactions' ? 'black' : 'white', 
            fontWeight: 'bold', border: '1px solid #ffffff'}}
        >
          Swap Transactions
        </button>
        <button
          onClick={() => setActiveTab('pay')}
          className={`px-4 py-2 rounded ${activeTab === 'pay' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          style={{backgroundColor: activeTab === 'pay' ? '#ffffff' : '#000000', 
            padding: '10px', borderRadius: '5px', color: activeTab === 'pay' ? 'black' : 'white', 
            fontWeight: 'bold', border: '1px solid #ffffff'}}
        >
          Pay Transactions
        </button>
      </div>

      {activeTab === 'errors' ? (
        <div>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', padding: '20px', color: 'white'}}>Error Logs Dashboard</h1>
          <div className="space-y-6">
            {errorLogs.map((log) => (
              <div key={log.id} style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px', color: 'white'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{fontWeight: 'bold'}}>Error ID:{log.id}</div>
                  <button
                    onClick={() => deleteErrorLog(log.id)}
                    style={{
                      backgroundColor: '#ff4444',
                      color: 'black',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2">
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>User: {log.user_email ? log.user_email : 'Anonymous'}</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Error Type: </span>
                      {log.error_type}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Error Message: </span>
                      {log.error_message}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Date: </span>
                      {new Date(log.creation_date).toLocaleString('en-US', {
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
                    style={{backgroundColor: '#CCCCCC', padding: '5px', borderRadius: '5px', color: 'black', fontWeight: 'bold'}}
                  >
                    {expandedLogs.has(log.id) ? 'Hide Stack Trace ^' : 'Show Stack Trace v'}

                  </button>
                  
                  {expandedLogs.has(log.id) && (
                    <div className="mt-2 bg-gray-50 rounded p-3">
                      <pre className="text-xs whitespace-pre-wrap overflow-x-auto" style={{color: 'white'}}>
                        {log.error_stack_trace}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'users' ? (
        <div>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', padding: '20px', color: 'white'}}>Users Dashboard</h1>
          <div className="space-y-6">
            {users.map((user) => (
              <div key={user.uid} style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px', color: 'white'}}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>User ID: </span>
                      {user.uid}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Email: </span>
                      {user.email}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Name: </span>
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Phone: </span>
                      {user.phone_number || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Country: </span>
                      {user.country || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>KYC Verified: </span>
                      {user.kyc_verified ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Created: </span>
                      {new Date(user.creation_date).toLocaleString('en-US', {
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
                      <span className="font-semibold" style={{color: 'white'}}>Last Login: </span>
                      {user.last_login_date ? new Date(user.last_login_date).toLocaleString() : 'Never'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>EVM Pub Key: </span>
                      {user.evm_pub_key || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Solana Pub Key: </span>
                      {user.solana_pub_key || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'transactions' ? (
        <div>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', padding: '20px', color: 'white'}}>Swap Transactions Dashboard</h1>
          <div className="space-y-6">
            {swapTransactions.map((transaction) => (
              <div key={transaction.id} style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px', color: 'white'}}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Transaction ID: </span>
                      {transaction.id}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>User ID: </span>
                      {transaction.user_id}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Input Amount: </span>
                      {transaction.input_amount} 
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Input Mint / Contract: </span>
                      {transaction.input_currency}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Output Amount: </span>
                      {transaction.output_amount} 
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>OutputMint / Contract: </span>
                      {transaction.output_currency}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Status: </span>
                      {transaction.transaction_status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Input Chain: </span>
                      {transaction.input_chain}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Output Chain: </span>
                      {transaction.output_chain}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Type: </span>
                      {transaction.transaction_type}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Created: </span>
                      {new Date(transaction.creation_date).toLocaleString('en-US', {
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
                      <span className="font-semibold" style={{color: 'white'}}>Transaction Hash: </span>
                      <span style={{wordBreak: 'break-all'}}>{transaction.transaction_hash}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', padding: '20px', color: 'white'}}>Pay Transactions Dashboard</h1>
          <div className="space-y-6">
            {payTransactions.map((transaction) => (
              <div key={transaction.id} style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px', color: 'white'}}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Transaction ID: </span>
                      {transaction.id}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Sender ID: </span>
                      {transaction.sender_id}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Receiver ID: </span>
                      {transaction.receiver_id || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Amount: </span>
                      {transaction.amount} {transaction.currency}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Chain: </span>
                      {transaction.chain}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Status: </span>
                      {transaction.transaction_status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Receiver Email: </span>
                      {transaction.receiver_email || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Receiver Phone: </span>
                      {transaction.receiver_phone_number || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Created: </span>
                      {new Date(transaction.creation_date).toLocaleString('en-US', {
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
                      <span className="font-semibold" style={{color: 'white'}}>Transaction Hash: </span>
                      <span style={{wordBreak: 'break-all'}}>{transaction.transaction_hash}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Sender Public Key: </span>
                      <span style={{wordBreak: 'break-all'}}>{transaction.sender_public_key}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{color: 'white'}}>Receiver Public Key: </span>
                      <span style={{wordBreak: 'break-all'}}>{transaction.receiver_public_key}</span>
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../env";

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

interface KYCUser {
  user_id: string;
  email: string;
  phone_number: string;
  address_line_1: string;
  city: string;
  state_province_region: string;
  postal_code: string;
  country: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  tax_id: string;
  id_doc_type: string;
  id_doc_front_file: string;
  id_doc_back_file: string;
  id_doc_country: string;
  kyc_verified: boolean;
  creation_date: string;
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

interface BlockchainWallet {
  id: string;
  name: string;
  network: string;
  address: string;
  is_account_abstraction: boolean;
}

interface KYCWarning {
  code: string;
  message: string;
  resolution_status: string;
  warning_id: string;
}

interface Receiver {
  id: string;
  type: string;
  kyc_type: string;
  kyc_status: string;
  kyc_warnings: KYCWarning[] | null;
  email: string;
  tax_id: string;
  address_line_1: string;
  city: string;
  state_province_region: string;
  country: string;
  postal_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  id_doc_country: string;
  id_doc_type: string;
  blockchain_wallets: BlockchainWallet[];
}

function Dashboard() {
  const navigate = useNavigate();
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [kycUsers, setKycUsers] = useState<KYCUser[]>([]);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [swapTransactions, setSwapTransactions] = useState<SwapTransaction[]>([]);
  const [payTransactions, setPayTransactions] = useState<PayTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<
    "errors" | "users" | "transactions" | "pay" | "kyc" | "receivers"
  >("errors");

  useEffect(() => {
    fetchErrorLogs();
    fetchUsers();
    fetchSwapTransactions();
    fetchPayTransactions();
    fetchKYCUsers();
    fetchReceivers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_all_users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const fetchErrorLogs = async () => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_error_logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch error logs");
      }

      const data = await response.json();
      console.log(data);
      setErrorLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchSwapTransactions = async () => {
    try {
      const response = await fetch(
        `${MYFYE_BACKEND}/get_all_swap_transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": MYFYE_BACKEND_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch swap transactions");
      }

      const data = await response.json();
      setSwapTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const fetchPayTransactions = async () => {
    try {
      const response = await fetch(
        `${MYFYE_BACKEND}/get_all_pay_transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": MYFYE_BACKEND_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pay transactions");
      }

      const data = await response.json();
      setPayTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const fetchKYCUsers = async () => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_all_kyc_users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch KYC users");
      }

      const data = await response.json();
      setKycUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const fetchReceivers = async () => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_all_receivers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch receivers");
      }

      const data = await response.json();
      setReceivers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteReceiverAndWallet = async (receiverId: string, walletId: string) => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/delete_blockchain_wallet_and_receiver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({ receiverId, walletId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete receiver and wallet");
      }

      // Remove the deleted receiver from the state
      setReceivers((prevReceivers) => 
        prevReceivers.filter((receiver) => receiver.id !== receiverId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting");
    }
  };

  const deleteKYCUser = async (userId: string) => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/delete_kyc_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete KYC user");
      }

      // Remove the deleted KYC user from the state
      setKycUsers((prevKycUsers) => 
        prevKycUsers.filter((kycUser) => kycUser.user_id !== userId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting KYC user");
    }
  };

  const toggleStackTrace = (logId: string) => {
    setExpandedLogs((prev) => {
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({ error_log_id: logId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete error log");
      }

      // Remove the deleted log from the state
      setErrorLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the log"
      );
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ color: "white" }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4" style={{ color: "white" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      className="p-6"
      style={{
        background: "#000000",
        minWidth: "100vw",
        minHeight: "100lvh",
        color: "white",
      }}
    >
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("errors")}
          className={`px-4 py-2 rounded ${
            activeTab === "errors" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          style={{
            backgroundColor: activeTab === "errors" ? "#ffffff" : "#000000",
            padding: "10px",
            borderRadius: "5px",
            color: activeTab === "errors" ? "black" : "white",
            fontWeight: "bold",
            border: "1px solid #ffffff",
          }}
        >
          Error Logs
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${
            activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          style={{
            backgroundColor: activeTab === "users" ? "#ffffff" : "#000000",
            padding: "10px",
            borderRadius: "5px",
            color: activeTab === "users" ? "black" : "white",
            fontWeight: "bold",
            border: "1px solid #ffffff",
          }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("kyc")}
          className={`px-4 py-2 rounded ${
            activeTab === "kyc" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          style={{
            backgroundColor: activeTab === "kyc" ? "#ffffff" : "#000000",
            padding: "10px",
            borderRadius: "5px",
            color: activeTab === "kyc" ? "black" : "white",
            fontWeight: "bold",
            border: "1px solid #ffffff",
          }}
        >
          KYC Users
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 rounded ${
            activeTab === "transactions"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          style={{
            backgroundColor:
              activeTab === "transactions" ? "#ffffff" : "#000000",
            padding: "10px",
            borderRadius: "5px",
            color: activeTab === "transactions" ? "black" : "white",
            fontWeight: "bold",
            border: "1px solid #ffffff",
          }}
        >
          Swap Transactions
        </button>
        <button
          onClick={() => setActiveTab("pay")}
          className={`px-4 py-2 rounded ${
            activeTab === "pay" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          style={{
            backgroundColor: activeTab === "pay" ? "#ffffff" : "#000000",
            padding: "10px",
            borderRadius: "5px",
            color: activeTab === "pay" ? "black" : "white",
            fontWeight: "bold",
            border: "1px solid #ffffff",
          }}
        >
          Pay Transactions
        </button>
        <button
          onClick={() => setActiveTab("receivers")}
          className={`px-4 py-2 rounded ${activeTab === "receivers" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          style={{
            backgroundColor: activeTab === "receivers" ? "#ffffff" : "#000000",
            padding: "10px",
            borderRadius: "5px",
            color: activeTab === "receivers" ? "black" : "white",
            fontWeight: "bold",
            border: "1px solid #ffffff",
          }}
        >
          Receivers
        </button>
      </div>

      {activeTab === "kyc" ? (
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              padding: "20px",
              color: "white",
            }}
          >
            KYC Users Dashboard
          </h1>
          <div className="space-y-6">
            {kycUsers.map((user) => (
              <div
                key={user.user_id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  margin: "10px",
                  color: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>KYC User ID: {user.user_id}</div>
                  <button
                    onClick={() => deleteKYCUser(user.user_id)}
                    style={{
                      backgroundColor: "#ff4444",
                      color: "black",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete KYC
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        User ID:{" "}
                      </span>
                      {user.user_id}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Email:{" "}
                      </span>
                      {user.email}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Name:{" "}
                      </span>
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Phone:{" "}
                      </span>
                      {user.phone_number || "N/A"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Tax ID:{" "}
                      </span>
                      {user.tax_id}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Date of Birth:{" "}
                      </span>
                      {new Date(user.date_of_birth).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Address:{" "}
                      </span>
                      {user.address_line_1}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        City:{" "}
                      </span>
                      {user.city}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        State/Province:{" "}
                      </span>
                      {user.state_province_region}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Postal Code:{" "}
                      </span>
                      {user.postal_code}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Country:{" "}
                      </span>
                      {user.country}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        ID Document Type:{" "}
                      </span>
                      {user.id_doc_type}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        ID Document Country:{" "}
                      </span>
                      {user.id_doc_country}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        KYC Verified:{" "}
                      </span>
                      {user.kyc_verified ? "Yes" : "No"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Created:{" "}
                      </span>
                      {new Date(user.creation_date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-semibold" style={{ color: "white" }}>
                        ID Document Front:{" "}
                      </span>
                      {user.id_doc_front_file ? (
                        <a
                          href={user.id_doc_front_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#4CAF50",
                            textDecoration: "underline",
                            wordBreak: "break-all",
                          }}
                        >
                          {user.id_doc_front_file}
                        </a>
                      ) : (
                        "No document available"
                      )}
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-semibold" style={{ color: "white" }}>
                        ID Document Back:{" "}
                      </span>
                      {user.id_doc_back_file ? (
                        <a
                          href={user.id_doc_back_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#4CAF50",
                            textDecoration: "underline",
                            wordBreak: "break-all",
                          }}
                        >
                          {user.id_doc_back_file}
                        </a>
                      ) : (
                        "No document available"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "errors" ? (
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              padding: "20px",
              color: "white",
            }}
          >
            Error Logs Dashboard
          </h1>
          <div className="space-y-6">
            {errorLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  margin: "10px",
                  color: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>Error ID:{log.id}</div>
                  <button
                    onClick={() => deleteErrorLog(log.id)}
                    style={{
                      backgroundColor: "#ff4444",
                      color: "black",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2">
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        User: {log.user_email ? log.user_email : "Anonymous"}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Error Type:{" "}
                      </span>
                      {log.error_type}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Error Message:{" "}
                      </span>
                      {log.error_message}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Date:{" "}
                      </span>
                      {new Date(log.creation_date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => toggleStackTrace(log.id)}
                    style={{
                      backgroundColor: "#CCCCCC",
                      padding: "5px",
                      borderRadius: "5px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {expandedLogs.has(log.id)
                      ? "Hide Stack Trace ^"
                      : "Show Stack Trace v"}
                  </button>

                  {expandedLogs.has(log.id) && (
                    <div className="mt-2 bg-gray-50 rounded p-3">
                      <pre
                        className="text-xs whitespace-pre-wrap overflow-x-auto"
                        style={{ color: "white" }}
                      >
                        {log.error_stack_trace}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "users" ? (
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              padding: "20px",
              color: "white",
            }}
          >
            Users Dashboard
          </h1>
          <div className="space-y-6">
            {users.map((user) => (
              <div
                key={user.uid}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  margin: "10px",
                  color: "white",
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        User ID:{" "}
                      </span>
                      {user.uid}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Email:{" "}
                      </span>
                      {user.email}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Name:{" "}
                      </span>
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Phone:{" "}
                      </span>
                      {user.phone_number || "N/A"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Country:{" "}
                      </span>
                      {user.country || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        KYC Verified:{" "}
                      </span>
                      {user.kyc_verified ? "Yes" : "No"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Created:{" "}
                      </span>
                      {new Date(user.creation_date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Last Login:{" "}
                      </span>
                      {user.last_login_date
                        ? new Date(user.last_login_date).toLocaleString()
                        : "Never"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        EVM Pub Key:{" "}
                      </span>
                      {user.evm_pub_key || "N/A"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Solana Pub Key:{" "}
                      </span>
                      {user.solana_pub_key || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "transactions" ? (
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              padding: "20px",
              color: "white",
            }}
          >
            Swap Transactions Dashboard
          </h1>
          <div className="space-y-6">
            {swapTransactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  margin: "10px",
                  color: "white",
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Transaction ID:{" "}
                      </span>
                      {transaction.id}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        User ID:{" "}
                      </span>
                      {transaction.user_id}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Input Amount:{" "}
                      </span>
                      {transaction.input_amount}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Input Mint / Contract:{" "}
                      </span>
                      {transaction.input_currency}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Output Amount:{" "}
                      </span>
                      {transaction.output_amount}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        OutputMint / Contract:{" "}
                      </span>
                      {transaction.output_currency}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Status:{" "}
                      </span>
                      {transaction.transaction_status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Input Chain:{" "}
                      </span>
                      {transaction.input_chain}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Output Chain:{" "}
                      </span>
                      {transaction.output_chain}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Type:{" "}
                      </span>
                      {transaction.transaction_type}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Created:{" "}
                      </span>
                      {new Date(transaction.creation_date).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Transaction Hash:{" "}
                      </span>
                      <span style={{ wordBreak: "break-all" }}>
                        {transaction.transaction_hash}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "pay" ? (
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              padding: "20px",
              color: "white",
            }}
          >
            Pay Transactions Dashboard
          </h1>
          <div className="space-y-6">
            {payTransactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  margin: "10px",
                  color: "white",
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Transaction ID:{" "}
                      </span>
                      {transaction.id}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Sender ID:{" "}
                      </span>
                      {transaction.sender_id}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Receiver ID:{" "}
                      </span>
                      {transaction.receiver_id || "N/A"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Amount:{" "}
                      </span>
                      {transaction.amount}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Currency:{" "}
                      </span>
                      {transaction.currency}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Chain:{" "}
                      </span>
                      {transaction.chain}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Status:{" "}
                      </span>
                      {transaction.transaction_status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Receiver Email:{" "}
                      </span>
                      {transaction.receiver_email || "N/A"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Receiver Phone:{" "}
                      </span>
                      {transaction.receiver_phone_number || "N/A"}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Created:{" "}
                      </span>
                      {new Date(transaction.creation_date).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Transaction Hash:{" "}
                      </span>
                      <span style={{ wordBreak: "break-all" }}>
                        {transaction.transaction_hash}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Sender Public Key:{" "}
                      </span>
                      <span style={{ wordBreak: "break-all" }}>
                        {transaction.sender_public_key}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: "white" }}
                      >
                        Receiver Public Key:{" "}
                      </span>
                      <span style={{ wordBreak: "break-all" }}>
                        {transaction.receiver_public_key}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "receivers" ? (
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", padding: "20px", color: "white" }}>
            Receivers Dashboard
          </h1>
          <div className="space-y-6">
            {receivers.map((receiver) => (
              <div
                key={receiver.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  margin: "10px",
                  color: "white",
                }}
              >
                {/* KYC Status Banner */}
                <div style={{
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  backgroundColor: receiver.kyc_status === 'approved' ? 'rgba(76, 175, 80, 0.2)' :
                                 receiver.kyc_status === 'rejected' ? 'rgba(244, 67, 54, 0.2)' :
                                 receiver.kyc_status === 'verifying' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${
                    receiver.kyc_status === 'approved' ? '#4CAF50' :
                    receiver.kyc_status === 'rejected' ? '#f44336' :
                    receiver.kyc_status === 'verifying' ? '#FFA500' : '#ffffff'
                  }`
                }}>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold" style={{
                      color: receiver.kyc_status === 'approved' ? '#4CAF50' :
                             receiver.kyc_status === 'rejected' ? '#f44336' :
                             receiver.kyc_status === 'verifying' ? '#FFA500' : 'white'
                    }}>
                      KYC Status: {receiver.kyc_status.toUpperCase()}
                    </div>
                    {receiver.kyc_warnings && receiver.kyc_warnings.length > 0 && (
                      <div className="text-sm" style={{ color: "#FFA500" }}>
                        {receiver.kyc_warnings.length} Warning{receiver.kyc_warnings.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Receiver ID:{" "}
                      </span>
                      {receiver.id}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Email:{" "}
                      </span>
                      {receiver.email}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Name:{" "}
                      </span>
                      {receiver.first_name} {receiver.last_name}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Type:{" "}
                      </span>
                      {receiver.type}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        KYC Type:{" "}
                      </span>
                      {receiver.kyc_type}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Tax ID:{" "}
                      </span>
                      {receiver.tax_id}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Date of Birth:{" "}
                      </span>
                      {new Date(receiver.date_of_birth).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Address:{" "}
                      </span>
                      {receiver.address_line_1}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        City:{" "}
                      </span>
                      {receiver.city}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        State/Province:{" "}
                      </span>
                      {receiver.state_province_region}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Country:{" "}
                      </span>
                      {receiver.country}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        Postal Code:{" "}
                      </span>
                      {receiver.postal_code}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        ID Document Type:{" "}
                      </span>
                      {receiver.id_doc_type}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: "white" }}>
                        ID Document Country:{" "}
                      </span>
                      {receiver.id_doc_country}
                    </div>
                  </div>
                </div>

                {/* KYC Warnings Section */}
                {receiver.kyc_warnings && receiver.kyc_warnings.length > 0 && (
                  <div className="mt-4 p-3" style={{
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    border: '1px solid #FFA500',
                    borderRadius: '5px'
                  }}>
                    <h4 className="font-semibold mb-2" style={{ color: "#FFA500" }}>KYC Warnings</h4>
                    <div className="space-y-3">
                      {receiver.kyc_warnings.map((warning, index) => (
                        <div key={warning.warning_id} className="p-2" style={{
                          backgroundColor: 'rgba(255, 165, 0, 0.05)',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 165, 0, 0.3)'
                        }}>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="font-semibold" style={{ color: "#FFA500" }}>Code: </span>
                              {warning.code}
                            </div>
                            <div>
                              <span className="font-semibold" style={{ color: "#FFA500" }}>Status: </span>
                              {warning.resolution_status}
                            </div>
                          </div>
                          <div className="mt-1">
                            <span className="font-semibold" style={{ color: "#FFA500" }}>Message: </span>
                            {warning.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blockchain Wallets Section */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Blockchain Wallets</h3>
                  {receiver.blockchain_wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      style={{
                        border: "1px solid #666",
                        padding: "10px",
                        borderRadius: "5px",
                        margin: "5px 0",
                      }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm">
                            <span className="font-semibold" style={{ color: "white" }}>
                              Wallet ID:{" "}
                            </span>
                            {wallet.id}
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold" style={{ color: "white" }}>
                              Name:{" "}
                            </span>
                            {wallet.name}
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold" style={{ color: "white" }}>
                              Network:{" "}
                            </span>
                            {wallet.network}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm">
                            <span className="font-semibold" style={{ color: "white" }}>
                              Address:{" "}
                            </span>
                            <span style={{ wordBreak: "break-all" }}>{wallet.address}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold" style={{ color: "white" }}>
                              Account Abstraction:{" "}
                            </span>
                            {wallet.is_account_abstraction ? "Yes" : "No"}
                          </div>
                          <button
                            onClick={() => deleteReceiverAndWallet(receiver.id, wallet.id)}
                            style={{
                              backgroundColor: "#ff4444",
                              color: "black",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: "bold",
                              marginTop: "10px",
                            }}
                          >
                            Delete Receiver & Wallet
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;

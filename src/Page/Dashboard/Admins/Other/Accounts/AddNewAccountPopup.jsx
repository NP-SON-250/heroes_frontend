import axios from "axios";
import React, { useState } from "react";
import LoadingSpinner from "../../../../../Components/LoadingSpinner ";
const AddNewAccountPopup = ({ setShowAddAccountPopup, onAccountAdded }) => {
  const [accountTitle, setAccountTitle] = useState("");
  const [accountFees, setAccountFees] = useState("");
  const [accountValidIn, setAccountValidIn] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:4700/api/v1/accounts",
        {
          title: accountTitle,
          fees: accountFees,
          validIn: accountValidIn,
        }
      );
      onAccountAdded();
      setShowAddAccountPopup(false);
    } catch (error) {
      console.error("Failed to create account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Account
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="accountTitle"
              className="block text-sm text-gray-700"
            >
              Account Title
            </label>
            <input
              type="text"
              id="accountTitle"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Valid Period (days)
            </label>
            <input
              type="number"
              id="accountValid"
              value={accountValidIn}
              onChange={(e) => setAccountValidIn(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label
              htmlFor="accountFees"
              className="block text-sm text-gray-700"
            >
              Account Fees
            </label>
            <input
              type="number"
              id="accountFees"
              value={accountFees}
              onChange={(e) => setAccountFees(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-around">
          <button
            onClick={() => setShowAddAccountPopup(false)}
            className="px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={5} strokeWidth={2} />
              </>
            ) : (
              "Save Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewAccountPopup;

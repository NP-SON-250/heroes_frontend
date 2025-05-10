import React, { useState, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";
import EditUserPopup from "./Other/Users/EditUserPopup";
import DeleteUserPopup from "./Other/Users/DeleteUserPopup";
import AddUserPopup from "./Other/Users/AddUserPopup";

import axios from "axios";

const USERS_PER_PAGE = 4;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editedCompanyName, setEditedCompanyName] = useState("");
  const [editedTin, setEditedTin] = useState("");
  const [editedFName, setEditedFName] = useState("");
  const [editedLName, setEditedLName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedIdcard, setEditedIdcard] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedAddress, setEditedAddress] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newTin, setNewTin] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newIdcard, setNewIdcard] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAddress, setNewAddress] = useState("");
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://heroes-backend-wapq.onrender.com/api/v1/users"
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleMenu = (userId) => {
    setSelectedMenu(selectedMenu === userId ? null : userId);
  };

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedMenu(null);
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditedCompanyName(user.companyName);
    setEditedTin(user.tin);
    setEditedFName(user.fName);
    setEditedLName(user.lName);
    setEditedIdcard(user.idCard);
    setEditedPhone(user.phone);
    setEditedEmail(user.email);
    setEditedRole(user.role);
    setEditedAddress(user.address);
    setShowEditPopup(true);
    setSelectedMenu(null);
  };

  const handleSaveUserEdit = async () => {
    if (!userToEdit) return;

    try {
      const updatedUser = {
        companyName: editedCompanyName,
        tin: editedTin,
        fName: editedFName,
        lName: editedLName,
        email: editedEmail,
        phone: editedPhone,
        idCard: editedIdcard,
        role: editedRole,
        address: editedAddress,
      };

      const response = await axios.put(
        `https://heroes-backend-wapq.onrender.com/api/v1/users/${userToEdit._id}`,
        updatedUser
      );

      console.log("User successfully updated:", response.data);

      // Update the users list locally without refetching
      const updatedUsers = users.map((user) =>
        user._id === userToEdit._id ? { ...user, ...updatedUser } : user
      );
      setUsers(updatedUsers);
      setShowEditPopup(false);
      setUserToEdit(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(
        `https://heroes-backend-wapq.onrender.com/api/v1/users/${userToDelete._id}`
      );
      console.log("User successfully deleted");

      // Update the users list locally without refetching
      const updatedUsers = users.filter(
        (user) => user._id !== userToDelete._id
      );
      setUsers(updatedUsers);

      setShowDeletePopup(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setUserToDelete(null);
  };

  // This function simulates saving the new user
  const handleAddUser = async () => {
    try {
      const newUser = {
        companyName: newCompanyName,
        tin: newTin,
        phone: newPhone,
        password: newPassword,
        email: newEmail,
        role: newRole,
        address: newAddress,
        idCard: newIdcard,
      };

      const response = await axios.post(
        "https://heroes-backend-wapq.onrender.com/api/v1/users",
        newUser
      );

      console.log("User successfully added:", response.data);

      // Update the users list immediately with the new user
      setUsers((prevUsers) => [...prevUsers, response.data.data]);

      // Close the popup and reset the form
      setShowAddPopup(false);
      setNewCompanyName("");
      setNewEmail("");
      setNewRole("");
      setNewAddress("");
      setNewPassword("");
      setNewPhone("");
      setNewIdcard("");
      setNewTin("");
    } catch (error) {
      console.error("Failed to add user:", error);
      alert("Failed to add user. Please check your input or server.");
    }
  };

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage All Users</h2>
        <button
          onClick={() => setShowAddPopup(true)}
          className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition"
        >
          Add Company
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-2">Name</th>
              <th className="px-6 py-2">Email</th>
              <th className="px-6 py-2">Id Card</th>
              <th className="px-6 py-2">Phone</th>
              <th className="px-6 py-2">Address</th>
              <th className="px-6 py-2">Role</th>
              <th className="px-6 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="border-t  hover:bg-gray-50">
                <td className="px-6 py-2 whitespace-nowrap">
                  {user.fName || user.lName
                    ? `${user.fName || ""} ${user.lName || ""}`
                    : user.companyName}
                </td>
                <td className="px-6 py-2 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.idCard}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.address}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-2 text-right relative">
                  <button
                    onClick={() => toggleMenu(user._id)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <MdMoreHoriz size={22} />
                  </button>
                  {selectedMenu === user._id && (
                    <div className="absolute right-6 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <ul className="text-sm text-gray-700">
                        <li
                          className="hover:bg-gray-100 px-4 py-1 cursor-pointer text-blue-800"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </li>
                        <li
                          className="hover:bg-gray-100 px-4 py-1 cursor-pointer text-red-500"
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* Edit Popup */}
      {showEditPopup && (
        <EditUserPopup
          userToEdit={userToEdit}
          editedCompanyName={editedCompanyName}
          editedTin={editedTin}
          editedFName={editedFName}
          editedLName={editedLName}
          editedEmail={editedEmail}
          editedIdcard={editedIdcard}
          editedPhone={editedPhone}
          editedRole={editedRole}
          editedAddress={editedAddress}
          setEditedCompanyName={setEditedCompanyName}
          setEditedTin={setEditedTin}
          setEditedFName={setEditedFName}
          setEditedLName={setEditedLName}
          setEditedPhone={setEditedPhone}
          setEditedAddress={setEditedAddress}
          setEditedEmail={setEditedEmail}
          setEditedRole={setEditedRole}
          setEditedIdcard={setEditedIdcard}
          setShowEditPopup={setShowEditPopup}
          handleSaveUserEdit={handleSaveUserEdit}
        />
      )}
      {/*Add new user */}
      {showAddPopup && (
        <AddUserPopup
          newCompanyName={newCompanyName}
          newTin={newTin}
          newPhone={newPhone}
          newEmail={newEmail}
          newRole={newRole}
          newAddress={newAddress}
          newIdcard={newIdcard}
          newPassword={newPassword}
          setNewCompanyName={setNewCompanyName}
          setNewTin={setNewTin}
          setNewPhone={setNewPhone}
          setNewEmail={setNewEmail}
          setNewRole={setNewRole}
          setNewAddress={setNewAddress}
          setNewIdcard={setNewIdcard}
          setNewPassword={setNewPassword}
          setShowAddPopup={setShowAddPopup}
          handleAddUser={handleAddUser}
        />
      )}

      {/* Delete Popup */}
      {showDeletePopup && userToDelete && (
        <DeleteUserPopup
          user={userToDelete}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AdminUsers;

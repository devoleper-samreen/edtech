import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUsers = (initialParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchUsers = async (params = initialParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAllUsers(params);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await userService.createUser(userData);
      await fetchUsers();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await userService.updateUser(id, userData);
      await fetchUsers();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await userService.deleteUser(id);
      await fetchUsers();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await userService.toggleUserStatus(id);
      await fetchUsers();
      return response;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
  };
};

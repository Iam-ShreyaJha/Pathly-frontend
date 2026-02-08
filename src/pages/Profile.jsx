import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-10 max-w-2xl">
      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-6">
          {user?.name?.charAt(0)}
        </div>
        <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
        <p className="text-gray-500 mb-8">{user?.email}</p>
        
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Account Type</span>
            <span className="font-bold text-blue-600">Student</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Member Since</span>
            <span className="font-medium">February 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
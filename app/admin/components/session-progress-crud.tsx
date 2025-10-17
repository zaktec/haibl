'use client';

import { useState } from 'react';

export default function SessionProgressCRUD() {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">User Progress Management</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
        >
          {showForm ? 'Cancel' : 'Add Session'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-3">Add New User Progress</h4>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Student Name" className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Content" className="px-3 py-2 border rounded" />
            <input type="date" placeholder="Session Date" className="px-3 py-2 border rounded" />
            <input type="number" placeholder="Completion %" min="0" max="100" className="px-3 py-2 border rounded" />
            <input type="number" placeholder="Score %" min="0" max="100" className="px-3 py-2 border rounded" />
            <input type="number" placeholder="Grade" min="1" max="9" step="0.1" className="px-3 py-2 border rounded" />
            <textarea placeholder="Strengths" className="px-3 py-2 border rounded col-span-2" rows={2}></textarea>
            <textarea placeholder="Areas for Improvement" className="px-3 py-2 border rounded col-span-2" rows={2}></textarea>
            <textarea placeholder="Tutor Feedback" className="px-3 py-2 border rounded col-span-2" rows={2}></textarea>
            <input type="text" placeholder="Homework" className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Next Lesson Plan" className="px-3 py-2 border rounded" />
          </div>
          <div className="mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">
              Save Session
            </button>
            <button 
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No user progress records found. Click "Add Session" to create one.
                </td>
              </tr>
            ) : (
              sessions.map((session, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Student Name</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Content</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Date</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">85%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">92%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7.5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded mr-1">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
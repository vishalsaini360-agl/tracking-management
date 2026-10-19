import React from "react";
import { FiMail, FiUsers, FiClock } from "react-icons/fi";
import { MOCK_USER_PROFILE } from "./mockTrackerData";

const UserProfileCard = ({ user = MOCK_USER_PROFILE }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Side: Avatar + User Info + Product Pills */}
        <div className="flex items-start sm:items-center gap-4 flex-1">
          {/* Avatar Circle */}
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center shrink-0 shadow-2xs">
            {user.initial || "A"}
          </div>

          {/* User Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Name + Status + Role */}
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                {user.userId}
              </h2>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {user.status}
              </span>
            </div>

            <div className="text-xs text-gray-500 font-medium">
              {user.role}
            </div>

            {/* Client, Department, Designation metadata */}
            <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
              <span>{user.clientName}</span>
              <span className="text-gray-300">|</span>
              <span>Client ID: {user.clientId}</span>
              <span className="text-gray-300">|</span>
              <span>Department: {user.department}</span>
              <span className="text-gray-300">|</span>
              <span>Designation: {user.designation}</span>
            </div>

            {/* Product Badges */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                Digital Shelf (DS)
              </span>
              <span className="bg-purple-50 text-purple-600 border border-purple-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                PIM
              </span>
              <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                Business Monitoring (BM)
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Key Metadata items */}
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
              <FiMail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-900">{user.email}</div>
              <div className="text-[11px] text-gray-400">Email</div>
            </div>
          </div>

          {/* First Active */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
              <FiUsers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-900">{user.firstActive}</div>
              <div className="text-[11px] text-gray-400">First Active</div>
            </div>
          </div>

          {/* Last Active */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
              <FiClock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-900">{user.lastActive}</div>
              <div className="text-[11px] text-gray-400">Last Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;

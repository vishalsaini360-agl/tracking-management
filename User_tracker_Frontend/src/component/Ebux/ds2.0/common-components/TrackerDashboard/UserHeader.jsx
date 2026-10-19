/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { BsSliders2 } from "react-icons/bs";
import HeaderDatePicker from "../../../../common-components/main-layout/HeaderDatePicker";

const UserHeader = ({ onOpenFilterDrawer, appliedCount = 0 }) => {
  const [selectedProject, setSelectedProject] = useState("VIP Bags - Wt. SOS & Buy Box");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const projects = [
    "VIP Bags - Wt. SOS & Buy Box",
    "Nestle India - Digital Shelf",
    "Maruti Suzuki - Monitoring",
    "Abbott - Comprehensive",
  ];

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-4 gap-4">
      {/* Left: Breadcrumbs + Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
          <span className="hover:text-gray-700 cursor-pointer">Users</span>
          <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-700 font-semibold">User Activity</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          User Activity
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Detailed activity for a specific user across PIM, Digital Shelf and Business Monitoring
        </p>
      </div>

      {/* Right Controls: HeaderDatePicker + Filter Button + Project Dropdown */}
      <div className="flex items-center gap-3 flex-wrap relative z-20">
        {/* Project's existing Date Range Picker component (Current, Compare, Toggle & Dropdown Modal) */}
        <div className="relative">
          <HeaderDatePicker />
        </div>

        {/* Filter Button (Opens Right Drawer matching screenshot) */}
        <button
          type="button"
          onClick={onOpenFilterDrawer}
          className="flex items-center gap-1.5 bg-white border border-gray-300 hover:border-gray-400 px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs hover:bg-gray-50 transition-all select-none cursor-pointer"
          title="Open Filters Drawer"
        >
          <BsSliders2 className="w-3.5 h-3.5 text-gray-700" />
          <span>Filter</span>
          {appliedCount > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
              {appliedCount}
            </span>
          )}
        </button>

        {/* Project Dropdown matching screenshot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 px-3.5 py-2 rounded-lg text-xs font-bold text-gray-900 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span>{selectedProject}</span>
            <FiChevronDown className="w-3.5 h-3.5 text-gray-600" />
          </button>

          {showProjectDropdown && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30 text-xs">
              {projects.map((proj) => (
                <button
                  key={proj}
                  type="button"
                  onClick={() => {
                    setSelectedProject(proj);
                    setShowProjectDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 transition-colors ${
                    selectedProject === proj
                      ? "font-bold text-blue-600 bg-blue-50/50"
                      : "text-gray-700"
                  }`}
                >
                  {proj}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;

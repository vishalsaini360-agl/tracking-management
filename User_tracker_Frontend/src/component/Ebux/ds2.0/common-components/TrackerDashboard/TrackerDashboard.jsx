import React, { useState } from "react";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import UserProfileCard from "./UserProfileCard";
import KpiCardsRow from "./KpiCardsRow";
import ProductDonutChart from "./ProductDonutChart";
import ActivityTrendChart from "./ActivityTrendChart";
import ModulesBarChart from "./ModulesBarChart";
import EventTypesChart from "./EventTypesChart";
import ActivityDetailsTable from "./ActivityDetailsTable";
import RightFilterDrawer from "./RightFilterDrawer";
import {
  MOCK_USER_PROFILE,
  MOCK_KPI_METRICS,
  MOCK_EVENTS_BY_PRODUCT,
  MOCK_MODULES_USED,
  MOCK_EVENT_TYPES_DISTRIBUTION,
  MOCK_ACTIVITY_DETAILS,
} from "./mockTrackerData";

const TrackerDashboard = () => {
  const { selectedHeaderOpen, setSelectedHeaderOpen } = useEbuxContext();
  const [filteredEvents, setFilteredEvents] = useState(MOCK_ACTIVITY_DETAILS);
  const [appliedCount, setAppliedCount] = useState(0);

  const isFilterDrawerOpen = Boolean(selectedHeaderOpen?.edit || selectedHeaderOpen?.filterDrawer);

  const handleCloseDrawer = () => {
    setSelectedHeaderOpen((prev) => ({
      ...prev,
      edit: false,
      filterDrawer: false,
    }));
  };

  const handleApplyDrawerFilters = (filters) => {
    setAppliedCount(filters.appliedCount || 0);
    let result = [...MOCK_ACTIVITY_DETAILS];

    // Filter by product checkboxes (ds, pim, bm)
    if (filters.products) {
      result = result.filter((item) => {
        const prod = item.product.toLowerCase();
        return filters.products[prod] !== false;
      });
    }

    // Filter by selected event types
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      result = result.filter((item) => filters.eventTypes.includes(item.eventType));
    }

    // Filter by selected modules
    if (filters.modules && filters.modules.length > 0) {
      result = result.filter((item) => filters.modules.includes(item.module));
    }

    setFilteredEvents(result);
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-4 py-2 font-sans text-gray-900 bg-[#F8FAFC]">
      {/* Main Dashboard Content (Full Width) */}
      <div className="w-full space-y-4">
        {/* User Profile Card */}
        <UserProfileCard user={MOCK_USER_PROFILE} />

        {/* 5 KPI Metric Cards */}
        <KpiCardsRow metrics={MOCK_KPI_METRICS} />

        {/* Middle Row: Events by Product Donut + Activity Trend Line Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-5">
            <ProductDonutChart data={MOCK_EVENTS_BY_PRODUCT} />
          </div>
          <div className="xl:col-span-7">
            <ActivityTrendChart />
          </div>
        </div>

        {/* Lower Row: Modules Used (Horizontal Bar) + Event Types Distribution (Vertical Bar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ModulesBarChart modules={MOCK_MODULES_USED} />
          </div>
          <div>
            <EventTypesChart data={MOCK_EVENT_TYPES_DISTRIBUTION} />
          </div>
        </div>

        {/* Bottom Table: Activity Details */}
        <div>
          <ActivityDetailsTable events={filteredEvents} />
        </div>
      </div>

      {/* Right-Side Slide-Over Filter Drawer (Contains the entire Filters and Recent Sessions panel) */}
      <RightFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={handleCloseDrawer}
        onApplyFilters={handleApplyDrawerFilters}
        appliedCount={appliedCount}
      />
    </div>
  );
};

export default TrackerDashboard;

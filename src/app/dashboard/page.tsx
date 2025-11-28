"use client";
import { useFetchWarrantyData } from "../common/hooks/useFetchWarrantyData";
import { uniqBy } from "lodash-es";
import DonutChart from "@/app/common/components/charts/DonutChart";
import VerticalBarChart from "@/app/common/components/charts/VerticalBarChart";
import React, { useState } from "react";
import styles from "./TabNavigation.module.scss";
import DateFilter from "./DateFilter";

const StatCard = ({
  header,
  value,
  color,
}: {
  header: string;
  value: number;
  color: string;
}) => (
  <div
    className={`bg-white shadow-lg rounded-2xl border-2 border-gray-200 p-12 min-h-[220px] flex flex-col items-center justify-center w-80`}
  >
    <h2 className={`text-lg font-bold mb-6 w-full text-center`}>{header}</h2>
    <span className={`text-6xl mb-2 ${color}`}>{value}</span>
  </div>
);

const DashboardPage = () => {
  const { data, isLoading, error } = useFetchWarrantyData();
  // Tab navigation state
  const [activeTab, setActiveTab] = useState("Summary");
  const tabs = ["Summary", "Charts", "List"];

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  if (error) return <div>Error: {String(error)}</div>;
  const uniqueData = data ? uniqBy(data, "Br_Original_Invoice_No") : [];
  const uniqueWarrantyCount = uniqueData.length;
  const totalClaims = data
    ? data.filter(
        (item) =>
          item.Br_Invoice_No !== null &&
          item.Br_Invoice_No !== undefined &&
          String(item.Br_Invoice_No).trim() !== ""
      ).length
    : 0;

  // Active warranties: Br_Date_of_Purchase within last 1 year
  const totalActiveWarranties = uniqueData
    ? uniqueData.filter((item) => {
        if (!item.Br_Date_of_Purchase) return false;
        const purchaseDate = new Date(item.Br_Date_of_Purchase);
        const now = new Date();
        const oneYearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        return purchaseDate >= oneYearAgo && purchaseDate <= now;
      }).length
    : 0;

  // Prepare DonutChart data from Br_IPC1 field
  const brIPC1Data = uniqueData
    ? Object.entries(
        uniqueData.reduce((acc: Record<string, number>, item) => {
          const key = item.Br_IPC1 || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];
  const getMonth = (dateStr: string | undefined) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Unknown";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  //Prepare DonutChart data from Br_VehicleBrand field
  const brVehicleBrandData = uniqueData
    ? Object.entries(
        uniqueData.reduce((acc: Record<string, number>, item) => {
          const key = item.Br_VehicleBrand || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  const monthlyData = data
    ? data.reduce((acc, item) => {
        const purchaseMonth = getMonth(item.Br_Date_of_Purchase ?? undefined);
        const incidentMonth = getMonth(item.Br_Incident_Date ?? undefined);
        if (!acc[purchaseMonth])
          acc[purchaseMonth] = { Br_Date_of_Purchase: 0, Br_Incident_Date: 0 };
        if (!acc[incidentMonth])
          acc[incidentMonth] = { Br_Date_of_Purchase: 0, Br_Incident_Date: 0 };
        if (purchaseMonth !== "Unknown")
          acc[purchaseMonth].Br_Date_of_Purchase++;
        if (incidentMonth !== "Unknown") acc[incidentMonth].Br_Incident_Date++;
        return acc;
      }, {} as { [key: string]: { Br_Date_of_Purchase: number; Br_Incident_Date: number } })
    : {};
  const verticalBarChartData = Object.entries(monthlyData).map(
    ([name, values]) => ({ name, ...values })
  );
  // Date filter handlers (stub)
  const handleDateApply = (from: string, to: string) => {
    // TODO: Filter data based on date range
    // You can implement filtering logic here
    console.log("Apply date filter:", from, to);
  };
  const handleDateReset = () => {
    // TODO: Reset date filter
    console.log("Reset date filter");
  };

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mt-8 mb-8 text-center text-gray-800">
        Egypt Bridgestone Dashboard
      </h1>
      {/* Date Filter above tabs */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl shadow p-6 mb-6 w-full max-w-xl">
          <DateFilter onApply={handleDateApply} onReset={handleDateReset} />
        </div>
      </div>
      {/* Tab Navigation below Header */}
      <div className={styles.tabNavWrapper}>
        <div className={styles.tabNav}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={
                tab === activeTab
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* Tab content */}
      {activeTab === "Summary" && (
        <div className="max-w-full mx-auto flex flex-row gap-8 justify-center items-center overflow-x-auto whitespace-nowrap pb-4">
          {/* <div>
            <StatCard
              header="Total Warranty Records"
              value={data ? data.length : 0}
              color="text-green-600"
            />
          </div> */}
          <div>
            <StatCard
              header="Unique Warranties"
              value={uniqueWarrantyCount}
              color="text-blue-600"
            />
          </div>
          <div>
            <StatCard
              header="Active Warranties"
              value={totalActiveWarranties}
              color="text-orange-600"
            />
          </div>
          <div>
            <StatCard
              header="Total Claims"
              value={totalClaims}
              color="text-purple-600"
            />
          </div>
        </div>
      )}
      {activeTab === "Charts" && (
        <>
          <div
            className="mt-8 mb-8 flex justify-center items-center gap-8"
            style={{ minHeight: 320 }}
          >
            <div
              className="bg-white rounded-xl shadow p-6 flex items-center justify-center"
              style={{
                width: "50%",
                minWidth: 320,
                maxWidth: 600,
                height: 340,
              }}
            >
              <div style={{ width: 320, height: 320, position: "relative" }}>
                <DonutChart
                  data={brIPC1Data}
                  unitOfMeasure="IPC1"
                  valueDecimals={0}
                  size={1}
                />
              </div>
            </div>
            <div
              className="bg-white rounded-xl shadow p-6 flex items-center justify-center"
              style={{
                width: "50%",
                minWidth: 320,
                maxWidth: 600,
                height: 340,
              }}
            >
              <div style={{ width: 320, height: 320, position: "relative" }}>
                <DonutChart
                  data={brVehicleBrandData}
                  unitOfMeasure="VehicleBrand"
                  valueDecimals={0}
                  size={1}
                  hideLegends={true}
                />
              </div>
            </div>
          </div>
          <div
            className="mt-8 mb-16 flex justify-center items-center"
            style={{ minHeight: 400 }}
          >
            <div
              className="bg-white rounded-xl shadow p-6 flex items-center justify-center w-full max-w-7xl"
              style={{ height: 400 }}
            >
              <div
                style={{
                  width: "100%",
                  minWidth: 900,
                  height: 360,
                  position: "relative",
                }}
              >
                <VerticalBarChart
                  data={{
                    common: verticalBarChartData.map((d) => d.name),
                    series: [
                      {
                        name: "Warranty Purchases",
                        values: verticalBarChartData.map((d) => ({
                          name: d.name,
                          value: d.Br_Date_of_Purchase,
                        })),
                      },
                      {
                        name: "Claim Incident",
                        values: verticalBarChartData.map((d) => ({
                          name: d.name,
                          value: d.Br_Incident_Date,
                        })),
                      },
                    ],
                  }}
                  height={360}
                  unitOfMeasure="Count"
                  stacked={false}
                  barSize={24}
                  hideLegend={false}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;

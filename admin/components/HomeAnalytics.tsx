import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

// Define TypeScript types for stats and API response
interface Stat {
  title: string;
  value: string;
}

interface ApiResponse {
  success: boolean;
  failedAuth?: boolean;
  data: Stat[];
}
// { totalSell: '$0.00', totalBalance: '$120.00', totalNID: '1' }
const HomeAnalytics = async () => {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/balance/home-analytics`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
        },
        credentials: "same-origin",
      }
    );

    // Check if the response is not OK
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data: ApiResponse = await res.json();

    // Redirect if authentication failed
    if (data.failedAuth) {
      redirect("/login");
    }

    const stats = data.data;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    redirect("/login"); // Redirect to login in case of a fetch error
  }
};

export default HomeAnalytics;

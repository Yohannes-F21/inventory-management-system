import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    Order: 4000,
    Loan: 2400,
  },
  {
    name: "Feb",
    Order: 3000,
    Loan: 1398,
  },
  {
    name: "Mar",
    Order: 2000,
    Loan: 9800,
  },
  {
    name: "Apr",
    Order: 2780,
    Loan: 3908,
  },
  {
    name: "May",
    Order: 1890,
    Loan: 4800,
  },
  {
    name: "Jun",
    Order: 2390,
    Loan: 3800,
  },
  {
    name: "July",
    Order: 3490,
    Loan: 4300,
  },
  {
    name: "Aug",
    Order: 2000,
    Loan: 9800,
  },
  {
    name: "Sep",
    Order: 2780,
    Loan: 3908,
  },
  {
    name: "Oct",
    Order: 1890,
    Loan: 4800,
  },
  {
    name: "Nov",
    Order: 2390,
    Loan: 3800,
  },
  {
    name: "Dec",
    Order: 3490,
    Loan: 4300,
  },
];

export default function TransactionChart() {
  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Orders</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Loan" fill="#0ea5e9" />
            <Bar dataKey="Order" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

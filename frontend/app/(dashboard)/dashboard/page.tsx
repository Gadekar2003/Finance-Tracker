"use client";

import { AppHeader } from "@/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const chartColor: any = {
  "Food & Dining": "#3b82f6", // blue-500
  Transportation: "#22c55e", // green-500
  Shopping: "#eab308", // yellow-500
  Entertainment: "#a855f7", // purple-500
  "Bills & Utilities": "#ef4444", // red-500
  Healthcare: "#f43f5e", // red-600
  Education: "#10b981", // green-500
  Travel: "#8b5cf6", // purple-500
  Other: "#facc15", // yellow-400
};

export default function DashboardPage() {
  const [totalIncome, settotalIncome] = useState(0);
  const [totalExpense, settotalExpense] = useState(0);
  const [totalSaving, settotalSaving] = useState(0);
  const [expenseChartData, setexpenseChartData] = useState([]);
  const [monthlyData, setmonthlyData] = useState([]);

  const getMetaData = async () => {
    try {
      const response = await fetch(
        "https://finance-tracker-5mv4.onrender.com/metadata/get-all",
        {
          headers: { authentication: localStorage.getItem("userId") || "" },
        }
      );
      const data = await response.json();
      if (data.status) {
        settotalIncome(data.data.income.total);
        settotalExpense(data.data.expense.total);
        settotalSaving(
          parseInt(data.data.income.total) - parseInt(data.data.expense.total)
        );
        setexpenseChartData(
          data.data.expense.categoryTotals.map((category: any) => ({
            value: category.totalAmount,
            name: category.category,
            color: chartColor[category.category],
          }))
        );
        setmonthlyData(data.data.monthlyData);
      } else {
        throw new Error("unable to get income data");
      }
    } catch (error: any) {
      toast.error(error.message || "Something Went Wrong!");
    }
  };
  useEffect(() => {
    getMetaData();
  }, []);
  useEffect(() => {
    console.log(expenseChartData);
  }, [expenseChartData]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AppHeader title="Dashboard" />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpense.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${totalSaving.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>
              Breakdown of your monthly expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent as number) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseChartData.map((entry: any, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>
              Monthly comparison over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`$${value}`, name]} />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
    </div>
  );
}

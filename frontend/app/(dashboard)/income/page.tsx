"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Rental",
  "Other",
];

export default function IncomePage() {
  const [incomes, setIncomes] = useState<
    {
      _id: string;
      source: string;
      category:
        | "Salary"
        | "Freelance"
        | "Business"
        | "Investment"
        | "Rental"
        | "Other";
      amount: number;
      description: string;
      createdAt: string;
    }[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [formData, setFormData] = useState({
    source: "",
    category: "",
    amount: "",
    description: "",
  });
  const getAllIncome = async () => {
    try {
      const response = await fetch(
        "https://finance-tracker-5mv4.onrender.com/income/get-all",
        {
          headers: { authentication: localStorage.getItem("userId") || "" },
        }
      );
      const data = await response.json();
      if (data.status) {
        setIncomes(data.data);
      } else {
        throw new Error("unable to get income data");
      }
    } catch (error: any) {
      toast.error(error.message || "Something Went Wrong!");
    }
  };
  useEffect(() => {
    getAllIncome();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newIncome = {
      source: formData.source,
      category: formData.category,
      amount: Number.parseFloat(formData.amount),

      description: formData.description,
    };

    console.log(newIncome);
    if (editingIncome) {
      try {
        const response = await fetch(
          "https://finance-tracker-5mv4.onrender.com/income/update",
          {
            method: "PATCH",
            body: JSON.stringify({ ...newIncome, _id: editingIncome._id }),
            headers: { "content-type": "application/json" },
          }
        );
        const data = await response.json();
        if (data.status) {
          //refetch data
          getAllIncome();
        } else {
          throw new Error("unable to create income");
        }
      } catch (error) {}
    } else {
      try {
        const response = await fetch(
          "https://finance-tracker-5mv4.onrender.com/income/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...newIncome,
              userId: localStorage.getItem("userId") || "",
            }),
            headers: { "content-type": "application/json" },
          }
        );
        const data = await response.json();
        if (data.status) {
          getAllIncome();
        } else {
          throw new Error("unable to create income");
        }
      } catch (error) {}
    }

    setFormData({ source: "", category: "", amount: "", description: "" });
    setEditingIncome(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (income: any) => {
    setEditingIncome(income);
    setFormData({
      source: income.source,
      category: income.category,
      amount: income.amount.toString(),
      description: income.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    // setIncomes(incomes.filter((income) => income._id !== id));
    try {
      const response = await fetch(
        "https://finance-tracker-5mv4.onrender.com/income/delete",
        {
          method: "DELETE",
          body: JSON.stringify({ _id: id }),
          headers: { "content-type": "application/json" },
        }
      );
      const data = await response.json();
      if (data.status) {
        await getAllIncome();
      } else {
        throw new Error("unable to delete");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AppHeader
        title="Income"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
      />

      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">
              Total Income This Month
            </CardTitle>
            <CardDescription>All your income sources combined</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            ${totalIncome.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Add Income Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Income Records</CardTitle>
            <CardDescription>Track all your income sources</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingIncome(null);
                  setFormData({
                    source: "",
                    category: "",
                    amount: "",
                    description: "",
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingIncome ? "Edit Income" : "Add New Income"}
                </DialogTitle>
                <DialogDescription>
                  {editingIncome
                    ? "Update your income record."
                    : "Add a new income source to track your earnings."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="source">Income Source</Label>
                    <Input
                      id="source"
                      placeholder="e.g., Tech Corp, Client Name"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          source: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((previous) => ({
                          ...previous,
                          category: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          amount: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Optional description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingIncome ? "Update" : "Add"} Income
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomes.map((income) => (
                <TableRow key={income._id}>
                  <TableCell className="font-medium">
                    {income.createdAt.split("T")[0]}
                  </TableCell>
                  <TableCell>{income.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{income.category}</Badge>
                  </TableCell>
                  <TableCell>{income.description}</TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    +${income.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(income)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(income._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

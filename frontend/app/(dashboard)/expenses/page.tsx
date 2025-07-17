"use client"

import type React from "react"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, TrendingDown, Filter } from "lucide-react"

const expenseCategories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
]

const sampleExpenses = [
  {
    id: 1,
    date: "2024-01-15",
    category: "Food & Dining",
    amount: 45.5,
    description: "Restaurant dinner",
    notes: "Date night",
  },
  {
    id: 2,
    date: "2024-01-14",
    category: "Transportation",
    amount: 25.0,
    description: "Gas station",
    notes: "Weekly fill-up",
  },
  {
    id: 3,
    date: "2024-01-13",
    category: "Shopping",
    amount: 120.0,
    description: "Grocery shopping",
    notes: "Weekly groceries",
  },
  {
    id: 4,
    date: "2024-01-12",
    category: "Entertainment",
    amount: 35.0,
    description: "Movie tickets",
    notes: "Weekend movie",
  },
  {
    id: 5,
    date: "2024-01-11",
    category: "Bills & Utilities",
    amount: 150.0,
    description: "Electricity bill",
    notes: "Monthly utility",
  },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(sampleExpenses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [filterCategory, setFilterCategory] = useState("all")
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newExpense = {
      id: editingExpense ? editingExpense.id : Date.now(),
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
      notes: formData.notes,
    }

    if (editingExpense) {
      setExpenses(expenses.map((expense) => (expense.id === editingExpense.id ? newExpense : expense)))
    } else {
      setExpenses([...expenses, newExpense])
    }

    setFormData({ category: "", amount: "", date: "", description: "", notes: "" })
    setEditingExpense(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (expense: any) => {
    setEditingExpense(expense)
    setFormData({
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      description: expense.description,
      notes: expense.notes,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const filteredExpenses =
    filterCategory === "all" ? expenses : expenses.filter((expense) => expense.category === filterCategory)

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AppHeader title="Expenses" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />

      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">
              {filterCategory === "all" ? "Total Expenses This Month" : `${filterCategory} Expenses`}
            </CardTitle>
            <CardDescription>Track and manage your spending</CardDescription>
          </div>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expense Records</CardTitle>
            <CardDescription>Track all your expenses and spending patterns</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingExpense(null)
                    setFormData({ category: "", amount: "", date: "", description: "", notes: "" })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                  <DialogDescription>
                    {editingExpense ? "Update your expense record." : "Add a new expense to track your spending."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
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
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="e.g., Restaurant dinner"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Optional notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingExpense ? "Update" : "Add"} Expense</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-muted-foreground">{expense.notes}</TableCell>
                  <TableCell className="text-right font-medium text-red-600">-${expense.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(expense)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id)}>
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
  )
}

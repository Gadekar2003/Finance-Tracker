"use client"

import type React from "react"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Edit, Trash2, RefreshCw, Calendar } from "lucide-react"

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
]

const sampleRecurring = [
  {
    id: 1,
    title: "Salary",
    type: "income",
    amount: 5000,
    frequency: "monthly",
    startDate: "2024-01-01",
    endDate: "",
    isActive: true,
    description: "Monthly salary from Tech Corp",
  },
  {
    id: 2,
    title: "Rent",
    type: "expense",
    amount: 1200,
    frequency: "monthly",
    startDate: "2024-01-01",
    endDate: "",
    isActive: true,
    description: "Monthly apartment rent",
  },
  {
    id: 3,
    title: "Netflix Subscription",
    type: "expense",
    amount: 15.99,
    frequency: "monthly",
    startDate: "2024-01-15",
    endDate: "",
    isActive: true,
    description: "Streaming service subscription",
  },
  {
    id: 4,
    title: "Gym Membership",
    type: "expense",
    amount: 49.99,
    frequency: "monthly",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: false,
    description: "Local gym membership",
  },
]

export default function RecurringPage() {
  const [transactions, setTransactions] = useState(sampleRecurring)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    type: "expense",
    amount: "",
    frequency: "monthly",
    startDate: "",
    endDate: "",
    isActive: true,
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTransaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      title: formData.title,
      type: formData.type,
      amount: Number.parseFloat(formData.amount),
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      description: formData.description,
    }

    if (editingTransaction) {
      setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? newTransaction : t)))
    } else {
      setTransactions([...transactions, newTransaction])
    }

    setFormData({
      title: "",
      type: "expense",
      amount: "",
      frequency: "monthly",
      startDate: "",
      endDate: "",
      isActive: true,
      description: "",
    })
    setEditingTransaction(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setFormData({
      title: transaction.title,
      type: transaction.type,
      amount: transaction.amount.toString(),
      frequency: transaction.frequency,
      startDate: transaction.startDate,
      endDate: transaction.endDate,
      isActive: transaction.isActive,
      description: transaction.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const toggleActive = (id: number) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)))
  }

  const activeTransactions = transactions.filter((t) => t.isActive)
  const monthlyIncome = activeTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.frequency === "monthly" ? t.amount : t.amount / 12), 0)
  const monthlyExpenses = activeTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.frequency === "monthly" ? t.amount : t.amount / 12), 0)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AppHeader title="Recurring Transactions" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Income</CardTitle>
            <RefreshCw className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${monthlyIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Automated income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Expenses</CardTitle>
            <RefreshCw className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${monthlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Automated expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Monthly Impact</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${monthlyIncome - monthlyExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ${(monthlyIncome - monthlyExpenses).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Net recurring amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Recurring Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recurring Transactions</CardTitle>
            <CardDescription>Manage your automated income and expenses</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingTransaction(null)
                  setFormData({
                    title: "",
                    type: "expense",
                    amount: "",
                    frequency: "monthly",
                    startDate: "",
                    endDate: "",
                    isActive: true,
                    description: "",
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recurring Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? "Edit Recurring Transaction" : "Add Recurring Transaction"}
                </DialogTitle>
                <DialogDescription>
                  {editingTransaction
                    ? "Update your recurring transaction details."
                    : "Set up a new recurring income or expense."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Salary, Rent, Netflix"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
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
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Optional description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingTransaction ? "Update" : "Add"} Transaction</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.title}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === "income" ? "default" : "secondary"}>{transaction.type}</Badge>
                  </TableCell>
                  <TableCell
                    className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="capitalize">{transaction.frequency}</TableCell>
                  <TableCell>{transaction.startDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={transaction.isActive}
                        onCheckedChange={() => toggleActive(transaction.id)}
                        size="sm"
                      />
                      <span className="text-sm">{transaction.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(transaction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
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

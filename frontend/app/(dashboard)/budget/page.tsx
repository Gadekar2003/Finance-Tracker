"use client"

import type React from "react"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Plus, Edit, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

const sampleBudgets = [
  { id: 1, category: "Food & Dining", budget: 800, spent: 650, color: "bg-blue-500" },
  { id: 2, category: "Transportation", budget: 300, spent: 280, color: "bg-green-500" },
  { id: 3, category: "Shopping", budget: 500, spent: 620, color: "bg-yellow-500" },
  { id: 4, category: "Entertainment", budget: 200, spent: 150, color: "bg-purple-500" },
  { id: 5, category: "Bills & Utilities", budget: 400, spent: 380, color: "bg-red-500" },
]

export default function BudgetPage() {
  const [budgets, setBudgets] = useState(sampleBudgets)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<any>(null)
  const [formData, setFormData] = useState({
    category: "",
    budget: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newBudget = {
      id: editingBudget ? editingBudget.id : Date.now(),
      category: formData.category,
      budget: Number.parseFloat(formData.budget),
      spent: editingBudget ? editingBudget.spent : 0,
      color: editingBudget ? editingBudget.color : "bg-gray-500",
    }

    if (editingBudget) {
      setBudgets(budgets.map((budget) => (budget.id === editingBudget.id ? newBudget : budget)))
    } else {
      setBudgets([...budgets, newBudget])
    }

    setFormData({ category: "", budget: "" })
    setEditingBudget(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (budget: any) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      budget: budget.budget.toString(),
    })
    setIsDialogOpen(true)
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budget, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overBudgetCategories = budgets.filter((budget) => budget.spent > budget.budget)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AppHeader title="Budget" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly budget limit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${(totalBudget - totalSpent).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Overspending Alert */}
      {overBudgetCategories.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Budget Alert:</strong> You're over budget in {overBudgetCategories.length}
            {overBudgetCategories.length === 1 ? " category" : " categories"}:{" "}
            {overBudgetCategories.map((cat) => cat.category).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {/* Budget Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Budget Categories</CardTitle>
            <CardDescription>Set and track your monthly spending limits</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingBudget(null)
                  setFormData({ category: "", budget: "" })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
                <DialogDescription>
                  {editingBudget ? "Update your budget limit." : "Set a monthly budget limit for a category."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Food & Dining"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      disabled={!!editingBudget}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Monthly Budget</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingBudget ? "Update" : "Add"} Budget</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.budget) * 100
              const isOverBudget = budget.spent > budget.budget

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                      <span className="font-medium">{budget.category}</span>
                      {isOverBudget && (
                        <Badge variant="destructive" className="text-xs">
                          Over Budget
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        ${budget.spent.toFixed(2)} / ${budget.budget.toFixed(2)}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 ${isOverBudget ? "[&>div]:bg-red-500" : ""}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span className={isOverBudget ? "text-red-600 font-medium" : "text-green-600"}>
                        {isOverBudget
                          ? `$${(budget.spent - budget.budget).toFixed(2)} over`
                          : `$${(budget.budget - budget.spent).toFixed(2)} remaining`}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

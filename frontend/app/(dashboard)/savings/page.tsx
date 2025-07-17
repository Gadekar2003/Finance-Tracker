"use client"

import type React from "react"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
import { Plus, Edit, Trash2, Calendar, DollarSign } from "lucide-react"

const sampleGoals = [
  {
    id: 1,
    title: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 6500,
    dueDate: "2024-12-31",
    category: "Emergency",
    color: "bg-red-500",
  },
  {
    id: 2,
    title: "Vacation to Europe",
    targetAmount: 5000,
    currentAmount: 2800,
    dueDate: "2024-08-15",
    category: "Travel",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "New Car Down Payment",
    targetAmount: 8000,
    currentAmount: 4200,
    dueDate: "2024-10-01",
    category: "Transportation",
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "Home Renovation",
    targetAmount: 15000,
    currentAmount: 3500,
    dueDate: "2025-03-01",
    category: "Home",
    color: "bg-purple-500",
  },
]

export default function SavingsPage() {
  const [goals, setGoals] = useState(sampleGoals)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    dueDate: "",
    category: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newGoal = {
      id: editingGoal ? editingGoal.id : Date.now(),
      title: formData.title,
      targetAmount: Number.parseFloat(formData.targetAmount),
      currentAmount: Number.parseFloat(formData.currentAmount) || 0,
      dueDate: formData.dueDate,
      category: formData.category,
      color: editingGoal ? editingGoal.color : "bg-gray-500",
    }

    if (editingGoal) {
      setGoals(goals.map((goal) => (goal.id === editingGoal.id ? newGoal : goal)))
    } else {
      setGoals([...goals, newGoal])
    }

    setFormData({ title: "", targetAmount: "", currentAmount: "", dueDate: "", category: "" })
    setEditingGoal(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (goal: any) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      dueDate: goal.dueDate,
      category: goal.category,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = (totalCurrentAmount / totalTargetAmount) * 100

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AppHeader title="Savings Goals" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Savings Overview</CardTitle>
          <CardDescription>Track your progress towards financial goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${totalCurrentAmount.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Saved</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${totalTargetAmount.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Target</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{overallProgress.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Savings Goals</CardTitle>
            <CardDescription>Create and track your financial objectives</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingGoal(null)
                  setFormData({ title: "", targetAmount: "", currentAmount: "", dueDate: "", category: "" })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingGoal ? "Edit Savings Goal" : "Create New Savings Goal"}</DialogTitle>
                <DialogDescription>
                  {editingGoal ? "Update your savings goal details." : "Set a new financial target to work towards."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Emergency Fund"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currentAmount">Current Amount</Label>
                    <Input
                      id="currentAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Target Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Emergency, Travel, Home"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingGoal ? "Update" : "Create"} Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const remaining = goal.targetAmount - goal.currentAmount
              const daysUntilDue = Math.ceil(
                (new Date(goal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card key={goal.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <Badge variant="outline">{goal.category}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />${goal.currentAmount.toLocaleString()} / $
                          {goal.targetAmount.toLocaleString()}
                        </span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-medium">${remaining.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due Date
                        </p>
                        <p className="font-medium">{goal.dueDate}</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {daysUntilDue > 0 ? (
                        <span>{daysUntilDue} days remaining</span>
                      ) : (
                        <span className="text-red-600">Goal overdue</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

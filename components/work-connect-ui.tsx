"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Department, PostCategory } from "@/components/prototype-store"
import { MessagesSquare, UserRound } from "lucide-react"
import type { ReactNode } from "react"

export function WorkConnectMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <MessagesSquare />
    </span>
  )
}

export function AnonymousAvatar({
  size = "default",
  className,
}: {
  size?: "sm" | "default" | "lg"
  className?: string
}) {
  return (
    <Avatar size={size} className={cn("anonymous-avatar", className)} aria-label="共通の匿名アバター">
      <AvatarFallback className="anonymous-avatar-fallback">
        <UserRound aria-hidden="true" />
      </AvatarFallback>
    </Avatar>
  )
}

export function DepartmentBadge({ department }: { department: Department }) {
  return <Badge variant="outline" className="department-badge">{department}</Badge>
}

export function CategoryBadge({ category }: { category: PostCategory }) {
  return <Badge variant={category === "人事から" ? "default" : "secondary"} className="category-badge">{category}</Badge>
}

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
  titleId,
}: {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
  titleId?: string
}) {
  return (
    <header className="page-heading">
      <div>
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 id={titleId}>{title}</h1>
        {description ? <p className="page-heading-description">{description}</p> : null}
      </div>
      {actions ? <div className="page-heading-actions">{actions}</div> : null}
    </header>
  )
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

"use client"

import * as React from "react"

export function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={(className || "") + " p-4 rounded border"}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={(className || "") + " mb-2"}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={(className || "") + " mb-2"}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={(className || "") + " mt-2"}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 {...props} className={(className || "") + " text-lg font-bold"}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props} className={(className || "") + " text-sm text-muted"}>
      {children}
    </p>
  )
}
"use client"

import * as React from "react"

export function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className={(props.className || "") + " text-sm font-medium"}>
      {children}
    </label>
  )
}
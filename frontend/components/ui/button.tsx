"use client"

import * as React from "react"

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={(props.className || "") + " px-4 py-2 rounded"}>
      {children}
    </button>
  )
}
"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { useTheme } from "@/lib/theme-provider"

function TestComponent() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>Current theme: {theme}</button>
}

describe("Theme Toggle", () => {
  it("toggles between light and dark mode", () => {
    render(<TestComponent />)
    const button = screen.getByRole("button")
    expect(button).toHaveTextContent("light")
    fireEvent.click(button)
    expect(button).toHaveTextContent("dark")
  })
})

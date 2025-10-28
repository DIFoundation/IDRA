import { render, type RenderOptions } from "@testing-library/react"
import type React from "react"
import { Web3Provider } from "@/components/web3/web3-provider"
import { ThemeProvider } from "@/lib/theme-provider"

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3Provider>
      <ThemeProvider>{children}</ThemeProvider>
    </Web3Provider>
  )
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }

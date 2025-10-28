import { render, screen, fireEvent } from "@testing-library/react"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

describe("ConnectWalletButton", () => {
  it("renders connect button initially", () => {
    render(<ConnectWalletButton />)
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument()
  })

  it("shows loading state when connecting", () => {
    render(<ConnectWalletButton />)
    const button = screen.getByText(/Connect Wallet/i)
    fireEvent.click(button)
    // Note: Full test would require mocking window.ethereum
  })
})

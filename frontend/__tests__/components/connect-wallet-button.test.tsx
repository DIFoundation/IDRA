import { render, screen } from "@/lib/test-utils"
import { ConnectWalletButton } from "@/components/web3/connect-wallet-button"

describe("ConnectWalletButton", () => {
  it("renders connect wallet button when not connected", () => {
    render(<ConnectWalletButton />)
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument()
  })

  it("displays wallet address when connected", () => {
    // This test would require mocking wagmi hooks
    // Implementation depends on your testing setup
  })
})

"use client"

import { useState } from "react"
import { ArrowUpDown, ExternalLink, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Token {
  name: string
  symbol: string
  address: string
  decimals: number
  logoURI: string
}

const tokenList: Token[] = [
  {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
  },
  {
    name: "USDT Mining Token",
    symbol: "USDTM",
    address: "0x5e0dEA37f44b28544697227a3a77316Db99c68F1",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/ishfaq548/Usdtm-token-assets/main/logo.png",
  },
]

export default function Component() {
  const [walletConnected, setWalletConnected] = useState(true)
  const [fromAmount, setFromAmount] = useState("")
  const [fromToken, setFromToken] = useState<Token>(tokenList[0])
  const [toToken, setToToken] = useState<Token>(tokenList[1])

  const isValidAmount = Number.parseFloat(fromAmount) > 0
  const isSwapReady = walletConnected && isValidAmount
  const showReward = Number.parseFloat(fromAmount) >= 10

  const handleSwapClick = () => {
    const url = `https://pancakeswap.finance/swap?inputCurrency=${fromToken.address}&outputCurrency=${toToken.address}`
    window.open(url, "_blank")
  }

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleFromTokenChange = (symbol: string) => {
    const selected = tokenList.find((t) => t.symbol === symbol)
    if (selected) setFromToken(selected)
  }

  const handleToTokenChange = (symbol: string) => {
    const selected = tokenList.find((t) => t.symbol === symbol)
    if (selected) setToToken(selected)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <ArrowUpDown className="h-6 w-6 text-primary" />
            Token Swap
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* From Token Section */}
          <div className="space-y-2">
            <Label htmlFor="from-token" className="text-sm font-medium text-muted-foreground">
              From
            </Label>
            <Select value={fromToken.symbol} onValueChange={handleFromTokenChange}>
              <SelectTrigger id="from-token">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokenList.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      <img
                        src={token.logoURI || "/placeholder.svg"}
                        alt={token.symbol}
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=20&width=20"
                        }}
                      />
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-muted-foreground">— {token.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapTokens}
              className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token Section */}
          <div className="space-y-2">
            <Label htmlFor="to-token" className="text-sm font-medium text-muted-foreground">
              To
            </Label>
            <Select value={toToken.symbol} onValueChange={handleToTokenChange}>
              <SelectTrigger id="to-token">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokenList.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      <img
                        src={token.logoURI || "/placeholder.svg"}
                        alt={token.symbol}
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=20&width=20"
                        }}
                      />
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-muted-foreground">— {token.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Token Addresses */}
          <div className="space-y-1 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <div className="flex justify-between">
              <span>{fromToken.symbol} Address:</span>
              <code className="font-mono">{shortenAddress(fromToken.address)}</code>
            </div>
            <div className="flex justify-between">
              <span>{toToken.symbol} Address:</span>
              <code className="font-mono">{shortenAddress(toToken.address)}</code>
            </div>
          </div>

          {/* Reward Badge */}
          {showReward && (
            <Badge
              variant="secondary"
              className="w-full justify-center py-2 bg-green-50 text-green-700 border-green-200"
            >
              🎉 Swap 10 USDT and get 5 Extra USDTM as reward!
            </Badge>
          )}

          {/* Swap Button */}
          <Button
            disabled={!isSwapReady}
            onClick={handleSwapClick}
            className="w-full py-6 text-lg font-semibold"
            size="lg"
          >
            {walletConnected ? (
              isValidAmount ? (
                <div className="flex items-center gap-2">
                  Swap on PancakeSwap
                  <ExternalLink className="h-4 w-4" />
                </div>
              ) : (
                "Enter Amount"
              )
            ) : (
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </div>
            )}
          </Button>

          {/* Wallet Status */}
          {!walletConnected && <p className="text-destructive text-sm text-center">Wallet not connected</p>}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Bitcoin, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados de exemplo para criptomoedas
const cryptoData = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 63245.82, change24h: 2.34, icon: Bitcoin },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3421.56, change24h: -1.23, icon: Bitcoin },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, change24h: 5.67, icon: Bitcoin },
  { id: "solana", name: "Solana", symbol: "SOL", price: 142.78, change24h: 8.91, icon: Bitcoin },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 6.32, change24h: -3.45, icon: Bitcoin },
]

// Tipo para os ativos do portfólio
type PortfolioAsset = {
  id: string
  name: string
  symbol: string
  amount: number
  price: number
  change24h: number
  value: number
  icon: any
}

export function CryptoPortfolio() {
  // Estado para o portfólio
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([
    { ...cryptoData[0], amount: 0.5, value: 0.5 * cryptoData[0].price },
    { ...cryptoData[1], amount: 4.2, value: 4.2 * cryptoData[1].price },
    { ...cryptoData[3], amount: 12, value: 12 * cryptoData[3].price },
  ])

  // Estado para o formulário de adição
  const [newAsset, setNewAsset] = useState({
    id: "",
    amount: "",
  })

  // Calcular valor total do portfólio
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0)

  // Calcular mudança total em 24h
  const totalChange24h = portfolio.reduce((sum, asset) => {
    const changeValue = asset.value * (asset.change24h / 100)
    return sum + changeValue
  }, 0)

  const totalChangePercentage = totalValue > 0 ? (totalChange24h / (totalValue - totalChange24h)) * 100 : 0

  // Adicionar novo ativo
  const addAsset = () => {
    if (newAsset.id && newAsset.amount) {
      const cryptoInfo = cryptoData.find((crypto) => crypto.id === newAsset.id)
      if (cryptoInfo) {
        const amount = Number.parseFloat(newAsset.amount)
        const newPortfolioAsset: PortfolioAsset = {
          ...cryptoInfo,
          amount,
          value: amount * cryptoInfo.price,
        }

        // Verificar se já existe no portfólio
        const existingIndex = portfolio.findIndex((asset) => asset.id === newAsset.id)

        if (existingIndex >= 0) {
          // Atualizar quantidade se já existir
          const updatedPortfolio = [...portfolio]
          updatedPortfolio[existingIndex].amount += amount
          updatedPortfolio[existingIndex].value = updatedPortfolio[existingIndex].amount * cryptoInfo.price
          setPortfolio(updatedPortfolio)
        } else {
          // Adicionar novo se não existir
          setPortfolio([...portfolio, newPortfolioAsset])
        }

        // Resetar formulário
        setNewAsset({ id: "", amount: "" })
      }
    }
  }

  // Remover ativo
  const removeAsset = (id: string) => {
    setPortfolio(portfolio.filter((asset) => asset.id !== id))
  }

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meu Portfólio de Criptomoedas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Ativo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Criptomoeda</DialogTitle>
                <DialogDescription>Adicione uma nova criptomoeda ao seu portfólio.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="crypto">Criptomoeda</Label>
                  <Select value={newAsset.id} onValueChange={(value) => setNewAsset({ ...newAsset, id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma criptomoeda" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoData.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          {crypto.name} ({crypto.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Quantidade</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    value={newAsset.amount}
                    onChange={(e) => setNewAsset({ ...newAsset, amount: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addAsset}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Valor Total</CardDescription>
              <CardTitle className="text-3xl">
                ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {totalChangePercentage > 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={totalChangePercentage > 0 ? "text-green-500" : "text-red-500"}>
                  {Math.abs(totalChangePercentage).toFixed(2)}% (24h)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ativos</CardDescription>
              <CardTitle>{portfolio.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Criptomoedas em seu portfólio</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Mudança (24h)</CardDescription>
              <CardTitle className={totalChange24h > 0 ? "text-green-500" : "text-red-500"}>
                $
                {Math.abs(totalChange24h).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {totalChange24h > 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={totalChange24h > 0 ? "text-green-500" : "text-red-500"}>
                  {totalChangePercentage > 0 ? "+" : ""}
                  {totalChangePercentage.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ativos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ativos">Meus Ativos</TabsTrigger>
            <TabsTrigger value="mercado">Mercado</TabsTrigger>
          </TabsList>
          <TabsContent value="ativos">
            <Card>
              <CardHeader>
                <CardTitle>Meus Ativos</CardTitle>
                <CardDescription>Gerencie suas criptomoedas e acompanhe seu desempenho.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      Você ainda não tem criptomoedas no seu portfólio. Adicione seu primeiro ativo para começar a
                      acompanhar.
                    </div>
                  ) : (
                    portfolio.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <asset.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            $
                            {asset.value.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                          <div className="text-sm flex items-center justify-end">
                            <span className="text-muted-foreground mr-2">
                              {asset.amount.toLocaleString("pt-BR", { minimumFractionDigits: asset.price < 1 ? 4 : 2 })}{" "}
                              {asset.symbol}
                            </span>
                            <div
                              className={`flex items-center ${asset.change24h > 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {asset.change24h > 0 ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(asset.change24h).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-2" onClick={() => removeAsset(asset.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mercado">
            <Card>
              <CardHeader>
                <CardTitle>Mercado</CardTitle>
                <CardDescription>Preços atuais das principais criptomoedas.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cryptoData.map((crypto) => (
                    <div key={crypto.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <crypto.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          $
                          {crypto.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div
                          className={`flex items-center justify-end ${crypto.change24h > 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {crypto.change24h > 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(crypto.change24h).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


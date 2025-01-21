import { AreaChart, Card, Title } from "@tremor/react"

const chartdata = [
  {
    date: "Jan 22",
    Revenue: 2890000,
  },
  {
    date: "Feb 22",
    Revenue: 3200000,
  },
  // Thêm dữ liệu các tháng khác...
]

export function RevenueChart() {
  return (
    <AreaChart
      className="h-72 mt-4"
      data={chartdata}
      index="date"
      categories={["Revenue"]}
      colors={["blue"]}
      valueFormatter={(number) => 
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(number)
      }
    />
  )
} 
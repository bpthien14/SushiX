import { AreaChart, Card, Title } from "@tremor/react"

const chartdata = [
  {
    "time_period": "2024-01-01T00:00:00.000Z",
    "total_revenue": 1500000,
    "total_orders": 25
  },
  {
    "time_period": "2024-01-02T00:00:00.000Z", 
    "total_revenue": 1800000,
    "total_orders": 30
  }
  // Thêm dữ liệu các tháng khác...
]

export function RevenueChart() {
  return (
    <AreaChart
      className="h-72 mt-4"
      data={chartdata}
      index="time_period"
      categories={["total_revenue"]}
      colors={["blue"]}

      valueFormatter={(number) => 
        // Chuyển đổi sang triệu đồng
        `${(number / 1000000).toFixed(1)}M`
      }
      yAxisWidth={60} // Tăng độ rộng trục y
      showAnimation={true}
      showLegend={false}
      showGridLines={false}
      showYAxis={true}
      autoMinValue={true} // Tự động điều chỉnh giá trị min
    />
  )
} 
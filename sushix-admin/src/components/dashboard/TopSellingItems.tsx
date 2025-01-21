import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
} from '@tremor/react'

const items = [
  {
    name: "Sashimi cá hồi",
    category: "Sashimi",
    quantity: 156,
    revenue: 31200000,
    trend: "up",
  },
  {
    name: "Maki California",
    category: "Maki",
    quantity: 134,
    revenue: 24120000,
    trend: "up",
  },
  {
    name: "Tempura tôm",
    category: "Tempura",
    quantity: 122,
    revenue: 18300000,
    trend: "down",
  },
  {
    name: "Ramen Tonkotsu",
    category: "Ramen",
    quantity: 98,
    revenue: 15680000,
    trend: "up",
  },
]

export function TopSellingItems() {
  return (
    <Table className="mt-6">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Tên món</TableHeaderCell>
          <TableHeaderCell>Danh mục</TableHeaderCell>
          <TableHeaderCell>Số lượng</TableHeaderCell>
          <TableHeaderCell>Doanh thu</TableHeaderCell>
          <TableHeaderCell>Xu hướng</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.name}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.revenue)}
            </TableCell>
            <TableCell>
              <Badge color={item.trend === "up" ? "emerald" : "red"}>
                {item.trend === "up" ? "Tăng" : "Giảm"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 
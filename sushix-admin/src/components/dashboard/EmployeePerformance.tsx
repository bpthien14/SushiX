import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
} from '@tremor/react'

type Status = "excellent" | "good" | "average" | "poor"

const employees = [
  {
    name: "Nguyễn Văn A",
    position: "Phục vụ bàn",
    orders: 45,
    rating: 4.8,
    status: "excellent" as Status,
  },
  {
    name: "Trần Thị B",
    position: "Thu ngân",
    orders: 38,
    rating: 4.6,
    status: "good" as Status,
  },
  {
    name: "Lê Văn C",
    position: "Phục vụ bàn",
    orders: 32,
    rating: 4.2,
    status: "good" as Status,
  },
  {
    name: "Phạm Thị D",
    position: "Bếp trưởng",
    orders: 28,
    rating: 4.7,
    status: "excellent" as Status,
  },
]

const statusColors = {
  excellent: "emerald",
  good: "blue",
  average: "yellow",
  poor: "red",
} as const

export function EmployeePerformance() {
  return (
    <Table className="mt-6">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Nhân viên</TableHeaderCell>
          <TableHeaderCell>Vị trí</TableHeaderCell>
          <TableHeaderCell>Số đơn</TableHeaderCell>
          <TableHeaderCell>Đánh giá</TableHeaderCell>
          <TableHeaderCell>Hiệu suất</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.name}>
            <TableCell>{employee.name}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>{employee.orders}</TableCell>
            <TableCell>{employee.rating}/5.0</TableCell>
            <TableCell>
              <Badge color={statusColors[employee.status]}>
                {employee.status === "excellent" && "Xuất sắc"}
                {employee.status === "good" && "Tốt"}
                {employee.status === "average" && "Trung bình"} 
                {employee.status === "poor" && "Kém"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 
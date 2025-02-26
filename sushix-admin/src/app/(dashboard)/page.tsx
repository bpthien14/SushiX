import { useState } from 'react'
import { Title, Text } from '@tremor/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { RevenueChart } from '../../components/dashboard/RevenueChart'
import { TopSellingItems } from '../../components/dashboard/TopSellingItems'
import { EmployeePerformance } from '../../components/dashboard/EmployeePerformance'
import { BranchesOverview } from '../../components/dashboard/BranchesOverview'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { RevenueCard } from '../../components/dashboard/RevenueCard'

const areas = [
  { id: 'all', name: 'Tất cả khu vực' },
  { id: 'hcm', name: 'TP. Hồ Chí Minh' },
  { id: 'hn', name: 'Hà Nội' },
  { id: 'dn', name: 'Đà Nẵng' },
] as const

type AreaId = typeof areas[number]['id']

export default function DashboardPage() {
  const [selectedArea, setSelectedArea] = useState<typeof areas[number]['id']>('all')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title>Bảng điều khiển</Title>
          <Text>Xem tổng quan về hoạt động kinh doanh</Text>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RevenueCard />
        {/* ... các Card khác ... */}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className='lg:col-span-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Doanh thu theo thời gian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className='lg:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Hiệu suất chi nhánh
            </CardTitle>
            <Select 
              value={selectedArea} 
              onValueChange={(value: AreaId) => setSelectedArea(value)}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
                
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <BranchesOverview areaId={selectedArea} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Top món ăn bán chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopSellingItems />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Hiệu suất nhân viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeePerformance />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
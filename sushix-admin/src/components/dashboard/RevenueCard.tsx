import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatCurrency } from '../../lib/utils'
import { ENDPOINTS } from '../../lib/config'

export function RevenueCard() {
  const [revenue, setRevenue] = useState<{
    currentMonth: number;
    previousMonth: number;
    percentageChange: number;
    hasCurrentMonthData: boolean;
    latestMonthDate: Date | null;
  }>({
    currentMonth: 0,
    previousMonth: 0,
    percentageChange: 0,
    hasCurrentMonthData: false,
    latestMonthDate: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const now = new Date()
        const months = []
        
        // Tạo mảng 6 tháng gần nhất với ngày đầu và cuối của chính tháng đó
        for (let i = 0; i < 6; i++) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
          
          // Nếu là tháng hiện tại và ngày chưa kết thúc, lấy đến ngày hiện tại
          if (i === 0) {
            monthEnd.setDate(now.getDate())
          }
          
          months.push({ 
            start: monthStart.toISOString().split('T')[0], 
            end: monthEnd.toISOString().split('T')[0] 
          })
        }

        // Tìm tháng gần nhất có doanh thu
        let latestMonthData = null
        let previousMonthData = null

        for (const month of months) {
          const response = await fetch(
            `${ENDPOINTS.BRANCHES_REVENUE}?startDate=${month.start}&endDate=${month.end}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          )
          
          const data = await response.json()
          console.log('Revenue for', month.start, 'to', month.end, ':', data)

          if (data.total_revenue > 0) {
            if (!latestMonthData) {
              latestMonthData = {
                date: new Date(month.start),
                revenue: data.total_revenue
              }
            } else if (!previousMonthData) {
              previousMonthData = {
                date: new Date(month.start),
                revenue: data.total_revenue
              }
              break
            }
          }
        }

        // Tính toán phần trăm thay đổi
        const percentageChange = latestMonthData && previousMonthData
          ? ((latestMonthData.revenue - previousMonthData.revenue) / previousMonthData.revenue) * 100
          : 0

        setRevenue({
          currentMonth: latestMonthData?.revenue || 0,
          previousMonth: previousMonthData?.revenue || 0,
          percentageChange,
          hasCurrentMonthData: !!latestMonthData,
          latestMonthDate: latestMonthData?.date || null
        })

      } catch (error) {
        console.error('Failed to fetch revenue:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRevenue()
  }, [])

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          Tổng doanh thu {revenue.latestMonthDate && 
            `tháng ${revenue.latestMonthDate.getMonth() + 1}/${revenue.latestMonthDate.getFullYear()}`}
        </CardTitle>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
        </svg>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mt-2"></div>
          </div>
        ) : (
          <>
            <div className='text-2xl font-bold'>
              {!revenue.hasCurrentMonthData 
                ? 'Chưa có dữ liệu doanh thu'
                : formatCurrency(revenue.currentMonth)
              }
            </div>
            {revenue.hasCurrentMonthData && revenue.previousMonth > 0 && (
              <p className={`text-xs ${revenue.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {`${revenue.percentageChange >= 0 ? '+' : ''}${revenue.percentageChange.toFixed(1)}% so với tháng trước`}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 
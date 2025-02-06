import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { useWindowSize } from '../../hooks/useWindowSize'

interface Branch {
  name: string;
  "Doanh thu": number;
  "Đơn hàng": number;
}

interface BranchesOverviewProps {
  areaId: 'all' | 'hcm' | 'hn' | 'dn';
}

const branchesByArea: Record<string, Branch[]> = {
  hcm: [
    {
      name: "Chi nhánh Quận 1",
      "Doanh thu": 4800000,
      "Đơn hàng": 245,
    },
    // ... các chi nhánh HCM
  ],
  hn: [
    {
      name: "Chi nhánh Hoàn Kiếm",
      "Doanh thu": 3900000,
      "Đơn hàng": 210,
    },
    // ... các chi nhánh Hà Nội
  ],
  dn: [
    {
      name: "Chi nhánh Hải Châu",
      "Doanh thu": 2800000,
      "Đơn hàng": 180,
    },
    // ... các chi nhánh Đà Nẵng
  ],
}

export function BranchesOverview({ areaId }: BranchesOverviewProps) {
  const { isMobile } = useWindowSize()
  const branches = areaId === 'all' 
    ? Object.values(branchesByArea).flat()
    : branchesByArea[areaId] || []

  return (
    <div style={{ maxHeight: '350px' }}>
      <ResponsiveContainer className="overflow-y-auto"
        width='100%' height={350}>
        <BarChart
          data={branches}
          layout="horizontal"
          margin={{ top: 20, right: 40, bottom: isMobile ? 60 : 20, left: 40 }}
        >
          <XAxis
            type="category"
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 60 : 30}
            angle={isMobile ? -45 : 0}
          />

          <YAxis
            yAxisId="revenue"
            orientation="left"
            tickFormatter={(value) =>
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(value)
            }
            stroke="#8884d8"
          />

          <YAxis
            yAxisId="orders"
            orientation="right"
            tickFormatter={(value) => `${value} đơn`}
            stroke="#82ca9d"
          />

          <Tooltip
            formatter={(value, name) => {
              if (name === 'Doanh thu') {
                return [
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(value)),
                  'Doanh thu'
                ]
              }
              return [`${value} đơn`, 'Đơn hàng']
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            labelStyle={{ color: '#374151' }}
          />

          <Bar
            yAxisId="revenue"
            dataKey="Doanh thu"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />

          <Bar
            yAxisId="orders"
            dataKey="Đơn hàng"
            fill="#82ca9d"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 
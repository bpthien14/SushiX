import { Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon,
  UsersIcon, 
  BuildingStorefrontIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Tổng quan', href: '/', icon: HomeIcon },
  { name: 'Quản lý chi nhánh', href: '/branches', icon: BuildingStorefrontIcon },
  { name: 'Quản lý nhân viên', href: '/employees', icon: UsersIcon },
  { name: 'Báo cáo doanh thu', href: '/revenue', icon: ChartBarIcon },
  { name: 'Quản lý menu', href: '/menu', icon: ClipboardDocumentListIcon },
  { name: 'Cài đặt', href: '/settings', icon: Cog6ToothIcon },
]

export function Sidebar() {
  const location = useLocation()
  
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="h-8 w-auto"
              src="/sushix-logo.svg"
              alt="SushiX Logo"
            />
            <span className="ml-2 text-xl font-bold">SushiX</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
} 
import { useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/solid'

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">SushiX Admin</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
            <span className="sr-only">Xem thông báo</span>
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-sm focus:outline-none"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="hidden md:block font-medium text-gray-700">
                Admin User
              </span>
            </button>

            {isProfileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cài đặt
                  </a>
                  <a
                    href="#logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 
import React, { useEffect, useMemo } from 'react'
import type { DbMenuData } from '@/api/menuApi'
import { SelectField } from '../components/SelectField'
import { useAuthContext } from '../context/AuthContext'
import {
  PUBLISH_SETTINGS_ITEMS,
  MENU_DESTINATION_ITEMS,
} from '../constants/constants'

type MenuFilterProps = {
  dbMenusData: DbMenuData[]
}

export const MenuFilter: React.FC<MenuFilterProps> = ({ dbMenusData }) => {
  const {
    dateFilter,
    destinationFilter,
    statusFilter,
    handleDateFilterChange,
    handleDestinationFilterChange,
    handleStatusFilterChange,
    setFilteredData,
  } = useAuthContext()

  useEffect(() => {
    let filtered = [...dbMenusData]

    if (dateFilter.year || dateFilter.month || dateFilter.day) {
      filtered = filtered.filter((Menu) => {
        const startDate = new Date(Menu.start_date)
        const endDate = new Date(Menu.end_date)

        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          if (
            (!dateFilter.year ||
              d.getFullYear().toString() === dateFilter.year) &&
            (!dateFilter.month ||
              (d.getMonth() + 1).toString() === dateFilter.month) &&
            (!dateFilter.day || d.getDate().toString() === dateFilter.day)
          ) {
            return true
          }
        }

        return false
      })
    }

    if (destinationFilter) {
      filtered = filtered.filter(
        (menu) => String(menu.prefecture_id) === destinationFilter
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (menu) => String(menu.is_public) === statusFilter
      )
    }

    setFilteredData(filtered)
  }, [
    dateFilter,
    destinationFilter,
    statusFilter,
    dbMenusData,
    setFilteredData,
  ])

  const getUniqueYears = (menus: DbMenuData[]) => {
    const yearsSet = new Set(
      menus.map((menu) => new Date(menu.start_date).getFullYear())
    )
    return Array.from(yearsSet).sort((a, b) => a - b)
  }

  const getUniqueMonths = (menus: DbMenuData[]) => {
    const monthsSet = new Set(
      menus.map((menu) => new Date(menu.start_date).getMonth() + 1)
    )
    return Array.from(monthsSet).sort((a, b) => a - b)
  }

  const getUniqueDays = (menus: DbmMenuData[]) => {
    const daysSet = new Set(
      menus.flatMap((menu) => {
        const days = []
        for (
          let d = new Date(menu.start_date);
          d <= new Date(menu.end_date);
          d.setDate(d.getDate() + 1)
        ) {
          days.push(d.getDate())
        }
        return days
      })
    )
    return Array.from(daysSet).sort((a, b) => a - b)
  }

  const getUniqueDestinations = (menus: DbMenuData[]) => {
    return Array.from(new Set(menus.map((menu) => menu.prefecture_id)))
  }

  const years = useMemo(() => getUniqueYears(dbMenusData), [dbMenusData])
  const months = useMemo(() => getUniqueMonths(dbMenusData), [dbMenusData])
  const days = useMemo(() => getUniqueDays(dbMenusData), [dbMenusData])
  const destinations = useMemo(
    () => getUniqueDestinations(dbMenusData),
    [dbMenusData]
  )
  const filteredDestinations = Menu_DESTINATION_ITEMS.filter((item) =>
    destinations.includes(Number(item.value))
  )

  return (
    <div className="flex justify-center">
      <div className="space-y-2 max-w-xs">
        <SelectField
          id="destinations"
          labelName="旅行先"
          value={destinationFilter}
          items={filteredDestinations}
          search={true}
          onChange={handleDestinationFilterChange}
        />
        <div className="flex space-x-2">
          <SelectField
            id="year"
            labelName="旅行年"
            value={dateFilter.year}
            items={years}
            search={true}
            onChange={handleDateFilterChange}
          />
          <SelectField
            id="month"
            labelName="旅行月"
            value={dateFilter.month}
            items={months}
            search={true}
            onChange={handleDateFilterChange}
          />
          <SelectField
            id="day"
            labelName="旅行日"
            value={dateFilter.day}
            items={days}
            search={true}
            onChange={handleDateFilterChange}
          />
        </div>
        <SelectField
          id="publish-settings"
          value={statusFilter}
          labelName="公開状態"
          items={PUBLISH_SETTINGS_ITEMS}
          search={true}
          onChange={handleStatusFilterChange}
        />
      </div>
    </div>
  )
}

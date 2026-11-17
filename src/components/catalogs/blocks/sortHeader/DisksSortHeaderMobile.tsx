import type React from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { getDisksCards, sortDisksTypeSelect, sortDisksTypeSelector } from '../../../../app/slices/filters/disksFiltersSlice'
import { SortHeader } from './SortHeader'

export const DisksSortHeaderMobile: React.FC = () => {
  const sortType = useAppSelector(sortDisksTypeSelector)
  return <SortHeader sortData={{ sortType, sortTypeAction: sortDisksTypeSelect, newDataReq: getDisksCards }} />
}

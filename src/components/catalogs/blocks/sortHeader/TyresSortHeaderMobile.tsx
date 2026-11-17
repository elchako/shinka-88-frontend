import type React from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { getTyresCards, sortTyresTypeSelect, sortTyresTypeSelector } from '../../../../app/slices/filters/tiresFiltersSlice'
import { SortHeader } from './SortHeader'

export const TyresSortHeaderMobile: React.FC = () => {
  const sortType = useAppSelector(sortTyresTypeSelector)
  return <SortHeader sortData={{ sortType, sortTypeAction: sortTyresTypeSelect, newDataReq: getTyresCards }} />
}

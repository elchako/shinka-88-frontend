import type React from 'react'
import type { IFilterBlockProps } from '../../../app/hooks'
import { SizeFilter } from './SizeFilter'
import { SeasonFilter } from './SeasonFilter'
import { AdditionalFilter } from './AdditionalFilter'

// Жизненным циклом запросов управляет каталог, а не скрытая desktop-ветка.
export const TyresFilterBlocks: React.FC<IFilterBlockProps> = () => (
  <>
    <SizeFilter />
    <SeasonFilter />
    <AdditionalFilter />
  </>
)

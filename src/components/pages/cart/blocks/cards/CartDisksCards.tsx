import type React from 'react'
import type { selectedType } from '../../../../../types/cart'
import type { resultsDisksType } from '../../../../../types/disks'
import { CartProductCard } from './CartTyresCards'

export const CartDisksCards: React.FC<{ data: selectedType & resultsDisksType; onRemove: () => void }> = ({ data, onRemove }) =>
  <CartProductCard data={data} onRemove={onRemove} />

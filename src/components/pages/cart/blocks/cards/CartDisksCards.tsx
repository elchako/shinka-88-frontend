import type React from 'react'
import type { selectedType } from '../../../../../types/cart'
import type { resultsDisksType } from '../../../../../types/disks'
import { CartProductCard } from './CartTyresCards'

export const CartDisksCards: React.FC<{ data: selectedType & resultsDisksType }> = ({ data }) =>
  <CartProductCard data={data} />

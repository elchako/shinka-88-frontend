import type React from 'react'
import type { resultsDisksType } from '../../../../../types/disks'
import { ProductCard } from '../ProductCard'

interface Props {
  data: resultsDisksType
  handler: (data: resultsDisksType, inCart: boolean) => void
}

export const DisksCardDesktop: React.FC<Props> = ({ data, handler }) => (
  <ProductCard data={data} category="disks" onAdd={(amount, inCart) => handler({ ...data, amount }, inCart)} />
)

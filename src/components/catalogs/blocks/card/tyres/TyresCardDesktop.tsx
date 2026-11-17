import type React from 'react'
import type { resultsTyresType } from '../../../../../types/tires'
import { ProductCard } from '../ProductCard'

interface Props {
  data: resultsTyresType
  handler: (data: resultsTyresType, inCart: boolean) => void
}

export const TyresCardDesktop: React.FC<Props> = ({ data, handler }) => (
  <ProductCard data={data} category="tires" onAdd={(amount, inCart) => handler({ ...data, amount }, inCart)} />
)

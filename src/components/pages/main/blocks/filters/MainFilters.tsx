import type React from 'react'
import { useRef, useState } from 'react'
import { tabs } from '../../../../../consts'
import { Icon } from '../../../../common/Icon'
import { AssistedSelection } from '../../../../common/AssistedSelection'
import { TiresFilterBlock1 } from './filtersBlocks/TiresFilterBlock1'
import { DisksFilterBlock2 } from './filtersBlocks/DisksFilterBlock2'
import styles from './MainFilters.module.scss'

export interface ITabsProps {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const MainFilters: React.FC = () => {
  const [selected, setSelected] = useState(0)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  return (
    <section className={styles.mainWrapper} id="product-picker" aria-label="Подбор товаров">
      <div className={styles.header} role="tablist" aria-label="Категория товара">
        {tabs.map((tab, index) => (
          <button
            type="button" key={tab} ref={element => { refs.current[index] = element }}
            id={`home-tab-${index}`} role="tab" aria-selected={selected === index}
            aria-controls="home-filter-panel" tabIndex={selected === index ? 0 : -1}
            className={`${styles.tab} ${selected === index ? styles.selectedTab : ''}`}
            onClick={() => setSelected(index)}
            onKeyDown={event => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
              event.preventDefault()
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length
              setSelected(next)
              refs.current[next]?.focus()
            }}
          >{index < 2 && <Icon name={index === 0 ? 'tire' : 'wheel'} size={20} />}{tab}</button>
        ))}
      </div>
      <div className={styles.content} id="home-filter-panel" role="tabpanel" aria-labelledby={`home-tab-${selected}`}>
        {selected === 0 ? <TiresFilterBlock1 /> : selected === 1 ? <DisksFilterBlock2 />
          : <AssistedSelection category={(['oils', 'akb', 'autoParts'] as const)[selected - 2] || 'oils'} showPageLink />}
      </div>
    </section>
  )
}

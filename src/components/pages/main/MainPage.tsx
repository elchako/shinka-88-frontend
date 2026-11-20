import type React from 'react'
import { MainFilters } from './blocks/filters/MainFilters'
import { Contacts } from './blocks/contacts/Contacts'
import { PromoBanner } from './PromoBanner'
import { Footer } from '../../footer/Footer'
import { ProductHelp } from '../../common/ProductHelp'
import styles from './MainPageStyles.module.scss'

export const MainPage: React.FC = () => (
  <>
    <div className={styles.mainWrapper}>
      <main className={styles.content}>
        <header className={styles.intro}>
          <h1>Шины, диски и автозапчасти в Егорьевске</h1>
          <p>«Шинка88»: магазин шин, колёсных дисков и автозапчастей с шиномонтажем. Подберите товар по параметрам и проверьте цены и наличие в каталоге.</p>
        </header>
        <PromoBanner />
        <div className={styles.picker}><MainFilters /><ProductHelp /></div>
        <Contacts />
      </main>
      <Footer compact />
    </div>
  </>
)

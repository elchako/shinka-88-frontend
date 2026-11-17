import type React from 'react'
import { Helmet } from 'react-helmet-async'
import { MainFilters } from './blocks/filters/MainFilters'
import { Contacts } from './blocks/contacts/Contacts'
import { PromoBanner } from './PromoBanner'
import { Footer } from '../../footer/Footer'
import styles from './MainPageStyles.module.scss'

export const MainPage: React.FC = () => (
  <>
    <Helmet><title>Шинка88 | Шины, диски и шиномонтаж в Егорьевске</title></Helmet>
    <div className={styles.mainWrapper}>
      <div className={styles.content}>
        <PromoBanner />
        <div className={styles.picker}><MainFilters /></div>
        <Contacts />
      </div>
      <Footer compact />
    </div>
  </>
)

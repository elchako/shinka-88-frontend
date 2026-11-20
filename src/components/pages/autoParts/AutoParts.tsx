import { Footer } from '../../footer/Footer'
import { AssistedSelection, assistedCategories, type AssistedCategory } from '../../common/AssistedSelection'
import styles from './AutoPartsStyles.module.scss'

export const AutoParts = ({ category = 'autoParts' }: { category?: AssistedCategory }) => (
  <>
    <main className={styles.content}>
      <h1 className="pageTitle">{assistedCategories[category].title}</h1>
      <div className={styles.searchBlock}><AssistedSelection category={category} /></div>
    </main>
    <Footer />
  </>
)

import type React from 'react'
import { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { mobileMenuReducer, mobileMenuSelector } from '../../../app/slices/common/smallActions'
import { links } from '../../../consts'
import { Modal } from '../../common/Modal'
import { Icon } from '../../common/Icon'
import styles from './MobileMenu.module.scss'

export const HiddenMobileMenu: React.FC = () => {
  const closed = useAppSelector(mobileMenuSelector)
  const dispatch = useAppDispatch()
  const close = useCallback(() => { if (!closed) dispatch(mobileMenuReducer()) }, [closed, dispatch])
  const items = [links[0], links[3], links[4], links[1], links[5], links[6], links[7], links[8], links[12], links[14], links[13], links[11]]
  return (
    <Modal isOpen={!closed} onClose={close} title="Меню магазина" size="md">
      <nav className={styles.hiddenMenuContent} aria-label="Разделы магазина">
        {items.map((item, index) => (
          <NavLink key={item.link} to={item.link.startsWith('/') ? item.link : `/${item.link}`} className={styles.hiddenMenuItem} onClick={close}>
            {index < 4 && <Icon name={['home', 'tire', 'wheel', 'cart'][index]} size={20} />}
            <span>{item.title}</span><Icon name="chevron" size={16} />
          </NavLink>
        ))}
      </nav>
      <div className={styles.menuContacts}><a href={links[2].link}>{links[2].title}</a><p>«Шинка», Егорьевск, ул. Рязанская</p></div>
    </Modal>
  )
}

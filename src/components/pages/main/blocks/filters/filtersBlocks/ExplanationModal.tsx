import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import closeModal from '../../../../../../imgs/closeHiddenMenu.png';
import tires from '../../../../../../imgs/modalTires.png';
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks";
import { explanationToggle, explanationToggleSelector } from "./filterBlock1Slice";

export const ExplanationModal: React.FC = () => {
    const isModalOpen = useAppSelector(explanationToggleSelector)
    const dispatch = useAppDispatch()

    let openModalStyles = null
    isModalOpen
        ? openModalStyles = FilterBlocksStyles.explanationModalWrapper
        : openModalStyles = FilterBlocksStyles.explanationModalWrapper +
        ' ' + FilterBlocksStyles.explanationModalHidden
    return (
        <div className={openModalStyles}>
            <div className={FilterBlocksStyles.explanationModal}>
                <div className={FilterBlocksStyles.explanationModalTop}>
                    <p className={FilterBlocksStyles.explanationModalTitle}>АБСОЛЮТНО БЕСПЛАТНЫЙ ШИНОМОНТАЖ</p>
                    <img src={closeModal} alt="close modal" onClick={() => dispatch(explanationToggle(false))} />
                </div>
                <div className={FilterBlocksStyles.explanationModalContent}>
                    <div className={FilterBlocksStyles.explanationModalText}>
                        <p className={FilterBlocksStyles.explanationModalText_first}>
                            Бесплатный шиномонтаж в нашем салоне без забот и лишних затрат:
                            покупайте комплект из 4 шин или дисков и получите монтаж в подарок!
                        </p>
                        <p className={FilterBlocksStyles.explanationModalText_second}>
                            Дарим весь комплекс необходимых работ:
                        </p>
                        <p className={FilterBlocksStyles.explanationModalText_third}>
                            <ul>
                                <li>снятие и установка колес</li>
                                <li>мойка колес</li>
                                <li>демонтаж и монтаж шины на колесный диск</li>
                                <li>балансировка колес</li>
                                <li>смазка ступицы</li>
                                <li>замена вентилей (если требуется)</li>
                                <li>грузики</li>
                            </ul>
                        </p>
                    </div>
                    <img className={FilterBlocksStyles.tiresModalImg} src={tires} alt="" />
                </div>
            </div>
        </div>
    )
}
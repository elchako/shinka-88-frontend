import React from "react";
import AboutUsStyles from "./AboutUsStyles.module.scss";
import { Footer } from "../../footer/Footer";
import { Helmet } from "react-helmet-async";

export const AboutUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Шинка88 - О нас</title>
      </Helmet>
      <div className={AboutUsStyles.mainWrapper}>
        <div className={AboutUsStyles.content}>

          <div className={AboutUsStyles.paragraph}>
            <p className={AboutUsStyles.title}>БОЛЕЕ 20 ЛЕТ С ВАМИ</p>
            <p className={AboutUsStyles.text}>
              Компания <strong>«Шинка 88»</strong> работает в Егорьевске с <strong>2000 года</strong>.<br />
              Уже <strong>более 20 лет</strong> мы помогаем автолюбителям и профессиональным водителям.<br />
              За эти годы мы заслужили <strong>доверие</strong> тысяч клиентов.<br />
              Нас выбирают за <strong>опыт, надёжность и честное отношение к каждому покупателю</strong>.
            </p>
          </div>

          <div className={AboutUsStyles.paragraph}>
            <p className={AboutUsStyles.title}>ТОВАРЫ И УСЛУГИ</p>
            <p className={AboutUsStyles.text}>
              В компании <strong>«Шинка 88»</strong> вы найдёте всё необходимое для обслуживания вашего автомобиля:
            </p>
            <p className={AboutUsStyles.text}>
              - шины для легковых и грузовых машин,<br />
              - стальные и литые диски,<br />
              - моторные масла,<br />
              - аккумуляторы.
            </p>
            <p className={AboutUsStyles.text}>
              Мы работаем <strong>напрямую с проверенными поставщиками</strong>, поэтому у нас:<br />
              - всегда в наличии популярные размеры и марки,<br />
              - только качественная и сертифицированная продукция,<br />
              - разумные цены без лишней наценки.
            </p>
          </div>

          <div className={AboutUsStyles.paragraph}>
            <p className={AboutUsStyles.text}>
              Помимо товаров, мы предоставляем <strong>профессиональные услуги</strong>:<br />
              - шиномонтаж,<br />
              - балансировка,<br />
              - замена резины,<br />
              - мелкий ремонт и техобслуживание.
            </p>
            <p className={AboutUsStyles.text}>
              Все работы выполняют <strong>опытные мастера</strong>, быстро и аккуратно, с гарантией.<br />
              Вы можете быть уверены: ваш автомобиль — в надёжных руках.
            </p>
          </div>

          <div className={AboutUsStyles.paragraph}>
            <p className={AboutUsStyles.title}>ЦЕНИМ СВОИХ КЛИЕНТОВ</p>
            <p className={AboutUsStyles.text}>
              С первого дня работы для нас главное — <strong>довольный клиент</strong>.<br />
              Мы благодарны всем, кто выбирает нас снова и снова, и всегда рады новым покупателям.
            </p>
            <p className={AboutUsStyles.text}>Нас ценят за:</p>
            <p className={AboutUsStyles.text}>
              - надёжность,<br />
              - внимательное отношение,<br />
              - быстрое обслуживание и доступные цены.
            </p>
            <p className={AboutUsStyles.text}>
              Мы постоянно улучшаем сервис, расширяем ассортимент и контролируем качество, чтобы вы могли уверенно обращаться к нам по любому автовопросу.
            </p>
            <p className={AboutUsStyles.text}><strong>«Шинка 88» — здесь вам всегда помогут.</strong></p>
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
};

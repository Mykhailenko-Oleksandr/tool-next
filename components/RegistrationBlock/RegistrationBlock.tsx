

import Image from 'next/image';
import css from './RegistrationBlock.module.css';
import Link from 'next/link';



export default function RegistrationBlock() {

  

  return (
    <section className={css.registrationBlockSection} id="registration-block"> 
    <div className={`${css.contentWrapper} container`}>

        <div className={css.textAndButton}>
          <div className={css.textContent}>
          <h1 className={css.title}>Зареєструйтесь і отримайте доступ до інструментів поруч із вами</h1>
          <p className={css.description}>Не витрачайте гроші на купівлю — орендуйте зручно та швидко.
          Приєднуйтесь до ToolNext вже сьогодні!</p>
          </div>
         <Link href="/auth/register" className={css.buttonRegister}>Зареєструватися</Link>
        </div>
      

<picture className={css.imageBlock}>
  <source 
    srcSet="/images/home-down-desk.jpg 1x, /images/home-down-desk@2x.jpg 2x" 
    media="(min-width: 1440px)" 
  />
  <source 
    srcSet="/images/home-down-tab.jpg, /images/home-down-tab@2x.jpg 2x" 
    media="(min-width: 768px)" 
  />
    <source 
    srcSet="/images/home-down-mob.jpg, /images/home-down-mob@2x.jpg 2x" 
    media="(min-width: 375px)" 
  />
  
  <Image
    src="/images/home-down-desk.jpg" 
    alt="Tool's workshop"
    fill={true}
  />
</picture>
</div>
    </section>
  );
}

// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { Header } from '../header/header';
// import { getExampleById, Item, AppStore } from 'state';
// import styles from './Detail.module.scss';

// export interface DetailProps {
//     item: Item | null
// }

// export const DetailContainer: React.FC<DetailProps> = (props) => {

//     return (
//         <section className={styles.component}>
//             <Header title={item ? item.title : 'Detail'} />
//             <main className={styles.main}>
//                 <div className={styles.text}>
//                     <h1>
//                         {item ? item.title : 'Nothing Selected'}
//                     </h1>
//                     <h2>
//                         Detail Page
//                     </h2>
//                 </div>
//             </main>
//         </section>
//     );
// };

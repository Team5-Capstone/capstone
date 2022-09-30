/* eslint-disable prettier/prettier */
import React from 'react';
import { connect } from 'react-redux';
import '../style.css';
import { Link } from 'react-router-dom';
import TextSection from './TextSection';
import GridSection from './GridSection';

/**
 * COMPONENT
 */
export const Home = ({ isLoggedIn }) => {
  return (
    <div className='w-full'>
      <section className=''>
        <div className='left-0 mt-[-72px] flex min-h-[70vh] w-full flex-col items-center justify-center border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 pt-[72px]'>
          <div className='max-w-[700px] py-10 text-center lg:w-3/4'>
            <p className='py-4 text-center font-inter leading-normal text-lime-400'>
              Welcome to TestBrew
            </p>
            <h1 className='text-center text-[64px] leading-tight'>
              <b>The quickest way to learn unit testing</b>
            </h1>
            <h3 className='pt-8 text-center text-[24px] leading-normal text-slate-500'>
              TestBrew helps you learn the fundamental syntax of some of the
              most popular testing languages. Learn to write unit tests today!
            </h3>
            <p className='inline-block py-8 text-center leading-normal text-slate-300'>
              Select a language to get started:
            </p>
            <div className='mt-2 mb-6 flex items-center justify-center gap-10'>
              <svg
                width='64'
                height='72'
                viewBox='0 0 88 96'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='lang-logo-active group transition-all'>
                <path
                  d='M83.7399 47.2664C83.7399 41.8387 79.8258 37.3098 74.6699 36.3424L87.0029 0H28.7062L41.0579 36.4161C36.0814 37.5227 32.3484 41.966 32.3484 47.2664C32.3484 51.2469 34.4538 54.7433 37.6094 56.7079C36.0916 58.967 34.2917 61.0929 32.2291 63.0368C28.9584 66.1199 25.3141 68.4581 21.3854 69.9962C17.4285 67.5128 15.7557 62.8297 17.493 58.7497L17.629 58.4305C17.7139 58.2308 17.7992 58.0305 17.8842 57.8301C22.2303 56.3161 25.3586 52.1827 25.3586 47.3306C25.3586 41.2 20.3665 36.2127 14.2304 36.2127C8.09434 36.2127 3.10255 41.2 3.10255 47.3306C3.10255 50.4249 4.3753 53.2269 6.42395 55.2445C6.05249 56.0356 5.66199 56.8397 5.26063 57.6634C3.38735 61.5075 1.26427 65.8646 0.461195 70.7028C-1.13374 80.3118 1.43862 87.9931 7.70452 92.3318C11.5068 94.9647 15.3679 96.0003 19.2535 96C26.5702 95.9997 33.9712 92.3274 41.2101 88.735C46.4239 86.1479 51.8146 83.4726 57.1398 82.1606C59.1212 81.6723 61.16 81.3786 63.3184 81.0676C67.5985 80.4506 72.0248 79.813 75.9453 77.5444C80.4895 74.9146 83.6006 70.5032 84.4801 65.4415C85.2353 61.0963 84.3262 56.7446 82.1096 53.0537C83.1431 51.3668 83.7399 49.3852 83.7399 47.2664ZM79.3714 47.2664C79.3714 50.9902 76.3392 54.0201 72.6117 54.0201C68.8849 54.0201 65.8523 50.9902 65.8523 47.2664C65.8523 43.5426 68.8849 40.5131 72.6117 40.5131C76.3392 40.5131 79.3714 43.5426 79.3714 47.2664ZM80.9089 4.36458L70.0183 36.4565C69.5462 36.5696 69.0861 36.7122 68.6391 36.8836L57.8807 14.9562L47.091 36.7539C46.6247 36.5933 46.1448 36.4612 45.6527 36.3634L34.7995 4.36458H80.9089ZM43.4763 40.5131C47.2035 40.5131 50.2357 43.5426 50.2357 47.2664C50.2357 50.9902 47.2035 54.0201 43.4763 54.0201C39.7494 54.0201 36.7169 50.9902 36.7169 47.2664C36.7169 43.5426 39.7494 40.5131 43.4763 40.5131ZM14.2304 40.5773C17.9579 40.5773 20.9901 43.6067 20.9901 47.3306C20.9901 51.0544 17.9579 54.0842 14.2304 54.0842C10.5036 54.0842 7.47104 51.0544 7.47104 47.3306C7.47104 43.6067 10.5036 40.5773 14.2304 40.5773ZM80.1759 64.6948C79.5182 68.4801 77.178 71.787 73.7557 73.7673C70.5654 75.6134 66.7424 76.1645 62.6947 76.7475C60.5265 77.0599 58.2841 77.3831 56.0937 77.923C50.3019 79.3498 44.692 82.1338 39.2668 84.8261C28.4102 90.2137 19.0339 94.8662 10.1933 88.7445C3.71735 84.2604 4.01642 75.9635 4.7709 71.4169C5.46998 67.2048 7.36025 63.3254 9.18833 59.5737C9.50473 58.9245 9.81196 58.2885 10.1134 57.6566C11.0201 58.0189 11.9843 58.2658 12.9893 58.3778C11.1286 64.5139 14.0551 71.1853 20.1972 74.3381L21.0377 74.7696L21.9281 74.4528C26.784 72.7252 31.2582 69.9524 35.227 66.2116C37.7926 63.7937 39.9972 61.1183 41.81 58.2597C42.3537 58.3415 42.9101 58.3846 43.4763 58.3846C49.6124 58.3846 54.6045 53.3973 54.6045 47.2664C54.6045 43.9694 53.1591 41.0044 50.8698 38.9664L57.8634 24.8371L64.9279 39.2357C62.8083 41.2615 61.4838 44.1113 61.4838 47.2664C61.4838 53.3973 66.4756 58.3846 72.6117 58.3846C74.9693 58.3846 77.1563 57.6464 78.9575 56.3922C80.2081 58.95 80.6741 61.828 80.1759 64.6948Z'
                  fill='white'
                />
              </svg>

              <svg
                width='62'
                height='72'
                viewBox='0 0 85 96'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='lang-logo group transition-all'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M44.8407 95.3043L81.9478 73.8679C83.4939 72.9404 84.4731 71.2399 84.5247 69.4364V26.5636C84.5247 24.7601 83.5454 23.0596 81.9478 22.132L44.8407 0.695652C43.243 -0.231884 41.2846 -0.231884 39.6869 0.695652L2.57981 22.132C0.982145 23.0596 0.00292969 24.7085 0.00292969 26.5636V69.4364C0.00292969 71.2399 0.982145 72.9404 2.57981 73.8679L39.6869 95.3043C41.2846 96.2319 43.243 96.2319 44.8407 95.3043ZM43.6553 8.47669C43.1915 8.21904 42.7277 8.06445 42.2123 8.06445C41.7484 8.06445 41.2331 8.21904 40.7692 8.47669L8.71282 26.9759C7.83668 27.4912 7.26976 28.4702 7.26976 29.5008V66.4992C7.26976 67.5298 7.83668 68.5089 8.71282 69.0242L40.7692 87.5234C41.1815 87.781 41.6969 87.9356 42.2123 87.9356C42.7277 87.9356 43.1915 87.781 43.6553 87.5234L75.7118 69.0242C76.5879 68.5089 77.1548 67.5298 77.1548 66.4992V29.5008C77.1548 28.4702 76.5879 27.4912 75.7118 26.9759L43.6553 8.47669ZM39.9962 7.13691C40.6662 6.72467 41.4392 6.51855 42.2123 6.51855C42.9854 6.51855 43.7584 6.72467 44.4284 7.13691L76.4848 25.6361C77.8763 26.4091 78.7009 27.8519 78.7009 29.4493V66.4477C78.7009 67.9936 77.8763 69.488 76.4848 70.2609L44.4284 88.7601C43.7584 89.1723 42.9854 89.3785 42.2123 89.3785C41.4392 89.3785 40.6662 89.1723 39.9962 88.7601L7.93975 70.2609C6.54823 69.488 5.72363 68.0451 5.72363 66.4477V29.4493C5.72363 27.9034 6.54823 26.4091 7.93975 25.6361L39.9962 7.13691ZM46.7733 29.4492C46.7733 29.1915 46.5671 28.9339 46.2579 28.9339H36.5688C36.3112 28.9339 36.0535 29.14 36.0535 29.4492C36.0535 31.2012 36.3112 37.2302 38.888 40.1674C38.9911 40.2704 39.0942 40.3219 39.2488 40.3219H43.578C43.7326 40.3219 43.8357 40.2704 43.9387 40.1674C46.5156 37.2817 46.7733 31.2527 46.7733 29.4492ZM42.9595 38.8276H39.9188C39.7642 38.8276 39.6611 38.7761 39.558 38.673C37.8057 36.6118 37.5996 32.4894 37.5481 31.0466C37.5481 30.7889 37.7542 30.5313 38.0634 30.5313H44.8664C45.1241 30.5313 45.3818 30.7374 45.3818 31.0466C45.3818 32.4894 45.1241 36.5603 43.3718 38.673C43.2172 38.7761 43.1141 38.8276 42.9595 38.8276ZM42.3926 27.9033C42.3926 27.9033 44.248 26.8211 43.1141 24.863C42.4441 23.8324 42.1349 22.9564 42.3926 22.5957C42.3155 22.6905 42.2323 22.786 42.1473 22.8836C41.4931 23.6346 40.731 24.5096 41.8257 26.1513C42.238 26.615 42.4441 27.5941 42.3926 27.9033ZM40.3311 28.0579C40.3311 28.0579 41.568 27.3364 40.7949 25.9967C40.3534 25.3589 40.1453 24.7679 40.3042 24.5348L40.3311 24.5023C40.3212 24.5122 40.3122 24.523 40.3042 24.5348C40.2631 24.5841 40.2203 24.6335 40.177 24.6835L40.1769 24.6836C39.7316 25.1975 39.2332 25.7726 39.9703 26.9242C40.228 27.1819 40.3311 27.8517 40.3311 28.0579ZM43.0626 38.055C43.9388 37.0244 44.3511 35.4269 44.5572 34.0356C44.5572 34.0356 44.5057 34.4994 43.2688 34.9632C41.568 35.5815 38.5789 35.1693 38.5789 35.1693C38.8365 36.2514 39.2488 37.282 39.8673 38.055C39.9188 38.158 40.0734 38.2096 40.1765 38.2096H42.7534C42.8565 38.2096 42.9596 38.158 43.0626 38.055ZM10.697 42.3834H12.6039L15.7477 47.2272L18.8915 42.3834H20.7984V52.6893H18.9946V45.3206L15.7477 50.1644H15.6962L12.5008 45.3721V52.7409H10.697V42.3834ZM30.1267 52.8439C29.3536 52.8439 28.6321 52.6893 27.9621 52.4317C27.2921 52.174 26.7252 51.7618 26.2614 51.298C25.7976 50.8343 25.4368 50.2674 25.1791 49.5975C24.9214 48.9792 24.7668 48.2578 24.7668 47.5363V47.4848C24.7668 46.7634 24.9214 46.0935 25.1791 45.4236C25.4368 44.8053 25.7976 44.2384 26.3129 43.7231C26.7768 43.2594 27.3437 42.8471 28.0137 42.5895C28.6837 42.2803 29.4052 42.1772 30.1783 42.1772C30.9513 42.1772 31.6728 42.3318 32.3428 42.5895C33.0128 42.8471 33.5797 43.2594 34.0436 43.7231C34.5074 44.1869 34.8682 44.7537 35.1259 45.4236C35.3836 46.042 35.5382 46.7634 35.5382 47.4848V47.5363C35.5382 48.2578 35.3836 48.9277 35.1259 49.5975C34.8682 50.2159 34.5074 50.7827 33.992 51.298C33.5282 51.7618 32.9613 52.174 32.2913 52.4317C31.6213 52.7409 30.8998 52.8439 30.1267 52.8439ZM30.1267 51.195C30.6421 51.195 31.1059 51.0919 31.5182 50.8858C31.9305 50.6797 32.2913 50.422 32.6005 50.1128C32.9097 49.8037 33.1159 49.3914 33.3221 48.9792C33.4767 48.5154 33.5797 48.0516 33.5797 47.5879V47.5363C33.5797 47.021 33.4767 46.5573 33.3221 46.0935C33.1674 45.6297 32.9097 45.269 32.6005 44.9083C32.2913 44.5991 31.9305 44.3415 31.5182 44.1354C31.1059 43.9293 30.6421 43.8262 30.1267 43.8262C29.6113 43.8262 29.1475 43.9293 28.7352 44.1354C28.3229 44.3415 27.9621 44.5991 27.6529 44.9083C27.3437 45.2175 27.1375 45.6297 26.9314 46.042C26.7768 46.5057 26.6737 46.9695 26.6737 47.4333V47.4848C26.6737 48.0001 26.7768 48.4639 26.9314 48.9277C27.086 49.3914 27.3437 49.7521 27.6529 50.1128C27.9621 50.422 28.3229 50.6797 28.7352 50.8858C29.1475 51.0919 29.6629 51.195 30.1267 51.195ZM44.248 52.8439C43.475 52.8439 42.805 52.6893 42.1865 52.4317C41.5681 52.174 41.0012 51.7618 40.5373 51.298C40.0735 50.8343 39.7127 50.2674 39.455 49.5975C39.1973 48.9277 39.0427 48.2578 39.0427 47.5363V47.4848C39.0427 46.7634 39.1973 46.042 39.455 45.4236C39.7127 44.8053 40.0735 44.2384 40.5373 43.7231C41.0012 43.2594 41.5681 42.8471 42.2381 42.5895C42.9081 42.3318 43.578 42.1772 44.4026 42.1772C44.8665 42.1772 45.2788 42.2288 45.6911 42.2803C45.9659 42.349 46.195 42.4177 46.424 42.4864L46.4248 42.4866C46.5391 42.5209 46.6534 42.5552 46.7734 42.5895C47.0826 42.7441 47.3918 42.8987 47.6495 43.1048L47.6496 43.1049C47.9073 43.311 48.1649 43.5171 48.4226 43.7747L47.2372 45.1144C46.8249 44.7537 46.4126 44.4446 45.9488 44.1869C45.4849 43.9293 44.9696 43.8262 44.3511 43.8262C43.8357 43.8262 43.4234 43.9293 43.0111 44.1354C42.5988 44.3415 42.2381 44.5991 41.9288 44.9083C41.6196 45.2175 41.4135 45.6297 41.2073 46.0419L41.2073 46.042C41.0527 46.5057 40.9496 46.9695 40.9496 47.4333V47.4848C40.9496 48.0001 41.0527 48.4639 41.2073 48.9277C41.3619 49.3914 41.6196 49.7521 41.9288 50.1128C42.2381 50.422 42.5988 50.7312 43.0111 50.8858C43.4234 51.0404 43.8873 51.195 44.3511 51.195C44.9696 51.195 45.5365 51.0919 45.9488 50.8343C46.3611 50.5766 46.8249 50.2674 47.2888 49.8552L48.4741 51.0404C48.2365 51.3255 47.9988 51.523 47.7208 51.754L47.6495 51.8133C47.3403 52.071 47.0311 52.2256 46.7218 52.3801C46.4126 52.5347 46.0003 52.6893 45.6395 52.7409C45.1757 52.8439 44.7119 52.8439 44.248 52.8439ZM52.0818 42.3834H53.8856V46.6603H58.8332V42.3834H60.637V52.6893H58.8332V48.3608H53.8856V52.6893H52.0818V42.3834ZM68.6253 42.3318H70.2745L74.8099 52.6893H72.903L71.8722 50.2159H67.0277L65.9454 52.6893H64.09L68.6253 42.3318ZM71.2022 48.6185L69.4499 44.4961L67.6977 48.6185H71.2022ZM75.1192 55.9353H9.40869V56.5021H75.1192V55.9353ZM47.1858 36.5601H75.1192V37.1269H47.1343C47.1343 37.0238 47.1471 36.9336 47.16 36.8435C47.1729 36.7533 47.1858 36.6631 47.1858 36.5601ZM9.40869 37.1269V36.5601H35.6929C35.6929 36.6631 35.7058 36.7533 35.7187 36.8435C35.7315 36.9336 35.7444 37.0238 35.7444 37.1269H9.40869Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
              </svg>

              <svg
                width='90'
                height='68'
                viewBox='0 0 126 96'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='lang-logo group transition-all'>
                <path
                  d='M45.8508 30.0896V0H73.7911V26.5075L91.7016 0H122.508L90.6927 45.8507L75.7796 67.3433L73.7911 70.209V96H63.7613L45.8508 30.0896Z'
                  fill='#747C8B'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M15.0448 83.1047L0 30.8062L22.209 55.8808L36.5373 42.9853L15.0448 83.1047Z'
                  fill='#747C8B'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M51.582 95.9998L36.5372 42.9849L15.0447 83.1043L28.6566 69.4923L51.582 95.9998Z'
                  fill='#585E6A'
                  className='transition-all group-hover:fill-white/50'
                />
                <path
                  d='M94.5671 96L75.9402 66.6268L90.985 45.1343L125.373 96H94.5671Z'
                  fill='#585E6A'
                  className='transition-all group-hover:fill-white/50'
                />
              </svg>

              <svg
                width='72'
                height='72'
                viewBox='0 0 97 96'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='lang-logo group transition-all'>
                <path
                  d='M44.8041 39.75H52.2391L54.086 37.2074V17.2888H42.9578V37.2089L44.8041 39.75Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M40.0117 48.6338L42.3089 41.5631L40.4613 39.02L21.5176 32.8649L18.0786 43.4487L37.0251 49.6045L40.0117 48.6338Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M46.9798 55.9384L40.9655 51.5667L37.9761 52.5396L26.2683 68.6542L35.2708 75.1943L46.9798 59.0788V55.9384Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M56.0796 51.5667L50.064 55.9367L50.0649 59.0794L61.7723 75.1943L70.7759 68.6542L59.0661 52.538L56.0796 51.5667Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M54.7332 41.5623L57.0316 48.6343L60.0207 49.604L78.9645 43.4498L75.526 32.8661L56.581 39.0222L54.7332 41.5623Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M48.5243 -2.13871e-06C22.0577 -2.13871e-06 0.524658 21.5291 0.524658 47.992C0.524658 74.4645 22.0577 96 48.5243 96C74.9886 96 96.5185 74.4645 96.5185 47.992C96.5185 21.5291 74.9886 -2.13871e-06 48.5243 -2.13871e-06ZM48.5243 9.71749C69.6595 9.71749 86.8002 26.8511 86.8002 47.992C86.8002 69.14 69.6595 86.2809 48.5243 86.2809C27.3808 86.2809 10.2431 69.14 10.2431 47.992C10.2431 26.8511 27.3808 9.71749 48.5243 9.71749Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M77.5947 58.6597L63.1941 53.9799L64.1468 51.0462L78.5467 55.726L77.5947 58.6597Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M59.2284 35.5415L56.7332 33.7288L65.6323 21.4781L68.1282 23.2903L59.2284 35.5415Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M37.969 35.4282L29.0708 23.1779L31.5667 21.3649L40.465 33.6159L37.969 35.4282Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M19.3898 58.4766L18.4373 55.5435L32.8368 50.8662L33.7889 53.7993L19.3898 58.4766Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
                <path
                  d='M46.8848 78.5928H49.9686V63.4511H46.8848V78.5928Z'
                  fill='#6B7280'
                  className='transition-all group-hover:fill-white/70'
                />
              </svg>
            </div>
            <Link
              to={isLoggedIn ? '/jest' : '/login'}
              className='filled-button group my-6 inline-flex items-center gap-4 rounded-lg bg-gradient-to-r from-lime-500 to-lime-400 px-8 py-4 text-[18px] text-slate-900 transition-all'>
              {isLoggedIn ? 'Continue your progress' : 'Get started for free'}
              <svg
                // className='transition-all group-hover:ml-4'
                width='17'
                height='18'
                viewBox='0 0 17 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M1.48022 8.87939H14.5'
                  stroke='#101827'
                  strokeWidth='2'
                  strokeLinecap='square'
                  strokeLinejoin='round'
                />
                <path
                  d='M8.48022 1.87939L15.4802 8.87939L8.48022 15.8794'
                  stroke='#101827'
                  strokeWidth='2'
                  strokeLinecap='square'
                />
              </svg>
            </Link>
          </div>
        </div>
        <div id='modal-root'></div>
      </section>
      <GridSection />
      <TextSection />
      {/* <section className='mx-auto min-h-screen max-w-[1440px]'>
        <div className='py-8'>
          <p className='font-black'>What is a unit test?</p>

          <p>
            A unit test should test the behaviour of a given input, expecting a
            specific end result. Unit tests should be:
          </p>
          <div>
            <ul className='list-decimal pl-4'>
              <li>Repeatable</li>
              <li>Fast</li>
              <li>Consistent</li>
              <li>Easy to write and read</li>
            </ul>
          </div>
        </div>
      </section> */}
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);

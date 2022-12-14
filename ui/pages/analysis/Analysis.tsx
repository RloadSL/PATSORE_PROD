/* eslint-disable react-hooks/exhaustive-deps */
import ButtonApp from 'components/ButtonApp'

import { NextPage } from 'next'
import React, { Suspense, useEffect, useState } from 'react'
import style from './Analysis.module.scss'
import addArticleIcon from '../../../assets/img/icons/add-document.svg'
import { FormattedMessage } from 'react-intl'
import SubscriptionBanner from 'components/SubscriptionBanner'
import bannerImage from '../../../assets/img/banner.png'
import WPCategory from 'components/WPCategory'
import CreateFormArticle from './components/CreateFormArticle'
import { AnalysisRepositoryInstance } from 'infrastructure/repositories/analysis.repository'
import { useSelector } from 'react-redux'
import { getUserLogged } from 'ui/redux/slices/authentication/authentication.selectors'
import { useRouter } from 'next/router'
import { useGuardPermissions } from 'ui/hooks/guard.permissions.hook'
import CategoriesMap from './components/CategoriesMap'
import CreateCategoryAnalysis from './components/CreateCategoryAnalysis'

const Analysis: NextPage<any> = () => {
  const [wpCategories, setWpCategories] = useState<Array<any>>([])
  const [artOutsanding, setartOutsanding] = useState([])
  const [loading, setLoading] = useState<boolean>(true)

  const userLogged = useSelector(getUserLogged)
  const router = useRouter()
  const { editionGranted } = useGuardPermissions()

  useEffect(() => {
    let fetching = true
    if (userLogged?.uid) {
      AnalysisRepositoryInstance.getCategories().then(categories => {
        if (fetching) {
          setWpCategories(categories as Array<any>)
        }
      })
    }

    AnalysisRepositoryInstance.getOutstandingArticles().then(res => setartOutsanding(res))

    if (Object.keys(router.query).length > 0) {
      router.replace('/research/bitcoins-altcoins', undefined, { shallow: true })
    }

    return () => {
      fetching = false
    }
  }, [])

  const _getCategories = () => {
    setLoading(true)
    AnalysisRepositoryInstance.getCategories().then(categories => {
      setWpCategories(categories as Array<any>)
      setLoading(false)
    })
  }

  return (
    <AnalysisView
      getCategories={_getCategories}
      editionGranted={editionGranted}
      categories={wpCategories}
      artOutsanding={artOutsanding}
    ></AnalysisView>
  )
}

const AnalysisView = ({ categories, editionGranted, getCategories, artOutsanding }: any) => {
  const [create, setCreate] = useState(false)
  const [createCategory, setCreateCategory] = useState(false)

  //El contenido del banner lo monto desde el padre para que sea totalmente configurable ya que no se qu?? mostrar?? en cada banner
  const BannerContentColLeft = () => {
    return (
      <div className={style.bannerColLeft}>
        <p className={style.subtitle}>
          Upgrade to <strong>Pastore Capital</strong>
        </p>
        <p className={style.title}>
          Unlock <strong>Everything</strong>
        </p>
      </div>
    )
  }

  const BannerContentColRight = () => {
    return (
      <div className={style.bannerColRight}>
        <ul className={style.list}>
          <li>Exclusive long-form daily research</li>
          <li>Daily crypto news and insights in your inbox</li>
          <li>CSV data exports</li>
        </ul>
      </div>
    )
  }

  const renderBanners = (index: number) => {
    return (
      <div key={index}>
        {
          index % 2 === 0 ? (
            <SubscriptionBanner
              
              linkHref={'#'}
              colLeftContent={BannerContentColLeft()}
              colRightContent={BannerContentColRight()}
              backgroundColor={'#DADDE5'}
            />
          ) : (
            <SubscriptionBanner
            
              linkHref={'#'}
              image={bannerImage}
              colLeftContent={BannerContentColLeft()}
              colRightContent={<div className={style.fakeButton}>Learn More</div>}
              backgroundColor={'#DADDE5'}
            />
          )
        }
      </div>
    )
  }

  return (
    <div className={style.analysisPage}>
      <header>
        <p className={`main-title`}>
          <FormattedMessage id='page.analysis.title' />
        </p>
      </header>
      <CategoriesMap
        onCreate={() => setCreateCategory(true)}
        editionGranted={editionGranted}
        categories={categories.map((item: any, index:number) => item.term)}
      />
      
      <WPCategory
        componentStyle={'flex'}
        category={{name: 'Art??culos destacados', slug:'art-outstanding', metas: false}}
        posts = {artOutsanding}
        
      />
      {artOutsanding.length > 0 && renderBanners(1)}
      {categories.map((WPterm: any, index: number) => {
        const { term } = WPterm
        return (
          <div key={term.term_id}>
            <WPCategory
              componentStyle={'grid'}
              category={term}
            />
            {renderBanners(index)}
          </div>
        )
      })}

      <div className={style.addNewArticle}>
        {editionGranted && (
          <ButtonApp
            onClick={() => setCreate(!create)}
            labelID='page.analysis.articles.form.create.title'
            buttonStyle='primary'
            icon={addArticleIcon}
          />
        )}
        {create && (
          <Suspense>
            <CreateFormArticle
              onClose={() => {
                setCreate(false)
              }}
            ></CreateFormArticle>
          </Suspense>
        )}
        {createCategory && (
          <Suspense>
            <CreateCategoryAnalysis
              onClose={() => {
                setCreateCategory(false)
                getCategories()
              }}
            ></CreateCategoryAnalysis>
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default Analysis

import Breadcrumbs from 'components/Breadcrumbs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from 'ui/redux/slices/authentication/autentication.slice'
import { getUserLogged } from 'ui/redux/slices/authentication/authentication.selectors'
import { AppDispatch } from 'ui/redux/store'
import style from './NavBar.module.scss'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import { useComponentUtils } from 'ui/hooks/components.hooks'
import Notifications from 'components/Notifications'
import useWindowSize from 'ui/hooks/windowSize.hook'
/**
 * OJO crear un interface
 * @returns 
 */
const NavBar = () => {
  const windowSize = useWindowSize();
  const dispatch = useDispatch<AppDispatch>()

  const user = useSelector(getUserLogged)
  const { limitTextLength } = useComponentUtils()
  const router = useRouter()

  const _signOutUser = () => {
    router.push('/');
    dispatch(signOut())
  }

  return (
    <NavBarView
      userName={user && user.uid != 'not-logged' ? limitTextLength(20, `${user?.name} ${user?.lastname}`) : undefined}
      userRole={user && user.uid != 'not-logged' ? user.role.label : undefined}
      userPlan={user && user.uid != 'not-logged' ? user.subscription.plan.label : undefined}
      signOut={user && user.uid != 'not-logged' ? () => _signOutUser() : () => null}
      linkToSignIn={!user ? router.route !== '/login' : undefined}
      back={router.route !== '/' ? router.back : undefined}
      windowSize={windowSize}
    />
  )
}

const NavBarView = ({
  back,
  signOut,
  userName,
  userRole,
  linkToSignIn,
  userPlan,
  windowSize
}: {
  back?: Function
  userName?: string
  linkToSignIn?: boolean
  signOut: Function,
  userRole?: string,
  userPlan?: string
  windowSize: any
}) => {

  return (
    <div className={style.navbarContainer}>
      {windowSize.width >= 1080 ? <Breadcrumbs /> : (
        <div className={style.backButton}>
          <button onClick={() => back ? back() : null}>
            <span className='only-readers'><FormattedMessage id='component.navbar.backbuttom' /></span>
          </button>
        </div>
      )}
      <div className={style['navbar-item']}></div>
      {!userName && (
        <Link href={'/login'}>
          <a className={style.loginLink}>
            <FormattedMessage id='component.navbar.signUpBtn' />
          </a>
        </Link>
      )}
      {userName && (
        <div className={`${style.userInfoContainer} flex-container`}>
          <div><Notifications hasNotifications={true} /></div>
          <div className='flex-container'>
            <div className={style.userInfo}>
              <p className={style.userName}>{userName || ''}</p>
              <p className={style.userProfile}><FormattedMessage id={`role.${userRole}`} /> {userRole === 'User' && <FormattedMessage id={`plan.${userPlan}`} />}</p>
            </div>
            <div className={style.optionsMenu}>
              <Menu
                align='end'
                offsetY={5}
                menuButton={
                  <button className={style.optionsButton}>
                    <span className='only-readers'>opciones</span>
                  </button>
                }
              >
                <MenuItem onClick={() => console.log('hola')}><FormattedMessage id='component.navbar.profile' /></MenuItem>
                <MenuItem onClick={() => signOut()}>
                  <FormattedMessage id='component.navbar.signOutBtn' />
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar

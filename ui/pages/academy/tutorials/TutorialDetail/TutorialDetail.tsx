import style from './TutorialDetail.module.scss'
import { PostDto } from 'infrastructure/dto/course.dto'
import { WP_EDIT_POST } from 'infrastructure/wordpress/config'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getUserLogged } from 'ui/redux/slices/authentication/authentication.selectors'
import parse from 'html-react-parser'
import ReadingProgressBar from 'components/ReadingProgressBar'
/* import CommentsList from 'components/Comments' */
import SidebarCollapsable from 'components/SidebarCollapsable'
import ButtonApp from 'components/ButtonApp'
import LinkApp from 'components/LinkApp'
import iconEdit from '../../../../../assets/img/icons/pencil.svg'
import iconDelete from '../../../../../assets/img/icons/trash.svg'


const TutorialDetail: NextPage<any> = ({ post }: { post: PostDto }) => {
  const router = useRouter()
  const loggedUser = useSelector(getUserLogged)
  /*  useEffect(() => {
     window.addEventListener('contextmenu', function (e) { 
       // do something here... 
       e.preventDefault(); 
     }, false);
   }, []) */
  useEffect(() => {
    if (!post) {
      router.replace('/academy/tutorials')
    }
  }, [post])

  const editLink = (token?: string) => {
    return token ? `${WP_EDIT_POST}?post=${post.id}&action=edit&?&token=${token}` : undefined;
  }

  return post ? <LessonDetailView
    courseTitle={router.query.courseTitle as string}
    ispublisherized={loggedUser?.wpToken != null}
    post={post}
    editLink={editLink(loggedUser?.wpToken)}
  /> : <></>
}

const LessonDetailView = ({
  post,
  courseTitle,
  ispublisherized,
  editLink,

}: {
  post: any
  ispublisherized: boolean
  editLink?: string,
  courseTitle: string

}) => {
  const contentRef = useRef<any>();

  return (
    <div className={style.lessonPage} ref={contentRef}>
      <ReadingProgressBar target={contentRef} />
      <div className={style.readingContainer}>
        {post && editLink ? (
          <div className='admin-buttons-wrapper'>
            <div className='admin-buttons-container'>
              <LinkApp label={'edit'} linkStyle={'edit'} linkHref={editLink} icon={iconEdit} />
              <ButtonApp labelID={'btn.delete'} onClick={() => console.log('borrar')} type='button' buttonStyle='delete' size='small' icon={iconDelete} />
            </div>
          </div>
        ) : null}
        <div>
          <p className='small-caps'>{courseTitle}</p>
          <h1 className='main-title'>{post.title.rendered}</h1>
        </div>
        <div className={style.post}>{parse(post.content?.rendered || '')}</div>
      </div>
    </div>
  )
}

export default TutorialDetail;
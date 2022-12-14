import FormApp from 'components/FormApp'
import InputApp from 'components/FormApp/components/InputApp'
import SelectApp from 'components/FormApp/components/SelectApp/SelectApp'
import style from './FilterTutorials.module.scss'
import searchIcon from '../../../../../../../assets/img/icons/glass.svg'
import React, { useEffect, useState } from 'react'
import { CourseRepositoryInstance } from 'infrastructure/repositories/courses.repository'
import { debounce } from 'lodash'
import { getTagsFromServer } from 'infrastructure/wordpress/wp.utils'
import Card from 'components/Card'

const FilterTutorials = ({ onFilter }: any) => {
  //const [levels, setlevels] = useState([])
  const [tags, setTags] = useState([])

  //Levels
  /* useEffect(() => {
    let fetching = true
    getLevels()
      .then(res => {
        if (fetching) setlevels(res as any)
      })
      .catch(() => {
        console.error('Error interno refrescar la página. Para obtener los niveles')
      }) 
    return () => {
      fetching = false
    }
  }, []) */

  /*  const getLevels = async () => {
    const response = await CourseRepositoryInstance.readLevelsCategoriesFromWp()
    return response
  } */

  const getTags = async (tags: string) => {
    const res = await getTagsFromServer(tags)
    if (res.length > 0) {
      setTags(res)
    }
  }

  const _handleFilter = React.useRef(
    debounce(value => {
      setTags([])
      if (value.search?.trim()[0] === '#') {
        getTags(value.search)
      } else {
        onFilter({ ...value, tags: value.tags })
      }
    }, 300)
  ).current

  return <FilterTutorialsView tags={tags} levels={[]} onFilter={_handleFilter} />
}

const FilterTutorialsView = ({ levels, onFilter, tags }: any) => {
  const [search, setsearch] = useState('')
  const _handleOnChange = (newValue: {
    search?: string
    categories?: string
    tags?: string
  }) => {
    onFilter(newValue)
  }

  return (
    <div className={style.filtersContainer}>
      <FormApp>
        <div className={style.flexItems}>
          <div className={style.filterSearchItem}>
            <InputApp
              // helper='page.academy.courses.filterSearch.helper'
              value={search}
              onChange={(name: string, value: any) => {
                _handleOnChange({ [name]: value })
                setsearch(value)
              }}
              labelID={'page.academy.courses.filterSearch.label'}
              icon={searchIcon}
              name='search'
              type='text'
            />
          </div>

          <input hidden type='submit'></input>
        </div>
      </FormApp>
      {tags.length > 0 && (

        <Card cardStyle={['autocomplete', 'elevationSmall']}>
          <div>
            {tags.map((tag: { id: number; name: string }, index: number) => {
              return (
                <p
                  onClick={() => {
                    _handleOnChange({ tags: tag.id.toString() })
                    setsearch('#' + tag.name)
                  }}
                  className={style.itemTag}
                  key={index}
                >
                  #<small>{tag.name}</small>
                </p>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

export default FilterTutorials

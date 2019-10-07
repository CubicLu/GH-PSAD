import React from 'react';
import { list as selectList } from 'selectors/list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp, faMinus } from '@fortawesome/free-solid-svg-icons';
import withFetching from 'components/modules/with_fetching';

const TRSort = (props) => {

  const { filterFetcher, startFetching, setList, handleClick, sortedAttr, setQuery, filterQuery } = props
  return (
    <tr>
      {
        props.children.map((th, index) => (
          <React.Fragment key={th.props.attr || index}>
            <th className="px-4">
              <span className={th.props.disableSort ? 'non-sortable' : 'sortable'} onClick={() => {
                if(!th.props.disableSort) {
                  const newSortedAttr = {
                    keyword: th.props.attr,
                    asc: th.props.attr === sortedAttr.keyword ? !sortedAttr.asc : true
                  }
                  startFetching(
                    filterFetcher({filters: filterQuery, query: setQuery(newSortedAttr)})
                      .then((res) => {
                        setList(selectList(res));
                      })
                  )

                  handleClick(newSortedAttr)
                }
              }}>
                {th.props.children}
                <FontAwesomeIcon icon={arrowPosition(th.props, sortedAttr)}/>
              </span>
            </th>
          </React.Fragment>
        ))
      }
    </tr>
  )
}

const arrowPosition = (th, sortedAttr) => {
  if (th.disableSort) {
    return ''
  }

  if(th.attr === sortedAttr.keyword) {
    return sortedAttr.asc ? faSortDown : faSortUp
  } else {
    return faMinus
  }
}

export default withFetching(TRSort);
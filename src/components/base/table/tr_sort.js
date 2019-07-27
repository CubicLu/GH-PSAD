import React from 'react';
import { list as selectList } from 'selectors/list';

const TRSort = (props) => {

  const { fetcher, setList, handleClick, handledFetched, sortedAttr, setQuery} = props
  return (
    <tr>
      {
        props.children.map(th => (
          <React.Fragment key={th.props.attr}>
            <th>
              <span className={th.props.disableSort ? 'non-sortable' : 'sortable'} onClick={() => {
                if(!th.props.disableSort) {
                  const newSortedAttr = {
                    keyword: th.props.attr,
                    asc: th.props.attr === sortedAttr.keyword ? !sortedAttr.asc : true
                  }
                  fetcher(setQuery(newSortedAttr))
                    .then((res) => {
                      setList(selectList(res));
                      handledFetched()
                    })

                  handleClick(newSortedAttr)
                }
              }}>
                {th.props.children}
                <span dangerouslySetInnerHTML={{__html: arrowPosition(th.props, sortedAttr)}}></span>
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
    return sortedAttr.asc ? '&#9660;' : '&#9650;'
  } else {
    return ' &ndash;'
  }
}

export default TRSort;
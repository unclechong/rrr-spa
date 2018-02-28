import './index.css';

const Tag = ({label,item,onClick,active}) => {
    return (
        <li onClick={onClick} className={active?'com-tl-body-ul-li com-tl-body-ul-li-active':'com-tl-body-ul-li'}>
            {label}
        </li>
    )
}

const TagList = ({onClick,activeTag,style,data}) => {
    return (
        <div className='com-tl-body' style={style}>
            <ul className='com-tl-body-ul'>
                {
                    data.map((item,k)=><Tag
                        label={item.label}
                        key={item.key}
                        onClick={()=>{onClick(item.value, item, k)}}
                        active={item.value===activeTag}
                    />)
                }
            </ul>
        </div>
    )
}

export default TagList

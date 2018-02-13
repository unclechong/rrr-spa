import './index.css';

const taglist = [
    {
        key:'1',
        value:'1',
        label:'1133333333333333333333333333333333333333333333333331'
    },
    {
        key:'2',
        value:'2',
        label:'222'
    },
    {
        key:'3',
        value:'3',
        label:'333'
    },
    {
        key:'4',
        value:'4',
        label:'444'
    },
    {
        key:'5',
        value:'5',
        label:'555'
    },
    {
        key:'6',
        value:'6',
        label:'666'
    },
]

const Tag = ({label,item,onClick,activeTag}) => {
    return (
        <li onClick={onClick} className={activeTag?'com-tl-body-ul-li com-tl-body-ul-li-active':'com-tl-body-ul-li'}>
            {label}
        </li>
    )
}

const TagList = ({onClick,activeTag}) => {
    return (
        <div className='com-tl-body'>
            <ul className='com-tl-body-ul'>
                {
                    taglist.map(item=><Tag label={item.label} key={item.key} onClick={()=>{onClick(item.value,item)}} activeTag={item.value===activeTag} />)
                }
            </ul>
        </div>
    )
}

export default TagList

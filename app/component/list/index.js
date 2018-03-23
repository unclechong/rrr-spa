import QueueAnim from 'rc-queue-anim';

import './index.css';

const WrapList = ({list,style,size}) => {
    const liStyle = {
        height:size==='large'?32:25,
        lineHeight:size==='large'?'32px':'25px',
        borderLeft: size==='large'?'5px solid #3963b2':'3px solid #3963b2'
    }
    return (
        <div className='com-list-body' style={style}>
            <QueueAnim component="ul" animConfig={[
                    { opacity: [1, 0], translateY: [0, 50] },
                    { opacity: [1, 0], translateY: [0, -50] }
                ]}
            >
                {
                    list.map(l=><li style={liStyle} key={l.key}>{l.name}</li>)
                }
            </QueueAnim>
        </div>

    )
}

export default WrapList

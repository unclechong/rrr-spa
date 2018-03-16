import QueueAnim from 'rc-queue-anim';

import './index.css';

const WrapList = ({list,style}) => {
    return (
        <div className='com-list-body' style={style}>
            <QueueAnim component="ul" animConfig={[
                    { opacity: [1, 0], translateY: [0, 50] },
                    { opacity: [1, 0], translateY: [0, -50] }
                ]}
            >
                {
                    list.map(l=><li key={l.key}>{l.name}</li>)
                }
            </QueueAnim>
        </div>

    )
}

export default WrapList

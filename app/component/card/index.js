import './index.css';

const Card = ({title, body, bodyStyle}) => {
    return (
        <div className='com-card-body'>
            <div className='com-card-body-title'>{title}</div>
            <div style={bodyStyle}>{body}</div>
        </div>
    )
}

export default Card

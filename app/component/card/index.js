import './index.css';

const Card = ({title, body}) => {
    return (
        <div className='com-card-body'>
            <div className='com-card-body-title'>{title}</div>
            {body}
        </div>
    )
}

export default Card

import { Row, Col } from 'antd';
import './index.css';

const PageContainer = ({areaLeft,areaRight}) => (
    <Row gutter={16} >
        <Col md={6} lg={6} xl={5} className='sm-main-area-left'>
            {areaLeft}
        </Col>
        <Col md={18} lg={18} xl={19} className='sm-main-area-right'>
            {areaRight}
        </Col>
    </Row>
)

export default PageContainer

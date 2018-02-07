import { Row, Col } from 'antd';

export default class TypeSystem extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div >
                <Row gutter={16} >
                    <Col span={6}>
                        111
                    </Col>
                    <Col span={18}>
                        222
                    </Col>
                </Row>
            </div>

        )
    }
}

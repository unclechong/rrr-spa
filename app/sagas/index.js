import typesystemSaga from './typesystemSaga';
import datafusionSaga from './datafusionSaga';

function* rootSaga() {
    //watch typesystem async
    yield [
        typesystemSaga(),
        datafusionSaga()
    ];

}

export default rootSaga;

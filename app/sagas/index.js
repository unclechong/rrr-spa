import typesystemSaga from './typesystemSaga';
import datafusionSaga from './datafusionSaga';
import knowledgegraphSaga from './knowledgegraphSaga';


function* rootSaga() {
    //watch typesystem async
    yield [
        typesystemSaga(),
        datafusionSaga(),
        knowledgegraphSaga()
    ];
}

export default rootSaga;

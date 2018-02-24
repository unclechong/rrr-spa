import typesystemSaga from './typesystemSaga';

function* rootSaga() {
    //watch typesystem async
    yield [
        typesystemSaga()
    ];

}

export default rootSaga;

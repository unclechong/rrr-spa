import { fromJS ,Map, List} from 'immutable';

const initialState = fromJS({
    currentTab: 'dataSource'
});

export default (state = initialState, action) => {

    switch (action.type) {
        case 'datafusion/CHANGE_TAB':
            return state.set('currentTab', action.currentTab);
        default:
            return state;
    }
};

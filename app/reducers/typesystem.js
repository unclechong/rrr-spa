import Immutable ,{ fromJS } from 'immutable';

const initialState = fromJS({
    activeTag: null,
    activeTagName: null,
    currentTab: null,
    showAddArea:false
});


export default (state = initialState, action) => {

    switch (action.type) {
        case 'CHANGE_ACTIVE_TAG':
            if (state.get('activeTag')===action.e.key)
            return state.set('activeTag', null).set('activeTagName', null);
            return state.set('activeTag', action.e.key).set('activeTagName', action.e.label);
        case 'CHANGE_TAB':
            return state.set('currentTab', action.currentTab);
        case 'SHOW_ADD_AREA':
            return state.set('showAddArea', action.isShow);
        // case 'ADD_TODO':
        //     // console.log(Immutable.is(fromJS({a:'1',b:'2'}),fromJS({a:'1',b:'2'})));
        //     // return state.set('addList', state.get('addList').push(action.name));
        //     return state.update('addList',a => a.push(action.name))
        //         .set('isAdd', false)
        //         .set('listTotal',state.get('listTotal') + 1)
        default:
            return state;
    }

};

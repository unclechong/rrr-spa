import Immutable ,{ fromJS } from 'immutable';

const initialState = fromJS({
    change: 1,
    listTotal:0,
    isAdd:false,
    addList:[]
});


export default (state = initialState, action) => {

    switch (action.type) {
        case 'HAVE_CHANGE':
            return state.set('change', state.get('change') + 1);
        case 'IS_ADDING':
            return state.set('isAdd', true);
        case 'ADD_TODO':
            // console.log(Immutable.is(fromJS({a:'1',b:'2'}),fromJS({a:'1',b:'2'})));
            // return state.set('addList', state.get('addList').push(action.name));
            return state.update('addList',a => a.push(action.name))
                .set('isAdd', false)
                .set('listTotal',state.get('listTotal') + 1)
        default:
            return state;
    }

};

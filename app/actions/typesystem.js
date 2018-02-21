import { fromJS } from 'immutable';


const changeActiveTag = e => ({
    type:'CHANGE_ACTIVE_TAG',
    e
})

const changeTab = currentTab => ({
    type:'CHANGE_TAB',
    currentTab
})

const showAddArea = isShow => ({
    type:'SHOW_ADD_AREA',
    isShow
})
// const isAdded = data => ({
//     type:'ADD_TODO',
//     name:data
// })
//
// const isAdding = () => ({
//     type:'IS_ADDING',
// })
//
// const addTodo = (n) => {
//     return (dispatch,getState) => {
//         dispatch(isAdding())
//         setTimeout(()=>{
//             dispatch(isAdded(fromJS('add')))
//         },1500)
//         // axios.get('./index.json').then(data=>{
//         //     dispatch(isAdded(fromJS(data.data.name)))
//         // })
//     }
// }

export { changeActiveTag,changeTab,showAddArea }

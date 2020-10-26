import {combineReducers} from 'redux';
import configureStore from './CreateStore';
import rootSaga from 'App/Sagas';
import {reducer as UserReducer} from './User/Reducers';
import {reducer as TeamReducer} from './Team/Reducers';
import {reducer as PostReducer} from './Post/Reducers';
import {reducer as AccountingReducer} from './Accounting/Reducers';
import {reducer as TodoListReducer} from './TodoList/Reducers';
import {reducer as paymentReducer} from './Payment/Reducers';

export default () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    user: UserReducer,
    team: TeamReducer,
    post: PostReducer,
    accounting: AccountingReducer,
    todoList: TodoListReducer,
    payment: paymentReducer,
  });

  return configureStore(rootReducer, rootSaga);
};

import React, { useCallback } from 'react';
import ToDoListItem from './TodoListItem';
import '../css/TodoList.css';
import {List} from 'react-virtualized'

function TodoList({ cate_id, todolistData, todos, onRemove, onToggle, onChangeSelectedTodo, onInsertToggle }) {

  const cateId = cate_id;

  const rowRender = useCallback(
    ({index,key,style}) => {
      // index 0부터 항목 갯수 만큼
      const todo = todos[index];
      return(
        <ToDoListItem
        todo={todo}
        key={key}
        onToggle={onToggle}
        onRemove={onRemove}
        onInsertToggle={onInsertToggle}
        onChangeSelectedTodo={onChangeSelectedTodo}
        style={style}
        cateId={cateId}
      />
      )
    },
    [ cate_id, todolistData, todos, onRemove, onToggle, onChangeSelectedTodo, onInsertToggle ]
  )

  return (<>
    <List 
        className='TodoList'
        width={330}                 // 전체 너비
        height={100}                // 전체 높이
        rowCount={todos.length}     // 항목 갯수
        rowHeight={60}              // 항목 높이
        rowRenderer={rowRender}     // 항목을 렌더링 함수
        list={todolistData}         // 배열
      />
  </>

  );
}

export default React.memo(TodoList);

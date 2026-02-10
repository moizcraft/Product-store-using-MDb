import { createSlice , nanoid} from '@reduxjs/toolkit'

const initialState = {
    todos : []
}



const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo : (state, action)=>{
            const newTodo = {
                id: nanoid(),
                text: action.payload.text,
                completed: action.payload.completed
            }
            state.todos.push(newTodo)

            console.log('Added Todo:', newTodo);
        },
        
    }
})

export default todoSlice.reducer

export const { addTodo } = todoSlice.actions
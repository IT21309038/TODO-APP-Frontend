import { api, authApi } from "./apiBase";

const apiDefinitions = {
    
    //login api
    postLogin: async function (payload){
        return await authApi.post(`/login`,payload)
    },

    //getAllTodos api
    getAllTodo: async function(){
        return await api.get(`/Todos`)
    },

    //deleteTodo api
    deleteTodo: async function(id){
        return await api.delete(`/Todos/${id}`)
    },

    //completeTodo api
    putCompleteTodo: async function(id){
        return await api.put(`/Todos/${id}/complete`)
    },

    //addTodo api
    postAddTodo: async function(payload){
        return await api.post(`/Todos`,payload)
    },

    //getTodoById api
    getTodoById: async function(id){
        return await api.get(`/Todos/${id}`)
    },

    //updateTodo api
    putUpdateTodo: async function(id,payload){
        return await api.put(`/Todos/${id}`,payload)
    }
};

export default apiDefinitions;
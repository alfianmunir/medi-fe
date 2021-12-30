import baseURL from '../baseURL'
import Cookies from 'universal-cookie'
import router from "../../router"; 
const cookies = new Cookies()

export const state = {
    data: null,
    error: null,
    isLoading: false
}

export const mutations = {
    success(state, data) {
        state.data = data
        state.error = null
        state.isLoading = false
    },
    loading(state) {
        state.isLoading = true
    },
    error(state, error) {
        state.error = error
    },
    setUserData(state, data){
        state.data = {...state.data, ...data}
    },
    logout(state) {
        state.data = null;
        state.error = null;
    },
    resetError(state){
        state.error = null
    }
}

export const actions = {
    login({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.post('user/login', {user_email:payload.email, user_password:payload.password})

                cookies.set('user_email', data?.user_email);
                cookies.set('user_password', data?.user_password);
                cookies.set('user_role', data?.user_role);
                cookies.set('user_name', data?.user_name);
                
                if(data?.user_role =='perawat')
                resolve('/perawat')
                else resolve('/dokter')
            } catch(err){
                commit('error', 'Email atau Password salah!')
                reject()
            }
        })
    },
    logout({ commit }) {
        cookies.set('user_email', '', { path: '/', expires: (new Date(Date.now())) });
        cookies.set('user_password', '', { path: '/', expires: (new Date(Date.now())) });
        cookies.set('user_role', '', { path: '/', expires: (new Date(Date.now())) });
        cookies.set('user_name', '', { path: '/', expires: (new Date(Date.now())) });
        commit('logout');
        router.push('/login/staff');
    },
    resetError({commit}){
        commit('resetError')
    }
}
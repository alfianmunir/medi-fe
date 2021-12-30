import baseURL from '../baseURL'
export const state = {
    log_data: [],
    fee_berobat: 0,
    error: null,
    isLoading: false
}

export const mutations = {
    success(state, data) {
        state.log_data = data
        state.error = null
        state.isLoading = false
    },
    success_pengaturan(state, data) {
        state.fee_berobat = data
        state.error = null
        state.isLoading = false
    },
    loading(state) {
        state.isLoading = true
    },
    error(state, error) {
        state.error = error
        state.isLoading = false
    }, 
    resetError(state){
        state.error = null
    }
}

export const actions = {
    async logsGetAll({commit} ){
        commit('loading')
        try { 
            let {data} = await baseURL.get('log/') 
            console.log('logsGetAll', data)
            commit('success', data)
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async getPengaturan({commit}){
        commit('loading')
        try { 
            let {data} = await baseURL.get('pengaturan/fee_berobat') 
            console.log('getPengaturan', data)
            commit('success_pengaturan', data)
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async putPengaturan({commit}, {payload, id}){
        commit('loading')
        try { 
            let {data} = await baseURL.put('pengaturan/'+id, payload) 
            console.log('putPengaturan', data)
            commit('success_pengaturan', data)
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async logsDelete({commit}, id){
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.delete('log/'+id)
                console.log('logsDelete',data)
                commit('success', { })
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        })
    }
}
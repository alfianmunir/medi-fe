import baseURL from '../baseURL'
export const state = {
    obat_data: null,
    error: null,
    isLoading: false
}

export const mutations = {
    success(state, data) {
        state.obat_data = {...state.obat_data, ...data}
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
    obatSearchByID({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.get('obat/'+payload)
                console.log('obatSearchByID',data)
                commit('success', { obatByID : data })
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        })
    },
    async obatGetAll({commit} ){
        commit('loading')
        try { 
            let {data} = await baseURL.get('obat/') 
            console.log('obatGetAll', data)
            commit('success', {obats: data})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async obatGetAllByPasien({commit}, id){
        commit('loading')
        try { 
            let {data} = await baseURL.get('rekam_medis/pasien/'+id) 
            console.log('obatGetAllByPasien', data)
            commit('success', {obats_by_pasien: data})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async obatGetSedikit({commit} ){
        commit('loading')
        try { 
            let {data} = await baseURL.get('obat/sedikit') 
            console.log('obatGetSedikit', data)
            commit('success', {obats_sedikit: data})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async obatPostToCreate({commit}, payload){
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                let {data} = await baseURL.post('obat', payload) 
                console.log('obaPostToCreate', data)
                commit('success')
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        }) 
    },
    async obatRekamMedisPostToCreate({commit}, payload){
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                let {data} = await baseURL.post('obat_rekam_medis', payload) 
                console.log('obatRekamMedisPostToCreate', data)
                commit('success')
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        }) 
    },
    async obatPutToEdit({commit}, {payload, id}){
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                let {data} = await baseURL.put('obat/'+id, payload) 
                console.log('obatPutToEdit', data)
                commit('success')
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        }) 
    },
    async obatRekamMedisPutToEdit({commit}, {payload, id}){
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                let {data} = await baseURL.put('obat_rekam_medis/'+id, payload) 
                console.log('obatRekamMedisPutToEdit', data)
                commit('success')
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        }) 
    },
    async rekamMedisToEdit({commit}, {payload, id}){
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                let {data} = await baseURL.put('rekam_medis/'+id, payload) 
                console.log('rekamMedisToEdit', data)
                commit('success')
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        }) 
    },
    async obatToDelete({commit}, id){
        commit('loading')
        try { 
            let {data} = await baseURL.delete('obat/'+id) 
            console.log('obatToDelete', data)
            commit('success')
        } catch(err){
            commit('error', err.data?.message)
        }
    },
}
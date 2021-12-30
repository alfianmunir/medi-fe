import baseURL from '../baseURL'
export const state = {
    pasien_data: null,
    error: null,
    isLoading: false
}

export const mutations = {
    success(state, data) {
        state.pasien_data = {...state.pasien_data, ...data}
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
    pasienSearchByID({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.get('pasien/'+payload)
                console.log('pasienSearchByID',data)
                commit('success', { pasienByID : data })
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        })
    },
    async pasienGetAll({commit} ){
        commit('loading')
        try { 
            let {data} = await baseURL.get('pasien/') 
            console.log('pasienGetAll', data)
            commit('success', {pasiens: data})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async pasienPostToCreate({commit}, payload){
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.post('pasien', payload)
                console.log('pasienPostToCreate', data)
                commit('success')
                resolve(data.data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        })
    },
    async pasienPostToEdit({commit}, {payload, id}){
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.put('pasien/'+id, payload)
                console.log('pasienPostToEdit', data)
                commit('success')
                resolve(data.data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        })
    },
    async pasienPutListEdit({commit}, {payload,id}){
        commit('loading')
        try { 
            await baseURL.put('list/'+id, payload)  
            commit('success')
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    pasienDeleteToList({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.delete('list/'+payload)
                console.log('pasienDeleteToList',data)
                commit('success')
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        })
    },
    pasienDelete({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.delete('pasien/'+payload)
                console.log('pasienDelete',data)
                commit('success')
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(err)
            }
        })
    },
    deleteRekamMedisPasien({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit('loading')
            try {
                const {data} = await baseURL.delete('rekam_medis/'+payload)
                console.log('deleteRekamMedisPasien',data)
                commit('success')
                resolve(data)
            } catch(err){
                commit('error', 'Error tidak ditemukan!')
                reject(null)
            }
        })
    },
    async pasienGetListWaiting({commit} ){
        commit('loading')
        try { 
            let {data} = await baseURL.get('list/status/wait') 
            console.log('pasienGetListWaiting', data)
            commit('success', {pasiens_waiting: data})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async pasienGetListPeriksa({commit} ){
        commit('loading')
        try { 
            let {data} = await baseURL.get('list/status/periksa') 
            console.log('pasienGetListPeriksa', data)
            commit('success', {pasiens_periksa: data})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async pasienGetListDone({commit} ){
        commit('loading')
        try { 
            let {data} = await baseURL.get('list/status/done') 
            console.log('pasienGetListDone', data)
            commit('success', {pasiens_done: data})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async pasienPostToWaiting({commit}, payload){
        commit('loading')
        try { 
            await baseURL.post('list', payload)  
            commit('success')
        } catch(err){
            commit('error', err.data?.message)
        }
    },
}
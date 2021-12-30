import baseURL from '../baseURL'
export const state = {
    statistik_data: [],
    error: null,
    isLoading: false
}

export const mutations = {
    success(state, data) {
        state.statistik_data = {...state.statistik_data, ...data}
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
    async getStatistikPasien({commit}, payload){
        commit('loading')
        console.log('payload', payload)
        try {  
            let {data} = await baseURL.get('obat_rekam_medis/statistics/pasien', {
                params: payload
            }) 
            console.log('getStatistikPasien', data)
            commit('success', {pasiens:data.data, pasiens_total: data.total})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async getStatistikObat({commit}, payload){
        commit('loading')
        try { 
            let {data} = await baseURL.get('obat_rekam_medis/statistics/obat', {
                params: payload
            }) 
            console.log('getStatistikObat', data)
            commit('success', {obats:data.data, obats_total: data.total})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
    async getStatistikFee({commit}, payload){
        commit('loading')
        try { 
            let {data} = await baseURL.get('obat_rekam_medis/statistics/fee', {
                params: payload
            }) 
            console.log('getStatistikFee', data)
            commit('success', {fees:data.data, fees_total: data.total})
        } catch(err){
            commit('error', err.data?.message)
        }
    },
}
<script>
    import {mapActions} from 'vuex'

    export default { 
        props: {
            tableData: Array,
            tableHeader: Array,
            sortInit: String,
        },
        data() {
            return {
                input: null,
                isOpen: false,
                datas: this.$props.tableData,
                fields: [
                    {
                        key: "rm_date",
                        sortable: true,
                        label:'Tanggal'
                    },
                    {
                        key: "rm_anamnesa",
                        sortable: true,
                        label: 'Anamnesa'
                    },
                    {
                        key: "rm_diagnosa",
                        sortable: true,
                        label: 'Diagnosa'
                    },
                    {
                        key: "obats",
                        sortable: true,
                        label: 'Terapi/Obat'
                    }, 
                ], 
                totalRows: 1,
                currentPage: 1,
                perPage: 10,
                pageOptions: [10, 25, 50, 100],
                filter: null,
                filterOn: [],
                sortBy: this.$props.sortInit || null,
                sortDesc: false,
            }
        },
        computed: {
            rows() {
                if (this.datas ==null){
                    return 1
                }else{
                    return this.datas.length;
                }
            },
        },
        watch: {
            tableData(value){
                this.datas = value
            },
            filtersOn: {
                handler: function (val) {
                    this.datas = this.$props.tableData
                    if (val && val.length > 0)
                        val.map(item => {
                            if (item)
                                this.datas = this.datas.filter(data => (data[item.name] == item.value))
                        })
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            ...mapActions('pasien', ['pasienGetAll']),
            onFiltered(filteredItems) {
                this.totalRows = filteredItems.length;
                this.currentPage = 1;
            },  
        },
    }
</script>

<template>
    <div class="">
        <div class="mt-3"> 
            <!-- Table -->
            <div class="table-responsive mb-0">
                <b-table striped :items="datas" :fields="fields" responsive :per-page="perPage" :current-page="currentPage"
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :filter="filter" fixed thead-class="bg-semisecondary"
                    :filter-included-fields="filterOn" @filtered="onFiltered">
                    <template #table-colgroup="scope">
                        <col v-for="field in scope.fields" :key="field.key"
                            :style="{ width: ['rm_date', 'no_kartu'].includes(field.key) ? '100px' : 'auto' }">
                    </template>
                    <template #empty="">
                        <h5>Tidak ada data ditemukan</h5>
                    </template> 
                    <template #cell(rm_date)="data">
                        {{(new Date(data.item.rm_date)).toLocaleDateString()}}
                    </template>
                    <template #cell(rm_anamnesa)="data">
                        Temp: {{data.item.rm_temp}}. Tensi: {{data.item.rm_tensi}}. Gula Darah: {{data.item.rm_gula_darah}}. Kolesterol: {{data.item.rm_kolesterol}}. Asam Urat: {{data.item.rm_asam_urat}}.
                        {{data.item.rm_anamnesa}}
                    </template>
                    <template #cell(obats)="data">
                        <div v-for="obat in data.item.obats" :key="obat">
                            <div v-if="obat.obat_rekam_medis.orm_obat_strip > 0 && obat">
                                {{obat.obat_name}} | {{obat.obat_kandungan}} | {{obat.obat_rekam_medis.orm_obat_strip}} strip
                            </div>
                        </div>
                    </template>
                </b-table>
            </div>
            <div class="row">
                <div class="col">
                    <div class="dataTables_paginate paging_simple_numbers float-right">
                        <ul class="pagination pagination-rounded mb-0">
                            <!-- pagination -->
                            <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
                            </b-pagination>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
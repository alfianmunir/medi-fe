<script>
    import {mapActions} from 'vuex'
import NewObat from '../../components/form/new_obat.vue'
    import Swal from 'sweetalert2'

    export default {
        components: {
                NewObat
        },
        props: {
            tableData: Array,
            tableHeader: Array,
            sortInit: String,
            addButton: Boolean
        },
        data() {
            return {
                input: {name:null},
                isOpen: false,
                datas: this.$props.tableData,
                fields: this.$props.tableHeader,
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
            ...mapActions('obat', ['obatGetAll', 'obatToDelete']),
            onFiltered(filteredItems) {
                this.totalRows = filteredItems.length;
                this.currentPage = 1;
            }, 
            toggleModal() {
                this.input = null
                this.isOpen = !this.isOpen
                this.edit = null
            }, 
            update(obat){
                const payload = {
                    name : obat.obat_name,
                    stok: obat.obat_stok,
                    harga: obat.obat_harga,
                    kandungan : obat.obat_kandungan
                }
                this.toggleModal()
                this.input = payload
                this.edit = obat.obat_id
            },
            onSubmitObat(){
                this.obatGetAll()
                this.obatGetSedikit()
                this.toggleModal()
            },
            deleteObat(item){
                Swal.fire({
                    title: 'Yakin akan menghapus obat ini?',
                    showDenyButton: false,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya',
                }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        this.obatToDelete(item).then(() => {
                            Swal.fire('Sukses menghapus data!.', '', 'success')
                            window.location.reload()
                        }).catch(() => {
                            Swal.fire('Gagal menghapus data!', '', 'error')
                        })
                    } 
                })
            }
        },
    }
</script>

<template>
    <div class="card">
        <div class="card-body">
            <div class="row mb-2">
                <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                        <label class="d-inline-flex align-items-center">
                            Show&nbsp;
                            <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>
                            &nbsp;entries
                        </label>
                    </div>
                </div>
                <!-- Search -->
                <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                        <label class="d-inline-flex align-items-center mr-3">
                            Search:
                            <b-form-input v-model="filter" type="search" placeholder="Search..."
                                class="form-control form-control-sm ml-2"></b-form-input>
                        </label>
                        <b-button variant="primary" size="sm" @click="toggleModal" v-if="addButton">Tambah data obat</b-button>
                    </div>
                </div>
                <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
                <b-table striped :items="datas" :fields="fields" responsive :per-page="perPage" :current-page="currentPage"
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :filter="filter" fixed thead-class="bg-semisecondary"
                    :filter-included-fields="filterOn" @filtered="onFiltered">
                    <template #table-colgroup="scope">
                        <col v-for="field in scope.fields" :key="field.key"
                            :style="{ width: ['action', 'nomor', 'nomor_obat'].includes(field.key) ? '100px' : 'auto' }">
                    </template>
                    <template #empty="">
                        <h5>Tidak ada data ditemukan</h5>
                    </template>
                    <template #cell(component_status)="data">
                        <b-badge pill variant="success" v-if="data.item.component_status == 1">Aktif</b-badge>
                        <b-badge pill variant="danger" v-else>Non Aktif</b-badge>
                    </template>
                    <template #cell(component_custom)="data">
                        <b-badge pill variant="success" v-if="data.item.component_custom == 1">Ya</b-badge>
                        <b-badge pill variant="danger" v-else>Tidak</b-badge>
                    </template>
                    <template #cell(action)="data">
                        <div class="d-flex" :style="{justifyContent:'space-evenly'}">
                            <div class="btn btn-outline-warning btn-sm mx-1" @click="update(data.item)" v-b-tooltip.hover title="Edit Data">
                                <i class="fa fa-edit" />
                            </div> 
                            <b-dropdown dropleft variant="outline-light" size="sm">
                                <template #button-content>
                                    <i class="fa fa-ellipsis-v text-primary" />
                                </template>
                                <b-dropdown-item
                                    href="#" 
                                    @click="deleteObat(data.item.obat_id)"
                                    ><i class="fa fa-trash text-danger mr-2" />Hapus</b-dropdown-item
                                >
                            </b-dropdown>
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

        <b-modal :visible='isOpen' centered title='Form Masterdata Komponen Pembiayaan' title-class="font-18" hide-header hide-footer size="md">
            <!-- <b-form @submit.prevent="edit != null ? save() : add()">
                <b-form-group label="Nama Komponen Biaya">
                    <b-form-input v-model.lazy="input.component_name" placeholder="Nama Komponen Biaya" required />
                </b-form-group>
                <b-form-checkbox
                    v-model="input.component_custom"
                    :value="1"
                    :unchecked-value="0"
                    required
                >
                    (n) Biaya (Biaya yang dapat di isi jumlah n oleh calon mahasiswa)
                </b-form-checkbox>
                <div class="d-flex mt-4" :style="{justifyContent:'space-between'}">
                    <button type="button" class="btn btn-secondary" @click="toggleModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </b-form> -->
            <new-obat :isAdmin="true" @closed="toggleModal()" :obatData="input" @submit="onSubmitObat()" :obatID="edit" />
        </b-modal>

    </div>
</template>

<style>
    .bg-semisecondary {
        background: #E0E0E0;
    }
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css">
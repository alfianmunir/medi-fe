<script>
    import {mapActions, mapState} from 'vuex'
    import NewPasien from '../../components/form/new_pasien.vue'
    import PasienDetail from './dt_detail.vue'
    import Cookies from 'universal-cookie'
    import Swal from 'sweetalert2'
    const cookies = new Cookies()

    export default {
        components: {
            NewPasien, PasienDetail
        },
        props: {
            tableData: Array,
            tableHeader: Array,
            sortInit: String,
        },
        data() {
            return {
                input: null,
                detailS: {},
                edit:null,
                isOpenDetail: false,
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
            ...mapState('obat', ['obat_data']),
            rows() {
                if (this.datas ==null){
                    return 1
                }else{
                    return this.datas.length;
                }
            },
            tableDataDetail: function(){
                return this.obat_data?.obats_by_pasien
            },
            role: function(){
                return cookies.get('user_role')
            }
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
            ...mapActions('pasien', ['pasienGetAll', 'pasienPostToWaiting', 'pasienDelete']),
            ...mapActions('obat', ['obatGetAllByPasien']),
            onFiltered(filteredItems) {
                this.totalRows = filteredItems.length;
                this.currentPage = 1;
            }, 
            toggleModal() {
                this.input = null
                this.isOpen = !this.isOpen
                this.edit = null
            },  
            toggleModalDetail() {
                this.detailS = {}
                this.isOpenDetail = !this.isOpenDetail
            },  
            toggleStatus(component_id){
                this.toggleStatusDataKomponenBiaya(component_id)
            },
            detail(pasien){
                this.toggleModalDetail()
                this.detailS = pasien
                this.obatGetAllByPasien(pasien?.pasien_id)
            },
            update(pasien){
                const payload = {
                    name : pasien.pasien_name,
                    age: pasien.pasien_umur,
                    gender: pasien.pasien_gender,
                    address : pasien.pasien_alamat
                }
                this.toggleModal()
                this.input = payload
                this.edit = pasien.pasien_id
            },
            onSubmitPasien(){
                this.pasienGetAll()
                this.toggleModal()
                window.location.reload()
            },
            async tambahAntrian(item){
                Swal.fire({
                    title: 'Yakin akan memasukan pasien ini dalam antrian?',
                    showDenyButton: false,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya',
                }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        const payload = {
                        wl_pasien_id : item.pasien_id,
                        wl_status : 'wait'
                        }
                        await this.pasienPostToWaiting(payload)
                        Swal.fire('Sukses menambahkan ke antrian!.', '', 'success')
                    } 
                })
            },
            deletePasien(item){
                Swal.fire({
                    title: 'Yakin akan menghapus pasien ini?',
                    showDenyButton: false,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya',
                }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        this.pasienDelete(item).then(() => {
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
                        <b-button variant="primary" size="sm" @click="toggleModal">Tambah data pasien</b-button>
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
                            :style="{ width: ['action', 'no_kartu'].includes(field.key) ? '100px' : 'auto' }">
                    </template>
                    <template #empty="">
                        <h5>Tidak ada data ditemukan</h5>
                    </template> 
                    <template #cell(action)="data">
                        <div class="d-flex" :style="{justifyContent:'space-evenly'}">
                            <div class="btn btn-outline-primary btn-sm mx-1" @click="tambahAntrian(data.item)" v-b-tooltip.hover title="Tambah Antrian" v-if="role == 'perawat'">
                                <i class="fa fa-level-up-alt" style="transform:rotate(90deg)" />
                            </div> 
                            <div class="btn btn-outline-primary btn-sm mx-1" @click="detail(data.item)" v-b-tooltip.hover title="Detail Rekam Medis" v-else>
                                <i class="fa fa-file-medical" />
                            </div> 
                            <div class="btn btn-outline-warning btn-sm mx-1" @click="update(data.item)" v-b-tooltip.hover title="Edit Data">
                                <i class="fa fa-edit" />
                            </div> 
                            <b-dropdown dropleft variant="outline-light" size="sm">
                                <template #button-content>
                                    <i class="fa fa-ellipsis-v text-primary" />
                                </template>
                                <b-dropdown-item
                                    href="#" 
                                    @click="deletePasien(data.item.pasien_id)"
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

        <b-modal :visible='isOpen' centered  title-class="font-18" hide-footer hide-header size="md"> 
            <new-pasien :isAdmin="true" newR @closed="isOpen = false" :pasienData="input" @submit="onSubmitPasien()" :pasienID="edit" />
        </b-modal>

        <b-modal :visible='isOpenDetail' centered title="Rekam Medis Pasien" title-class="font-18 font-weight-bold px-2" hide-footer @hidden='toggleModalDetail()' size="xl"> 
            <div class="p-2" >
                <!-- <h4 class="font-weight-bold mb-3">Rekam Medis Pasien</h4> -->
                <b-row>
                    <b-col col md="4">
                        <table>
                            <tr>
                                <td>No. Kartu</td>
                                <td class="px-3">:</td>
                                <td>{{detailS.pasien_id}}</td>
                            </tr>
                            <tr>
                                <td>Nama</td>
                                <td class="px-3">:</td>
                                <td>{{detailS.pasien_name}}</td>
                            </tr>
                            <tr>
                                <td>Alamat</td>
                                <td class="px-3">:</td>
                                <td>{{detailS.pasien_alamat}}</td>
                            </tr>
                        </table>
                    </b-col>
                    <b-col col md="4">
                        <table>
                            <tr>
                                <td>Jenis Kelamin</td>
                                <td class="px-3">:</td>
                                <td>{{detailS.pasien_gender}}</td>
                            </tr>
                            <tr>
                                <td>Umur</td>
                                <td class="px-3">:</td>
                                <td>{{detailS.pasien_umur}} Tahun</td>
                            </tr>
                            <tr>
                                <td>Alergi</td>
                                <td class="px-3">:</td>
                                <td>{{detailS.pasien_alergi}}</td>
                            </tr>
                        </table>
                    </b-col>
                    <b-col col md="4">
                        <table>
                            <tr>
                                <td>Terakhir Berobat</td>
                                <td class="px-3">:</td>
                                <td>{{detailS.pasien_lastarrival}}</td>
                            </tr>
                        </table>
                    </b-col>
                </b-row>
                <pasien-detail :tableData='tableDataDetail' sortInit='name' />
            </div>
        </b-modal>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
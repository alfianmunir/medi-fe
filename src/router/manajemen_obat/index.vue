<script>
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config"; 
// import NewPasien from '../../components/form/new_pasien.vue'
import DataTable from './dt.vue'
import NewObat from '../../components/form/new_obat.vue'
import { mapState, mapActions } from 'vuex';
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export default {
  page: {
    title: "Dashboard Perawat",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    PageHeader, DataTable, NewObat
  },
  computed: {
    ...mapState('obat', ['obat_data']),
    time: function(){
      return (new Date()).getHours()
    },
    time_of_day:function(){
      let tod 
      if(this.time > 4 && this.time <= 10) tod = 'Selamat Pagi'
      else if(this.time > 10 && this.time <= 14) tod = 'Selamat Siang'
      else if(this.time > 14 && this.time <= 18) tod = 'Selamat Sore'
      else if (this.time > 18 ) tod = 'Selamat Malam'
      return tod
    },
    tableData: function(){
      return this.obat_data?.obats
    },
    obats_sedikit:function(){
      return this.obat_data?.obats_sedikit || []
    },
    role: function(){
      return cookies.get('user_role')
    }
  },
  watch: {

  },
  mounted() {
    this.obatGetAll()
    this.obatGetSedikit()
  },
  methods: {
    ...mapActions('obat', ['obatGetAll', 'obatGetSedikit']),
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
        console.log(obat)
        this.toggleModal()
        this.input = payload
        this.edit = obat.obat_id
    },
    onSubmitObat(){
        this.toggleModal()
        this.obatGetAll()
        this.obatGetSedikit()
        window.location.reload()
    },
    onFiltered(filteredItems) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
    },
  },
  data() {
    return {
      isModalOpen: false,
        form: {},
        user: {},
        edit:null,
        input: {},
        isOpen: false,
        tableHeader: [
            {
                key: "obat_id",
                sortable: true,
            },
            {
                key: "obat_name",
                sortable: true,
            },
            {
                key: "obat_stok",
                sortable: true,
            },
            {
                key: "obat_harga",
                sortable: true,
            },
            {
                key: "obat_kandungan",
                sortable: true,
            },
            {
                key: "action",
                sortable: false,
                label: 'Aksi'
            },
        ], 
    };
  },
};
</script>

<template>
  <div>
    <PageHeader :title="'Data Obat'"  />  
    <div :style="{}" class="card p-4 shadow" style="border:1px solid #2F80ED" v-if="role == 'perawat'">
      <div class="d-flex flex-wrap justify-content-between">
        <h5 class="">Obat dengan stok sedikit <b-badge variant="danger" class="m-auto">{{obats_sedikit.length}}</b-badge></h5> 
        <!-- <label  class="text-primary" style="cursor:pointer" @click="toggleModal()">+ Tambah obat</label> -->
      </div>

      <div class="w-100 dt-row d-flex align-items-center px-3 mt-2" v-for="(item,idx) in obats_sedikit" :key="idx+'OBATSEDIKIT'">
        <span class="mr-3 py-1 font-weight-bold">{{idx+1}}.</span>
        <span class="py-1 mr-auto">{{item.obat_name}}</span>
        <span class="py-1 mr-auto">{{item.obat_kandungan}}</span>
        <span class="text-right py-1 mx-auto">Sisa stok : <strong class="text-danger">{{item.obat_stok}}</strong></span>
        <span class="py-1 text-danger" style="cursor:pointer;width:fit-content;text-decoration:underline" @click='update(item)'>Update stok</span>
      </div>  
    </div>
    <DataTable :tableData='tableData' :tableHeader='tableHeader' sortInit='name' :addButton="role == 'perawat'"></DataTable>
    <div class="position-absolute d-flex justify-content-center" style="width:100vw;height:100vh;top:0;left:0;z-index:9999;background:rgba(0, 0, 0, 0.64);" v-if="isOpen">
      <div class="bg-white rounded-lg p-4 mb-auto mt-5 w-100" style="max-width:450px">
        <new-obat :isAdmin="true" @closed="toggleModal()" :obatData="input" @submit="onSubmitObat()" :obatID="edit" stokOnly  />
      </div>
    </div>
  </div>
</template>
 
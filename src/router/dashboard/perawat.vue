<script>
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config"; 
import NewPasien from '../../components/form/new_pasien.vue'
import { mapActions, mapState } from 'vuex';
import Swal from 'sweetalert2'

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
    PageHeader, NewPasien
  },
  computed: {
    ...mapState('pasien', ['pasien_data']),
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
    pasiens_waiting: function(){
      return this.pasien_data?.pasiens_waiting || []
    },
    pasiens_periksa: function(){
      return this.pasien_data?.pasiens_periksa || []
    },
    pasiens_done: function(){
      return this.pasien_data?.pasiens_done || []
    },
  },
  watch: {
    
    },
  mounted() {
    this.pasienGetListWaiting()
    this.pasienGetListPeriksa()
    this.pasienGetListDone()
  },
  methods: {
    ...mapActions('pasien', ['pasienGetListWaiting', 'pasienGetListPeriksa', 'pasienGetListDone', 'pasienDeleteToList', 'pasienPutListEdit']),
    toggleModal(){
      this.isModalOpen = !this.isModalOpen
    },
    handlePeriksa(item){
      Swal.fire({
        title: 'Yakin akan memasukan pasien ini dalam pemeriksaan?',
        showDenyButton: false,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await this.pasienPutListEdit({payload:{wl_status: 'periksa'}, id: item.wl_id})
          this.pasienGetListPeriksa()
          Swal.fire('Berhasil!', '', 'success')
          window.location.reload()
        } 
      })
    },
    deleteList(item){
      Swal.fire({
        title: 'Yakin menghapus data ini?',
        showDenyButton: false,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hapus',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await this.pasienDeleteToList(item.wl_id)
          if(item.wl_status == 'wait'){
            this.pasienGetListWaiting()
          } else if(item.wl_status == 'periksa'){
            this.pasienGetListPeriksa()
          } else {
            this.pasienGetListDone()
          }
          Swal.fire('Terhapus!', '', 'success')
        } 
      })
    },
    onSubmitPasien(){
      this.toggleModal()
      this.pasienGetListWaiting()
      window.location.reload()
    }
  },
  data() {
    return {
      form: {},
      header: {
        title: "Selamat Pagi"
      },
      user: {},
      jenisOption:['Sudah pernah berobat', 'Saya sudah pernah berobat disini'],
      isModalOpen: false
    };
  },
};
</script>

<template>
  <div class="p">
    <PageHeader :title="time_of_day" :items="header.items" /> 
    <b-row>
      <b-col col lg="6">
        <div :style="{}" class="card p-4 shadow" style="border:1px solid #2F80ED">
          <div class="d-flex flex-wrap justify-content-between">
            <h5 class="mb-0">Antrian Pasien <b-badge variant="danger" class="m-auto">{{pasiens_waiting.length}}</b-badge></h5>
            <label  class="text-primary" style="cursor:pointer" @click="toggleModal()">+ Tambah manual</label>
          </div>

          <div v-for="(item,idx) in pasiens_waiting" :key="item">
            <div class="w-100 dt-row d-flex align-items-center px-3 mt-2" v-if="item.pasien">
              <span class="mr-3 py-1 font-weight-bold">{{idx+1}}.</span>
              <span class="py-1 mr-auto">{{item.pasien.pasien_name}}</span>
              <span class="text-right py-1">No. <strong class="text-primary">{{item.wl_pasien_id}}</strong></span>
              <span class="text-center px-3 py-0" @click="handlePeriksa(item)">
                <div class="py-2 periksa px-3 h-100">
                  Periksa
                </div>
              </span> 
              <b-dropdown dropleft variant="outline-light" size="sm">
                <template #button-content>
                  <i class="fa fa-ellipsis-v text-primary" />
                </template>
                <b-dropdown-item
                  href="#" 
                  @click="deleteList(item)"
                  ><i class="fa fa-trash text-danger mr-2" />Hapus</b-dropdown-item
                >
              </b-dropdown>
            </div>
          </div>  
        </div>
      </b-col>
      <b-col col lg="6">
        <div :style="{}" class="card p-4 shadow" style="border:1px solid #F2994A">
          <div class="d-flex flex-wrap justify-content-between">
            <h5 class="mb-0">Pasien yang <strong>sedang</strong> diperiksa <b-badge variant="danger" class="m-auto">{{pasiens_periksa.length}}</b-badge></h5> 
          </div>

          <div v-for="(item,idx) in pasiens_periksa" :key="item">
            <div class="w-100 dt-row d-flex align-items-center px-3 mt-2" v-if="item.pasien">
            <span class="mr-3 py-1 font-weight-bold">{{idx+1}}.</span>
            <span class="py-1 mr-auto">{{item.pasien.pasien_name}}</span>
            <span class="text-right py-1 px-5">No. <strong class="text-primary">{{item.wl_pasien_id}}</strong></span> 
            <!-- <b-dropdown dropleft variant="outline-light" size="sm">
              <template #button-content>
                <i class="fa fa-ellipsis-v text-primary" />
              </template>
              <b-dropdown-item
                href="#" 
                @click="deleteList(item)"
                ><i class="fa fa-trash text-danger mr-2" />Hapus</b-dropdown-item
              >
            </b-dropdown> -->
            </div>
          </div>  
        </div>

        <div :style="{}" class="card p-4 shadow" style="border:1px solid #EAEAEA">
          <div class="d-flex flex-wrap justify-content-between">
            <h5 class="mb-0">Pasien yang <strong>sudah</strong> diperiksa <b-badge variant="danger" class="m-auto">{{pasiens_done.length}}</b-badge></h5> 
          </div>

          <div v-for="(item,idx) in pasiens_done" :key="item">
            <div class="w-100 dt-row d-flex align-items-center px-3 mt-2" v-if="item.pasien">
            <span class="mr-3 py-1 font-weight-bold">{{idx+1}}.</span>
            <span class="py-1 mr-auto">{{item.pasien.pasien_name}}</span>
            <span class="text-right py-1 px-5">No. <strong class="text-primary">{{item.wl_pasien_id}}</strong></span> 
            <!-- <b-dropdown dropleft variant="outline-light" size="sm">
              <template #button-content>
                <i class="fa fa-ellipsis-v text-primary" />
              </template>
              <b-dropdown-item
                href="#" 
                @click="deleteList(item)"
                ><i class="fa fa-trash text-danger mr-2" />Hapus</b-dropdown-item
              >
            </b-dropdown> -->
            </div>
          </div>  
        </div>
      </b-col>
    </b-row>


    <div class="position-absolute d-flex justify-content-center" style="width:100vw;height:100vh;top:0;left:0;z-index:9999;background:rgba(0, 0, 0, 0.64);" v-if="isModalOpen">
      <div class="bg-white rounded-lg p-4 mb-auto mt-5 w-100" style="max-width:450px">
        <new-pasien :isAdmin="true" @closed="toggleModal()" @submit="onSubmitPasien()" />
      </div>
    </div>
    <div class="position-absolute d-flex justify-content-center" style="width:100vw;height:100vh;top:0;left:0;z-index:9999;background:rgba(0, 0, 0, 0.64);" v-if="isModalSuccess">
      <div class="bg-white rounded p-4 w-100 my-auto d-flex flex-column" style="max-width:450px">
        <img src="../../assets/medicloud/check-circle.png" class="mx-auto" />
        <h4 class="mx-auto text-center mt-2 font-weight-bold">Tambah data pasien berhasil</h4>
      </div>
    </div>
    <div class="position-absolute d-flex justify-content-center" style="width:100vw;height:100vh;top:0;left:0;z-index:9999;background:rgba(0, 0, 0, 0.64);" v-if="isModalError">
      <div class="bg-white rounded p-4 w-100 my-auto d-flex flex-column" style="max-width:450px">
        <img src="../../assets/medicloud/x-circle.png" class="mx-auto" />
        <h4 class="mx-auto text-center mt-2 font-weight-bold">Tambah data pasien gagal</h4>
      </div>
    </div>


  </div>
</template>

<style>
  .dt-row {
    border: 1px solid #EAEAEA;
    border-radius: 5px;
  }
  .dt-row:hover {
    border: 1px solid #2F80ED;
    border-radius: 10px;
  }
  .periksa {
    background: white;
  }
  .periksa:hover {
    color: white;
    font-weight: bold;
    cursor: pointer;
    background: #2F80ED;
  }
  tr.spaceUnder>td {
    padding-bottom: 1em;
  }
</style>

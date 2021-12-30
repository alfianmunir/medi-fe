<script>
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config"; 
// import NewPasien from '../../components/form/new_pasien.vue'
import DataTable from './dt.vue'
import {mapActions, mapState} from 'vuex'

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
    PageHeader, DataTable
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
    tableData: function(){ 
      return this.pasien_data?.pasiens
    }
  },
  watch: {

  },
  mounted() {
    this.pasienGetAll()
  },
  methods: {
    ...mapActions('pasien', ['pasienGetAll']),
    toggleModal(){
      this.isModalOpen = !this.isModalOpen
    },
    addNewPasien(){

    },
    onFiltered(filteredItems) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
    },
  },
  data() {
    return {
        form: {},
        user: {},
        tableHeader: [
            {
                key: "pasien_id",
                sortable: true,
                label:'No Kartu'
            },
            {
                key: "pasien_name",
                sortable: true,
                label: 'Nama'
            },
            {
                key: "pasien_umur",
                sortable: true,
                label: 'Umur'
            },
            {
                key: "pasien_gender",
                sortable: true,
                label: 'Jenis Kelamin'
            },
            {
                key: "pasien_lastarrival",
                sortable: true,
                label: 'Terakhir Berobat'
            },
            {
                key: "pasien_alamat",
                sortable: true,
                label: 'Alamat'
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
    <PageHeader :title="'Data Pasien'"  />   
    <DataTable :tableData='tableData' :tableHeader='tableHeader' sortInit='name'></DataTable>

  </div>
</template>
 
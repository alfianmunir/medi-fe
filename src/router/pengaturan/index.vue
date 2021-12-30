<script>
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";  

import {mapState, mapActions} from 'vuex'
import Swal from 'sweetalert2';

export default {
  page: {
    title: "Pengaturan",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    PageHeader
  },
  computed: {
    ...mapState('logs', ['fee_berobat']),
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
    }
  },
  watch: {
    fee_berobat: {
      immediate: true,
      deep: true,
      handler: function(val){
        this.pengaturan.fee_berobat = val?.pengaturan_value
      }
    }
  },
  mounted() {
    this.getPengaturan()
  },
  methods: { 
    ...mapActions('logs', ['getPengaturan', 'putPengaturan']),
    currency(e){
      const number = String(e).replace(/[^0-9]/g, "");
      return 'Rp.' + new Intl.NumberFormat().format(number)
    },
    submit(){
      this.putPengaturan({
        payload: {
          pengaturan_value : parseFloat(this.pengaturan?.fee_berobat)
        },
        id:this.fee_berobat?.pengaturan_key
      })
      this.getPengaturan()
      Swal.fire('Sukses menyimpan data!', '', 'success').then(() => {
        window.location.reload()
      })
    }
  },
  data() {
    return {
        form: {},
        pengaturan: {}, 
    };
  },
};
</script>

<template>
  <div> 
    <PageHeader :title="'Pengaturan'"  />  
    <div style="visibility:hidden">{{fee_berobat}}</div>
    <div class="d-flex flex- align-items-center mt-5" style="max-width:600px">
        <label style="width:100px;" class="mb-0">Fee berobat</label>
        <b-form-input
          v-model="pengaturan.fee_berobat"
          type="text" 
          placeholder="Rp."
          class="mx-3"
          required
        ></b-form-input>
        <b-button variant="primary" @click="submit()">
          Simpan
        </b-button>
    </div>
  </div>
</template>
 
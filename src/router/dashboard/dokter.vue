<script>
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config"; 
import PasienDetail from '../manajemen_pasien/dt_detail'
import Multiselect from 'vue-multiselect'

import {mapActions, mapState} from 'vuex' 
import Swal from 'sweetalert2';

export default {
  page: {
    title: "Dashboard Dokter",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    PageHeader, PasienDetail, Multiselect
  },
  computed: {
    ...mapState('pasien', ['pasien_data']),
    ...mapState('obat', ['obat_data']),
    ...mapState('logs', ['fee_berobat']),
    pasiens_periksa: function(){
      return this.pasien_data?.pasiens_periksa
    },
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
    tableDataDetail: function(){
        return this.obat_data?.obats_by_pasien
    }
  },
  watch: {
    pasiens_periksa(val){
      if(val){
        this.sections = val.map(item => ({
          ...item, rm: item.rekam_medi, rm_obats: item.rekam_medi.obats.map(obat => ({...obat, ...obat.obat_rekam_medis}))
        }))
      }
    }
  },
  mounted() {
    this.pasienGetListPeriksa()
    this.obatGetAll()
    this.getPengaturan()
  },
  methods: {
    ...mapActions('pasien', ['pasienGetListPeriksa', 'pasienPostToEdit', 'pasienPutListEdit', 'deleteRekamMedisPasien']),
    ...mapActions('obat', ['obatGetAllByPasien', 'obatGetAll', 'rekamMedisToEdit', 'obatRekamMedisPutToEdit', 'obatRekamMedisPostToCreate']),
    ...mapActions('logs', ['getPengaturan']),
    toggleModal(){
      this.isModalOpen = !this.isModalOpen
    },
    toggleModalDetail() {
        this.detailS = {}
        this.isOpenDetail = !this.isOpenDetail
    }, 
    detail(pasien){
        this.toggleModalDetail()
        this.detailS = pasien
        this.obatGetAllByPasien(pasien?.pasien_id)
    },
    add_obat(idx){
      this.sections[idx].rm_obats = [...this.sections[idx].rm_obats, {orm_obat_strip:1}]
    },
    sum_harga_obat(idx){
      let harga = 0
      this.sections[idx].rm_obats.forEach(element => {
          harga += parseInt(element.obat_harga) * element.orm_obat_strip
      });
      return new Intl.NumberFormat().format(harga + parseInt(this.fee_berobat?.pengaturan_value))
    },
    batal(idx){ 
      let rm_id = this.sections[idx].wl_rm_id
      this.pasienPutListEdit({payload:{wl_status:'wait', wl_rm_id: null}, id: this.sections[idx].wl_id })
      this.deleteRekamMedisPasien(rm_id)
      Swal.fire('Sukses membatalkan pemeriksaan!', '', 'success').then(() => {
        window.location.reload()
      })
    },
    selesai(idx){
      this.pasienPutListEdit({payload:{wl_status:'done'}, id: this.sections[idx].wl_id })
      Swal.fire('Pemeriksaan pasien selesai!', '', 'success').then(() => {
        window.location.reload()
      })
    },
    async simpan(idx){
      let rekam_medis = this.sections[idx].rm
      let rm_id = this.sections[idx].wl_rm_id
      let obats = this.sections[idx].rm_obats
      obats.forEach(async (obat,obt_idx) => { 
        if(obat.orm_id) await this.obatRekamMedisPutToEdit({payload: {orm_obat_strip: obat.orm_obat_strip}, id: obat.orm_id })
        else {
          const obatdata = await this.obatRekamMedisPostToCreate({orm_rm_id: rm_id, orm_obat_id: obat.obat_id, orm_obat_strip: obat.orm_obat_strip })
          this.sections[idx].rm_obats[obt_idx].orm_id = obatdata.orm_id
        }
      })
      await this.rekamMedisToEdit({payload:rekam_medis, id:rm_id}) 
      await this.pasienPostToEdit({payload: {pasien_alergi: this.sections[idx].pasien.pasien_alergi}, id: this.sections[idx].pasien.pasien_id})
      Swal.fire('Sukses menyimpan data!', '', 'success').then(() => {
        window.location.reload()
      })
    }
  },
  data() {
    return {
      sections: [],
      form: {},
      detailS: {},
      isOpenDetail: false,
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
    <div class="card" style="height:50vh" v-if="sections.length < 1">
      <div class="card-body d-flex">
        <h2 class="m-auto font-weight-bold">Tidak ada pasien periksa</h2>
      </div>
    </div>
    <div :style="{}" class="card p-4 shadow-lg" style="border:1px solid #EAEAEA" v-for="(item,idx) in sections" :key="idx+'SECTIONIDX'"> 
      <div class="p-2 card-body" >
          <!-- <h4 class="font-weight-bold mb-3">Rekam Medis Pasien</h4> -->
          <b-row>
              <b-col col md="4">
                  <table>
                      <tr>
                          <td>No. Kartu</td>
                          <td class="px-3">:</td>
                          <td><strong>{{item.wl_id}}</strong>/{{item.pasien.pasien_id}}</td>
                      </tr>
                      <tr>
                          <td>Nama</td>
                          <td class="px-3">:</td>
                          <td>{{item.pasien.pasien_name}}</td>
                      </tr>
                      <tr>
                          <td>Alamat</td>
                          <td class="px-3">:</td>
                          <td>{{item.pasien.pasien_alamat}}</td>
                      </tr>
                  </table>
              </b-col>
              <b-col col md="4">
                  <table>
                      <tr>
                          <td>Jenis Kelamin</td>
                          <td class="px-3">:</td>
                          <td>{{item.pasien.pasien_gender}}</td>
                      </tr>
                      <tr>
                          <td>Umur</td>
                          <td class="px-3">:</td>
                          <td>{{item.pasien.pasien_umur}} Tahun</td>
                      </tr>
                      <tr>
                          <td>Alergi</td>
                          <td class="px-3">:</td>
                          <td>
                            <b-form-input type="text" placeholder="Alergi" v-model="item.pasien.pasien_alergi" size="sm" />
                          </td>
                      </tr>
                  </table>
              </b-col>
              <b-col col md="4">
                  <table>
                      <tr>
                          <td>Terakhir Berobat</td>
                          <td class="px-3">:</td>
                          <td>{{(new Date(item.pasien.pasien_lastarrival)).toLocaleDateString()}}</td>
                      </tr>
                      <tr>
                          <td>Waktu</td>
                          <td class="px-3">:</td>
                          <td>{{(new Date(item.pasien.pasien_lastarrival)).toLocaleTimeString()}}</td>
                      </tr>
                  </table>
              </b-col>
          </b-row>
          <b-button variant="primary"  @click="detail(item.pasien)" block class="my-3" >
            Lihat Rekam Medis Pasien
          </b-button>
          <div class="d-flex">
            <b-form-group :id="'temp'+idx+'SECTION'" label="Temp" :label-for="'temp'+idx" class="w-100 mx-2">
              <b-form-input
                :label-for="'temp'+idx"
                v-model="item.rm.rm_temp"
                placeholder="Temp"
                required
              ></b-form-input>
            </b-form-group> 
            <b-form-group :id="'tensi'+idx+'SECTION'" label="Tensi" :label-for="'tensi'+idx" class="w-100 mx-2">
              <b-form-input
                :label-for="'tensi'+idx"
                v-model="item.rm.rm_tensi"
                placeholder="Tensi"
                required
              ></b-form-input>
            </b-form-group> 
            <b-form-group :id="'gula-darah'+idx+'SECTION'" label="Gula Darah" :label-for="'gula-darah'+idx" class="w-100 mx-2">
              <b-form-input
                :label-for="'gula-darah'+idx"
                v-model="item.rm.rm_gula_darah"
                placeholder="Gula Darah"
                required
              ></b-form-input>
            </b-form-group> 
            <b-form-group :id="'kolesterol'+idx+'SECTION'" label="Kolesterol" :label-for="'kolesterol'+idx" class="w-100 mx-2">
              <b-form-input
                :label-for="'kolesterol'+idx"
                v-model="item.rm.rm_kolesterol"
                placeholder="Kolesterol"
                required
              ></b-form-input>
            </b-form-group> 
            <b-form-group :id="'asam-urat'+idx+'SECTION'" label="Asam Urat" :label-for="'asam-urat'+idx" class="w-100 mx-2">
              <b-form-input
                :id="'asam-urat'+idx"
                v-model="item.rm.rm_asam_urat"
                placeholder="Asam Urat"
                required
              ></b-form-input>
            </b-form-group> 
          </div>
          <div class="d-flex">
            <b-form-group :id="'anamnesa'+idx+'SECTION'" label="Anamnesa" :label-for="'anamnesa'+idx" class="w-100 mx-2">
              <b-form-textarea
                id="textarea"
                v-model="item.rm.rm_anamnesa"
                placeholder="Asam Urat"
                rows="6"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
            <b-form-group :id="'diagnosa'+idx+'SECTION'" label="Diagnosa" :label-for="'diagnosa'+idx" class="w-100 mx-2">
              <b-form-textarea
                id="textarea"
                v-model="item.rm.rm_diagnosa"
                placeholder="Diagnosa"
                rows="6"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </div>
          <div class=" justify-content-between mx-2">
            <label>
              Terapi/Obat
            </label>
            <div class="d-flex flex-wrap align-items-center w-100"> 
              <div v-for="(obat,idx_obat) in item.rm_obats" :key="idx_obat+'OBATSECTION'" style="width:fit-content" :class="`d-flex ${idx_obat != 0 ? 'ml-3' : ''}`">
                <!-- {{obat.orm_id}} -->
                  <multiselect v-model="sections[idx].rm_obats[idx_obat]" :options="obat_data.obats" label='obat_name' trackBy='obat_id' :disabled='obat.orm_id'
                    style="border-top-right-radius:0px;border-bottom-right-radius:0px;width:200px"
                  ></multiselect> 
                  <b-form-input
                    v-model="obat.orm_obat_strip"
                    style="width:60px;border-top-left-radius:0px;border-bottom-left-radius:0px"
                    type="number" 
                    required
                  ></b-form-input>
              </div>
              <div :class="`d-flex rounded-circle ${item.rm_obats.length > 0 ? 'ml-3' : ''}`" style="width:30px;height:30px;border:1px solid #2F80ED;cursor:pointer" @click="add_obat(idx)">
                <i class="m-auto fa fa-plus text-primary font-weight-bold rounded-circle" style="" />
              </div>
            </div>
            <div class="d-flex align-items-center">
              <h6 class="text-right text-muted mr-auto">Total biaya pengobatan: <strong>Rp. {{sum_harga_obat(idx)}}</strong></h6>
              <div class="d-flex mt-auto">
                <b-button variant="outline-danger" class="mx-1" @click="batal(idx)" >Batal memeriksa</b-button>
                <b-button variant="outline-primary" class="mx-1" @click="selesai(idx)" >Pemeriksaan selesai</b-button>
                <b-button variant="primary" class="mx-1 px-3" @click="simpan(idx)" >Simpan</b-button>
              </div>
            </div>
          </div>
      </div>
    </div>

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

<style src="vue-multiselect/dist/vue-multiselect.min.css">
<template> 
  <form class="form-horizontal"> 
    <h3 :class="`text-center mb-5 align-items-center d-flex justify-content-center position-relative ${isAdmin ? 'mt-3' : ''}`">
      <i class="fa fa-chevron-left mr-3 position-absolute my-auto mb-0 font-size-16" style="left:5%;cursor:pointer" @click="prev()" v-if="step != 0 && !newR"> </i>
      <i class="fa fa-times mr-3 position-absolute my-auto mb-0 font-size-16" style="right:0%;cursor:pointer" @click="closed()" v-if="isAdmin"> </i>
      <span v-if="!isAdmin">Form Pendaftaran Antrian</span>
      <span v-else class="position-absolute h4 font-weight-bold mb-0">Tambah pasien manual</span>
    </h3>  
    <div v-if="step == 0">
      <label class="text-secondary" v-if="!isAdmin">Pilih status kunjungan anda</label>
      <label class="text-secondary" v-if="isAdmin">Jenis Pasien</label>
      <button
        :class="`btn btn-${
          status == 'new' ? 'outline-primary' : 'outline-secondary'
        } btn-block`"
        type="button"
        @click="onStatus('new')"
      >
        <span v-if="!isAdmin">Belum pernah pernah berobat</span>
        <span v-if="isAdmin">Ini kunjungan pertamanya</span>
      </button>
      <button
        :class="`btn btn-${
          status == 'old' ? 'outline-primary' : 'outline-secondary'
        } btn-block`"
        type="button"
        @click="onStatus('old')"
      >
        <span>Sudah pernah berobat</span>
      </button>

      <div class="mt-3">
        <button
          :class="`btn btn-${status ? 'primary' : 'secondary'} btn-block`"
          type="button"
          @click="next()"
        >
          Selanjutnya >
        </button>
      </div>
    </div>
    <div v-if="step == 1 && status == 'new'">
      <b-form-group label="Nama anda">
        <b-form-input v-model="user.name" trim></b-form-input>
      </b-form-group>

      <b-row>
        <b-col col lg="6">
          <b-form-group label="Umur anda">
            <b-form-input v-model="user.age" type="number" trim></b-form-input>
          </b-form-group>
        </b-col>
        <b-col col lg="6">
          <b-form-group label="Jenis kelamin anda">
            <b-form-select v-model="user.gender" :options="options"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <b-form-group label="Alamat anda">
        <b-form-textarea
          v-model="user.address"
          placeholder="Alamat anda..."
          rows="2"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>

      <div class="mt-3">
        <button
          :class="`btn btn-${user_valid ? 'primary' : 'secondary'} btn-block`"
          type="button"
          @click="submit()"
        >
          Daftar antrian
        </button>
      </div>

    </div>

    <div v-if="step == 1 && status == 'old'">
      <b-form-group label="Masukan nomor kartu berobat anda" :state="user_found_valid">
        <b-form-input
          v-model="user_number"
          :formatter="numberOnly"
          trim
          :state="user_found_valid"
        ></b-form-input>
      </b-form-group> 

      <p v-if="user_found_valid == false" class="text-danger mt-3">
        * Data tidak ditemukan !
      </p>
      <p v-else-if="user_found == null" class="text-warning mt-3">
        * Nomor harus sesuai dengan nomor di kartu berobat
      </p>
      <p class="text-dark mt-3" v-else>Nama anda: <strong>{{ user_found.pasien_name.toUpperCase() }}</strong></p>

      <div class="mt-3">
        <button
          :class="`btn btn-${user_found_valid ? 'primary' : 'secondary'} btn-block`"
          type="button"
          @click="submit()"
        >
          Daftar antrian
        </button>
      </div>
    </div>
  </form>
</template>

<script>

import {mapActions, mapState} from 'vuex'
import Swal from 'sweetalert2'

export default {
  props:{
      isAdmin : Boolean,
      newR: Boolean,
      noUpList: Boolean,
      pasienData: Object,
      pasienID: String,
      isPasien: Boolean
  }, 
  data() {
    return {
      status: null,
      step: 0,
      user: { gender: null },
      user_valid: false,
        user_number: "",
        user_found : null,
      options: [
        { value: null, text: "-- pilih salah satu --" },
        { value: "Laki-Laki", text: "Laki-Laki" },
        { value: "Perempuan", text: "Perempuan" },
      ],
    };
  },
  watch: {
    pasienData : {
      immediate: true,
      deep: true,
      handler: function(val){
        this.user = {...this.user, ...val}
      }
    },
    user: {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.user_valid = val.name && val.age && val.gender && val.address;
      },
    },
    async user_number(val) {
      if (val.length > 0) {
        this.pasienSearchByID(val).then(res => {
          this.user_found = res
        }).catch(() => {
          this.user_found = null
        })
        this.$forceUpdate()
      } else {
        this.user_found = null
      }
    },
    newR: {
      immediate: true,
      handler: function(val){
      if(val){
          this.step = 1
          this.status = 'new'
        }
      }
    }
  },
  computed: {
    ...mapState('pasien', ['pasien_data']),
    // user_found: function(){
    //   return this.pasien_data?.pasienByID
    // },
    user_found_valid: function () {
      if (this.user_number && this.user_found) return true;
      else if (this.user_number && !this.user_found) return false;
      else return null;
    },
  },
  emits:['closed', 'submit'],
  methods: {
    ...mapActions('pasien', ['pasienSearchByID','pasienPostToWaiting','pasienGetListWaiting', 'pasienPostToCreate', 'pasienPostToEdit']),
    reset(){
      this.status = null
      this.step = 0
      this.user = { gender: null }
      this.user_valid = false
      this.user_number = ""
      this.user_found = null
    },
    numberOnly(e) {
      return String(e).replace(/[^0-9]/g, "");
    },
    closed(){
        this.$emit('closed')
    },
    onStatus(e) {
      this.status = e;
    },
    next() {
      if (this.status) this.step = 1;
    },
    prev() {
      this.step -= 1;
    }, 
    async submit() {
      if (this.user_valid && this.status == "new"){ 
          const payload = {
            pasien_name: this.user.name,
            pasien_umur: this.user.age,
            pasien_gender: this.user.gender,
            pasien_alamat: this.user.address,
          }
          if(this.pasienID){
            this.pasienPostToEdit({payload, id: this.pasienID}).then(() => {
            })
          } else {
            this.pasienPostToCreate(payload).then(async res => {
              let paylod = {
                wl_pasien_id: res.pasien_id,
                wl_status: 'wait'
              }
              if(!this.noUpList)
                await this.pasienPostToWaiting(paylod)
            }).catch(err => alert(err))
          }
          this.$emit('submit')
          this.reset()
      }
      else if (this.status == "old") {
        const payload = {
          wl_pasien_id : this.user_found?.pasien_id,
          wl_status : 'wait'
        }
        await this.pasienPostToWaiting(payload)
        if(this.isPasien){
          this.$emit('submit')
        } else {
          Swal.fire({ 
            icon: 'success',
            title: 'Sukses menambahkan ke antrian. Silahkan menunggu.',
            showConfirmButton: false,
            timer: 1500
          })
          this.pasienGetListWaiting()
          this.$emit('closed')
          this.reset()
        }
      }
    },
  },
};
</script>

<style>
.login-back {
  position: absolute;
  left: 10%;
}
.login-back:hover {
  color: #1b71e5;
  cursor: pointer;
}
</style>

<template> 
  <form class="form-horizontal">
    <h3 :class="`text-center mb-5 align-items-center d-flex justify-content-center position-relative ${isAdmin ? 'mt-3' : ''}`"> 
      <i class="fa fa-times mr-3 position-absolute my-auto mb-0 font-size-16" style="right:0%;cursor:pointer" @click="closed()" v-if="isAdmin"> </i>
      <span v-if="!isAdmin">Form Pendaftaran Antrian</span>
      <span v-else class="position-absolute h4 font-weight-bold mb-0">Tambah data obat</span>
    </h3> 
      <b-form-group label="Nama obat">
        <b-form-input v-model="obat.name" :disabled='stokOnly' trim></b-form-input>
      </b-form-group>

      <b-row>
        <b-col col lg="6">
          <b-form-group label="Stok">
            <b-form-input v-model="obat.stok" type="number" :style="stokOnly && {color:'red', fontWeight:'bold'}" trim></b-form-input>
          </b-form-group>
        </b-col>
        <b-col col lg="6">
          <b-form-group label="Harga">
            <b-form-input v-model="obat.harga" type="text" :disabled='stokOnly' :formatter="currency" trim></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-form-group label="Kandungan obat">
        <b-form-textarea :disabled='stokOnly'
          v-model="obat.kandungan"
          placeholder="Kandungan obat..."
          rows="2"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>

      <div class="mt-3">
        <button
          :class="`btn btn-${obat_valid ? 'primary' : 'secondary'} btn-block`"
          type="button"
          @click="submit()"
        >
          Simpan data obat
        </button>
      </div> 
  </form>
</template>

<script>
import {mapActions} from 'vuex'
import Swal from 'sweetalert2'

export default {
    props:{
        isAdmin : Boolean,
        obatData: Object,
        obatID: String,
        stokOnly: Boolean,
    }, 
  data() {
    return {
      obat: { gender: null, stok: 0, harga: 'Rp.0' },
    };
  },
  watch: {
    obatData : {
      immediate: true,
      deep: true,
      handler: function(val){
        this.obat = {...this.obat, ...val}
      }
    },
    obat: {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.obat_valid = val.name && val.stok && val.harga && val.kandungan;
      },
    },
  }, 
  emits:['closed', 'submit'],
  methods: {
    ...mapActions('obat', ['obatPostToCreate', 'obatPutToEdit']),
    currency(e){
      const number = String(e).replace(/[^0-9]/g, "");
      return 'Rp.' + new Intl.NumberFormat().format(number)
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
    submit() {
      const payload = {
        obat_name: this.obat.name,
        obat_stok: this.obat.stok,
        obat_harga: String(this.obat.harga).replace(/[^0-9]/g, ""),
        obat_kandungan: this.obat.kandungan
      }
      if(this.obatID){
        this.obatPutToEdit({payload, id: this.obatID}).then(() => {
          Swal.fire({ 
            icon: 'success',
            title: 'Sukses mengedit obat.',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.$emit('submit')
            window.location.reload()
          })
        })
      } else {
        this.obatPostToCreate(payload).then(() => {
          Swal.fire({ 
            icon: 'success',
            title: 'Sukses menambahkan obat.',
            showConfirmButton: false,
            timer: 1500
          })
          this.$emit('submit')
            window.location.reload()
        }).catch(err => alert(err))
      }
      console.log(payload)
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
input:disabled {
  color: #BDBDBD;
  border: 1px solid #EAEAEA;
}
textarea:disabled {
  border: 1px solid #EAEAEA;
  color: #BDBDBD;

}
</style>
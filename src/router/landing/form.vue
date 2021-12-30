<template>
  <form class="form-horizontal"> 
    <h3 class="text-center mb-2 text-white">Selamat datang di</h3>
    <h1 class="text-center mb-4 text-white font-weight-bolder" style="font-size:48px">Klinik dr. Martini Husni</h1>
     
    <div class="d-flex">  
      <div class="m-auto">
        <button :class="`btn btn-primary px-5 font-weight-bold`" type="button" style="width:fit-content" @click="submit()">
          DAFTAR ANTRIAN
        </button>
      </div> 
    </div>

  </form>
</template>

<script>
export default { 
  methods: { 
    submit(){
      this.$router.push('/login')
    }
  },
};
</script> 

<script>
import moment from 'moment'
import DigitalClock from "vue-digital-clock";

export default {
  components: {DigitalClock}, 
  props: {
    title: {
      type: String,
      default: '',
    }, 
  },  
  computed:{ 
    day: function(){
      return moment().locale('id').format('dddd, Do MMMM YYYY')
    },
    isDashboard: function(){
      return this.title.includes('Selamat')
    },
    isMalam: function(){
      return this.title.includes('Malam')
    },
    time: function(){
      return moment().locale('id').format('h:mm:ss a');
    }
  }
}
</script>

<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div class="page-title-box d-flex flex-wrap align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <h2 class="mb-0 mr-2">{{ title }}</h2>
          <img src="../assets/medicloud/moon.png" style="max-height:40px" v-if="isDashboard && isMalam" />
          <img src="../assets/medicloud/sun.png" style="max-height:40px" v-if="isDashboard && !isMalam" />
        </div>  

        <span class="d-flex">
          <img src="../assets/medicloud/clock.png" class="m-auto" />
          <h2 class="mb-0 ml-3"><digital-clock :blink="true" :displaySeconds='true' /></h2>
        </span>

        <span class="d-flex">
          <img src="../assets/medicloud/calendar.png" class="m-auto"  />
          <h2 class="mb-0 ml-3">{{day}}</h2>
        </span>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>

<script>
 import { layoutComputed, authMethods } from "@/state/helpers";
// import Loading from 'vue-loading-overlay';
 
import {mapState} from 'vuex'

/**
 * Vertical layout
 */
export default {
  components: {  
    // Loading 
  },  
  watch : {
    isHidden(val){
      this.isMenuCondensed = val ? val : false
    }
  },
  computed: {
    ...layoutComputed,
    user : mapState('auth',['data']).data,
    pasienLoading: mapState('pasien',['isLoading']).isLoading, 
    isLoading: function(){
      return this.pasienLoading
    }
  }, 
  methods: {
    ...authMethods, 
  }, 
};
</script>

<template>
  <div> 
    <!-- <loading :active.sync="isLoading" 
        is-full-page lock-scroll loader='dots' color='#51A5F1'
    />   -->
    <div id="preloader" style="background:rgba(0,0,0,.5)" v-if="isLoading">
      <div id="status">
        <div class="spinner-chase">
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
        </div>
      </div>
    </div>
    <div id="layout-wrapper"> 
      <!-- ============================================================== -->
      <!-- Start Page Content here -->
      <!-- ============================================================== -->
 
          <!-- Start Content--> 
      <slot />
      <transition name="fade" mode="out-in">
      <router-view />
      </transition>   
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { layoutComputed, authMethods } from "@/state/helpers";
// import Loading from 'vue-loading-overlay';

import NavBar from "@/components/nav-bar";
import SideBar from "@/components/side-bar"; 
import {mapState} from 'vuex'

/**
 * Vertical layout
 */
export default {
  components: { NavBar, SideBar,  
    // Loading 
  },
  props: {
    isHidden: Boolean
  },
  data() {
    return {
      isMenuCondensed: this.$props.isHidden ? this.$props.isHidden : false,
    };
  },
  watch : {
    isHidden(val){
      this.isMenuCondensed = val ? val : false
    },
    $route(){
      if(this.isMenuCondensed){
        document.body.classList.toggle("sidebar-enable");
        document.body.classList.toggle("vertical-collpsed");
      }
    }
  },
  computed: {
    ...layoutComputed,
    user : mapState('auth',['data']).data,
    pasienLoading: mapState('pasien',['isLoading']).isLoading, 
    obatLoading: mapState('obat',['isLoading']).isLoading, 
    logLoading: mapState('logs',['isLoading']).isLoading, 
    isLoading: function(){
      return this.pasienLoading || this.obatLoading || this.logLoading
    }
  },
  created: () => {
    document.body.removeAttribute("data-layout", "horizontal");
    document.body.removeAttribute("data-topbar", "dark");
    document.body.removeAttribute("data-layout-size", "boxed");
    document.body.classList.remove("auth-body-bg");
  },
  methods: {
    ...authMethods,
    toggleMenu() {
      document.body.classList.toggle("sidebar-enable");

      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
          document.body.classList.remove("vertical-collpsed");
        });
        document.body.classList.toggle("vertical-collpsed");
      } else {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
        document.body.classList.remove("vertical-collpsed");
      }
      this.isMenuCondensed = !this.isMenuCondensed;
    },
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    },
  },
  mounted() {
    // if(!this.user || !this.user.name){
    //   this.getUserData()
    // }
    if (this.loader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
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
      <NavBar :is-condensed="isMenuCondensed" />
      <SideBar :is-condensed="isMenuCondensed" :type="leftSidebarType" :width="layoutWidth" />
      <!-- ============================================================== -->
      <!-- Start Page Content here -->
      <!-- ============================================================== -->

      <div class="main-content">
        <div class="page-content">
          <!-- Start Content--> 
          <div class="container-fluid"> 
            <!-- <slot /> -->
            <transition name="fade" mode="out-in">
            <router-view />
            </transition>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

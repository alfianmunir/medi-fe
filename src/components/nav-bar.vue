<script>
import axios from "axios";

import i18n from "../i18n";

import simplebar from "simplebar-vue";
import { mapActions, mapState } from 'vuex';
import moment from 'moment'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
/**
 * Nav-bar Component
 */
export default {
  props: {
    isCondensed: {
      type: Boolean,
      default: false,
    },
  }, 
  data() {
    return {
      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French",
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "Spanish",
        },
        {
          flag: require("@/assets/images/flags/chaina.png"),
          language: "zh",
          title: "Chinese",
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic",
        },
      ],
      lan: i18n.locale,
      text: null,
      flag: null,
      value: null,
    };
  },
  components: { simplebar },
  computed: {
    ...mapState('logs', ['log_data']),
    name: function(){
      return cookies.get('user_name')
    }
  },
  mounted() {
    this.logsGetAll()
    this.value = this.languages.find((x) => x.language === i18n.locale);
    this.text = this.value.title;
    this.flag = this.value.flag;
  },
  methods: {
    ...mapActions('logs', ['logsGetAll', 'logsDelete']),
    ...mapActions('auth', ['logout']),
    async deleteLog(id, url){
      await this.logsDelete(id)
      this.logsGetAll()
      this.$router.push(url)
    },
    timeCalc(d){
      return moment(d).locale('id').fromNow()
    },
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale, country, flag) {
      this.lan = locale;
      this.text = country;
      this.flag = flag;
      i18n.locale = locale;
    },
    logoutUser() {
      // eslint-disable-next-line no-unused-vars
      axios.get("http://127.0.0.1:8000/api/logout").then((res) => {
        this.$router.push({
          name: "default",
        });
      });
    },
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box d-flex bg-light" style="background:#F9FEFF"> 
          <router-link tag="a" to="/" class="m-auto logo logo-light ">
            <h5 class="font-weight-bold" v-if="!isCondensed">Klinik dr. Martini Husni</h5>
            <h5 class="font-weight-bold" v-else>MH</h5>
          </router-link>
        </div>

        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-16 header-item"
          @click="toggleMenu"
        >
          <i class="fa fa-fw fa-bars"></i>
        </button> 

        <div class="d-flex">
          <h5 class='m-auto font-weight-bold'>Dashboard</h5>
        </div>
      </div>

      <div class="d-flex"> 
        <b-dropdown
          right
          menu-class="dropdown-menu-lg p-0"
          toggle-class="header-item noti-icon"
          variant="black"
        >
          <template v-slot:button-content>
            <i class="bx bx-bell bx-tada"></i>
            <span class="badge badge-danger badge-pill">{{
              log_data.length
            }}</span>
          </template>
 
          <simplebar style="max-height: 300px">
            <span style="cursor:pointer" @click="deleteLog(item.log_id, item.log_src == 'obat' ? '/manajemen-obat' : '/perawat' )" class="text-reset notification-item" v-for="(item,idx) in log_data" :key="idx+'notif'">
              <div class="media">
                <b-row class="align-items-center w-100 mx-auto">
                  <b-col col sm="12" class="me-0 pe-0">
                    <div class="media-body w-100">
                      <h6 class="mt-0 mb-1 font-weight-bold">
                        {{item.log_title}}
                      </h6>
                      <div class="font-size-12 text-muted d-flex">
                        <p class="mb-1">
                          {{ item.log_subtitle }}
                        </p> 
                        <label class="text-primary font-size-12 ml-auto">{{timeCalc(item.log_date)}}</label>
                      </div>
                    </div>
                  </b-col>
                </b-row> 
              </div>
            </span> 
          </simplebar>
        </b-dropdown>

        <b-dropdown right variant="black" toggle-class="header-item">
          <template v-slot:button-content> 
            <span class="d-none d-xl-inline-block ml-1 mr-2 font-weight-bold">{{name || 'User'}}</span>
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
          </template>
          <!-- item-->  
          <div @click="logout" style="cursor:pointer"
           
            class="dropdown-item text-danger"
          >
            <i
              class="bx bx-power-off font-size-16 align-middle mr-1 text-danger"
            ></i>
            {{ $t("navbar.dropdown.henry.list.logout") }}
          </div>
        </b-dropdown> 
      </div>
    </div>
  </header>
</template>

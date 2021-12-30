<script>
import simplebar from "simplebar-vue";

import SideNav from "./side-nav";
import { layoutComputed } from "@/state/helpers";
/**
 * Sidebar component
 */
export default {
  components: { simplebar, SideNav },
  props: {
    isCondensed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...layoutComputed,
  },
  data() {
    return {
      widthss: this.$store ? this.$store.state.layout.layoutWidth : {} || {},
    };
  },
  mounted() {
    document.body.setAttribute("data-sidebar", "colored");
    document.body.removeAttribute("data-keep-enlarged");
    document.body.classList.remove("vertical-collpsed");
    document.body.removeAttribute("data-sidebar-size");
  },
};
</script>

<template>
  <!-- ========== Left Sidebar Start ========== -->
  <div>
    <div class="vertical-menu">
      <simplebar 
        :settings="settings"
        class="h-100 bg-light"
        style="background:#F9FEFF"
        ref="currentMenu"
        id="my-element"
      >
        <SideNav :isCondensed='isCondensed' />
      </simplebar>  
    </div>
  </div>
  <!-- Left Sidebar End -->
</template>


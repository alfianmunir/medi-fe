<script>
import appConfig from "@/app.config";

import Form from "./form.vue";

export default {
  components: {
    Form,
  },
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
};
</script>

<template>
  <div class="account-pages login-bg">
    <div class="" style="margin: 0 5%">
      <div class="row justify-content-center vh-100 align-items-center">
        <div class="col-md-12 col-lg-6 col-xl-5 mx-3" style="max-width: 500px">
          <div class="card overflow-hidden">
            <div class="card-body shadow-lg">
              <div class="p-2"> 
                <Form />
              </div>
            </div>
          </div> 
        </div>
        <!-- <div class="col-md-4 col-lg-6 col-xl-7">
          <img src="@/assets/sipanda/cities.png" width="100%" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<style>
  .login-bg {
    background-image: url('../../../assets/medicloud/login-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>
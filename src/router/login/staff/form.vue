<template>
  <form class="form-horizontal"> 
    <h3 class="text-center mb-5 align-items-center d-flex justify-content-center">Login</h3>
     
    <div>
      <b-form-group
        label="Username"   
      >
        <b-form-input placeholder="Username" v-model="user.email" trim></b-form-input> 
      </b-form-group> 
      <div class="d-flex flex-wrap justify-content-between">
        <label>Password</label>
        <!-- <router-link to="/perawat"><label class="text-primary" style="cursor:pointer">Forget password?</label></router-link> -->
      </div>
      <b-form-input placeholder="Password" v-model="user.password" type="password" trim></b-form-input>  
      
      <div class="mt-3">
        <button :class="`btn btn-${user_valid ? 'primary' : 'secondary'} btn-block`" type="button" @click="submit()">
          Login
        </button>
      </div> 
    </div>

  </form>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  data() {
    return {
      user : {
        email: '',
        password: ''
      }
    };
  },
  watch: {
    user:{
      deep: true,
      immediate: true,
      handler: function(val){
        this.user_valid = val.email && val.password
      }
    }, 
  }, 
  methods: { 
    ...mapActions('auth',['login']),
    submit(){
      if(this.user_valid){
        this.login({...this.user})
          .then((path) => {
            this.$router.push(path).catch((error) => {
              console.info(error.message);
            });
          })
          .finally(() => {
            this.loading = false;
          });
      } 
    }
  },
};
</script>

<style>
  .login-back {
    position: absolute;
    left: 10%;
  }
  .login-back:hover {
    color: #1B71E5;
    cursor: pointer;
  }
</style>

<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.jpg" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form" label-width="0px">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghu"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-ziyuanxhdpi" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
          <el-button type="info" @click="resetFrom('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
 name: "",
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    // 重置按钮
    resetFrom(formName){
      this.$refs[formName].resetFields();
    },
    //登录按钮
     login(formName){
       this.$router.push('/');
      //  this.$refs[formName].validate(async valid => {
      //   if(!valid)  return;
      //   const {data: res} = await this.$http.post('login',this.loginForm)
      //   if(res.meta.status != 200) return this.$message.error('登录失败！')
      //   this.$message.success('登录成功')
      //   // 1.  将登录成功之后的 token， 保存到客户端的 sessionStorage 中
      //   //  1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
      //   //  1.2 token 只应该在打开期间生效，所以保存在 sessionStorage
      //   window.sessionStorage.setItem('token', res.data.token);
      //   // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
      //   this.$router.push('/home');
      // })
    }
  },
  created () {},
  mounted () {},
}
</script>
<style lang="less" scoped>
.login_container{background: #2b4b6b; height: 100%;
  .login_box{width: 450px; height: 300px; background: #fff; border-radius: 3px;position: absolute;left: 50%; top: 50%; transform: translate(-50%,-50%);
    .avatar_box{width: 130px;height: 130px;border:1px solid #eee;border-radius:50%;padding: 10px;box-shadow:0 0 10px #ddd;position:absolute;transform: translate(-50%,-50%);left: 50%;background: #fff;
      img{width: 100%; height: 100%;border-radius:50%;background: #eee;}
    }
    .login_form{position: absolute;bottom: 0;width: 100%;padding: 0 20px;
      .btns{display: flex;justify-content: flex-end;}
    }
  }
}
</style>
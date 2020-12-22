<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/crawler' }">代码管理</el-breadcrumb-item>
      <el-breadcrumb-item>爬虫配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card style="min-height: 800px">
      <el-row>
        <el-col :span="4" style="line-height: 40px">
          脚本所属：{{ crawlerName }}
        </el-col>
        <el-col :span="3" :offset="17">
          <el-button
            icon="el-icon-document-add"
            type="primary"
            @click="addRule"
          >
            添加规则
          </el-button>
        </el-col>
      </el-row>
      <!-- 爬虫列表 -->
      <el-table :data="ruleList" border stripe>
        <el-table-column
          label="名称"
          width="140"
          prop="jsName"
        ></el-table-column>
        <el-table-column
          label="测试网址"
          width="200"
          prop="jsUrl"
        ></el-table-column>
        <el-table-column label="脚本代码" prop="js"></el-table-column>
        <el-table-column label="类型" width="70">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="small"
              type="danger"
              v-if="scope.row.type == 1"
              >加密</el-tag
            >
            <el-tag
              effect="dark"
              size="small"
              type="success"
              v-else-if="scope.row.type == 2"
              >列表</el-tag
            >
            <el-tag effect="dark" size="small" type="warning" v-else
              >内容</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="420">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            >规则编辑</el-button>
            <el-button
              type="info"
              icon="el-icon-odometer"
              size="mini"
              @click="selfTest(scope.row)"
            >自测</el-button>
            <el-button
              v-if="scope.row.type == 3"
              type="warning"
              icon="el-icon-odometer"
              size="mini"
              @click="allSelfTest(scope.row)"
            >整体自测</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRule(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加规则 -->
    <el-dialog :close-on-click-modal="false" title="添加规则" :visible.sync="ruleDialogVisible" width="60%">
      <el-form
        label-position="left"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="脚本名称" prop="jsName">
          <el-input v-model="form.jsName"></el-input>
        </el-form-item>
        <el-form-item label="脚本代码" prop="js">
          <el-input type="textarea"
  autosize v-model="form.js"></el-input>
        </el-form-item>
        <el-form-item label="脚本类型" prop="type">
          <el-radio-group v-model="form.type">
            <template v-if="encryptionStatus">
              <el-radio label="1">加密</el-radio>
              <el-radio label="2">列表</el-radio>
              <el-radio label="3">内容</el-radio>
            </template>
            <template v-else>
              <el-radio label="2">列表</el-radio>
              <el-radio label="3">内容</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="测试网址">
          <el-input v-model="form.jsUrl"></el-input>
        </el-form-item>
        <el-form-item label="下一页字段">
          <el-input v-model="form.jsNextName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="规则编辑" :visible.sync="editDialogVisible" width="60%">
      <el-form
        label-position="left"
        :model="editForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
      >
        <el-form-item label="测试网址" prop="jsUrl">
          <el-input v-model="editForm.jsUrl"></el-input>
        </el-form-item>
        <el-form-item label="脚本代码" prop="js">
          <el-input type="textarea"
  autosize v-model="editForm.js"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('editRuleForm')">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('editRuleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "querystring"
export default {
  name: "",
  data() {
    return {
      id: "",
      ruleList: [],
      crawlerName: "",
      isUrlFlag: false,
      encryptionStatus: false,
      ruleDialogVisible: false,
      editDialogVisible: false,
      form: {
        blongJspa: 0,
        cron: "",
        id: '',
        js: "",
        jsName: "",
        jsNextName: "",
        jsUrl: "",
        type: '',
      },
      editForm: { },
      rules: {
        jsName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        js: [
          {
            required: true,
            message: "请输入脚本代码",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择脚本类型",
            trigger: "change",
          },
        ],
      },
      editRules: {
        jsUrl: [
          {
            required: true,
            message: "请输入测试网址",
            trigger: "blur",
          },
        ],
        js: [
          {
            required: true,
            message: "请输入脚本代码",
            trigger: "blur",
          },
        ],
      }
    };
  },
  components: {},
  computed: {},
  methods: {
    // 添加规则
    addRule() {
      this.ruleDialogVisible = true;
    },
    // 获取规则列表
    getRuleList() {
      this.$http.post(`pachong/jspaJs/getJspaJs?id=${this.id}`).then((res) => {
        if (res.data.code != "200") return this.$message.error("获取列表失败");
        this.ruleList = res.data.data;
      });
    },
    // 获取规则所属爬虫
    getRuleFromCrawler() {
      this.$http
        .post(`pachong/jspaJspa/getJspaById?id=${this.id}`)
        .then((res) => {
          if (res.data.code != "200")
            return this.$message.error("获取爬虫所属失败");
          this.crawlerName = res.data.data.name;
          this.encryptionStatus = res.data.data.decrypt
        });
    },
    // 提交添加规则
    confirm(formName) {
      this.form.blongJspa = this.id
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post('pachong/jspaJs/saveJspaJs',this.form).then(res=>{
            if(res.data.code != '200') return this.$message.error('添加失败！')
            this.getRuleList()
            this.$message.success('添加成功！')
            this.$refs[formName].resetFields()
            this.ruleDialogVisible = false;
          })
        }
      })
    },
    // 取消添加规则
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.ruleDialogVisible = false;
    },
    // 删除规则
    async deleteRule(id) {
      const res = await this.$http.post(`pachong/jspaJs/deleteJspaJs?id=${id}`)
      if(res.data.code != '200') return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getRuleList()
    },
    showEditDialog(row) {
      this.editForm = row
      if(row.type == 1) this.isUrlFlag = true
      else this.isUrlFlag = false
      this.editDialogVisible = true
    },
    confirmEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post('pachong/jspaJs/updateJspaJs', this.editForm).then(res => {
            if(res.data.code != '200') return this.$message.error('修改失败！')
            this.getRuleList()
            this.$message.success('修改成功！')
            this.editDialogVisible = false
          })
        }
      })
    },
    cancelEdit(formName) {
      this.getRuleList();
      this.editDialogVisible = false
    },
    // 自测
    selfTest(row) {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http.post('pachong/pachong/singleZhixing',qs.stringify({id:row.id,url:row.jsUrl}),{
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }).then(res=>{
            loading.close()
            if(res.data.code != '200') return this.$message.error(res.data.data)
            return this.$alert(res.data.data, '成功',{
          confirmButtonText: '确定',
          callback: _=>{}});
          })
    },
    allSelfTest(row) {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http.post(`pachong/pachong/zhixing?id=${row.id}`).then(res=>{
            loading.close()
            if(res.data.code != '200') return this.$message.error(res.data.data)
            return this.$alert(res.data.data, '成功',{
          confirmButtonText: '确定',
          callback: _=>{}});
          })
    }
  },
  created() {},
  mounted() {
    this.id = this.$route.query.id;
    this.getRuleList();
    this.getRuleFromCrawler();
  },
};
</script>
<style lang="less" scoped>
</style>
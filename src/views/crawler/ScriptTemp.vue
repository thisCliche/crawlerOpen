<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>爬虫管理</el-breadcrumb-item>
      <el-breadcrumb-item>脚本模板</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 表格区域 -->
      <el-table :data="scriptList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="模板名称" width="280" prop="name"></el-table-column>
        <el-table-column label="模板代码" prop="value"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)">修改</el-button>
            <el-button v-if="scope.row.id != 1 && scope.row.id != 2 && scope.row.id != 3" type="danger" icon="el-icon-delete" size="mini" @click="deleteScript(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :close-on-click-modal="false" title="修改脚本模板" :visible.sync="editDialogVisible" width="50%">
      <el-form 
      label-position="left"
        :model="editFrom"
        label-width="100px">
        <el-form-item label="脚本模板">
          <el-input type="textarea" autosize v-model="editFrom.value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      scriptList: [],
      editDialogVisible:false,
      editFrom:{
        id: '',
        name: '',
        value: ``
      }
    }
  },
  components: {},
  computed: {},
  methods: {
    async deleteScript(row) {
      const res = await this.$http.post('pachong/jspaModle/deleteJspaModle',{id:row.id})
      if(res.data.code != '200') return this.$message.error("删除失败")
      this.$message.success("删除成功")
      this.getScriptList()
    },
    async getScriptList() {
      const res = await this.$http.post('pachong/jspaModle/getJspaModle')
      if(res.data.code != '200') return this.$message.error("脚本模板列表获取失败");
      this.scriptList = res.data.data
    },
    showEditDialog(row) {
      this.editFrom = row
      this.editDialogVisible = true
    },
    editCancel() {
      this.editDialogVisible = false
    },
    async editConfirm() {
      const res = await this.$http.post('pachong/jspaModle/updateJspaModle',this.editFrom)
      if(res.data.code != '200')  return this.$message.error("脚本模板列表修改失败");
      this.$message.success("脚本模板列表修改成功");
      this.getScriptList();
      this.editDialogVisible = false
    }
  },
  created() {},
  mounted() {
    this.getScriptList()
  },
}
</script>

<style lang="less" scoped>
</style>
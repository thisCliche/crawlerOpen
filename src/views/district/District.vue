<template>
  <div class="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>地域管理</el-breadcrumb-item>
      <el-breadcrumb-item>爬虫地域</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加地市</el-button
          >
          <!-- 表格区 -->
          <el-table
            v-if="isTable"
            :data="ProvinceTable"
            style="width: 100%"
            row-key="criCode"
            border
            lazy
            :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="criId" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="criName" label="名称" width="280">
            </el-table-column>
            <el-table-column label="等级" width="180">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.criLevel == 1" type="primary" size="mini">省级</el-tag>
              <el-tag v-else type="success" size="mini">市级</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页区 -->
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 内容主体区 -->
      <div>
        <el-form
          :model="addCri"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="criName">
            <el-input v-model="addCri.criName"></el-input>
          </el-form-item>
          <el-form-item label="行政代码" prop="criCode">
            <el-input v-model="addCri.criCode"></el-input>
          </el-form-item>
          <el-form-item label="省级分类">
            <el-cascader
              filterable
              placeholder="试试搜索：安徽省"
              v-model="addCri.criSuperiorCode"
              :options="ProvinceTable"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  inject: ['reload'],
  name: "",
  data() {
    return {
      addCateDialogVisible: false,
      ProvinceTable: [],
      cascaderProps: { expandTrigger: 'hover',  value: 'criCode', label: 'criName'},
      //添加分类表单的验证规则
      addCateFormRules: {
        criName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        criCode: [
          { required: true, message: "请输入行政代码", trigger: "blur" },
        ],
      },
      addCri:{
        criCode: "",
        criDataState: 1,
        criGmtCreate: "",
        criGmtModified: "",
        criId: '',
        criLat: "",
        criLevel: "1",
        criLng: "",
        criMemo: "",
        criName: "",
        criShortName: "",
        criSort: '',
        criSuperiorCode: "000000",
        criTenantCode: ""
      }
    };
  },
  components: {},
  computed: {
    isTable() {
      return this.ProvinceTable.length
    }
  },
  watch: {},
  methods: {
    
    load(tree, treeNode, resolve) {
        this.$http.post('pachong/jsqaRegionInfo/getRegionCorrespondCity',qs.stringify({criCode:tree.criCode}),{headers:{
          'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
        }}).then(res=>{
          resolve(res.data.data)
        })
      },
      // 删除地域
      handleDelete(row) {
        this.$http.post('pachong/jsqaRegionInfo/deleteRegion',qs.stringify({id:row.criId}),{headers:{
          'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
        }}).then(res=>{
          if(res.data.code != '200') return this.$message.error('删除失败！')
          this.$message.success('删除成功！')
          // this.getProvince()
          this.reload()
        })
      },
    // 级联选择数据发生变化
    parentCateChanged(val) {
      if(val.length != 0) {
        this.addCri.criLevel = '2'
        this.addCri.criSuperiorCode = val[0]
      }
      else{
        this.addCri.criLevel = '1'
        this.addCri.criSuperiorCode = '000000'
      }
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        this.addCri.criShortName = this.addCri.criName.substring(0,this.addCri.criName.length-1)
        console.log(this.addCri)
        this.$http.post('pachong/jsqaRegionInfo/saveRegion',this.addCri).then(res=>{
          if(res.data.code != '200') return this.$message.error('添加地域失败！')
          this.$message.success('添加成功！')
          this.addCateDialogVisible = false;
          this.reload()
        })
      });
    },
    // 关闭分类弹窗
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
    },
    // 打开弹窗
    showAddCateDialog() {
      this.addCateDialogVisible = true
    },
    // 获取省市
    async getProvince() {
      let provinceTable = await this.$http.post('pachong/jsqaRegionInfo/getRegionProvince')
      provinceTable.data.data.forEach(item => {
        item.hasChildren = true
      })
      this.ProvinceTable = provinceTable.data.data
    }
  },
  created() {
    
  },
  mounted() {
    this.getProvince()
  },
};
</script>
<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
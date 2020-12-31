<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代码管理</el-breadcrumb-item>
      <el-breadcrumb-item>爬虫列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card style="min-height: 400px">
      <el-row>
        <el-col :span="6">
          <el-cascader
            clearable
            filterable
            placeholder="请选择"
            v-model="criCode"
            :options="ProvinceList"
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-col>
        <el-col :span="2" :offset="16">
          <el-button type="primary" @click="addCrawler">添加爬虫</el-button>
        </el-col>
      </el-row>
      <!-- 爬虫列表 -->
      <el-table :data="crawlerlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="爬取时间" prop="cron"></el-table-column>
        <el-table-column label="加密状态" prop="decrypt">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.decrypt"
              @change="
                (status) => {
                  return userStateChanged(status, scope.row.id);
                }
              "
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="执行状态" prop="status">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="scope.row.status"
            @change="
                (status) => {
                  return implementStateChanged(status, scope.row.id);
                }
              "
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改名称和爬取时间的按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >修改</el-button>
            <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRule(scope.row.id)"
              >规则设置</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            >删除</el-button>
            <!-- <el-tooltip
              effect="dark"
              content="爬虫配置"
              placement="top"
              :enterable="false"
            >
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        v-if="total != 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog :close-on-click-modal="false" title="添加爬虫" :visible.sync="dialogVisible" width="50%">
      <el-form
        label-position="left"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="爬取时间" prop="cron">
          <el-input v-model="form.cron"></el-input>
        </el-form-item>
        <el-form-item label="是否加密" prop="decrypt">
          <el-switch v-model="form.decrypt"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="修改爬虫" :visible.sync="editDialogVisible" width="50%">
      <el-form
        label-position="left"
        :model="editFrom"
        :rules="rules"
        ref="editRuleForm"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="editFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="爬取时间" prop="cron">
          <el-input v-model="editFrom.cron"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel('editRuleForm')">取 消</el-button>
        <el-button type="primary" @click="editConfirm('editRuleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "querystring";
export default {
  name: "Crawler",
  data() {
    return {
      //级联选择器配置
      props: {
        expandTrigger: "hover",
        value: "criCode",
        label: "criName",
        lazy: true,
        lazyLoad: this.lazyLoad,
        checkStrictly: true
      },
      ProvinceList: [],
      // 获取爬虫列表的参数对象
      queryInfo: {
        // query: "",
        // 当前页码
        page: 1,
        // 当前每页条数
        size: 10,
      },
      total: 0,
      // 爬虫列表
      crawlerlist: [],
      // 当前选中的
      criCode: [],
      dialogVisible: false,
      editDialogVisible: false,
      form: {
        blongRegion: "",
        cron: "0 0 17 * * ?",
        decrypt: false,
        id: "",
        name: "",
        status: false
      },
      editFrom: {},
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        cron: [
          {
            required: true,
            message: "请输入爬取时间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: {},
  computed: {},
  methods: {
    lazyLoad(node, resolve) {
      this.$http
        .post(
          "pachong/jsqaRegionInfo/getRegionCorrespondCity",
          qs.stringify({ criCode: node.value }),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }
        )
        .then((res) => {
          // res.data.data.forEach((item) => {
          //   item.leaf = true;
          // });
          resolve(res.data.data);
        });
    },
    handleChange(value) {
      // 切换城市清除分页缓存
      this.queryInfo= {
        page: 1,
        size: 10,
      }
      this.getCrawlerList(value[value.length-1]);
    },
    addCrawler() {
      if (this.criCode.length == 0) {
        return this.$message.info("请先选取地区");
      }
      this.dialogVisible = true;
    },
    // 取消添加爬虫
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    // 添加爬虫
    confirm(formName) {
      this.form.blongRegion = this.criCode[this.criCode.length-1];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post("pachong/jspaJspa/savePachong", this.form)
            .then((res) => {
              if (res.data.code != "200") return this.$message.error(res.data.data);
              this.getCrawlerList(this.criCode[this.criCode.length-1]);
              this.$message.success("添加成功");
              this.$refs[formName].resetFields();
              this.dialogVisible = false;
            });
        } else {
          return false;
        }
      });
    },
    // 删除爬虫
    deleteUser(id) {
      this.$http.post(`pachong/jspaJspa/deletePachong?id=${id}`).then(res=>{
          if(res.data.code != '200') return this.$message.error("删除失败");
          this.getCrawlerList(this.criCode[this.criCode.length-1])
          this.$message.success("删除成功");
        })
    },
    // 修改加密状态
    userStateChanged(status, id) {
      this.$http
        .post(
          "pachong/jspaJspa/updateDecrypt",
          qs.stringify({ data: status, id }),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }
        )
        .then((res) => {
          if (res.data.code != "200") {
            status = !status;
            return this.$message.error("更改失败");
          }
          this.$message.success("更改成功");
        });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize;
      this.getCrawlerList(this.criCode[this.criCode.length-1]);
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getCrawlerList(this.criCode[this.criCode.length-1]);
    },
    // 获取省市
    async getProvince() {
      let ProvinceList = await this.$http.post(
        "pachong/jsqaRegionInfo/getRegionProvince"
      );
      this.ProvinceList = ProvinceList.data.data;
    },
    // 获取爬虫列表
    async getCrawlerList(value) {
      let crawlerList = await this.$http
        .post(
          `pachong/jspaJspa/getJspaJspa`,
          qs.stringify({ criCode: value, ...this.queryInfo }),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }
        )
        .then((res) => {
          if (res.data.code != "200") return this.$message.error("获取列表失败");
          this.total = res.data.data.total;
          this.crawlerlist = res.data.data.records;
        });
    },
    // 爬虫代码规则设置
    setRule(id) {
      this.$router.push({path:'/rule',query:{id}})
    },
    implementStateChanged(data,id){
      this.$http.post('pachong/jspaJspa/updateStatus',qs.stringify({ data, id }),{
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }).then(res=>{
            if(res.data.code != '200') {
              this.crawlerlist.forEach(item=>{
                if(item.id == id) item.status = !item.status
              })
              return this.$message.error("状态更改失败");
            }
            this.$message.success("状态更改成功");
          })
    },
    showEditDialog(id) {
      this.$http.post(`pachong/jspaJspa/getJspaById?id=${id}`).then(res=>{
        if(res.data.code != '200') return this.$message.error("爬虫修改详情失败");
        this.editDialogVisible = true
        this.editFrom = res.data.data
      })
    },
    editConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post("pachong/jspaJspa/updateJspa", this.editFrom)
            .then((res) => {
              if (res.data.code != "200") return this.$message.error(res.data.data);
              this.getCrawlerList(this.criCode[this.criCode.length-1]);
              this.$message.success("修改成功");
              this.$refs[formName].resetFields();
              this.editDialogVisible = false;
            });
        } else {
          return false;
        }
      });
    },
    editCancel(formName) {
      this.$refs[formName].resetFields();
      this.editDialogVisible = false;
    }
  },
  created() {},
  mounted() {
    this.getProvince();
    this.getCrawlerList("");
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}

</style>
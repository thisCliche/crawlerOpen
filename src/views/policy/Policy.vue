<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>政策管理</el-breadcrumb-item>
      <el-breadcrumb-item>政策列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="min-height: 400px">
      <el-row :gutter="4">
        <el-col :span="3">
          <el-cascader
            filterable
            placeholder="上线状态"
            v-model="status"
            :options="statusList"
            @change="selectDistrict"
          ></el-cascader>
        </el-col>
        <el-col :span="3">
          <el-cascader
            clearable
            filterable
            placeholder="选择地域"
            v-model="criCode"
            :options="ProvinceList"
            :props="props"
            @change="selectDistrict"
          ></el-cascader>
        </el-col>
        <el-col :span="3">
          <el-select
            @change="handleChange"
            v-model="crawlerId"
            placeholder="爬虫名称"
            no-data-text="请先选择地域"
            clearable
          >
            <el-option
              v-for="item in crawlerlist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            @change="handleChange"
            v-model="timeRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <!-- 爬虫列表 -->
      <el-table :data="policyList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="新闻标题" prop="title"></el-table-column>
        <el-table-column align="center" label="新闻内容" prop="content">
          <template slot-scope="scope">
            <div class="ellipisi">{{ scope.row.content }}</div>
            <el-button @click="allContent(scope.row.id)" size="mini"
              >显示全部</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="政策类别" align="center" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.policyType == '0'">培训</el-tag>
            <el-tag v-else-if="scope.row.policyType == '1'" type="success"
              >公示</el-tag
            >
            <el-tag v-else-if="scope.row.policyType == '-1'" type="primary"
              >国家政策</el-tag
            >
            <el-tag v-else-if="scope.row.policyType == '2'" type="info"
              >申报</el-tag
            >
            <el-tag v-else type="warning">未分类</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上线状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isOnline == '1'" type="info">下线</el-tag>
            <el-tag v-else type="success"
              >上线</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="新闻时间" prop="time"></el-table-column>
        <el-table-column label="发布时间" prop="handleTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="changeStatus(scope.row)">修改上线</el-button>
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
    <el-dialog
      title="新闻详情"
      :visible.sync="dialogVisible"
    >
      <span v-html="newsDetail"></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "querystring";
import axios from 'axios'
const service1 = axios.create({
  baseURL: 'http://47.96.121.235:8828/',
  headers: {
    "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
  }
})
export default {
  name: "",
  data() {
    return {
      dialogVisible:false,
      newsDetail: '',
      criCode: [],
      status: [0],
      statusList: [
        {value: 1,
        label: '下线'},
        {value: 0,
        label: '上线'}
      ],
      ProvinceList: [],
      crawlerId: "",
      crawlerlist: [],
      timeRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      props: {
        expandTrigger: "hover",
        value: "criCode",
        label: "criName",
        lazy: true,
        lazyLoad: this.lazyLoad,
        checkStrictly: true,
      },
      policyList: [],
      // 获取爬虫列表的参数对象
      queryInfo: {
        // query: "",
        // 当前页码
        page: 1,
        // 当前每页条数
        size: 10,
      },
      total: 0,
    };
  },
  components: {},
  computed: {},
  methods: {
    changeStatus(row) {
      let isOnline = row.isOnline == 1 ? 0 : 1
      service1.post("/jspa/zc/upOrDown",qs.stringify({id:row.id,isOnline:isOnline})).then(res=>{
        if(!res.data.success) return this.$message.error("修改失败！");
        else this.$message.success("修改成功！");
        let startTime, Endtime;
      startTime = this.timeRange ? this.timeRange[0] : "today";
      Endtime = this.timeRange ? this.timeRange[1] : "today";
      this.getPolicyList(
        this.criCode[this.criCode.length - 1],
        startTime,
        Endtime,
        this.crawlerId
      );
      })
      },
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
    selectDistrict(val) {
      if (val) this.crawlerId = "";
      this.getCrawlerList(val[val.length - 1]);
      this.handleChange();
    },
    handleChange() {
      let startTime, Endtime;
      startTime = this.timeRange ? this.timeRange[0] : "today";
      Endtime = this.timeRange ? this.timeRange[1] : "today";
      this.queryInfo = { page: 1, size: 10 };
      this.getPolicyList(
        this.criCode[this.criCode.length - 1],
        startTime,
        Endtime,
        this.crawlerId
      );
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize;
      let startTime, Endtime;
      startTime = this.timeRange ? this.timeRange[0] : "today";
      Endtime = this.timeRange ? this.timeRange[1] : "today";
      this.getPolicyList(
        this.criCode[this.criCode.length - 1],
        startTime,
        Endtime,
        this.crawlerId
      );
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      let startTime, Endtime;
      startTime = this.timeRange ? this.timeRange[0] : "today";
      Endtime = this.timeRange ? this.timeRange[1] : "today";
      this.getPolicyList(
        this.criCode[this.criCode.length - 1],
        startTime,
        Endtime,
        this.crawlerId
      );
    },
    // 获取省市
    async getProvince() {
      let ProvinceList = await this.$http.post(
        "pachong/jsqaRegionInfo/getRegionProvince"
      );
      this.ProvinceList = ProvinceList.data.data;
    },
    // 获取政策
    async getPolicyList(
      value = "",
      startTime = "today",
      Endtime = "today",
      jspaId = ""
    ) {
      let policyList = await this.$http
        .post(
          "pachong/jspaPolicy/getJspaPolicy",
          qs.stringify({
            criCode: value,
            ...this.queryInfo,
            startTime,
            Endtime,
            jspaId,
            status: this.status
          }),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }
        )
        .then((res) => {
          if (res.data.code != "200")
            return this.$message.error("获取政策列表失败");
          this.policyList = res.data.data.records;
          this.total = res.data.data.total;
        });
    },
    async allContent(all) {
      let res = await this.$http.post(
        `pachong/jspaPolicy/getIdPolicy?jspaPolicyId=${all}`
      );
      if(res.data.code != '200') return this.$message.error('获取政策详情失败')
      this.newsDetail = res.data.data
      this.dialogVisible = true
    },
    async getCrawlerList(value) {
      let crawlerList = await this.$http
        .post(
          `pachong/jspaJspa/getJspaJspaQuery`,
          qs.stringify({ criCode: value }),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }
        )
        .then((res) => {
          if (res.data.code != "200")
            return this.$message.error("获取列表失败");
          this.crawlerlist = res.data.data;
        });
    },
  },
  created() {},
  mounted() {
    this.getProvince();
    this.getPolicyList("");
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
.ellipisi {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
/deep/ .el-input__inner {
  width: 100%;
}
</style>
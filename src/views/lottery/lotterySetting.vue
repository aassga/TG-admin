<template>
  <div>
    <div class="v2-search">
      <Form ref="lotterySetting" inline>
        <FormItem label="彩票分类">
          <Select v-model="searchKey.type" class="s-140" clearable>
            <Option
              v-for="(item,index) in lotteryType"
              :key="index"
              :value="item.key"
            >{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="彩票名称">
          <Input v-model="searchKey.name" class="s-140" placeholder="可查询"/>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search" :loading="$root.tableLoading">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        :more="table.more"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { lotterySettingData } from "@/api/data";
import Tables from "@/components/tables";
export default {
  name: "lotterySetting",
  components: {
    Tables
  },
  computed: {
    ...mapState({
      lotteryType: state => state.info.lotteryType
    })
  },
  data() {
    return {
      searchKey: {},
      table: {
        loading: true,
        total: 100,
        data: [],
        columns: [
          {
            title: "彩票名称",
            key: "name",
            align: "center",
            render: (h, params) => (
              <span>{params.row.name ? "香港六合彩" : params.row.return ? "快速赛车" : '福彩3D'}</span>
            )
          },
          {
            title: "操作",
            align: "center",
            render: (h, params) => {
              if (params.row.name || (!params.row.name && !params.row.return)) {
                return (
                  <div>
                    <a
                      class="mr5"
                      onClick={() => {
                        this.$router.push({ name: "oddsSetting" });
                      }}
                    >
                      赔率设置
                    </a>
                    <a
                      class="mr5"
                      onClick={(e) => {
                        if(params.row.name){
                          this.$router.push({ name: "markTimeSetting" });
                        }else{
                          this.$router.push({name:'timesSettingAno'})
                        }
                      }}
                    >
                      时间设置
                    </a>
                  </div>
                );
              } else {
                return (
                  <a
                    onClick={() => {
                      this.$router.push({ name: "oddsSetting" });
                    }}
                  >
                    赔率设置
                  </a>
                );
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    getData(query) {
      lotterySettingData().then(res => {
        this.table.loading = true;
        setTimeout(() => {
          this.table.data = res.data;
          this.table.loading = false;
        }, 2000);
      });
    },
    onPageChange(page) {
      this.getData(page);
    },
    onPageSizeChange() {}
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  }
};
</script>


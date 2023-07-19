<template>
  <div>
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

           <el-table-column prop="title" label="图标" align="center">
        <template slot-scope="scope"><Icon  :type="scope.row.alClass"/>{{scope.row.alClass}} </template>
      </el-table-column>

      <el-table-column prop="title" label="总类名称" align="center">
        <template slot-scope="scope">{{ scope.row.blogName }}</template>
      </el-table-column>

      <el-table-column prop="title" label="分类数量" align="center">
        <template slot-scope="scope">{{ scope.row.blotypes.length }}</template>
      </el-table-column>
      <el-table-column prop="title" label="排列顺序" align="center">
        <template slot-scope="scope">{{ scope.row.order }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 删除按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑文章分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.blogName"></el-input>
        </el-form-item>
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标">
  <el-autocomplete
  popper-class="my-autocomplete"
  v-model="form.alClass"
  :fetch-suggestions="querySearch"
  placeholder="输入名字选择图标 如果没有则会显示全部"
  @select="handleSelect"
  size="small"
  style="marginRight:10px;"
  >
  <template slot-scope="{ item }">
    <Icon :type="item.className" />
    {{item.iconName}}
  </template>
</el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditBlogTypeHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Icon from '@/components/icon';
import {getBlogClassAll,updataBlogClass,deleteBlogClass} from '@/api/blogClass'
import {getIcons} from '@/api/icon'
export default {
    data(){
        return {
            data:[],
            dialogFormVisible:false,
            form:{
                blogName:'',
                order:1,
                alClass:'',
            },
        }
    },
    methods:{
        fetchData(){
          getBlogClassAll().then(res=>{
            this.data = res.data
            }).catch(err=>{
                console.log(err)
            })
        },
        editBlogTypeHandle(data){
            // 修改
            this.form = data
            this.dialogFormVisible = true
        },
        deleteBlogTypeHandle(data){
           // 删除
            deleteBlogClass(data.id).then(res=>{
                if(res.data && res.data.affectedSize){
                    this.$message.success(res.data.message);
                    this.fetchData()
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        dialogFormVisibles(){
            // 修改弹框的取消按钮
            this.dialogFormVisible = false
        },
        confirmEditBlogTypeHandle(){
            // 确认按钮
            updataBlogClass(this.form,this.form.id).then(res=>{
                console.log(res)
                this.$message.success(`${res.data}`)
                this.dialogFormVisible = false
                this.form = {}
                this.fetchData()
            }).catch(err=>{
                console.log(err);
            })

        },
        querySearch(searchString,callback){
                getIcons(searchString).then(res=>{
                    callback(res.data)
                }).catch(err=>{
                    console.log(err)
                })
        },
        handleSelect(item) {
        this.state = item.iconName
        this.form.alClass = item.iconName
      }

    },
    created(){
        this.fetchData()
    },
    components:{
    Icon
    }
}
</script>

<style>

</style>
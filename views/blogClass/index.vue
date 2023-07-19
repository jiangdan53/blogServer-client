<template>
  <div class="classcontent">
    <div class="Inpt">
       <el-select v-model="blogClass.order" placeholder="请选择导航顺序" size="small">
    <el-option
      v-for="item in classLength"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
      <el-input v-model="blogClass.blogName"  placeholder="请输入需要添加的类" size="small"></el-input>
   <el-autocomplete
  popper-class="my-autocomplete"
  v-model="state"
  :fetch-suggestions="querySearch"
  placeholder="输入名字选择图标 如果没有则会显示全部"
  @select="handleSelect"
  size="small"
  style="  marginRight:10px;"
  >
  <template slot-scope="{ item }">
    <IconItem :type="item.className" />
    {{item.iconName}}
    
  </template>
</el-autocomplete>
        <el-button type="primary" :loading="isAdd" :disabled="isAdd" size="small" @click="addBlogClass">添加</el-button>
    </div>
    <div class="feachlist">
     {{'选择分类'}} : <el-select v-model="listId" placeholder="请选择导航顺序" size="small">
         <el-option
      v-for="item in classArr"
      :key="item.id"
      :label="item.blogName"
      :value="item.blogName">
    </el-option>
  </el-select>
      <el-table
    :data="fechListData"
    border
    style="width: 100%">
     <el-table-column
      prop="blogId"
      label="博客总类ID"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="博客分类名称"
      >
    </el-table-column>
    <el-table-column
      prop="articleCount"
      label="文章数量"
    >
    </el-table-column>
   
  </el-table>
    </div>
  </div>
</template>

<script>
import {getBlogClassAll,setBlogClassOne} from '@/api/blogClass'
import {getIcons} from '@/api/icon'
import IconItem from '@/components/icon'
export default {
  name:'blogclass',
  data(){
    return {
      classArr:[],
      blogClass:{
        blogName:'',
        order:'',
        alClass:''
      },
      listId:'WEB基础',
      isAdd:false,
      state:'',
    }
  },
 computed:{
  classLength(){
    return this.classArr.length + 1
  },
  fechListData(){
    return !this.classArr.toString() ?[] : this.classArr.filter(it=>it.blogName === this.listId)[0].blotypes
  }
 },
async created(){
await this.fetchData() 
},
 methods:{
 async fetchData(){
  let data  = await getBlogClassAll()
  this.classArr = data.data
  },
  async addBlogClass(){
    this.isAdd = true;
    if(this.blogClass.blogName !== '' && this.blogClass.order !== ''){
     let data =  await setBlogClassOne(this.blogClass)
      if(Object.hasOwn(data,'msg') && typeof data.data === "object"){
        this.isAdd = false
        this.$message.success(`你添加了一个总类为${data.data.blogName}`)
        this.fetchData()
         this.blogClass = {}
      }else{
        this.isAdd = false
        this.$message.error(`错误消息为${data.data}`)
      }
    }else{
      this.isAdd = false;
      this.$message.error(`添加的${!this.blogClass.order ? '顺序内容不能为空':''} ${!this.blogClass.blogName?"导航名称不能为空" :""}`)
    }
 
    // if(Object.hasOwn(data,''))
  },
  querySearch(queryString, cb) {
          getIcons(queryString).then(res=>{
               cb(res.data);
          }).catch(err=>{
          })
  
      },
      handleSelect(item) {
        this.state = item.iconName
        this.blogClass.alClass = item.iconName
      }
},
components:{
  IconItem
}
}
</script>

<style lang="scss" scoped>
.classcontent{
  margin:20px 0px 0px 20px;

  .el-input{
    max-width: 250px;
    margin-right: 20px
  }
 .feachlist{
  margin-top: 20px;
 }
}
</style>
<template>
  <div>
    <!-- 文章标题 -->
    <div class="block">文章标题</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    </div>

    <!-- 文章编辑 -->
    <div class="block">文章编辑</div>
    <editor
      ref="toastuiEditor"
      :initialValue="form.editorText"
      height="600px"
      :options="editorOptions"
    />

    <!-- 文章描述 -->
    <div class="block">文章描述</div>
    <el-input type="textarea" v-model="form.description" :rows="6"></el-input>

 <!-- 选择分类 -->
    <div class="block">选择总类</div>
    <el-select
      v-model="form.classTotal"
      slot="prepend"
      placeholder="请选择文章分类"
      @change="change"
    >
      <el-option
        v-for="item in blogClass"
        :key="item.id"
        :label="item.blogName"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 选择分类 -->
    <div class="block">选择分类</div>
    <el-select
      v-model="form.articleClassId"
      slot="prepend"
      placeholder="请选择文章分类"
      @change="change"
    >
      <el-option
        v-for="item in ChenggeType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
    <div>
      <!-- 发布按钮 -->
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="addArticleHandle"
        >{{ btnContent }}</el-button
      >
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import Upload from "@/components/Upload.vue";
import { getBlogType} from "@/api/blogType.js";
import {getBlogClassAll } from '@/api/blogClass'
import { addBlog, editBlog, findOneBlog } from "@/api/blog.js";
import runstaJson from '@/utils/ruistaJson'
import "@toast-ui/editor/dist/i18n/zh-cn";

export default {
  props: ["mode"],
  data() {
    return {
      form: {
        title: "", // 文章标题
        editorText: "", // 用户编辑的内容
        description: "", // 文章的描述
        // thumb: "", // 文章的图片
        articleClassId: "", // 选择分类
        classTotal:""
      },
      blogType: [], // 存放博客分类
      blogClass:[],
      ChenggeType:[],
      // imageUrl: "", // 图片在服务器上面的地址
      editorOptions: {
        language: "zh-CN",
      },
      btnContent: "发布文章",
    };
  },

  created() {
    // 一进来的时候，就需要拿取分类的数据
    getBlogType().then(({ data }) => {
      this.blogType = data.rows;
    });
    //进来的时候需要拿到当前的总分类信息
    getBlogClassAll().then(({data})=>{
      this.blogClass = data
    })

    if(!runstaJson(window.localStorage.getItem('addWord')) && runstaJson(window.localStorage.getItem('BlogArticl'))?.title){              
      this.form = runstaJson(window.localStorage.getItem('BlogArticl'));
      this.form.id = this.$route.params.id;
      this.btnContent = "确认修改";
    }else{
 if (this.mode === "edit") {
      // 一进来的时候，就拿到传递过来的 id，根据这个 id 获取到这篇文章的内容，回填到表单
      this.id = this.$route.params.id;
      findOneBlog(this.id).then(({ data }) => {
        // 接下来，将这个内容回填至表单
        this.form = data;
        this.form.select = data.category === null ? "" : data.category.name ;
        this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
      });
      this.btnContent = "确认修改";
      window.localStorage.setItem('addWord',false)
    }
    }
    // 向浏览器发送文章是否提交标记
    this.updataBefor()
  },
  
  mounted(){
     this.$refs.toastuiEditor.invoke("setHTML",runstaJson(window.localStorage.getItem('BlogArticl')).htmlContent);
  },
  components: {
    editor: Editor,
    Upload,
  },
  
  methods: {
    addArticleHandle() {
      // 添加文章的业务逻辑 1. 获取表单内容   2. 发送请求
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");
      // 接下来，我们来组装要传递给服务器的对象

      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime() ,
        articleClassId: this.form.articleClassId,
        // toc 传递一个空数组过去，之后在服务器根据 markdown 的内容来生成 toc 目录
        toc: [],
        htmlContent: html,
        markdownContent: markdown,
        classTotal:this.form.classTotal 
      };
      // 对象组装好以后，就提交给服务器
      if (obj.title && obj.description && obj.htmlContent && obj.articleClassId) {
        if (this.mode === "add") {
          // 说明是要新增
          addBlog(obj).then((res) => {
            this.$router.push("/blogList"); // 跳转到文章列表
            if(res.data){
              this.$message.success(`谢谢分享的文章${res.data.title} 你一定非常棒`)
              window.localStorage.setItem('addWord',true)
            }else{
              this.$message.error(`当前分享的文章失败了 因为${res.msg}`)
            }
          });
        } else {
          // 说明是要编辑
          editBlog({ id: this.form.id, data: obj }).then(() => {
            this.$router.push("/blogList"); // 跳转到文章列表
            this.$message.success("文章修改成功");
              window.localStorage.setItem('addWord',true)
          });
        }
      } else {
        this.$message.error("请填写所有内容");
      }
    },
    change() {
      this.ChenggeType = []
      this.$forceUpdate();
   this.ChenggeType =  this.blogType.filter(it=>{
        return it.blogId === this.form.classTotal
      })
    },
    updataBefor(){
      window.addEventListener('unload',()=>{
         let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");
      // 接下来，我们来组装要传递给服务器的对象
      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime() ,
        articleClassId: this.form.articleClassId,
        // toc 传递一个空数组过去，之后在服务器根据 markdown 的内容来生成 toc 目录
        toc: [],
        htmlContent: html,
        markdownContent: markdown,
        classTotal:this.form.classTotal 
      };
      if(!JSON.parse(window.localStorage.getItem('addWord'))){
       window.localStorage.setItem('BlogArticl',JSON.stringify(obj))
    }else{
      window.localStorage.removeItem('BlogArticl',)
    }
      })
    }
  },
  beforeDestroy(){
    let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");
      // 接下来，我们来组装要传递给服务器的对象
      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime() ,
        articleClassId: this.form.articleClassId,
        // toc 传递一个空数组过去，之后在服务器根据 markdown 的内容来生成 toc 目录
        toc: [],
        htmlContent: html,
        markdownContent: markdown,
        classTotal:this.form.classTotal 
      };
    if(!runstaJson(window.localStorage.getItem('addWord'))){
       window.localStorage.setItem('BlogArticl',JSON.stringify(obj))
    }else{
      window.localStorage.removeItem('BlogArticl')
    }
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>
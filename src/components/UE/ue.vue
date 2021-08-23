<template>
  <div>
    <script :id=id ref="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      id: {
        type: String
      },
    },
    watch: {
      defaultMsg (val) {
        if (val) {
          this.editor.ready(() => {
            this.editor.setContent(val)
          })
        }
      }
    },
    mounted() {
      const _this = this;
      this.editor = window.UE.getEditor(this.id, this.config); // 初始化UE
      // 以下代码不起作用
      // this.editor.addListener("ready", function () {
      //   _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      // });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      getUEContentTxt() { // 获取纯文本内容方法
        return this.editor.getContentTxt()
      },
      setContent(data) {
        const that = this
        this.editor.ready(function() {
          that.editor.setContent(data)
        })
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>

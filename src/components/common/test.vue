<template>
  <div class="test-container">
    <h3>{{ title }}</h3>
    <button @click="handleChangeTitle">点击修改title</button>
  </div>
</template>
<script>
  export default{
    props: {
      title: String,
    },
    methods: {
      handleChangeTitle(){
        this.title = 'new title';
        this.$emit('title', this.title);
      },
    },
  };
</script>

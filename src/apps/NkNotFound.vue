<template>
    <div style="height: 100%;background-color: #ffffff;">
        <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
            <template #extra>
                <a-button type="primary" @click="$emit('close')">
                    Back Home
                </a-button>
            </template>
        </a-result>
    </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>

</style>

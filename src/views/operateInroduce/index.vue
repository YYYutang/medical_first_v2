<template>
    <vue-office-pdf 
        :src="pdf"
        style="height: 100vh"
    />
</template>

<script>
//引入VueOfficePdf组件
import VueOfficePdf from '@vue-office/pdf'

export default {
    components: {
        VueOfficePdf
    },
    data() {
        return {
            pdf: '/static/使用说明书.pdf' //设置文档地址
        }
    },
    methods: {

    }
}
</script>
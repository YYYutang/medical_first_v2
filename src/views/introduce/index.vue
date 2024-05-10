<template>
  <div>
    <vue-office-pdf :src="url"   style="height: 100vh" />
  </div>
</template>
     
<script>
import "@vue-office/docx/lib/index.css";
import "@vue-office/excel/lib/index.css";
import VueOfficePdf from "@vue-office/pdf";
import { getRequest, postRequest } from "@/api/user";
export default {
  components: {
    VueOfficePdf,
  },
  data() {
    return {
      url: "/static/软件介绍.pdf",
    };
  },
  created() {},
};
</script>
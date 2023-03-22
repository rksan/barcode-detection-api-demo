<template>
  <slot v-if="permission">
    <!-- do permisson -->
  </slot>

  <!-- want permisson -->
  <template v-else>
    <div class="container-fluid text-center" :class="compTheme">
      <!-- links -->
      <div class="position-absolute top-0 end-0" :class="compTheme">
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item" :class="compTheme">
            <a
              class="btn btn-dark"
              href="https://github.com/rksan/barcode-detection-api-demo"
              target="_blank"
            >
              <i class="bi bi-github"></i>
              github
              <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </li>
        </ul>
      </div>

      <!-- contents -->
      <div class="position-absolute top-50 start-50 translate-middle">
        <!-- denied -->
        <template v-if="error">
          <h1><i class="bi bi-x-circle text-danger"></i>{{ this.message }}</h1>
          <p>本アプリは利用するには、カメラの使用を許可してください</p>
          <span>
            <a
              class="btn btn-primary"
              :href="`https://www.google.com/search?q=%E3%82%AB%E3%83%A1%E3%83%A9+%E8%A8%B1%E5%8F%AF&oq=%E3%82%AB%E3%83%A1%E3%83%A9+%E8%A8%B1%E5%8F%AF&aqs=chrome..69i57.7261j0j7&sourceid=chrome&ie=UTF-8`"
              target="_blank"
            >
              <i class="bi bi-search"></i>
              カメラ 許可
              <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </span>
        </template>
        <!-- /denied -->

        <!-- get permission -->
        <template v-else>
          <div
            class="position-absolute top-50 start-50 translate-middle opacity-50"
          >
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading ...</span>
            </div>
          </div>
          <p>カメラを使用できるか確認しています...</p>
          <p>ブラウザにカメラの利用を許可してください</p>
        </template>
        <!-- /get permission -->
      </div>
    </div>
  </template>
  <!-- /want permisson -->
</template>

<script>
import USER_MEDIA from "@/lib/user-media";

export default {
  name: "p-async-permission-media",

  props: {
    theme: {
      type: String,
      default: "light",
    },

    constraints: {
      type: Object,
      default() {
        return {
          video: true,
        };
      },
    },
  },

  data() {
    return {
      permission: false,
      message: "",
      error: null,
    };
  },

  computed: {
    compTheme() {
      if (this.theme === "light") {
        return ["bg-light", "text-dark"].join(" ");
      } else {
        return ["bg-dark", "text-light"].join(" ");
      }
    },
  },

  methods: {
    async asyncPermissionToUseUserMedia(constraints) {
      return USER_MEDIA.asyncPermissionToUseUserMedia(constraints)
        .then((permission) => {
          if (permission instanceof Error) {
            return Promise.reject(permission);
          } else {
            this.permission = true;
            this.message = "カメラの使用が許可されました。";
            this.error = null;
          }
        })
        .catch((err) => {
          this.permission = false;
          this.message = "カメラの使用が拒否されています";
          this.error = err;
        });
    },
  },

  async created() {
    await this.asyncPermissionToUseUserMedia(this.constraints);
  },
};
</script>

<style scoped>
.container-fluid {
  height: 100vh;
}
</style>

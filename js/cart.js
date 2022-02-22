import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io'; // API平台
const apiPath = 'manson972';  //個人 API Path

const app = createApp({
    data() {
        return {
            cartData: {},//購物車列表
            products: [],//產品列表  免登入api no分頁選擇all
            productId: '',
        }
    },
    methods: {
        getProducts() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
              .then((res) => {
                console.log(res);
                this.products = res.data.products;
              })
        },
        openProductModal(id) {
            this.productId = id;
            this.$refs.productModal.openModal();
        },
    },
    mounted() {
        this.getProducts();
    },
});
//先把modal打開 在取得遠端資料
// $refs
app.component('productModal', {
    props: ['id'],
    template: '#userProductModal',
    data() {
        return {
            modal: {},
            product: {},
        }
    },
    watch: {
        //監控id id有變動從遠端抓資料
        id() {
            this.getProduct();
        },
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        getProduct() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
            .then((res) => {
              console.log(res);
              this.product = res.data.product;
            })
        },
    },
    mounted() {
        //ref="modal"
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
});

app.mount('#app');
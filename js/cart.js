import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io'; // API平台
const apiPath = 'manson972';  //個人 API Path

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 載入多國語系
loadLocaleFromURL('./zh_TW.json');

// 設定
configure({
  generateMessage: localize('zh_TW'),
  //validateOnInput: true, // 此項為true時，輸入文字就會立即進行驗證
});

const app = Vue.createApp({
    data() {
        return {
            cartData: {},//購物車列表
            products: [],//產品列表  免登入api no分頁選擇all
            productId: '',
            isLoadingItem: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            }
        }
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
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
        getCart() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
            .then((res) => {
              console.log(res);
              this.cartData = res.data.data;
            })
        },
        addToCart(id, qty = 1) {
            const data = {
                product_id: id,
                qty,
            }
            this.isLoadingItem = id;
            axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, { data })
            .then((res) => {
              console.log(res);
              this.getCart();
              this.$refs.productModal.closeModal();
              this.isLoadingItem = '';
            })
        },
        removeCartItem(id) {
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`)
            .then((res) => {
              console.log(res);
              this.getCart();
              this.isLoadingItem = '';
            })
        },
        deleteAllCarts() {
            axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
              .then((res) => {
                  console.log(res);
                  this.getCart();
              })
        },
        updateCartItem(item) {
            const data = {
                product_id: item.id,
                qty: item.qty,
            }
            this.isLoadingItem = item.id;
            axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, { data })
            .then((res) => {
              console.log(res);
              this.getCart();
              this.isLoadingItem = '';
            })
        },
        createOrder() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order }).then((response) => {
              alert(response.data.message);
              this.$refs.form.resetForm();
              this.getCart();
            }).catch((err) => {
              alert(err.data.message);
            });
          },
    },
    mounted() {
        this.getProducts();
        this.getCart();
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
            qty: 1,
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
        closeModal() {
            this.modal.hide();
        },
        getProduct() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
            .then((res) => {
              console.log(res);
              this.product = res.data.product;
            })
        },
        addToCart() {
            this.$emit('add-cart', this.product.id, this.qty);
        },
    },
    mounted() {
        //ref="modal"
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
});


app.mount('#app');